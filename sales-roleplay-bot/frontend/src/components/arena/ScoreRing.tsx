import { motion } from "framer-motion";
import { useId } from "react";
import { useCountUp } from "../../hooks/useCountUp";

interface ScoreRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

/** Animated circular progress ring used for overall-score display. */
export function ScoreRing({ value, size = 96, strokeWidth = 8, label }: ScoreRingProps) {
  const gradientId = useId();
  const animated = useCountUp(value, 900);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold text-white">{animated}</span>
        {label && <span className="text-[10px] uppercase tracking-wide text-white/40">{label}</span>}
      </div>
    </div>
  );
}
