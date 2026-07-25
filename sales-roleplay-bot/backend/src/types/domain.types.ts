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

export type ScenarioId =
  | "cold-call"
  | "product-demo"
  | "follow-up-call"
  | "pricing-negotiation"
  | "renewal-discussion"
  | "enterprise-sales";

export interface Scenario {
  id: ScenarioId;
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
  scenarioId: ScenarioId;
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

export interface TranscriptEntry {
  speaker: "rep" | "customer";
  text: string;
  timestampMs: number;
}

export interface Session {
  id: string;
  config: SessionConfig;
  persona: Persona;
  scenario: Scenario;
  createdAt: number;
  endedAt?: number;
  transcript?: TranscriptEntry[];
  coachReport?: CoachReport;
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
