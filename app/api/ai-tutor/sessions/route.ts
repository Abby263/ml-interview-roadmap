import { NextResponse } from "next/server";

import { getSignedInUserId } from "@/lib/auth";
import {
  createAiTutorSession,
  getAiTutorSessionMessages,
  getAiTutorSessions,
} from "@/lib/ai-tutor-store";
import { normalizeAiTutorProfile } from "@/lib/ai-tutor-types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (sessionId) {
    const messages = await getAiTutorSessionMessages(userId, sessionId, 60);
    return NextResponse.json({ messages });
  }

  const sessions = await getAiTutorSessions(userId);
  return NextResponse.json({ sessions });
}

export async function POST(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    profile?: unknown;
  };
  const profile = normalizeAiTutorProfile(body.profile);
  const session = await createAiTutorSession(userId, profile.preferredMode);
  const sessions = await getAiTutorSessions(userId);

  return NextResponse.json({
    sessionId: session.id,
    persisted: session.persisted,
    warning: "warning" in session ? session.warning : undefined,
    sessions,
  });
}
