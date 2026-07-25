import type { TranscriptEntry } from "./types";

const FILLER_WORDS = ["um", "uh", "like", "basically", "actually", "just", "sort of", "kind of"];
const OBJECTION_MARKERS = ["but", "however", "concern", "expensive", "not sure", "worried", "risk"];
const CLOSING_MARKERS = ["next steps", "sign", "contract", "proposal", "schedule", "move forward", "get started"];

export interface LiveMetrics {
  confidence: number;
  discovery: number;
  rapport: number;
  objectionHandling: number;
  closing: number;
  overall: number;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countOccurrences(text: string, markers: string[]): number {
  const lower = text.toLowerCase();
  return markers.reduce((count, marker) => count + (lower.includes(marker) ? 1 : 0), 0);
}

export function computeLiveMetrics(transcript: TranscriptEntry[]): LiveMetrics {
  const repEntries = transcript.filter((e) => e.speaker === "rep");
  const customerEntries = transcript.filter((e) => e.speaker === "customer");

  if (repEntries.length === 0) {
    return { confidence: 0, discovery: 0, rapport: 0, objectionHandling: 0, closing: 0, overall: 0 };
  }

  const repWords = repEntries.reduce((sum, e) => sum + wordCount(e.text), 0);
  const customerWords = customerEntries.reduce((sum, e) => sum + wordCount(e.text), 0);
  const talkRatio = repWords / Math.max(1, repWords + customerWords);

  const fillerCount = repEntries.reduce(
    (sum, e) => sum + countOccurrences(e.text, FILLER_WORDS),
    0
  );
  const fillerRatio = fillerCount / Math.max(1, repWords / 20);

  const questionCount = repEntries.filter((e) => e.text.includes("?")).length;

  const objectionsRaised = customerEntries.filter((e) =>
    countOccurrences(e.text, OBJECTION_MARKERS) > 0
  ).length;

  const closingSignals = repEntries.reduce(
    (sum, e) => sum + countOccurrences(e.text, CLOSING_MARKERS),
    0
  );

  const talkBalanceBonus = 30 - Math.abs(talkRatio - 0.5) * 60;
  const confidence = clamp(55 + talkBalanceBonus - fillerRatio * 25);
  const discovery = clamp(questionCount * 14);
  const rapport = clamp(repEntries.length * 7 + (talkRatio > 0.3 && talkRatio < 0.7 ? 15 : 0));
  const objectionHandling = clamp(objectionsRaised === 0 ? 40 : (objectionsRaised / Math.max(1, objectionsRaised)) * 55 + objectionsRaised * 10);
  const closing = clamp(closingSignals * 25);

  const overall = clamp((confidence + discovery + rapport + objectionHandling + closing) / 5);

  return {
    confidence: Math.round(confidence),
    discovery: Math.round(discovery),
    rapport: Math.round(rapport),
    objectionHandling: Math.round(objectionHandling),
    closing: Math.round(closing),
    overall: Math.round(overall),
  };
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
