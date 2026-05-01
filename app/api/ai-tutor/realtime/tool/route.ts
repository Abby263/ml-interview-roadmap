import { NextResponse } from "next/server";

import { executeRealtimeTool } from "@/lib/ai-tutor-realtime";
import { getSignedInUserId } from "@/lib/auth";
import {
  getAiTutorMemory,
  getAiTutorSessionPhase,
  getAiTutorSessionPlan,
  saveAiTutorProfile,
} from "@/lib/ai-tutor-store";
import {
  normalizeAiTutorProfile,
  type AiTutorPhase,
} from "@/lib/ai-tutor-types";

export const dynamic = "force-dynamic";

interface RequestBody {
  sessionId?: unknown;
  profile?: unknown;
  name?: unknown;
  args?: unknown;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function POST(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as RequestBody;
  const sessionId = asString(body.sessionId);
  const name = asString(body.name);

  if (!sessionId || sessionId.startsWith("local-")) {
    return NextResponse.json(
      { error: "A persisted sessionId is required." },
      { status: 400 }
    );
  }
  if (!name) {
    return NextResponse.json(
      { error: "Tool `name` is required." },
      { status: 400 }
    );
  }

  const args = asRecord(body.args);
  const profile = normalizeAiTutorProfile(body.profile);
  await saveAiTutorProfile(userId, profile);

  const [memory, phase, plan] = await Promise.all([
    getAiTutorMemory(userId),
    getAiTutorSessionPhase(sessionId) as Promise<AiTutorPhase>,
    getAiTutorSessionPlan(sessionId),
  ]);

  let result: Awaited<ReturnType<typeof executeRealtimeTool>>;
  try {
    result = await executeRealtimeTool(name, args, {
      userId,
      sessionId,
      profile,
      memory,
      currentPhase: phase,
      currentPlan: plan,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Tool execution failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({
    name,
    output: result.output,
    preview: result.preview,
    changes: result.changes,
    // Snapshot of the post-tool state for the UI to refresh from. The
    // browser uses these to update the plan card, phase pill, mastery
    // counter, and evaluation card immediately, without needing a
    // separate fetch.
    state: {
      phase: result.changes.phase ?? phase,
      plan: result.changes.plan ?? plan,
      memory: result.changes.memory ?? memory,
    },
  });
}
