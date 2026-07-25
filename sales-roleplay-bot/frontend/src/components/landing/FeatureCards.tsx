import { motion } from "framer-motion";
import {
  AudioLines,
  BarChart3,
  Building2,
  MessagesSquare,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: AudioLines,
    title: "Live Voice Roleplay",
    description:
      "Speak naturally with a low-latency AI customer that listens, interrupts, and responds in real time — no scripts, no typing.",
  },
  {
    icon: UsersRound,
    title: "8 Customer Personalities",
    description:
      "From Friendly to Nightmare-difficulty Skeptical buyers — every persona negotiates and objects differently.",
  },
  {
    icon: Building2,
    title: "7 Industries",
    description:
      "Healthcare, Finance, Education, Manufacturing, Real Estate, Retail, and Technology — each with realistic pain points.",
  },
  {
    icon: ShieldAlert,
    title: "5 Difficulty Levels",
    description:
      "Dial resistance from Easy warm-ups to Nightmare mode, where only an exceptional pitch earns the deal.",
  },
  {
    icon: MessagesSquare,
    title: "Live Transcript",
    description:
      "Every word timestamped and speaker-labeled as you talk, with search, copy, and download when the call ends.",
  },
  {
    icon: BarChart3,
    title: "AI Sales Coach",
    description:
      "Get graded on confidence, discovery, rapport, objection handling, and closing — with concrete, actionable feedback.",
  },
];

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Everything a sales floor needs, none of the awkwardness
        </h2>
        <p className="mt-4 text-white/50">
          A realistic training ground built to make your next real call easier.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
          >
            <GlassCard className="group h-full p-6 transition-all duration-300 hover:border-purple/30 hover:bg-white/[0.06]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-purple/10 border border-purple/20 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-5 w-5 text-purple-300" strokeWidth={1.75} />
              </div>
              <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-white/50">{feature.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
