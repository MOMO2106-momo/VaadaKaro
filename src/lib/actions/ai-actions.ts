"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { runAiTask } from "@/lib/ai";
import { CommunityInsightsService } from "@/lib/services/insights.service";

/**
 * Intelligence dashboard AI summary (uses runAiTask Path A per BRAIN.md)
 */
export async function getIntelligenceSummary() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [insights, health] = await Promise.all([
    CommunityInsightsService.generateInsights(),
    CommunityInsightsService.calculateHealthScore(),
  ]);

  const prompt = `
You are VaadaAI summarizing civic platform metrics for an admin dashboard.

Active grievances: ${insights.find((i) => i.type === "VOLUME")?.value ?? 0}
Recently resolved (30d): ${insights.find((i) => i.type === "RESOLUTION")?.value ?? 0}
Primary concern category: ${insights.find((i) => i.title === "Primary Concern")?.value ?? "None"}
Community health score: ${health.score}/100
Resolution rate: ${health.factors.resolutionRate}%

Return ONLY valid JSON:
{
  "summary": "2-3 sentence civic operations summary",
  "priorityAction": "single most important action for authorities",
  "trend": "up | down | stable"
}
  `;

  const result = await runAiTask("LEGAL_ASSISTANT", prompt, { json: true });

  if (result.data && typeof result.data === "object") {
    return { success: true, data: result.data };
  }

  return {
    success: true,
    data: {
      summary: `Platform health score is ${health.score}/100 with ${health.factors.resolutionRate}% resolution rate.`,
      priorityAction: "Review unresolved high-priority grievances in the primary concern category.",
      trend: "stable",
      fallback: true,
    },
  };
}
