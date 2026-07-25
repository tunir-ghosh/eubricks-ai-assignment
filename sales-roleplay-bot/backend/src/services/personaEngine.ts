import {
  industryContext,
  personaSeeds,
  type PersonaSeed,
} from "../data/dataLoader.js";
import type { Persona, SessionConfig } from "../types/domain.types.js";

const GENERIC_NAMES: Record<"male" | "female", string[]> = {
  male: ["Alex Rivera", "James Okafor", "Daniel Kim", "Marco Silva"],
  female: ["Jordan Ellis", "Naomi Cohen", "Sofia Petrov", "Leah Thompson"],
};

// Gemini Live prebuilt voice names (speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName)
const VOICES = ["Puck", "Charon", "Kore", "Fenrir", "Aoede", "Leda", "Orus", "Zephyr"];

function scoreSeed(seed: PersonaSeed, config: SessionConfig): number {
  let score = 0;
  if (seed.industry === config.industry) score += 4;
  if (seed.personality === config.personality) score += 3;
  if (seed.companySize === config.companySize) score += 1;
  if (seed.buyingStage === config.buyingStage) score += 1;
  if (seed.budget === config.budget) score += 1;
  if (seed.role === config.role) score += 2;
  return score;
}

function pickBestSeed(config: SessionConfig): PersonaSeed | undefined {
  const candidates = personaSeeds.filter((seed) => seed.industry === config.industry);
  const pool = candidates.length > 0 ? candidates : personaSeeds;

  return [...pool].sort((a, b) => scoreSeed(b, config) - scoreSeed(a, config))[0];
}

function synthesizeName(gender: "male" | "female", seed?: string): string {
  const pool = GENERIC_NAMES[gender];
  const index = seed
    ? Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) % pool.length
    : Math.floor(Math.random() * pool.length);
  return pool[index];
}

function pickVoice(seed?: string): string {
  const index = seed
    ? Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) % VOICES.length
    : Math.floor(Math.random() * VOICES.length);
  return VOICES[index];
}

/**
 * Resolves a full Persona for a given left-panel config. Prefers a curated
 * seed persona (personas/personas.json); when the exact combination isn't
 * covered, composes a coherent persona from the industry/personality trait
 * tables instead of hardcoding logic per combination.
 */
export function resolvePersona(config: SessionConfig): Persona {
  const seed = pickBestSeed(config);
  const context = industryContext[config.industry];
  const isExactMatch =
    seed &&
    seed.industry === config.industry &&
    seed.personality === config.personality &&
    seed.role === config.role;

  const avatarGender: "male" | "female" =
    seed?.avatarGender ?? (Math.random() > 0.5 ? "male" : "female");
  const uniqueSeed = `${config.industry}-${config.role}-${config.personality}-${config.companySize}`;

  const name = isExactMatch && seed ? seed.name : synthesizeName(avatarGender, uniqueSeed);
  const voice = isExactMatch && seed ? seed.voice : pickVoice(uniqueSeed);

  const objections =
    isExactMatch && seed && seed.objections.length > 0
      ? seed.objections
      : context.commonObjections;

  return {
    id: `${config.industry}-${config.role}-${config.personality}-${Date.now()}`
      .toLowerCase()
      .replace(/\s+/g, "-"),
    name,
    avatarGender,
    voice,
    industry: config.industry,
    role: config.role,
    companySize: config.companySize,
    personality: config.personality,
    buyingStage: config.buyingStage,
    budget: config.budget,
    difficulty: config.difficulty,
    painPoints: context.painPoints,
    goals: context.goals,
    decisionStyle: config.personality,
    objections,
    conversationStyle: config.personality,
    competitorsToMention: context.competitors,
  };
}
