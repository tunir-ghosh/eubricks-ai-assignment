import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required").optional(),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  GEMINI_LIVE_MODEL: z.string().default("gemini-3.1-flash-live-preview"),
  COACH_MODEL: z.string().default("gemini-3.1-flash-lite"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

if (!parsed.data.GEMINI_API_KEY) {
  console.warn(
    "[config] GEMINI_API_KEY is not set. Persona/scenario endpoints will work, but starting a " +
      "voice session or generating a coach report will fail until you add a key to backend/.env."
  );
}

export const env = parsed.data;
