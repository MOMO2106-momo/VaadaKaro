"use server";

import { type Content } from "@google/generative-ai";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getGeminiClient, MODEL_CHAIN } from "@/lib/ai";
import { getGeminiKeyForRole } from "@/lib/config";
import { buildCivicCopilotFallback, extractJsonFromText } from "@/lib/ai-fallback";
import { buildVaadaContext } from "./context-builder";

const FALLBACK_RESPONSE = {
  fallback: true,
  insight: "VaadaAI is operating in safe mode.",
  analysis: "AI service unavailable or key not configured.",
  recommendedAction: "Please rephrase your civic query or try again shortly.",
  escalationFlag: false,
  escalationReason: null,
  urgencyLevel: "LOW",
  suggestedAuthorityAction: null,
  actionButtons: [
    { label: "File Complaint", url: "/file-complaint" },
    { label: "Track Progress", url: "/track-complaint" },
  ],
};

const BASE_JSON_RULE = `
REQUIRED JSON OUTPUT (strict, no markdown wrappers):
{
  "insight": "2-3 lines max, factual summary",
  "analysis": "severity level, pattern detected, or priority analysis",
  "recommendedAction": "exact next step",
  "escalationFlag": true,
  "escalationReason": "clear reason for escalation, or null",
  "urgencyLevel": "LOW | MEDIUM | HIGH | URGENT",
  "suggestedAuthorityAction": "recommended authority-level response",
  "actionButtons": [
    { "label": "Action Label", "url": "/valid-route" }
  ]
}`;

const CITIZEN_PROMPT = `
FINAL IDENTITY:
VaadaAI is the official AI-powered "Civic Governance and Legal-Tech Copilot" for the VaadaKaro platform.

BEHAVIORAL RULES:
1. Actionable Guidance: NEVER provide vague responses like "Contact your local authority". Instead, identify the specific relevant department (e.g., Municipal Corporation, Ward Office, Public Works Department, Police, Water Department) and provide exact, step-by-step filing guidance.
2. Legal Draft Assistance: If the user requests a legal document (RTI, complaint, notice, application), you MUST generate a structured draft inside the "analysis" JSON field. The draft must contain EXACTLY these markdown sections:
   - **Subject**
   - **Incident Details**
   - **Relevant Legal/Civic Provisions**
   - **Requested Action**
   - **Supporting Evidence**
   - **Closing Statement**
3. Platform Awareness: Actively recommend VaadaKaro modules to solve the user's issue. Generate relevant "actionButtons" array items mapped to:
   - Report Civic Issue ("/file-complaint")
   - Track Complaint ("/tracking")
   - Dashboard ("/citizen/dashboard")
   - VaadaAI ("/ai-assistant")
   - Community Map ("/community-map")
4. Tone: Maintain a professional, trustworthy, empathetic, and citizen-friendly tone. Avoid unnecessary legal jargon unless actively drafting official legal documents.
5. Safety & Disclaimer: When discussing laws, citizen rights, or legal protocols, you MUST conclude the "analysis" or "insight" string with this exact note: "This information is for guidance and does not replace advice from a qualified legal professional."

You will receive a structured INPUT object (query, context, location, memory).
REASONING CHAIN:
1. INTERPRET: Identify the user's civic issue, legal request, or document draft requirement.
2. USE CONTEXT: Look at community trends and their past reports.
3. GUIDE: What specific department, scheme, or legal right applies? How can they act using VaadaKaro?
4. GENERATE: Produce STRICT JSON output adhering to the format. Do not use markdown backticks around the JSON payload. Format internal text properly for JSON string consumption.

${BASE_JSON_RULE}
`;

const OFFICER_PROMPT = `
FINAL IDENTITY:
VaadaAI = "Government Officer Copilot and Analyst"

FINAL RULES:
- Focus on: Case summarization, Citizen query summaries, Draft official responses, Department recommendations, Priority analysis, Workflow suggestions, Analytics insights.
- Speak professionally, efficiently, using administrative tone.
- NEVER behave like a chatbot
- ALWAYS use context data provided.

You will receive a structured INPUT object (query, context, location, memory).
REASONING CHAIN:
1. INTERPRET: Identify the administrative or triage request.
2. ANALYZE: Summarize cases, analyze priorities, detect systemic issues.
3. SUGGEST: What is the workflow recommendation or drafted response?
4. GENERATE: Produce structured output.

${BASE_JSON_RULE}
`;

function sanitizeChatHistory(
  history?: { role: string; content: string }[]
): Content[] {
  if (!history?.length) return [];

  const mapped: Content[] = history
    .filter((h) => h.content?.trim())
    .map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content.slice(0, 4000) }],
    }));

  while (mapped.length > 0 && mapped[0].role === "model") {
    mapped.shift();
  }

  // Gemini requires alternating roles — merge consecutive same-role messages
  const normalized: Content[] = [];
  for (const msg of mapped) {
    const last = normalized[normalized.length - 1];
    if (last && last.role === msg.role) {
      last.parts[0].text += "\n" + msg.parts[0].text;
    } else {
      normalized.push(msg);
    }
  }

  return normalized;
}

