import clsx from "clsx";
import { motion } from "framer-motion";
import { BarChart3, HeartHandshake, MessagesSquare, Search, ShieldCheck, Target, Timer, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { computeLiveMetrics } from "../../lib/metrics";
import { useSessionStore } from "../../store/sessionStore";
import { GlassCard } from "../ui/GlassCard";
import { ScoreRing } from "./ScoreRing";
import { TranscriptPanel } from "./TranscriptPanel";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function AnalyticsPanel() {
  const [tab, setTab] = useState<"analytics" | "transcript">("analytics");
  const transcript = useSessionStore((s) => s.transcript);
  const elapsedSeconds = useSessionStore((s) => s.elapsedSeconds);
  const status = useSessionStore((s) => s.status);

  const metrics = useMemo(() => computeLiveMetrics(transcript), [transcript]);
  const hasStarted = status !== "idle";

  return (
    <GlassCard className="flex h-full animate-fade-in flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
          <button
            onClick={() => setTab("analytics")}
            className={clsx(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              tab === "analytics" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
            )}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics
          </button>
          <button
            onClick={() => setTab("transcript")}
            className={clsx(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              tab === "transcript" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
            )}
          >
            <MessagesSquare className="h-3.5 w-3.5" />
            Transcript
          </button>
        </div>

        {tab === "analytics" && (
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
            <Timer className="h-3 w-3 text-white/40" />
            <span className="font-mono text-[11px] text-white/60">{formatTime(elapsedSeconds)}</span>
          </div>
        )}
      </div>

      {tab === "analytics" ? (
        !hasStarted ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="max-w-[220px] text-xs text-white/30">
              Live confidence, discovery, rapport, objection handling, and closing signals will
              appear here during your call.
            </p>
          </div>
        ) : (
          <div className="scrollbar-thin flex flex-1 flex-col gap-5 overflow-y-auto">
            <div className="flex items-center gap-4 rounded-2xl border border-purple/20 bg-purple/[0.06] p-4 transition-colors duration-300 hover:bg-purple/[0.09]">
              <ScoreRing value={metrics.overall} size={72} strokeWidth={6} />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
                  Overall Score
                </span>
                <span className="text-[11px] leading-relaxed text-white/40">
                  Live estimate — updates as the call progresses
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Confidence", value: metrics.confidence, icon: Zap },
                { label: "Discovery", value: metrics.discovery, icon: Search },
                { label: "Rapport", value: metrics.rapport, icon: HeartHandshake },
                { label: "Objection Handling", value: metrics.objectionHandling, icon: ShieldCheck },
                { label: "Closing", value: metrics.closing, icon: Target },
              ].map((metric) => (
                <motion.div
                  key={metric.label}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 text-center transition-colors duration-300 hover:border-purple/20 hover:bg-white/[0.04]"
                >
                  <ScoreRing value={metric.value} size={56} strokeWidth={5} />
                  <span className="flex items-center gap-1 text-[11px] font-medium text-white/60">
                    <metric.icon className="h-3 w-3 text-purple-300/70" />
                    {metric.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <p className="mt-auto text-[10px] leading-relaxed text-white/25">
              Live signals estimated from the conversation so far. Your graded Sales Coach report
              appears after the call ends.
            </p>
          </div>
        )
      ) : (
        <TranscriptPanel />
      )}
    </GlassCard>
  );
}
