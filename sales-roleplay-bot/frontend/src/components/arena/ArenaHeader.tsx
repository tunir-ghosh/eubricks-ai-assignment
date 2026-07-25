import clsx from "clsx";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, SlidersHorizontal, Sparkles, User, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ConnectionStatus } from "../../store/sessionStore";
import { useSessionStore } from "../../store/sessionStore";
import { Badge } from "../ui/Badge";
import { StatusIndicator } from "./StatusIndicator";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const CONNECTION_LABEL: Record<ConnectionStatus, string> = {
  idle: "Not Connected",
  connecting: "Connecting…",
  connected: "Connected",
  ended: "Call Ended",
  error: "Connection Error",
};

const CONNECTION_DOT: Record<ConnectionStatus, string> = {
  idle: "bg-white/30",
  connecting: "bg-purple-400",
  connected: "bg-emerald-400",
  ended: "bg-white/30",
  error: "bg-rose-400",
};

interface ArenaHeaderProps {
  onOpenConfig?: () => void;
  onOpenAnalytics?: () => void;
}

export function ArenaHeader({ onOpenConfig, onOpenAnalytics }: ArenaHeaderProps) {
  const navigate = useNavigate();
  const { persona, scenario, status, elapsedSeconds, speakerState, avatarMode } = useSessionStore();
  const isLive = status === "connecting" || status === "connected";

  return (
    <header className="flex items-center justify-between border-b border-white/5 px-4 py-3.5 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-purple">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-white">Sales Arena</span>
        {scenario && (
          <Badge tone="purple" className="ml-1 hidden sm:inline-flex">
            {scenario.name}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenConfig}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
          title="Customer configuration"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <button
          onClick={onOpenAnalytics}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
          title="Analytics & transcript"
        >
          <BarChart3 className="h-4 w-4" />
        </button>

        {/* Voice Mode indicator */}
        {status !== "idle" && (
          <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 md:flex">
            {avatarMode === "avatar" ? (
              <User className="h-3 w-3 text-purple-300/80" />
            ) : (
              <Waves className="h-3 w-3 text-purple-300/80" />
            )}
            <span className="text-xs text-white/60">
              {avatarMode === "avatar" ? "Avatar Mode" : "Voice Mode"}
            </span>
          </div>
        )}

        {/* Connection status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            {isLive && (
              <span
                className={clsx(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  CONNECTION_DOT[status]
                )}
              />
            )}
            <span className={clsx("relative inline-flex h-2 w-2 rounded-full", CONNECTION_DOT[status])} />
          </span>
          <span className="text-xs text-white/70">{CONNECTION_LABEL[status]}</span>
          {status === "connected" && (
            <span className="font-mono text-xs text-white/50">· {formatTime(elapsedSeconds)}</span>
          )}
        </motion.div>

        {status === "connected" && (
          <StatusIndicator state={speakerState} size="sm" className="hidden lg:inline-flex" />
        )}

        {/* AI Customer */}
        {persona && (
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-purple text-xs font-semibold text-white">
              {persona.name.charAt(0)}
            </div>
            <div className="text-right">
              <div className="text-[9px] font-semibold uppercase tracking-widest text-purple-300/60">
                AI Customer
              </div>
              <div className="text-xs font-medium text-white/80">{persona.name}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
