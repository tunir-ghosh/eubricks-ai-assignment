import { create } from "zustand";
import type {
  BudgetLevel,
  BuyingStage,
  CoachReport,
  CompanySize,
  ConfigOptions,
  Difficulty,
  Industry,
  Persona,
  Personality,
  Scenario,
  SessionConfig,
  TranscriptEntry,
} from "../lib/types";
import { CONFIG_OPTIONS, SCENARIOS } from "../lib/staticConfig";

export type ConnectionStatus = "idle" | "connecting" | "connected" | "ended" | "error";
export type SpeakerState = "idle" | "listening" | "thinking" | "speaking";
export type AvatarMode = "avatar" | "faceless";

interface DraftConfig {
  industry: Industry;
  role: string;
  companySize: CompanySize;
  personality: Personality;
  buyingStage: BuyingStage;
  budget: BudgetLevel;
  difficulty: Difficulty;
  scenarioId: string;
}

interface SessionState {
  configOptions: ConfigOptions;
  scenarios: Scenario[];
  draft: DraftConfig;

  status: ConnectionStatus;
  error: string | null;

  sessionId: string | null;
  persona: Persona | null;
  scenario: Scenario | null;
  clientSecret: string | null;
  realtimeModel: string | null;

  avatarMode: AvatarMode;
  speakerState: SpeakerState;
  micMuted: boolean;
  audioLevel: number;

  transcript: TranscriptEntry[];
  elapsedSeconds: number;
  coachReport: CoachReport | null;
  coachReportLoading: boolean;

  setDraftField: <K extends keyof DraftConfig>(key: K, value: DraftConfig[K]) => void;
  setStatus: (status: ConnectionStatus, error?: string | null) => void;
  beginSession: (payload: {
    sessionId: string;
    persona: Persona;
    scenario: Scenario;
    clientSecret: string;
    realtimeModel: string;
  }) => void;
  setAvatarMode: (mode: AvatarMode) => void;
  setSpeakerState: (state: SpeakerState) => void;
  setMicMuted: (muted: boolean) => void;
  setAudioLevel: (level: number) => void;
  appendTranscript: (entry: TranscriptEntry) => void;
  tick: () => void;
  setCoachReport: (report: CoachReport | null) => void;
  setCoachReportLoading: (loading: boolean) => void;
  endSession: () => void;
  resetSession: () => void;
}

export function buildSessionConfig(draft: DraftConfig): SessionConfig {
  return { ...draft };
}

export const useSessionStore = create<SessionState>((set) => ({
  configOptions: CONFIG_OPTIONS,
  scenarios: SCENARIOS,
  draft: {
    industry: "Technology",
    role: CONFIG_OPTIONS.rolesByIndustry["Technology"]?.[0] ?? "",
    companySize: "Mid-Market",
    personality: "Skeptical",
    buyingStage: "Actively Comparing",
    budget: "Moderate",
    difficulty: "Medium",
    scenarioId: "cold-call",
  },

  status: "idle",
  error: null,

  sessionId: null,
  persona: null,
  scenario: null,
  clientSecret: null,
  realtimeModel: null,

  avatarMode: "avatar",
  speakerState: "idle",
  micMuted: false,
  audioLevel: 0,

  transcript: [],
  elapsedSeconds: 0,
  coachReport: null,
  coachReportLoading: false,

  setDraftField: (key, value) =>
    set((state) => {
      const nextDraft = { ...state.draft, [key]: value };
      if (key === "industry") {
        const roles = state.configOptions.rolesByIndustry[value as string] ?? [];
        nextDraft.role = roles[0] ?? "";
      }
      return { draft: nextDraft };
    }),

  setStatus: (status, error = null) => set({ status, error }),

  beginSession: ({ sessionId, persona, scenario, clientSecret, realtimeModel }) =>
    set({
      sessionId,
      persona,
      scenario,
      clientSecret,
      realtimeModel,
      status: "connecting",
      transcript: [],
      elapsedSeconds: 0,
      coachReport: null,
      speakerState: "idle",
      error: null,
    }),

  setAvatarMode: (avatarMode) => set({ avatarMode }),
  setSpeakerState: (speakerState) => set({ speakerState }),
  setMicMuted: (micMuted) => set({ micMuted }),
  setAudioLevel: (audioLevel) => set({ audioLevel }),

  appendTranscript: (entry) => set((state) => ({ transcript: [...state.transcript, entry] })),

  tick: () => set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),

  setCoachReport: (coachReport) => set({ coachReport }),
  setCoachReportLoading: (coachReportLoading) => set({ coachReportLoading }),

  endSession: () => set({ status: "ended", speakerState: "idle" }),

  resetSession: () =>
    set({
      status: "idle",
      error: null,
      sessionId: null,
      persona: null,
      scenario: null,
      clientSecret: null,
      realtimeModel: null,
      speakerState: "idle",
      micMuted: false,
      audioLevel: 0,
      transcript: [],
      elapsedSeconds: 0,
      coachReport: null,
      coachReportLoading: false,
    }),
}));
