import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  Loader2,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";
import { Button } from "../ui/Button";
import { GlassCard } from "../ui/GlassCard";
import { MetricBar } from "./MetricBar";
import { ScoreRing } from "./ScoreRing";

export function CoachReportModal() {
  const navigate = useNavigate();
  const { status, coachReport, coachReportLoading, resetSession, persona, scenario } =
    useSessionStore();

  const visible = status === "ended";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <GlassCard strong glow className="max-h-[85vh] overflow-y-auto p-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-purple">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">AI Sales Coach Report</h2>
                  <p className="text-xs text-white/40">
                    {scenario?.name} with {persona?.name} · {persona?.difficulty} difficulty
                  </p>
                </div>
              </div>

              {coachReportLoading && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/50">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-300" />
                  <span className="text-sm">Grading your call…</span>
                </div>
              )}

              {!coachReportLoading && !coachReport && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-white/50">
                  <AlertCircle className="h-8 w-8 text-rose-300" />
                  <span className="max-w-sm text-sm">
                    We couldn't generate a coach report for this call. This usually means the
                    server's GEMINI_API_KEY isn't configured, or the call was too short to grade.
                  </span>
                </div>
              )}

              {!coachReportLoading && coachReport && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                  className="flex flex-col gap-6"
                >
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    className="flex items-center gap-6 rounded-2xl border border-purple/20 bg-purple/[0.06] p-5"
                  >
                    <ScoreRing value={coachReport.overallScore} size={88} label="Overall" />
                    <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3">
                      <MetricBar label="Confidence" value={coachReport.confidence} icon={Zap} />
                      <MetricBar label="Discovery" value={coachReport.discovery} icon={Search} />
                      <MetricBar label="Rapport" value={coachReport.rapport} icon={HeartHandshake} />
                      <MetricBar
                        label="Objection Handling"
                        value={coachReport.objectionHandling}
                        icon={ShieldCheck}
                      />
                      <MetricBar label="Closing" value={coachReport.closing} icon={Target} />
                    </div>
                  </motion.div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Strengths
                      </h3>
                      <ul className="space-y-1.5">
                        {coachReport.strengths.map((s, i) => (
                          <li
                            key={i}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm leading-relaxed text-white/70"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-300">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Weaknesses
                      </h3>
                      <ul className="space-y-1.5">
                        {coachReport.weaknesses.map((w, i) => (
                          <li
                            key={i}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm leading-relaxed text-white/70"
                          >
                            {w}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                    <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-purple-300">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Actionable Suggestions
                    </h3>
                    <ul className="space-y-1.5">
                      {coachReport.suggestions.map((s, i) => (
                        <li
                          key={i}
                          className="rounded-lg border border-purple/10 bg-purple/[0.04] px-3 py-2 text-sm leading-relaxed text-white/70"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              )}

              <div className="mt-8 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
                <Button onClick={resetSession}>
                  <RotateCcw className="h-4 w-4" />
                  Practice Again
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
