import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  glow?: boolean;
  hoverable?: boolean;
}

export function GlassCard({ strong, glow, hoverable, className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={clsx(
        strong ? "glass-strong" : "glass",
        "rounded-3xl shadow-glass transition-all duration-300",
        glow && "shadow-glow",
        hoverable && "hover:border-purple/25 hover:bg-white/[0.06]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
