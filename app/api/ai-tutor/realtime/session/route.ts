import { NextResponse } from "next/server";

import {
  buildRealtimeSessionConfig,
} from "@/lib/ai-tutor-realtime";
import { buildVoiceInstructions } from "@/lib/ai-tutor-prompts";
import { getSignedInUserId } from "@/lib/auth";
import {
  createAiTutorSession,
  getAiTutorMemory,
  getAiTutorSessionPhase,
  getAiTutorSessionPlan,
  saveAiTutorProfile,
} from "@/lib/ai-tutor-store";
import { aiTutorOpenAIEnabled } from "@/lib/feature-flags";
import {
  normalizeAiTutorProfile,
  type AiTutorPhase,
} from "@/lib/ai-tutor-types";

export const dynamic = "force-dynamic";

interface RequestBody {
  sessionId?: unknown;
  profile?: unknown;
  voice?: unknown;
}

export async function POST(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  if (!aiTutorOpenAIEnabled) {
    return NextResponse.json(
      { error: "Voice coach is not configured. Add OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as RequestBody;
  const profile = normalizeAiTutorProfile(body.profile);
  await saveAiTutorProfile(userId, profile);

  const requestedSessionId =
    typeof body.sessionId === "string" && body.sessionId.length > 0
      ? body.sessionId
      : undefined;

  // Reuse the active session if one was passed; otherwise create a fresh
  // one so the voice transcript and memory updates land somewhere.
  let sessionId = requestedSessionId;
  if (!sessionId || sessionId.startsWith("local-")) {
    const created = await createAiTutorSession(userId, profile.preferredMode);
    sessionId = created.id;
  }

  const [memory, phase, plan] = await Promise.all([
    getAiTutorMemory(userId),
    getAiTutorSessionPhase(sessionId) as Promise<AiTutorPhase>,
    getAiTutorSessionPlan(sessionId),
  ]);

  const voice =
    typeof body.voice === "string" && body.voice.length > 0
      ? body.voice
      : undefined;

  const instructions = buildVoiceInstructions(profile, memory, phase);
  const config = buildRealtimeSessionConfig(
    { profile, memory, phase, plan, voice },
    instructions
  );

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 503 }
    );
  }

  const upstream = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "realtime=v1",
    },
    body: JSON.stringify(config),
  });

  const data = (await upstream.json().catch(() => ({}))) as {
    error?: { message?: string };
    id?: string;
    client_secret?: { value?: string; expires_at?: number };
    model?: string;
    voice?: string;
  };

  if (!upstream.ok || !data.client_secret?.value) {
    const message =
      data.error?.message ?? `Realtime mint failed (${upstream.status}).`;
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({
    sessionId,
    realtimeSessionId: data.id,
    clientSecret: data.client_secret.value,
    expiresAt: data.client_secret.expires_at,
    model: data.model ?? config.model,
    voice: data.voice ?? config.voice,
    phase,
    plan,
  });
}
