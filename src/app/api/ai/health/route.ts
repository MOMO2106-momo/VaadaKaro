import { NextResponse } from "next/server";
import { runAiTask } from "@/lib/ai";
import { getGeminiKeyForRole } from "@/lib/config";

export async function GET() {
  const keyStatus = {
    chat: Boolean(getGeminiKeyForRole("CHAT")),
    analysis: Boolean(getGeminiKeyForRole("ANALYSIS")),
    documents: Boolean(getGeminiKeyForRole("DOCUMENTS")),
  };

  try {
    const startTime = Date.now();
    const result = await runAiTask(
      "HEALTH_CHECK",
      "Respond with ONLY 'healthy' if you are working."
    );
    const duration = Date.now() - startTime;

    if (result.data && typeof result.data === "string" && result.data.length > 0) {
      return NextResponse.json({
        status: "healthy",
        model: result.metadata.model,
        keyRole: result.metadata.keyRole,
        keys: keyStatus,
        latency: `${duration}ms`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        status: "unhealthy",
        error: result.error || "AI service returned unexpected response",
        keys: keyStatus,
        metadata: result.metadata,
      },
      { status: 503 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal health check failure";
    return NextResponse.json(
      { status: "error", error: message, keys: keyStatus },
      { status: 500 }
    );
  }
}
