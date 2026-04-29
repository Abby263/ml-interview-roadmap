import { NextResponse } from "next/server";

import { runAiTutorAgent } from "@/lib/ai-tutor-agent";
import { getSignedInUserId } from "@/lib/auth";
import {
  appendAiTutorMessage,
  consumeAiTutorUsage,
  createAiTutorSession,
  getAiTutorMemory,
  getAiTutorSessionPhase,
  getAiTutorSessionPlan,
  saveAiTutorProfile,
} from "@/lib/ai-tutor-store";
import {
  normalizeAiTutorProfile,
  type AiTutorPhase,
} from "@/lib/ai-tutor-types";
import { aiTutorOpenAIEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

interface TutorRequestBody {
  message?: unknown;
  profile?: unknown;
  sessionId?: unknown;
  conversation?: unknown;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeConversation(
  value: unknown
): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const record =
        typeof item === "object" && item !== null
          ? (item as Record<string, unknown>)
          : {};
      const role = record.role === "assistant" ? "assistant" : "user";
      const content = asString(record.content);
      return content ? { role: role as "user" | "assistant", content } : null;
    })
    .filter((item): item is { role: "user" | "assistant"; content: string } =>
      Boolean(item)
    );
}

export async function POST(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (!aiTutorOpenAIEnabled) {
    return NextResponse.json(
      { error: "AI Tutor is not configured. Add OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as TutorRequestBody;
  const message = asString(body.message).slice(0, 5000);
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const profile = normalizeAiTutorProfile(body.profile);
  const profileResult = await saveAiTutorProfile(userId, profile);
  const usage = await consumeAiTutorUsage(
    userId,
    Math.ceil(message.length / 4)
  );
  if (!usage.ok) {
    return NextResponse.json({ error: usage.warning }, { status: 429 });
  }

  const memory = await getAiTutorMemory(userId);
  const existingSessionId = asString(body.sessionId);
  const session = existingSessionId
    ? {
        id: existingSessionId,
        persisted: !existingSessionId.startsWith("local-"),
      }
    : await createAiTutorSession(userId, profile.preferredMode);

  const [phase, plan] = await Promise.all([
    getAiTutorSessionPhase(session.id) as Promise<AiTutorPhase>,
    getAiTutorSessionPlan(session.id),
  ]);

  await appendAiTutorMessage(userId, session.id, {
    role: "user",
    content: message,
    phase,
  });

  const warnings = [
    profileResult.warning,
    usage.warning,
    "warning" in session ? session.warning : undefined,
  ].filter((warning): warning is string => Boolean(warning));

  const conversation = normalizeConversation(body.conversation);

  const turn = await runAiTutorAgent({
    userId,
    sessionId: session.id,
    message,
    profile,
    memory,
    phase,
    plan,
    conversation,
  });

  if (turn.warning) warnings.push(turn.warning);

  await appendAiTutorMessage(userId, session.id, {
    role: "assistant",
    content: turn.assistantMessage,
    evaluation: turn.evaluation,
    topicRef: turn.nextTopic,
    phase: turn.phase,
  });

  return NextResponse.json({
    sessionId: session.id,
    assistantMessage: turn.assistantMessage,
    evaluation: turn.evaluation,
    nextTopic: turn.nextTopic,
    suggestedAction: turn.suggestedAction,
    phase: turn.phase,
    plan: turn.plan,
    toolTrace: turn.toolTrace,
    warnings,
  });
}
