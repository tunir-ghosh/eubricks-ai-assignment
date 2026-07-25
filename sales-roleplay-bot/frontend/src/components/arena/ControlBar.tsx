import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, User, Waves } from "lucide-react";
import clsx from "clsx";
import { useSessionStore } from "../../store/sessionStore";

interface ControlBarProps {
  onToggleMic: () => void;
  onEndSession: () => void;
}

export function ControlBar({ onToggleMic, onEndSession }: ControlBarProps) {
  const { micMuted, avatarMode, setAvatarMode, status, speakerState } = useSessionStore();
  const disabled = status !== "connected";
  const isLive = !disabled && !micMuted;

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
        <button
          onClick={() => setAvatarMode("avatar")}
          className={clsx(
            "relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors duration-200",
            avatarMode === "avatar" ? "text-white" : "text-white/40 hover:text-white/70"
          )}
        >
          {avatarMode === "avatar" && (
            <motion.span
              layoutId="mode-toggle"
              className="absolute inset-0 rounded-xl bg-white/10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <User className="relative h-3.5 w-3.5" />
          <span className="relative">Avatar Mode</span>
        </button>
        <button
          onClick={() => setAvatarMode("faceless")}
          className={clsx(
            "relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors duration-200",
            avatarMode === "faceless" ? "text-white" : "text-white/40 hover:text-white/70"
          )}
        >
          {avatarMode === "faceless" && (
            <motion.span
              layoutId="mode-toggle"
              className="absolute inset-0 rounded-xl bg-white/10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <Waves className="relative h-3.5 w-3.5" />
          <span className="relative">Voice Mode</span>
        </button>
      </div>

      <div className="relative">
        {isLive && speakerState === "listening" && (
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
        )}
        <motion.button
          whileHover={disabled ? undefined : { scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleMic}
          disabled={disabled}
          className={clsx(
            "relative flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-40",
            micMuted
              ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
              : clsx(
                  "border-purple/40 bg-gradient-purple text-white shadow-glow-sm hover:shadow-glow",
                  isLive && "animate-pulse-glow"
                )
          )}
        >
          {micMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </motion.button>
      </div>

      <motion.button
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEndSession}
        disabled={disabled}
        className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/20 disabled:opacity-40"
      >
        <PhoneOff className="h-4 w-4" />
        End Session
      </motion.button>
    </div>
  );
}
