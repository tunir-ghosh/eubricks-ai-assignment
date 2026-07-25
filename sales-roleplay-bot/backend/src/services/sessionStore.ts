import type { Session } from "../types/domain.types.js";

const sessions = new Map<string, Session>();

export function createSession(session: Session): void {
  sessions.set(session.id, session);
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, patch: Partial<Session>): Session | undefined {
  const existing = sessions.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...patch };
  sessions.set(id, updated);
  return updated;
}
