"use server";

import { auth } from "@clerk/nextjs/server";

import { clerkEnabled, supabaseEnabled } from "@/lib/feature-flags";
import { PROGRESS_TABLE, getSupabaseAdmin } from "@/lib/supabase";

/** Returns the signed-in Clerk user id, or null when auth is off / signed out. */
async function getUserId(): Promise<string | null> {
  if (!clerkEnabled) return null;
  try {
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}

export interface ServerProgressMap {
  [day: number]: string[];
}

/** Pull all checked items for the signed-in user, grouped by day. */
export async function getServerProgress(): Promise<ServerProgressMap | null> {
  const userId = await getUserId();
  if (!userId) return null;
  if (!supabaseEnabled) return null;
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data, error } = await sb
    .from(PROGRESS_TABLE)
    .select("day,item_id")
    .eq("user_id", userId);
  if (error || !data) return {};
  const out: ServerProgressMap = {};
  for (const row of data as { day: number; item_id: string }[]) {
    (out[row.day] ??= []).push(row.item_id);
  }
  return out;
}

/** Add a check on the server. No-op if not signed in or Supabase off. */
export async function addServerCheck(day: number, itemId: string) {
  const userId = await getUserId();
  if (!userId) return { ok: false, reason: "not-signed-in" } as const;
  if (!supabaseEnabled) return { ok: false, reason: "no-db" } as const;
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, reason: "no-db" } as const;
  const { error } = await sb
    .from(PROGRESS_TABLE)
    .upsert(
      { user_id: userId, day, item_id: itemId },
      { onConflict: "user_id,day,item_id" }
    );
  return error
    ? ({ ok: false, reason: "db-error", error: error.message } as const)
    : ({ ok: true } as const);
}

/** Remove a check on the server. */
export async function removeServerCheck(day: number, itemId: string) {
  const userId = await getUserId();
  if (!userId) return { ok: false, reason: "not-signed-in" } as const;
  if (!supabaseEnabled) return { ok: false, reason: "no-db" } as const;
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, reason: "no-db" } as const;
  const { error } = await sb
    .from(PROGRESS_TABLE)
    .delete()
    .eq("user_id", userId)
    .eq("day", day)
    .eq("item_id", itemId);
  return error
    ? ({ ok: false, reason: "db-error", error: error.message } as const)
    : ({ ok: true } as const);
}
