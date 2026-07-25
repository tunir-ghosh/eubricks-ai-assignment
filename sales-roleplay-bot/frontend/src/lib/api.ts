import type { CoachReport, SessionConfig, StartSessionResponse, TranscriptEntry } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(body.error ?? `Request to ${path} failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  startSession: (config: SessionConfig) =>
    request<StartSessionResponse>("/session/start", {
      method: "POST",
      body: JSON.stringify(config),
    }),
  endSession: (sessionId: string, transcript: TranscriptEntry[]) =>
    request<{ coachReport: CoachReport }>(`/session/${sessionId}/end`, {
      method: "POST",
      body: JSON.stringify({ transcript }),
    }),
};
