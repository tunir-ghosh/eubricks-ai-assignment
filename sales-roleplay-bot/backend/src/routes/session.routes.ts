import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { scenarios } from "../data/dataLoader.js";
import { ApiError } from "../middleware/errorHandler.js";
import { generateCoachReport } from "../services/coachService.js";
import { resolvePersona } from "../services/personaEngine.js";
import { buildRealtimeInstructions } from "../services/promptBuilder.js";
import { mintRealtimeSession } from "../services/realtimeService.js";
import { createSession, getSession, updateSession } from "../services/sessionStore.js";
import type { ScenarioId, Session } from "../types/domain.types.js";

export const sessionRouter = Router();

const sessionConfigSchema = z.object({
  industry: z.string().min(1),
  role: z.string().min(1),
  companySize: z.string().min(1),
  personality: z.string().min(1),
  buyingStage: z.string().min(1),
  budget: z.string().min(1),
  difficulty: z.string().min(1),
  scenarioId: z.string().min(1),
}) satisfies z.ZodType<Record<string, unknown>>;

const transcriptEntrySchema = z.object({
  speaker: z.enum(["rep", "customer"]),
  text: z.string(),
  timestampMs: z.number(),
});

const endSessionSchema = z.object({
  transcript: z.array(transcriptEntrySchema),
});

sessionRouter.post("/session/start", async (req, res, next) => {
  try {
    const config = sessionConfigSchema.parse(req.body) as unknown as Session["config"];

    const scenario = scenarios.find((s) => s.id === config.scenarioId);
    if (!scenario) {
      throw new ApiError(400, `Unknown scenarioId: ${config.scenarioId}`);
    }

    const persona = resolvePersona(config);
    const instructions = buildRealtimeInstructions(persona, {
      ...scenario,
      id: scenario.id as ScenarioId,
    });

    const realtime = await mintRealtimeSession(instructions, persona.voice);

    const session: Session = {
      id: randomUUID(),
      config,
      persona,
      scenario: { ...scenario, id: scenario.id as ScenarioId },
      createdAt: Date.now(),
    };
    createSession(session);

    res.json({
      sessionId: session.id,
      persona,
      scenario: session.scenario,
      realtime: {
        clientSecret: realtime.clientSecret,
        expiresAt: realtime.expiresAt,
        model: realtime.model,
        voice: realtime.voice,
      },
    });
  } catch (err) {
    next(err);
  }
});

sessionRouter.get("/session/:id", (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    throw new ApiError(404, "Session not found");
  }
  res.json(session);
});

sessionRouter.post("/session/:id/end", async (req, res, next) => {
  try {
    const session = getSession(req.params.id);
    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    const { transcript } = endSessionSchema.parse(req.body);

    const coachReport = await generateCoachReport(transcript, session.persona, session.scenario);

    const updated = updateSession(session.id, {
      transcript,
      endedAt: Date.now(),
      coachReport,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});
