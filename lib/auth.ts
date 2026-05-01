import { auth } from "@clerk/nextjs/server";

import { clerkEnabled } from "@/lib/feature-flags";

/** Returns the signed-in Clerk user id, or null when auth is off / signed out. */
export async function getSignedInUserId(): Promise<string | null> {
  if (!clerkEnabled) return null;
  try {
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}
