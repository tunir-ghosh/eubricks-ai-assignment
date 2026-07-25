import { motion } from "framer-motion";
import type { SpeakerState } from "../../store/sessionStore";

interface AvatarProps {
  gender: "male" | "female";
  state: SpeakerState;
  audioLevel: number;
}

const RING_COLOR: Record<SpeakerState, string> = {
  idle: "rgba(255,255,255,0.12)",
  listening: "#8B5CF6",
  thinking: "#A855F7",
  speaking: "#8B5CF6",
};

export function Avatar({ gender, state, audioLevel }: AvatarProps) {
  const mouthScale = state === "speaking" ? 0.4 + audioLevel * 1.4 : 0.5;

  return (
    <div className="relative flex items-center justify-center">
      {state === "speaking" ? (
        // Audio-reactive glow: ring intensity tracks live speech amplitude directly.
        <div
          className="absolute h-64 w-64 rounded-full transition-shadow duration-75"
          style={{
            boxShadow: `0 0 ${25 + audioLevel * 55}px ${audioLevel * 8}px ${RING_COLOR.speaking}`,
            transform: `scale(${1 + audioLevel * 0.06})`,
          }}
        />
      ) : (
        <motion.div
          className="absolute h-64 w-64 rounded-full"
          style={{ boxShadow: `0 0 0 1px ${RING_COLOR[state]}` }}
          animate={{
            boxShadow:
              state === "idle"
                ? [`0 0 30px -8px ${RING_COLOR[state]}`, `0 0 30px -8px ${RING_COLOR[state]}`]
                : [
                    `0 0 25px -5px ${RING_COLOR[state]}`,
                    `0 0 55px 5px ${RING_COLOR[state]}`,
                    `0 0 25px -5px ${RING_COLOR[state]}`,
                  ],
            scale: state === "idle" ? 1 : [1, 1.04, 1],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {state === "thinking" && (
        <motion.div
          className="absolute h-72 w-72 rounded-full border border-dashed border-purple/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}

      {state === "speaking" && (
        <motion.div
          className="absolute h-72 w-72 rounded-full border-t-2 border-purple/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}

      <motion.svg
        viewBox="0 0 200 240"
        className="relative h-56 w-56 drop-shadow-2xl"
        animate={{ y: state === "idle" ? [0, -4, 0] : 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="bust" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f3f52" />
            <stop offset="100%" stopColor="#232331" />
          </linearGradient>
          <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b5b74" />
            <stop offset="100%" stopColor="#403f52" />
          </linearGradient>
          <linearGradient id="attire" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>

        {/* shoulders / blazer */}
        <path
          d="M20 240 C20 175 55 150 100 150 C145 150 180 175 180 240 Z"
          fill="url(#attire)"
        />
        {/* shirt/collar */}
        <path d="M78 158 L100 190 L122 158 L112 150 L100 168 L88 150 Z" fill="#e9e7f5" />
        {gender === "male" && <path d="M97 168 L100 172 L108 240 L92 240 Z" fill="#1c1b26" />}

        {/* neck */}
        <rect x="85" y="120" width="30" height="40" rx="10" fill="url(#face)" />

        {/* head */}
        <ellipse cx="100" cy="88" rx="46" ry="52" fill="url(#face)" />

        {/* hair */}
        {gender === "male" ? (
          <path
            d="M54 82 C50 40 76 20 100 20 C124 20 150 40 146 82 C146 60 130 66 100 66 C70 66 54 60 54 82 Z"
            fill="#1c1b26"
          />
        ) : (
          <path
            d="M50 96 C44 46 70 18 100 18 C130 18 156 46 150 96 C150 60 150 100 138 108 C142 78 132 58 100 58 C68 58 58 78 62 108 C50 100 50 96 50 96 Z"
            fill="#1c1b26"
          />
        )}

        {/* eyes */}
        <motion.ellipse
          cx="82"
          cy="90"
          rx="4.5"
          ry="5.5"
          fill="#e9e7f5"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.92, 0.95, 0.98, 1] }}
        />
        <motion.ellipse
          cx="118"
          cy="90"
          rx="4.5"
          ry="5.5"
          fill="#e9e7f5"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.92, 0.95, 0.98, 1] }}
        />

        {/* eyebrows */}
        <rect x="74" y="78" width="16" height="3" rx="1.5" fill="#12111a" opacity="0.5" />
        <rect x="110" y="78" width="16" height="3" rx="1.5" fill="#12111a" opacity="0.5" />

        {/* mouth: scales vertically with audio level while speaking */}
        <motion.ellipse
          cx="100"
          cy="112"
          rx="11"
          animate={{ ry: 3 * mouthScale }}
          transition={{ duration: 0.09 }}
          fill="#2a2836"
        />
      </motion.svg>
    </div>
  );
}
