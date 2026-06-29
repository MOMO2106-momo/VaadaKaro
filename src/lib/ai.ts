import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  config as envConfig,
  getGeminiKeyForRole,
  hasAnyGeminiKey,
  type GeminiKeyRole,
} from "./config";

export const AI_MODELS = {
  PRIMARY: "gemini-2.0-flash",
  FALLBACK: "gemini-1.5-flash",
  LEGACY: "gemini-1.5-flash-latest",
};

/** Try multiple models — some keys/regions don't support every model */
export const MODEL_CHAIN = [
  AI_MODELS.PRIMARY,
  AI_MODELS.FALLBACK,
  AI_MODELS.LEGACY,
] as const;

export type AiTaskType =
  | "LEGAL_ASSISTANT"
  | "DOCUMENT_GENERATION"
  | "COMPLAINT_ANALYSIS"
  | "HEALTH_CHECK";

const TASK_KEY_ROLE: Record<AiTaskType, GeminiKeyRole> = {
  LEGAL_ASSISTANT: "ANALYSIS",
  COMPLAINT_ANALYSIS: "ANALYSIS",
  HEALTH_CHECK: "ANALYSIS",
  DOCUMENT_GENERATION: "DOCUMENTS",
};

const clientCache = new Map<GeminiKeyRole, GoogleGenerativeAI>();
const AI_TIMEOUT_MS = 30000;

export function getGeminiClient(role: GeminiKeyRole): GoogleGenerativeAI | null {
  const apiKey = getGeminiKeyForRole(role);
  if (!apiKey) return null;

  if (!clientCache.has(role)) {
    clientCache.set(role, new GoogleGenerativeAI(apiKey));
  }
  return clientCache.get(role)!;
}

export function getKeyRoleForTask(taskType: AiTaskType): GeminiKeyRole {
  return TASK_KEY_ROLE[taskType];
}

interface AiTaskResult<T> {
  data?: T;
  error?: string;
  metadata: {
    model: string;
    duration: number;
    timestamp: string;
    task: AiTaskType;
    keyRole: GeminiKeyRole;
  };
}

function getUserFriendlyError(errorMessage: string) {
  const msg = errorMessage.toLowerCase();
  if (msg.includes("api key not valid") || msg.includes("api_key_invalid")) return "Invalid AI API key configuration.";
  if (msg.includes("quota") || msg.includes("429")) return "AI service rate limit exceeded. Please try again later.";
  if (msg.includes("timeout")) return "The AI request timed out. Please try again.";
  if (msg.includes("fetch failed") || msg.includes("network")) return "Network error connecting to AI service.";
  if (msg.includes("not found")) return "Selected AI model is currently unavailable.";
  return "AI service is temporarily unavailable. Please try again.";
}

function promptToText(prompt: string | string[]): string {
  return Array.isArray(prompt) ? prompt.join("\n\n") : prompt;
}

function parseJsonResponse(text: string): unknown {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
}

async function attemptGeneration(
  genAI: GoogleGenerativeAI,
  modelName: string,
  prompt: string | string[],
  taskType: AiTaskType,
  keyRole: GeminiKeyRole,
  options: { json?: boolean; systemInstruction?: string }
): Promise<AiTaskResult<string | unknown>> {
  const innerStart = Date.now();

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: options.systemInstruction,
    generationConfig: options.json
      ? { responseMimeType: "application/json" }
      : undefined,
  });

  const result = await model.generateContent(promptToText(prompt));
  const responseText = result.response.text();

  let data: string | unknown = responseText;
  if (options.json) {
    try {
      data = parseJsonResponse(responseText);
    } catch {
      console.warn(
        `[AI_SERIALIZATION_WARNING] Failed to parse JSON for task ${taskType}. Returning raw text.`
      );
    }
  }

  const duration = Date.now() - innerStart;
  console.log(
    `[AI_SUCCESS] Task: ${taskType} | Key: ${keyRole} | Model: ${modelName} | Duration: ${duration}ms`
  );

  return {
    data,
    metadata: {
      model: modelName,
      duration,
      timestamp: new Date().toISOString(),
      task: taskType,
      keyRole,
    },
  };
}

export async function runAiTask(
  taskType: AiTaskType,
  prompt: string | string[],
  options: { json?: boolean; systemInstruction?: string } = {}
): Promise<AiTaskResult<string | unknown>> {
  const startTime = Date.now();
  const keyRole = getKeyRoleForTask(taskType);
  const genAI = getGeminiClient(keyRole);

  if (!genAI) {
    return {
      error: `AI Service is not configured. Missing GEMINI_API_KEY_${keyRole}.`,
      metadata: {
        model: "none",
        duration: 0,
        timestamp: new Date().toISOString(),
        task: taskType,
        keyRole,
      },
    };
  }

  let lastError: Error | null = null;

  for (const modelName of MODEL_CHAIN) {
    try {
      return await Promise.race([
        attemptGeneration(genAI, modelName, prompt, taskType, keyRole, options),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("AI_TIMEOUT")), AI_TIMEOUT_MS)
        ),
      ]);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `[AI_FAILURE] Task: ${taskType} | Key: ${keyRole} | Model: ${modelName} | Error:`,
        lastError.message
      );
    }
  }

  const duration = Date.now() - startTime;
  return {
    error: lastError ? getUserFriendlyError(lastError.message) : "AI service is temporarily unavailable.",
    metadata: {
      model: AI_MODELS.LEGACY,
      duration,
      timestamp: new Date().toISOString(),
      task: taskType,
      keyRole,
    },
  };
}

export { hasAnyGeminiKey, envConfig };
