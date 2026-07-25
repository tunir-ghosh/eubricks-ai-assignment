import {
  Building2,
  DollarSign,
  Loader2,
  MessagesSquare,
  PhoneCall,
  ShieldAlert,
  Smile,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { api } from "../../lib/api";
import { buildSessionConfig, useSessionStore } from "../../store/sessionStore";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { GlassCard } from "../ui/GlassCard";
import { SegmentedControl } from "../ui/SegmentedControl";

const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

function SectionLabel({ children }: { children: string }) {
  return (
    <motion.div variants={fieldVariants} className="mb-1 mt-1 flex items-center gap-2 first:mt-0">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-purple-300/60">
        {children}
      </span>
      <div className="h-px flex-1 bg-white/[0.06]" />
    </motion.div>
  );
}

/** Wraps a field so it participates in the panel's staggered entrance animation. */
function Field({ children }: { children: ReactNode }) {
  return <motion.div variants={fieldVariants}>{children}</motion.div>;
}

export function ConfigPanel() {
  const { configOptions, scenarios, draft, setDraftField, beginSession, setStatus, status } =
    useSessionStore();

  const [starting, setStarting] = useState(false);

  const roles = configOptions.rolesByIndustry[draft.industry] ?? [];
  const isBusy = status === "connecting" || starting;
  const isActive = status === "connected";

  async function handleStart() {
    if (!draft.role) return;
    setStarting(true);
    setStatus("connecting");
    try {
      const response = await api.startSession(buildSessionConfig(draft));
      beginSession({
        sessionId: response.sessionId,
        persona: response.persona,
        scenario: response.scenario,
        clientSecret: response.realtime.clientSecret,
        realtimeModel: response.realtime.model,
      });
    } catch (err) {
      setStatus("error", err instanceof Error ? err.message : "Failed to start session");
    } finally {
      setStarting(false);
    }
  }

  return (
    <GlassCard className="flex h-full animate-fade-in flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-4 text-sm font-semibold text-white/80">
        <Sparkles className="h-4 w-4 text-purple-300" />
        Customer Configuration
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
        className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-5 py-5"
      >
        <SectionLabel>Customer Profile</SectionLabel>
        <Field>
          <Dropdown
            label="Industry"
            icon={Building2}
            options={configOptions.industries}
            value={draft.industry}
            disabled={isActive}
            onChange={(v) => setDraftField("industry", v as typeof draft.industry)}
          />
        </Field>
        <Field>
          <Dropdown
            label="Customer Role"
            icon={UserRound}
            options={roles}
            value={draft.role}
            disabled={isActive}
            onChange={(v) => setDraftField("role", v)}
          />
        </Field>
        <Field>
          <Dropdown
            label="Company Size"
            icon={Users}
            options={configOptions.companySizes}
            value={draft.companySize}
            disabled={isActive}
            onChange={(v) => setDraftField("companySize", v as typeof draft.companySize)}
          />
        </Field>

        <SectionLabel>Deal Context</SectionLabel>
        <Field>
          <Dropdown
            label="Personality"
            icon={Smile}
            options={configOptions.personalities}
            value={draft.personality}
            disabled={isActive}
            onChange={(v) => setDraftField("personality", v as typeof draft.personality)}
          />
        </Field>
        <Field>
          <Dropdown
            label="Buying Stage"
            icon={TrendingUp}
            options={configOptions.buyingStages}
            value={draft.buyingStage}
            disabled={isActive}
            onChange={(v) => setDraftField("buyingStage", v as typeof draft.buyingStage)}
          />
        </Field>
        <Field>
          <Dropdown
            label="Budget"
            icon={DollarSign}
            options={configOptions.budgets}
            value={draft.budget}
            disabled={isActive}
            onChange={(v) => setDraftField("budget", v as typeof draft.budget)}
          />
        </Field>
        <Field>
          <Dropdown
            label="Conversation Scenario"
            icon={MessagesSquare}
            options={scenarios.map((s) => s.name)}
            value={scenarios.find((s) => s.id === draft.scenarioId)?.name ?? ""}
            disabled={isActive}
            onChange={(name) => {
              const match = scenarios.find((s) => s.name === name);
              if (match) setDraftField("scenarioId", match.id);
            }}
          />
        </Field>

        <SectionLabel>Challenge</SectionLabel>
        <Field>
          <SegmentedControl
            label="Difficulty"
            icon={ShieldAlert}
            options={configOptions.difficulties}
            value={draft.difficulty}
            disabled={isActive}
            onChange={(value) => setDraftField("difficulty", value as typeof draft.difficulty)}
          />
        </Field>
      </motion.div>

      <div className="border-t border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
        <Button
          className="w-full"
          size="lg"
          disabled={isBusy || isActive || !draft.role}
          onClick={handleStart}
        >
          {isBusy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting…
            </>
          ) : isActive ? (
            <>
              <PhoneCall className="h-4 w-4" />
              Call in Progress
            </>
          ) : (
            <>
              <PhoneCall className="h-4 w-4" />
              Start Practice
            </>
          )}
        </Button>
      </div>
    </GlassCard>
  );
}
