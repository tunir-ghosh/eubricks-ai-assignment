import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { api } from "../../lib/api";
import { useAudioAnalyser } from "../../hooks/useAudioAnalyser";
import { useRealtimeSession } from "../../hooks/useRealtimeSession";
import { useSessionStore } from "../../store/sessionStore";
import { Avatar } from "./Avatar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ControlBar } from "./ControlBar";
import { GlassCard } from "../ui/GlassCard";
import { StatusIndicator } from "./StatusIndicator";
import { VoiceOrb } from "./VoiceOrb";
import { Waveform } from "./Waveform";

export function CustomerStage() {
  const {
    status,
    error,
    persona,
    scenario,
    speakerState,
    avatarMode,
    audioLevel,
    sessionId,
    transcript,
    setAudioLevel,
    setCoachReport,
    setCoachReportLoading,
    endSession,
    resetSession,
    tick,
  } = useSessionStore();

  const { remoteStream, disconnect, toggleMic } = useRealtimeSession();
  useAudioAnalyser(remoteStream, setAudioLevel);

  useEffect(() => {
    if (status !== "connected") return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [status, tick]);

  async function handleEndSession() {
    disconnect();
    endSession();
    if (!sessionId || transcript.length === 0) return;
    setCoachReportLoading(true);
    try {
      const { coachReport } = await api.endSession(sessionId, transcript);
      setCoachReport(coachReport);
    } catch {
      // handled via empty state in CoachReportModal
    } finally {
      setCoachReportLoading(false);
    }
  }

  if (status === "idle") {
    return (
      <GlassCard className="flex h-full animate-fade-in flex-col items-center justify-center gap-5 p-6 text-center">
        <VoiceOrb state="idle" size={200} />
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Ready when you are</h3>
          <p className="max-w-sm text-sm text-white/45">
            Configure your AI customer and begin your sales conversation.
          </p>
        </div>
      </GlassCard>
    );
  }

  if (status === "error") {
    return (
      <GlassCard className="flex h-full animate-fade-in flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <AlertTriangle className="h-7 w-7 text-rose-300" />
        </div>
        <h3 className="text-lg font-semibold text-white">Couldn't connect</h3>
        <p className="max-w-sm text-sm text-white/45">{error}</p>
        <Button variant="secondary" size="sm" onClick={resetSession}>
          Back to configuration
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="flex h-full animate-fade-in flex-col p-6">
      {persona && scenario && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{persona.industry}</Badge>
          <Badge tone="neutral">{persona.companySize}</Badge>
          <Badge tone="purple">{persona.personality}</Badge>
          <Badge tone="danger">{persona.difficulty}</Badge>
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        {status === "connecting" ? (
          <div className="flex flex-col items-center gap-4 text-white/50">
            <VoiceOrb state="thinking" size={180} />
            <span className="text-sm">Connecting to {persona?.name ?? "your customer"}…</span>
          </div>
        ) : (
          <>
            {avatarMode === "avatar" && persona ? (
              <Avatar gender={persona.avatarGender} state={speakerState} audioLevel={audioLevel} />
            ) : (
              <Waveform state={speakerState} audioLevel={audioLevel} />
            )}

            <div className="flex flex-col items-center gap-1">
              <span className="text-xl font-semibold text-white">{persona?.name}</span>
              <span className="text-sm text-white/45">
                {persona?.role} · {persona?.buyingStage}
              </span>
            </div>

            {status === "connected" && <StatusIndicator state={speakerState} />}

            {status === "ended" && (
              <span className="text-sm text-white/40">Call ended — grading your performance…</span>
            )}
          </>
        )}
      </div>

      {status === "connected" && (
        <div className="mt-6 flex justify-center">
          <ControlBar onToggleMic={toggleMic} onEndSession={handleEndSession} />
        </div>
      )}
    </GlassCard>
  );
}
