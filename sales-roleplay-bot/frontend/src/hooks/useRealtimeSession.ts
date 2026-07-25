import { GoogleGenAI } from "@google/genai";
import type { LiveServerMessage, Session } from "@google/genai";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  base64ToFloat32Array,
  floatTo16BitPCM,
  int16ArrayToBase64,
  MIC_SAMPLE_RATE,
  PLAYBACK_SAMPLE_RATE,
} from "../lib/pcmAudio";
import { useSessionStore } from "../store/sessionStore";

/**
 * Owns the imperative connection to Gemini's Live API. The ephemeral auth
 * token is minted server-side (see backend realtimeService) so this hook
 * never touches the standing GEMINI_API_KEY.
 *
 * Unlike OpenAI's Realtime API (WebRTC media tracks), Gemini Live streams
 * audio as base64 PCM16 frames over a WebSocket. This hook captures mic
 * audio via a ScriptProcessorNode, and plays received audio through a Web
 * Audio graph that also feeds a MediaStreamAudioDestinationNode — so
 * `remoteStream` keeps the exact same shape the rest of the app already
 * expects from `useAudioAnalyser`.
 */
export function useRealtimeSession() {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const sessionRef = useRef<Session | null>(null);
  const connectedSessionRef = useRef<string | null>(null);

  const micStreamRef = useRef<MediaStream | null>(null);
  const micContextRef = useRef<AudioContext | null>(null);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micMutedRef = useRef(false);

  const playbackContextRef = useRef<AudioContext | null>(null);
  const playbackDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const nextPlaybackTimeRef = useRef(0);

  const inputTranscriptRef = useRef("");
  const outputTranscriptRef = useRef("");

  const appendTranscript = useSessionStore((s) => s.appendTranscript);
  const setSpeakerState = useSessionStore((s) => s.setSpeakerState);
  const setStatus = useSessionStore((s) => s.setStatus);
  const setMicMuted = useSessionStore((s) => s.setMicMuted);

  const playAudioChunk = useCallback((base64Data: string) => {
    const ctx = playbackContextRef.current;
    const destination = playbackDestinationRef.current;
    if (!ctx || !destination) return;

    const float32 = base64ToFloat32Array(base64Data);
    const buffer = ctx.createBuffer(1, float32.length, PLAYBACK_SAMPLE_RATE);
    buffer.copyToChannel(float32 as Float32Array<ArrayBuffer>, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.connect(destination);

    const startAt = Math.max(ctx.currentTime, nextPlaybackTimeRef.current);
    source.start(startAt);
    nextPlaybackTimeRef.current = startAt + buffer.duration;
  }, []);

  const handleServerMessage = useCallback(
    (message: LiveServerMessage) => {
      const content = message.serverContent;
      if (!content) return;

      if (content.interrupted) {
        nextPlaybackTimeRef.current = 0;
        setSpeakerState("listening");
      }

      if (content.inputTranscription?.text) {
        inputTranscriptRef.current += content.inputTranscription.text;
        setSpeakerState("thinking");
      }
      if (content.inputTranscription?.finished && inputTranscriptRef.current.trim()) {
        appendTranscript({
          speaker: "rep",
          text: inputTranscriptRef.current.trim(),
          timestampMs: Date.now(),
        });
        inputTranscriptRef.current = "";
      }

      if (message.data) {
        setSpeakerState("speaking");
        playAudioChunk(message.data);
      }

      if (content.outputTranscription?.text) {
        outputTranscriptRef.current += content.outputTranscription.text;
      }

      if (content.turnComplete) {
        if (outputTranscriptRef.current.trim()) {
          appendTranscript({
            speaker: "customer",
            text: outputTranscriptRef.current.trim(),
            timestampMs: Date.now(),
          });
        }
        outputTranscriptRef.current = "";
        setSpeakerState("listening");
      }
    },
    [appendTranscript, playAudioChunk, setSpeakerState]
  );

  const disconnect = useCallback(() => {
    sessionRef.current?.close();
    sessionRef.current = null;

    micProcessorRef.current?.disconnect();
    micProcessorRef.current = null;
    micSourceRef.current?.disconnect();
    micSourceRef.current = null;
    micContextRef.current?.close().catch(() => {});
    micContextRef.current = null;

    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;

    playbackContextRef.current?.close().catch(() => {});
    playbackContextRef.current = null;
    playbackDestinationRef.current = null;
    nextPlaybackTimeRef.current = 0;

    inputTranscriptRef.current = "";
    outputTranscriptRef.current = "";

    setRemoteStream(null);
    connectedSessionRef.current = null;
  }, []);

  const connect = useCallback(
    async (clientSecret: string, model: string) => {
      try {
        const ai = new GoogleGenAI({
          apiKey: clientSecret,
          httpOptions: { apiVersion: "v1alpha" },
        });

        // Playback graph: decoded audio plays through the speakers AND feeds a
        // MediaStream so the existing audio-reactive UI (useAudioAnalyser) works unchanged.
        const playbackContext = new AudioContext({ sampleRate: PLAYBACK_SAMPLE_RATE });
        await playbackContext.resume();
        const destination = playbackContext.createMediaStreamDestination();
        playbackContextRef.current = playbackContext;
        playbackDestinationRef.current = destination;
        nextPlaybackTimeRef.current = 0;
        setRemoteStream(destination.stream);

        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = micStream;

        const micContext = new AudioContext({ sampleRate: MIC_SAMPLE_RATE });
        await micContext.resume();
        micContextRef.current = micContext;

        const micSource = micContext.createMediaStreamSource(micStream);
        micSourceRef.current = micSource;

        // ScriptProcessorNode only fires while wired into the graph; route through
        // a silent gain so we never actually play the mic back into the speakers.
        const processor = micContext.createScriptProcessor(4096, 1, 1);
        micProcessorRef.current = processor;
        processor.onaudioprocess = (event) => {
          if (micMutedRef.current) return;
          const pcm16 = floatTo16BitPCM(event.inputBuffer.getChannelData(0));
          sessionRef.current?.sendRealtimeInput({
            audio: { data: int16ArrayToBase64(pcm16), mimeType: `audio/pcm;rate=${MIC_SAMPLE_RATE}` },
          });
        };
        const silentGain = micContext.createGain();
        silentGain.gain.value = 0;
        micSource.connect(processor);
        processor.connect(silentGain);
        silentGain.connect(micContext.destination);

        // Config is intentionally omitted here — the ephemeral token already
        // locks the model, persona instructions, voice, and transcription
        // config server-side (see backend realtimeService), so the client
        // can't see or tamper with the system prompt.
        const session = await ai.live.connect({
          model,
          callbacks: {
            onmessage: (message) => {
              if (message.setupComplete) {
                setStatus("connected");
                setSpeakerState("listening");
              }
              handleServerMessage(message);
            },
            onerror: (event) => {
              setStatus("error", event.message || "Gemini Live connection error");
            },
            onclose: () => {
              if (useSessionStore.getState().status === "connected") {
                setStatus("ended");
              }
            },
          },
        });
        sessionRef.current = session;
      } catch (err) {
        disconnect();
        setStatus("error", err instanceof Error ? err.message : "Failed to connect voice session");
      }
    },
    [disconnect, handleServerMessage, setSpeakerState, setStatus]
  );

  const toggleMic = useCallback(() => {
    const nextMuted = !micMutedRef.current;
    micMutedRef.current = nextMuted;
    micStreamRef.current?.getAudioTracks().forEach((track) => (track.enabled = !nextMuted));
    setMicMuted(nextMuted);
  }, [setMicMuted]);

  // Auto-connect once per session when ConfigPanel mints a new client secret.
  const sessionId = useSessionStore((s) => s.sessionId);
  const clientSecret = useSessionStore((s) => s.clientSecret);
  const realtimeModel = useSessionStore((s) => s.realtimeModel);
  const status = useSessionStore((s) => s.status);

  useEffect(() => {
    if (
      status === "connecting" &&
      sessionId &&
      clientSecret &&
      realtimeModel &&
      connectedSessionRef.current !== sessionId
    ) {
      connectedSessionRef.current = sessionId;
      connect(clientSecret, realtimeModel);
    }
  }, [status, sessionId, clientSecret, realtimeModel, connect]);

  useEffect(() => disconnect, [disconnect]);

  return { remoteStream, disconnect, toggleMic };
}
