import {
  difficultyModifiers,
  personalityTraits,
  systemPromptTemplate,
} from "../data/dataLoader.js";
import type { Persona, Scenario } from "../types/domain.types.js";

export function buildRealtimeInstructions(persona: Persona, scenario: Scenario): string {
  const trait = personalityTraits[persona.personality];
  const difficulty = difficultyModifiers[persona.difficulty];

  const sections = [
    systemPromptTemplate.trim(),
    `# Your Character`,
    `Name: ${persona.name}`,
    `Role: ${persona.role} at a ${persona.companySize.toLowerCase()} ${persona.industry.toLowerCase()} company`,
    `Personality: ${persona.personality} — ${trait.tone}. ${trait.conversationStyle}.`,
    `Buying stage: ${persona.buyingStage}`,
    `Budget posture: ${persona.budget}`,
    `Decision style: ${trait.decisionStyle}`,
    `Your goals right now: ${persona.goals.join("; ")}`,
    `Your pain points: ${persona.painPoints.join("; ")}`,
    `How you raise objections: ${trait.objectionStyle}`,
    `Objections you genuinely hold (bring these up naturally, don't list them robotically): ${persona.objections.join("; ")}`,
    `Competitors you might reference by name if relevant: ${persona.competitorsToMention.join(", ")}`,
    ``,
    `# Scenario: ${scenario.name}`,
    scenario.description,
    scenario.openingStyle,
    ``,
    `# Difficulty: ${persona.difficulty} (resistance level: ${difficulty.resistanceLevel})`,
    ...difficulty.behaviorDirectives.map((directive) => `- ${directive}`),
    ``,
    `Begin the call now by answering/opening in character as ${persona.name}. Do not narrate stage directions — speak only your dialogue.`,
  ];

  return sections.join("\n");
}
