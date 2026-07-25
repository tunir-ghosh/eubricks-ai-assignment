import clsx from "clsx";
import { motion } from "framer-motion";
import { Brain, Circle, Mic, Volume2 } from "lucide-react";
import type { SpeakerState } from "../../store/sessionStore";

const STATE_CONFIG: Record<
  SpeakerState,
  { label: string; icon: typeof Circle; text: string; dot: string }
> = {
  idle: { label: "Idle", icon: Circle, text: "text-white/40", dot: "bg-white/30" },
  listening: { label: "Listening", icon: Mic, text: "text-emerald-300", dot: "bg-emerald-400" },
  thinking: { label: "Thinking", icon: Brain, text: "text-purple-300", dot: "bg-purple-400" },
  speaking: { label: "Speaking", icon: Volume2, text: "text-fuchsia-300", dot: "bg-fuchsia-400" },
};

interface StatusIndicatorProps {
  state: SpeakerState;
  size?: "sm" | "md";
  className?: string;
}

/** Color-coded live status pill (idle/listening/thinking/speaking) shared across the arena. */
export function StatusIndicator({ state, size = "md", className }: StatusIndicatorProps) {
  const config = STATE_CONFIG[state];
  const Icon = config.icon;

  return (
    <motion.div
      key={state}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md",
        size === "sm" ? "px-2 py-1 text-[10px]" : "px-3.5 py-1.5 text-xs",
        className
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {state !== "idle" && (
          <span
            className={clsx(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              config.dot
            )}
          />
        )}
        <span className={clsx("relative inline-flex h-2 w-2 rounded-full", config.dot)} />
      </span>
      <Icon className={clsx(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5", config.text)} />
      <span className={clsx("font-medium", config.text)}>{config.label}</span>
    </motion.div>
  );
}
