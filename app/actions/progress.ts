"use server";

import { getSignedInUserId } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/feature-flags";
import { PROGRESS_TABLE, getSupabaseAdmin } from "@/lib/supabase";

export interface ServerProgressMap {
  [day: number]: string[];
}

/** Pull all checked items for the signed-in user, grouped by day. */
export async function getServerProgress(): Promise<ServerProgressMap | null> {
  const userId = await getSignedInUserId();
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
  const userId = await getSignedInUserId();
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
  const userId = await getSignedInUserId();
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
