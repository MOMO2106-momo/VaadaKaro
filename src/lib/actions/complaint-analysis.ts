"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { runAiTask } from "@/lib/ai";
import { buildComplaintAnalysisFallback } from "@/lib/ai-fallback";
import { getSharedAiMemory } from "./context-builder";

export async function analyzeComplaint(
  title: string,
  description: string,
  department: string,
  category: string
) {
  const session = await auth();
  const userId = session?.user?.id;

  let memoryBlock = "";
  if (userId) {
    const memory = await getSharedAiMemory(userId, 5);
    if (memory.length > 0) {
      memoryBlock = `\nPrior AI interactions with this citizen:\n${JSON.stringify(memory)}`;
    }
  }

  const prompt = `
    Analyze the following grievance for a civic-tech platform:
    Title: ${title}
    Department: ${department}
    Category: ${category}
    Description: ${description}
    ${memoryBlock}

    Provide feedback in the following JSON format REQUIRED (no other text):
    {
      "reliabilityScore": number (0-100),
      "reliabilityLevel": "HIGH" | "MEDIUM" | "LOW",
      "feedback": "string",
      "suggestedCategory": "string",
      "missingDetails": ["string"]
    }

    Goal: Help the citizen make their complaint more actionable and detailed.
  `;

  const result = await runAiTask("COMPLAINT_ANALYSIS", prompt, { json: true });

  let output: Record<string, unknown>;

  if (result.data && typeof result.data === "object") {
    output = result.data as Record<string, unknown>;
  } else {
    output = buildComplaintAnalysisFallback(title, description, department, category);
  }

  if (userId) {
    try {
      await prisma.aILegalHistory.create({
        data: {
          userId,
          query: `${title}: ${description.slice(0, 200)}`,
          response: JSON.stringify(output),
          legalCategory: "COMPLAINT_ANALYSIS",
        },
      });
    } catch (dbErr) {
      console.warn("Failed to save complaint analysis history:", dbErr);
    }
  }

  return output;
}
