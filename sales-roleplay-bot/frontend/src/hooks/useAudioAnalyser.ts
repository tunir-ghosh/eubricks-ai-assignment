import { useEffect, useRef } from "react";

/**
 * Analyses a live MediaStream's amplitude and reports a smoothed 0-1 level
 * via onLevel, throttled to ~30fps. Used to drive the avatar mouth scale
 * and the faceless waveform bars while the AI customer is speaking.
 */
export function useAudioAnalyser(stream: MediaStream | null, onLevel: (level: number) => void) {
  const onLevelRef = useRef(onLevel);
  onLevelRef.current = onLevel;

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) {
      onLevelRef.current(0);
      return;
    }

    const AudioContextCtor = window.AudioContext ?? (window as any).webkitAudioContext;
    const audioContext: AudioContext = new AudioContextCtor();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.7;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);
    let rafId: number;
    let lastUpdate = 0;

    const tick = (time: number) => {
      rafId = requestAnimationFrame(tick);
      if (time - lastUpdate < 33) return;
      lastUpdate = time;

      analyser.getByteFrequencyData(data);
      const average = data.reduce((sum, value) => sum + value, 0) / data.length;
      onLevelRef.current(Math.min(1, average / 140));
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      source.disconnect();
      analyser.disconnect();
      audioContext.close().catch(() => {});
      onLevelRef.current(0);
    };
  }, [stream]);
}
