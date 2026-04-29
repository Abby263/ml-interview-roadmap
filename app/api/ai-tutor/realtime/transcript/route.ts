import { NextResponse } from "next/server";

import { getSignedInUserId } from "@/lib/auth";
import { appendAiTutorMessage } from "@/lib/ai-tutor-store";
import type { AiTutorEvaluation, AiTutorPhase } from "@/lib/ai-tutor-types";

export const dynamic = "force-dynamic";

interface TurnPayload {
  role?: unknown;
  content?: unknown;
  evaluation?: unknown;
  phase?: unknown;
}

interface RequestBody {
  sessionId?: unknown;
  turns?: unknown;
}

const validPhases: AiTutorPhase[] = [
  "warmup",
  "calibration",
  "practice",
  "recap",
];

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asEvaluation(value: unknown): AiTutorEvaluation | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const r = value as Record<string, unknown>;
  if (typeof r.score !== "number" || typeof r.summary !== "string") {
    return undefined;
  }
  return {
    score: r.score,
    summary: r.summary,
    strengths: Array.isArray(r.strengths)
      ? (r.strengths as unknown[]).filter((s): s is string => typeof s === "string")
      : [],
    gaps: Array.isArray(r.gaps)
      ? (r.gaps as unknown[]).filter((s): s is string => typeof s === "string")
      : [],
    rubric: Array.isArray(r.rubric)
      ? (r.rubric as unknown[]).filter((s): s is string => typeof s === "string")
      : [],
    readiness:
      r.readiness === "interview_ready" || r.readiness === "needs_practice"
        ? r.readiness
        : "not_assessed",
    trackerUpdated: r.trackerUpdated === true,
  };
}

export async function POST(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as RequestBody;
  const sessionId = asString(body.sessionId);
  if (!sessionId || sessionId.startsWith("local-")) {
    return NextResponse.json(
      { error: "A persisted sessionId is required." },
      { status: 400 }
    );
  }

  const turnsInput = Array.isArray(body.turns) ? body.turns : [];
  if (turnsInput.length === 0) {
    return NextResponse.json({ ok: true, written: 0 });
  }

  let written = 0;
  const warnings: string[] = [];
  for (const turnRaw of turnsInput.slice(0, 30)) {
    const turn = turnRaw as TurnPayload;
    const role = turn.role === "user" ? "user" : "assistant";
    const content = asString(turn.content);
    if (!content) continue;
    const phaseRaw = asString(turn.phase);
    const phase = validPhases.includes(phaseRaw as AiTutorPhase)
      ? (phaseRaw as AiTutorPhase)
      : undefined;
    const evaluation = role === "assistant" ? asEvaluation(turn.evaluation) : undefined;

    const result = await appendAiTutorMessage(userId, sessionId, {
      role,
      content: content.slice(0, 4000),
      evaluation,
      phase,
    });
    if (result.ok) written += 1;
    else if (result.warning) warnings.push(result.warning);
  }

  return NextResponse.json({ ok: true, written, warnings });
}
