"use server";

import { getSignedInUserId } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/feature-flags";
import { PROGRESS_TABLE, getSupabaseAdmin } from "@/lib/supabase";

export type ProgressSource = "manual" | "ai_tutor";

export interface ServerProgressRow {
  day: number;
  itemId: string;
  source: ProgressSource;
}

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

/** Pull progress with source attribution — used by AI Tutor to know what
 *  the learner has already studied (and how). Falls back to the lighter
 *  shape if the `source` column doesn't exist yet (graceful migration). */
export async function getServerProgressDetailed(
  userId: string
): Promise<ServerProgressRow[]> {
  if (!supabaseEnabled) return [];
  const sb = getSupabaseAdmin();
  if (!sb) return [];

  const detailed = await sb
    .from(PROGRESS_TABLE)
    .select("day,item_id,source")
    .eq("user_id", userId);

  if (!detailed.error && detailed.data) {
    return (
      detailed.data as { day: number; item_id: string; source: string | null }[]
    ).map((row) => ({
      day: row.day,
      itemId: row.item_id,
      source: row.source === "ai_tutor" ? "ai_tutor" : "manual",
    }));
  }

  const fallback = await sb
    .from(PROGRESS_TABLE)
    .select("day,item_id")
    .eq("user_id", userId);
  if (fallback.error || !fallback.data) return [];
  return (fallback.data as { day: number; item_id: string }[]).map((row) => ({
    day: row.day,
    itemId: row.item_id,
    source: "manual",
  }));
}

/** Add a check on the server. No-op if not signed in or Supabase off. */
export async function addServerCheck(
  day: number,
  itemId: string,
  source: ProgressSource = "manual"
) {
  const userId = await getSignedInUserId();
  if (!userId) return { ok: false, reason: "not-signed-in" } as const;
  if (!supabaseEnabled) return { ok: false, reason: "no-db" } as const;
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, reason: "no-db" } as const;

  // Try writing with source. If the column doesn't exist yet (older schema),
  // fall back to writing without it so existing deployments keep working.
  const withSource = await sb
    .from(PROGRESS_TABLE)
    .upsert(
      { user_id: userId, day, item_id: itemId, source },
      { onConflict: "user_id,day,item_id" }
    );
  if (!withSource.error) return { ok: true } as const;

  const fallback = await sb
    .from(PROGRESS_TABLE)
    .upsert(
      { user_id: userId, day, item_id: itemId },
      { onConflict: "user_id,day,item_id" }
    );
  return fallback.error
    ? ({ ok: false, reason: "db-error", error: fallback.error.message } as const)
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

/** Server-side variant called by the AI Tutor agent loop with an explicit
 *  userId (no Clerk session lookup). Tags the row as ai_tutor so the
 *  dashboard can show which checks came from coaching vs manual study. */
export async function recordAiTutorCheck(
  userId: string,
  day: number,
  itemId: string
) {
  if (!supabaseEnabled) return { ok: false, reason: "no-db" } as const;
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, reason: "no-db" } as const;

  const withSource = await sb
    .from(PROGRESS_TABLE)
    .upsert(
      { user_id: userId, day, item_id: itemId, source: "ai_tutor" },
      { onConflict: "user_id,day,item_id" }
    );
  if (!withSource.error) return { ok: true } as const;

  const fallback = await sb
    .from(PROGRESS_TABLE)
    .upsert(
      { user_id: userId, day, item_id: itemId },
      { onConflict: "user_id,day,item_id" }
    );
  return fallback.error
    ? ({ ok: false, reason: "db-error", error: fallback.error.message } as const)
    : ({ ok: true } as const);
}
