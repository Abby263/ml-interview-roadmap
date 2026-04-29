import { NextResponse } from "next/server";

import { getSignedInUserId } from "@/lib/auth";
import {
  createAiTutorSession,
  getAiTutorSessionMessages,
  listAiTutorSessions,
} from "@/lib/ai-tutor-store";
import { type AiTutorMode } from "@/lib/ai-tutor-types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");

  if (sessionId) {
    const messages = await getAiTutorSessionMessages(userId, sessionId);
    return NextResponse.json({ sessionId, messages });
  }

  const sessions = await listAiTutorSessions(userId);
  return NextResponse.json({ sessions });
}

export async function POST(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    mode?: unknown;
  };
  const mode: AiTutorMode =
    body.mode === "teach-and-quiz" || body.mode === "coding-lab"
      ? body.mode
      : "guided-interview";

  const session = await createAiTutorSession(userId, mode);
  return NextResponse.json(session);
}
