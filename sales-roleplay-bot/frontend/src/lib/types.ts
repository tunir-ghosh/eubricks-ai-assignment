export type Industry =
  | "Healthcare"
  | "Finance"
  | "Education"
  | "Manufacturing"
  | "Real Estate"
  | "Retail"
  | "Technology";

export type Personality =
  | "Friendly"
  | "Busy"
  | "Analytical"
  | "Aggressive"
  | "Skeptical"
  | "Price Sensitive"
  | "Technical Buyer"
  | "Decision Maker";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert" | "Nightmare";
export type CompanySize = "Startup" | "Small Business" | "Mid-Market" | "Enterprise";
export type BuyingStage =
  | "Just Exploring"
  | "Actively Comparing"
  | "Ready to Decide"
  | "Renewal / Post-Purchase";
export type BudgetLevel = "Tight" | "Moderate" | "Flexible" | "Enterprise-Scale";

export interface ConfigOptions {
  industries: Industry[];
  rolesByIndustry: Record<string, string[]>;
  personalities: Personality[];
  companySizes: CompanySize[];
  buyingStages: BuyingStage[];
  budgets: BudgetLevel[];
  difficulties: Difficulty[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  openingStyle: string;
}

export interface SessionConfig {
  industry: Industry;
  role: string;
  companySize: CompanySize;
  personality: Personality;
  buyingStage: BuyingStage;
  budget: BudgetLevel;
  difficulty: Difficulty;
  scenarioId: string;
}

export interface Persona {
  id: string;
  name: string;
  avatarGender: "male" | "female";
  voice: string;
  industry: Industry;
  role: string;
  companySize: CompanySize;
  personality: Personality;
  buyingStage: BuyingStage;
  budget: BudgetLevel;
  difficulty: Difficulty;
  painPoints: string[];
  goals: string[];
  decisionStyle: string;
  objections: string[];
  conversationStyle: string;
  competitorsToMention: string[];
}

export interface RealtimeSessionInfo {
  clientSecret: string;
  expiresAt: number;
  model: string;
  voice: string;
}

export interface StartSessionResponse {
  sessionId: string;
  persona: Persona;
  scenario: Scenario;
  realtime: RealtimeSessionInfo;
}

export interface TranscriptEntry {
  speaker: "rep" | "customer";
  text: string;
  timestampMs: number;
}

export interface CoachReport {
  overallScore: number;
  confidence: number;
  discovery: number;
  rapport: number;
  objectionHandling: number;
  closing: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}
