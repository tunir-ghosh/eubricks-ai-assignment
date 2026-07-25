import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedBackground } from "../components/landing/AnimatedBackground";
import { AnalyticsPanel } from "../components/arena/AnalyticsPanel";
import { ArenaHeader } from "../components/arena/ArenaHeader";
import { CoachReportModal } from "../components/arena/CoachReportModal";
import { ConfigPanel } from "../components/arena/ConfigPanel";
import { CustomerStage } from "../components/arena/CustomerStage";
import { useSessionStore } from "../store/sessionStore";

type MobilePanel = "config" | "analytics" | null;

export default function Arena() {
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);
  const status = useSessionStore((s) => s.status);

  useEffect(() => {
    if (status === "connecting") setMobilePanel(null);
  }, [status]);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <AnimatedBackground />
      <CoachReportModal />
      <ArenaHeader
        onOpenConfig={() => setMobilePanel("config")}
        onOpenAnalytics={() => setMobilePanel("analytics")}
      />
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-[320px_1fr_360px]">
        <div className="hidden overflow-hidden lg:block">
          <ConfigPanel />
        </div>
        <div className="overflow-hidden">
          <CustomerStage />
        </div>
        <div className="hidden overflow-hidden lg:block">
          <AnalyticsPanel />
        </div>
      </div>

      <AnimatePresence>
        {mobilePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobilePanel(null)}
          >
            <motion.div
              initial={{ x: mobilePanel === "config" ? -320 : 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: mobilePanel === "config" ? -320 : 320, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-0 h-full w-[86vw] max-w-sm p-3 ${
                mobilePanel === "config" ? "left-0" : "right-0"
              }`}
            >
              <div className="relative h-full">
                <button
                  onClick={() => setMobilePanel(null)}
                  className="absolute -top-1 right-1 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
                {mobilePanel === "config" ? <ConfigPanel /> : <AnalyticsPanel />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
