import { AnimatedBackground } from "../components/landing/AnimatedBackground";
import { FeatureCards } from "../components/landing/FeatureCards";
import { Hero } from "../components/landing/Hero";
import { Navbar } from "../components/landing/Navbar";

export default function Landing() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />
      </main>
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-white/30">
        Eubrics AI Sales Arena — built for practice, not production sales advice.
      </footer>
    </div>
  );
}
