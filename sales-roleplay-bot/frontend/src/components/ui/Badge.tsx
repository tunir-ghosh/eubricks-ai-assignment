import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "purple" | "neutral" | "success" | "danger";
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  purple: "bg-purple/15 text-purple-300 border-purple/30",
  neutral: "bg-white/[0.06] text-white/70 border-white/10",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  danger: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export function Badge({ tone = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm transition-colors",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
