import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useMemo } from "react";
import type { SpeakerState } from "../../store/sessionStore";

interface VoiceOrbProps {
  state: SpeakerState;
  audioLevel?: number;
  size?: number;
}

const STATE_COLOR: Record<SpeakerState, string> = {
  idle: "#8B5CF6",
  listening: "#10b981",
  thinking: "#A855F7",
  speaking: "#8B5CF6",
};

const RING_DURATION: Record<SpeakerState, number> = {
  idle: 22,
  listening: 14,
  thinking: 9,
  speaking: 5,
};

/**
 * Shared animated "voice orb" — the hero visual for the arena. Used both as
 * the pre-call idle centerpiece and as the live centerpiece in Voice Mode.
 * Purely presentational: driven entirely by speakerState + live audioLevel.
 */
export function VoiceOrb({ state, audioLevel = 0, size = 220 }: VoiceOrbProps) {
  const color = STATE_COLOR[state];
  const isSpeaking = state === "speaking";
  const isListening = state === "listening";
  const isThinking = state === "thinking";

  // Fixed particle field so positions don't re-randomize every render.
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return {
          x: Math.cos(angle) * (size * 0.42),
          y: Math.sin(angle) * (size * 0.42),
          delay: (i * 0.35) % 3,
          duration: 3 + (i % 4),
        };
      }),
    [size]
  );

  const coreScale = isSpeaking ? 1 + audioLevel * 0.18 : 1;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Particle field */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{ backgroundColor: color, left: "50%", top: "50%" }}
          animate={{
            x: [p.x, p.x * 1.08, p.x],
            y: [p.y, p.y - 10, p.y],
            opacity: state === "idle" ? [0.15, 0.4, 0.15] : [0.3, 0.7, 0.3],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Outer rotating ring */}
      <motion.div
        className="absolute rounded-full border border-dashed"
        style={{ width: size * 0.82, height: size * 0.82, borderColor: `${color}55` }}
        animate={{ rotate: 360 }}
        transition={{ duration: RING_DURATION[state], repeat: Infinity, ease: "linear" }}
      />

      {/* Speaking ripples */}
      {isSpeaking && (
        <>
          <span
            className="absolute rounded-full animate-ripple"
            style={{ width: size * 0.6, height: size * 0.6, border: `1px solid ${color}` }}
          />
          <span
            className="absolute rounded-full animate-ripple"
            style={{ width: size * 0.6, height: size * 0.6, border: `1px solid ${color}`, animationDelay: "0.5s" }}
          />
        </>
      )}

      {/* Soft outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: size * 0.62, height: size * 0.62 }}
        animate={{
          boxShadow: isSpeaking
            ? [
                `0 0 ${40 + audioLevel * 50}px ${10 + audioLevel * 15}px ${color}55`,
                `0 0 ${60 + audioLevel * 60}px ${15 + audioLevel * 20}px ${color}66`,
                `0 0 ${40 + audioLevel * 50}px ${10 + audioLevel * 15}px ${color}55`,
              ]
            : [`0 0 30px 4px ${color}33`, `0 0 55px 10px ${color}4d`, `0 0 30px 4px ${color}33`],
        }}
        transition={{ duration: isSpeaking ? 1 : 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Core orb — breathing gradient sphere */}
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size * 0.55,
          height: size * 0.55,
          background: `radial-gradient(circle at 35% 30%, ${color}dd, ${color}55 55%, #15151E 100%)`,
        }}
        animate={{
          scale: isSpeaking ? coreScale : [1, 1.035, 1],
        }}
        transition={{
          duration: isSpeaking ? 0.12 : 3.2,
          repeat: isSpeaking ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        {isListening && (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            <Mic className="h-7 w-7 text-white/90" />
          </motion.div>
        )}

        {isThinking && (
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-white/90"
                animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.9, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
