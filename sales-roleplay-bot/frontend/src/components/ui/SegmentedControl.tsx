import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SegmentedControlProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  icon: Icon,
  disabled,
}: SegmentedControlProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5", disabled && "opacity-50")}>
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/45">
        {Icon && <Icon className="h-3 w-3 text-purple-300/70" />}
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] p-1.5">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option)}
              className={clsx(
                "relative flex-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors duration-200 whitespace-nowrap",
                "disabled:cursor-not-allowed",
                active ? "text-white" : "text-white/55 hover:bg-white/[0.06] hover:text-white/80"
              )}
            >
              {active && (
                <motion.span
                  layoutId={`segmented-${label}`}
                  className="absolute inset-0 rounded-lg bg-gradient-purple shadow-glow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
