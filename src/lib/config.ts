/**
 * System Configurations and Environment Safety Layer
 * This module ensures that missing environment variables never crash the application.
 */

export type GeminiKeyRole = "CHAT" | "ANALYSIS" | "DOCUMENTS";

export interface GeminiKeys {
  chat: string | null;
  analysis: string | null;
  documents: string | null;
}

interface SystemConfig {
  /** @deprecated Use geminiKeys — kept for backward compatibility */
  geminiApiKey: string | null;
  geminiKeys: GeminiKeys;
  databaseUrl: string | null;
  nodeEnv: string;
}

const fallbackKey = process.env.GEMINI_API_KEY || null;

const validateEnv = (): SystemConfig => {
  const geminiKeys: GeminiKeys = {
    chat: process.env.GEMINI_API_KEY_CHAT || fallbackKey,
    analysis: process.env.GEMINI_API_KEY_ANALYSIS || fallbackKey,
    documents: process.env.GEMINI_API_KEY_DOCUMENTS || fallbackKey,
  };

  const config: SystemConfig = {
    geminiApiKey: fallbackKey || geminiKeys.chat || geminiKeys.analysis || geminiKeys.documents,
    geminiKeys,
    databaseUrl: process.env.DATABASE_URL || null,
    nodeEnv: process.env.NODE_ENV || "development",
  };

  const configuredRoles = Object.entries(geminiKeys)
    .filter(([, key]) => Boolean(key))
    .map(([role]) => role);

  if (configuredRoles.length === 0) {
    console.warn(
      "⚠️ [CONFIG_WARNING]: No Gemini API keys found. Set GEMINI_API_KEY_CHAT, GEMINI_API_KEY_ANALYSIS, GEMINI_API_KEY_DOCUMENTS (or GEMINI_API_KEY). AI will run in fallback mode."
    );
  } else {
    console.log(
      `[CONFIG] Gemini keys loaded — CHAT: ${geminiKeys.chat ? "✓" : "✗"} | ANALYSIS: ${geminiKeys.analysis ? "✓" : "✗"} | DOCUMENTS: ${geminiKeys.documents ? "✓" : "✗"}`
    );
  }

  if (!config.databaseUrl) {
    console.warn(
      "⚠️ [CONFIG_WARNING]: DATABASE_URL is missing. Database dependent routes will fail."
    );
  }

  return config;
};

export const config = validateEnv();

export function getGeminiKeyForRole(role: GeminiKeyRole): string | null {
  return config.geminiKeys[role.toLowerCase() as keyof GeminiKeys] ?? null;
}

export function hasAnyGeminiKey(): boolean {
  const { chat, analysis, documents } = config.geminiKeys;
  return Boolean(chat || analysis || documents);
}
