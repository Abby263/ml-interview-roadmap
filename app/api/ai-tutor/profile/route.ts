import { NextResponse } from "next/server";

import { getSignedInUserId } from "@/lib/auth";
import { getAiTutorState, saveAiTutorProfile } from "@/lib/ai-tutor-store";
import { normalizeAiTutorProfile } from "@/lib/ai-tutor-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const state = await getAiTutorState(userId);
  return NextResponse.json(state);
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
  const result = await saveAiTutorProfile(userId, profile);

  return NextResponse.json(result, { status: result.ok ? 200 : 202 });
}
