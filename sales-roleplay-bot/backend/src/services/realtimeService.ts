import { GoogleGenAI, Modality } from "@google/genai";
import { env } from "../config/env.js";
import { ApiError } from "../middleware/errorHandler.js";

export interface EphemeralRealtimeSession {
  clientSecret: string;
  expiresAt: number;
  model: string;
  voice: string;
}

/**
 * Mints a short-lived Gemini Live API auth token so the browser can open a
 * WebSocket session directly with Gemini without ever seeing the standing
 * GEMINI_API_KEY. The persona system prompt, voice, and transcription config
 * are locked into the token server-side (via liveConnectConstraints) so they
 * can't be inspected or overridden from the client.
 */
export async function mintRealtimeSession(
  instructions: string,
  voice: string
): Promise<EphemeralRealtimeSession> {
  if (!env.GEMINI_API_KEY) {
    throw new ApiError(
      500,
      "GEMINI_API_KEY is not configured on the server. Add it to backend/.env to start a voice session."
    );
  }

  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  // Short window to open the WebSocket after minting; longer window for how
  // long the resulting Live session itself may stay open.
  const newSessionExpireTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  try {
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        newSessionExpireTime,
        expireTime,
        liveConnectConstraints: {
          model: env.GEMINI_LIVE_MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: instructions,
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        },
        // Ephemeral auth tokens are currently a v1alpha-only Gemini API feature.
        httpOptions: { apiVersion: "v1alpha" },
      },
    });

    if (!token.name) {
      throw new ApiError(502, "Gemini did not return an ephemeral token.");
    }

    return {
      clientSecret: token.name,
      expiresAt: Math.floor(new Date(expireTime).getTime() / 1000),
      model: env.GEMINI_LIVE_MODEL,
      voice,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      502,
      `Gemini Live ephemeral token request failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
