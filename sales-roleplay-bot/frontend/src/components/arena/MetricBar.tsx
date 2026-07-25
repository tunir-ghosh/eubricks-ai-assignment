import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";

interface MetricBarProps {
  label: string;
  value: number;
  icon?: LucideIcon;
  emphasized?: boolean;
}

function colorForValue(value: number): string {
  if (value >= 70) return "#8B5CF6";
  if (value >= 40) return "#A855F7";
  return "#f43f5e";
}

export function MetricBar({ label, value, icon: Icon, emphasized }: MetricBarProps) {
  const animated = useCountUp(value, 700);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span
          className={
            emphasized
              ? "flex items-center gap-1.5 text-sm font-semibold text-white"
              : "flex items-center gap-1.5 text-xs text-white/60"
          }
        >
          {Icon && <Icon className="h-3.5 w-3.5 text-purple-300/70" />}
          {label}
        </span>
        <span className={emphasized ? "text-sm font-semibold text-white" : "text-xs text-white/50"}>
          {animated}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: colorForValue(value) }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