async function saveHistory(userId: string, query: string, response: Record<string, unknown>) {
  try {
    await prisma.aILegalHistory.create({
      data: {
        userId,
        query,
        response: JSON.stringify(response),
        legalCategory: "CIVIC_COPILOT",
      },
    });
  } catch (dbErr) {
    console.warn("Failed to save legal history:", dbErr);
  }
}

async function callGeminiChat(
  userMessage: string,
  history: Content[],
  systemPrompt: string
): Promise<{ text: string; model: string } | null> {
  const genAI = getGeminiClient("CHAT");
  if (!genAI) return null;

  for (const modelName of MODEL_CHAIN) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
        generationConfig: { responseMimeType: "application/json" },
      });

      if (history.length > 0) {
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(userMessage);
        const text = result.response.text();
        if (text) return { text, model: modelName };
      } else {
        const result = await model.generateContent(userMessage);
        const text = result.response.text();
        if (text) return { text, model: modelName };
      }
    } catch (error) {
      console.error(`[VAADAAI] Model ${modelName} failed:`, error);
    }
  }

  return null;
}

export async function getLegalAdvice(
  userQuery: string,
  pageContext?: string,
  history?: { role: string; content: string }[]
) {
  const session = await auth();
  const userId = session?.user?.id;
  const role = (session?.user as any)?.role;
  const ctx = pageContext || "General";

  let vaadaContextObject: Awaited<ReturnType<typeof buildVaadaContext>> | null = null;

  if (userId) {
    try {
      vaadaContextObject = await buildVaadaContext({
        userId,
        query: userQuery,
        pageContext: ctx,
      });
    } catch (e) {
      console.warn("Could not execute Context Builder:", e);
    }
  }

  const userMessage = JSON.stringify({
    query: userQuery,
    pageContext: ctx,
    userContext: vaadaContextObject?.userContext || {},
    locationContext: vaadaContextObject?.locationContext || null,
    communityContext: vaadaContextObject?.communityContext || {},
    clusterContext: vaadaContextObject?.clusterContext || {},
    sharedAiMemory: vaadaContextObject?.sharedAiMemory || [],
  });

  if (!getGeminiKeyForRole("CHAT")) {
    const guided = buildCivicCopilotFallback(userQuery, ctx);
    return { response: guided, usedFallback: true };
  }

  try {
    const chatHistory = sanitizeChatHistory(history);
    const isOfficer = role === 'OFFICER' || role === 'ADMIN' || role === 'DEPARTMENT_ADMIN' || role === 'SUPER_ADMIN';
    const systemInstruction = isOfficer ? OFFICER_PROMPT : CITIZEN_PROMPT;

    const geminiResult = await Promise.race([
      callGeminiChat(userMessage, chatHistory, systemInstruction),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 28000)),
    ]);

    if (!geminiResult?.text) {
      const guided = buildCivicCopilotFallback(userQuery, ctx);
      if (userId) await saveHistory(userId, userQuery, guided);
      return { response: guided, usedFallback: true };
    }

    const parsedData = extractJsonFromText(geminiResult.text);
    if (!parsedData) {
      const partial = {
        success: true,
        fallback: false,
        insight: "VaadaAI processed your query.",
        analysis: geminiResult.text.slice(0, 300),
        recommendedAction: "Review the analysis above and take the suggested civic action.",
        escalationFlag: false,
        escalationReason: null,
        urgencyLevel: "LOW",
        suggestedAuthorityAction: null,
        actionButtons: [{ label: "File Complaint", url: "/file-complaint" }],
      };
      if (userId) await saveHistory(userId, userQuery, partial);
      return { response: partial, usedFallback: false };
    }

    parsedData.success = true;
    parsedData.fallback = false;

    if (userId) await saveHistory(userId, userQuery, parsedData);

    return { response: parsedData, usedFallback: false };
  } catch (error) {
    console.error("[VAADAAI] Gemini chat error:", error);
    const guided = buildCivicCopilotFallback(userQuery, ctx);
    if (userId) await saveHistory(userId, userQuery, guided);
    return { response: guided, usedFallback: true };
  }
}

export async function getChatHistory() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await prisma.aILegalHistory.findMany({
    where: { userId: session.user.id, legalCategory: "CIVIC_COPILOT" },
    orderBy: { createdAt: "asc" },
    take: 40,
  });

  return rows.map((row) => {
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(row.response);
    } catch {
      data = { insight: row.response.slice(0, 200) };
    }
    return { query: row.query, response: data, createdAt: row.createdAt };
  });
}

export async function clearChatHistory() {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  await prisma.aILegalHistory.deleteMany({
    where: { userId: session.user.id, legalCategory: "CIVIC_COPILOT" },
  });

  return { success: true };
}
