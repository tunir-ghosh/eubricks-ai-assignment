import { motion } from "framer-motion";
import { ArrowRight, Mic, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

const STATS = [
  { value: "7", label: "Industries" },
  { value: "8", label: "Customer Personalities" },
  { value: "5", label: "Difficulty Levels" },
  { value: "6", label: "Sales Scenarios" },
];

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-20 text-center lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md"
      >
        <Sparkles className="h-3.5 w-3.5 text-purple-300" />
        AI-Powered Sales Roleplay
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-balance text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
      >
        Practice. Improve.
        <br />
        <span className="text-gradient-purple">Close More Deals.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-white/55"
      >
        Roleplay live sales calls against a realistic AI customer that negotiates, objects, and
        never breaks character — then get graded like a real coaching session.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <Button size="lg" onClick={() => navigate("/arena")} className="group">
          <Mic className="h-4 w-4" />
          Start Practice
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
        <Button size="lg" variant="secondary" onClick={() => navigate("/arena")}>
          Explore the Arena
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-20 grid w-full max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</span>
            <span className="text-xs text-white/40">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
