import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../config/env.js";
import { ApiError } from "../middleware/errorHandler.js";
import type { CoachReport, Persona, Scenario, TranscriptEntry } from "../types/domain.types.js";

const coachReportSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, minimum: 0, maximum: 100 },
    confidence: { type: Type.INTEGER, minimum: 0, maximum: 100 },
    discovery: { type: Type.INTEGER, minimum: 0, maximum: 100 },
    rapport: { type: Type.INTEGER, minimum: 0, maximum: 100 },
    objectionHandling: { type: Type.INTEGER, minimum: 0, maximum: 100 },
    closing: { type: Type.INTEGER, minimum: 0, maximum: 100 },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: "1", maxItems: "5" },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: "1", maxItems: "5" },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: "1", maxItems: "5" },
  },
  required: [
    "overallScore",
    "confidence",
    "discovery",
    "rapport",
    "objectionHandling",
    "closing",
    "strengths",
    "weaknesses",
    "suggestions",
  ],
};

function formatTranscript(transcript: TranscriptEntry[]): string {
  return transcript
    .map((entry) => `[${entry.speaker === "rep" ? "Sales Rep" : "Customer"}] ${entry.text}`)
    .join("\n");
}

export async function generateCoachReport(
  transcript: TranscriptEntry[],
  persona: Persona,
  scenario: Scenario
): Promise<CoachReport> {
  if (!env.GEMINI_API_KEY) {
    throw new ApiError(
      500,
      "GEMINI_API_KEY is not configured on the server. Add it to backend/.env to generate a coach report."
    );
  }

  if (transcript.length === 0) {
    throw new ApiError(400, "Cannot grade a session with an empty transcript.");
  }

  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  const prompt = [
    `Scenario: ${scenario.name} — ${scenario.description}`,
    `Customer persona: ${persona.name}, ${persona.role} at a ${persona.companySize} ${persona.industry} company. Personality: ${persona.personality}. Difficulty: ${persona.difficulty}.`,
    "",
    "Transcript:",
    formatTranscript(transcript),
    "",
    "Grade the sales rep's performance across: overall, confidence, discovery (uncovering needs), " +
      "rapport building, objection handling, and closing. List concrete strengths, weaknesses, and " +
      "actionable suggestions grounded in specific moments from the transcript.",
  ].join("\n");

  try {
    const response = await ai.models.generateContent({
      model: env.COACH_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          "You are an expert B2B sales coach grading a practice roleplay call. Be specific, honest, and " +
          "constructive. Base every score strictly on evidence in the transcript — do not inflate scores. " +
          "Scores are 0-100.",
        responseMimeType: "application/json",
        responseSchema: coachReportSchema,
      },
    });

    const raw = response.text;
    if (!raw) {
      throw new ApiError(502, "Gemini returned an empty coach report.");
    }

    return JSON.parse(raw) as CoachReport;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      502,
      `Gemini coach scoring request failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
