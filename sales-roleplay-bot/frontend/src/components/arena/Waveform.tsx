import { motion } from "framer-motion";
import { useMemo } from "react";
import type { SpeakerState } from "../../store/sessionStore";
import { VoiceOrb } from "./VoiceOrb";

interface WaveformProps {
  state: SpeakerState;
  audioLevel: number;
}

const BAR_COUNT = 32;

export function Waveform({ state, audioLevel }: WaveformProps) {
  const seeds = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }, (_, i) => ({
        amp: 0.4 + Math.random() * 0.6,
        delay: (i % 8) * 0.08,
      })),
    []
  );

  const isActive = state === "speaking";
  const isListening = state === "listening";

  return (
    <div className="flex flex-col items-center gap-8">
      <VoiceOrb state={state} audioLevel={audioLevel} size={180} />

      {/* Voice visualizer — ElevenLabs-style gradient bars, alive even at rest */}
      <div className="flex h-32 items-center justify-center gap-1.5">
        {seeds.map(({ amp, delay }, i) => {
          if (isActive) {
            const height = Math.max(6, 12 + amp * audioLevel * 110);
            return (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-gradient-purple"
                style={{ opacity: 0.5 + amp * 0.5 }}
                animate={{ height }}
                transition={{ duration: 0.12, ease: "easeInOut" }}
              />
            );
          }

          const restingHeight = isListening ? 10 + amp * 22 : 8 + amp * 6;
          return (
            <motion.div
              key={i}
              className="w-1.5 rounded-full bg-gradient-purple"
              style={{ opacity: 0.5 + amp * 0.5 }}
              animate={{ height: [restingHeight * 0.75, restingHeight * 1.25, restingHeight * 0.75] }}
              transition={{
                duration: isListening ? 0.9 : 1.8,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
