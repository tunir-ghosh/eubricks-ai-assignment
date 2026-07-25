import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// backend/src/data (or backend/dist/data) -> repo root, where /personas and /prompts live
const REPO_ROOT = resolve(__dirname, "../../..");

function loadJson<T>(relativePath: string): T {
  const fullPath = resolve(REPO_ROOT, relativePath);
  const raw = readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

function loadText(relativePath: string): string {
  const fullPath = resolve(REPO_ROOT, relativePath);
  return readFileSync(fullPath, "utf-8");
}

export interface ConfigOptions {
  industries: string[];
  rolesByIndustry: Record<string, string[]>;
  personalities: string[];
  companySizes: string[];
  buyingStages: string[];
  budgets: string[];
  difficulties: string[];
}

export interface IndustryContext {
  painPoints: string[];
  goals: string[];
  competitors: string[];
  commonObjections: string[];
}

export interface PersonalityTrait {
  conversationStyle: string;
  objectionStyle: string;
  tone: string;
  decisionStyle: string;
}

export interface DifficultyModifier {
  resistanceLevel: string;
  behaviorDirectives: string[];
}

export interface PersonaSeed {
  id: string;
  name: string;
  avatarGender: "male" | "female";
  voice: string;
  industry: string;
  role: string;
  companySize: string;
  personality: string;
  buyingStage: string;
  budget: string;
  objections: string[];
}

export const configOptions = loadJson<ConfigOptions>("personas/config-options.json");
export const scenarios = loadJson<
  { id: string; name: string; description: string; openingStyle: string }[]
>("personas/scenarios.json");
export const industryContext = loadJson<Record<string, IndustryContext>>(
  "personas/industry-context.json"
);
export const personalityTraits = loadJson<Record<string, PersonalityTrait>>(
  "personas/personality-traits.json"
);
export const difficultyModifiers = loadJson<Record<string, DifficultyModifier>>(
  "personas/difficulty-modifiers.json"
);
export const personaSeeds = loadJson<PersonaSeed[]>("personas/personas.json");
export const systemPromptTemplate = loadText("prompts/system-prompt-template.md");
