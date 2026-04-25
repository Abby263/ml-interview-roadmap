import { createClient } from "@supabase/supabase-js";

import { supabaseEnabled } from "@/lib/feature-flags";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
// Supabase renamed `anon` → `publishable`; accept either.
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
// Server-only secret. Newer name is `secret`, legacy name is `service_role`.
const serviceKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "";

/**
 * Server-side Supabase client using the service role key. Use in server
 * actions to read/write per-user progress. Returns null if Supabase isn't
 * configured.
 */
export function getSupabaseAdmin() {
  if (!supabaseEnabled) return null;
  if (!serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Browser-safe Supabase client using the anon key. Used by client
 * components if they need direct access; server actions are preferred for
 * per-user mutations.
 */
export function getSupabaseBrowser() {
  if (!supabaseEnabled) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * SQL schema (apply once in Supabase SQL editor):
 *
 *   create table if not exists day_progress (
 *     user_id text not null,
 *     day int not null,
 *     item_id text not null,
 *     created_at timestamptz default now(),
 *     primary key (user_id, day, item_id)
 *   );
 *
 *   create index if not exists day_progress_user_idx
 *     on day_progress (user_id);
 *
 * RLS is intentionally OFF here because we always go through the service
 * role from server actions. If you flip RLS on, add policies that scope
 * by `auth.uid()::text = user_id`.
 */
export const PROGRESS_TABLE = "day_progress";
