/**
 * Feature-flag detection for optional integrations.
 *
 * Both Clerk (auth) and Supabase (per-user progress sync) are optional. The
 * site works as a 100%-localStorage app when neither is configured. Adding
 * env vars in Vercel and redeploying turns each feature on with no code
 * changes.
 */

export const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
);

// Supabase recently renamed their public key from `anon` to `publishable`.
// Accept either name so users with newer Supabase projects don't have to
// duplicate the env var.
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && supabasePublicKey
);

/** Public/runtime-safe view (used in client components). */
export const publicFlags = {
  clerkEnabled: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  supabaseEnabled: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && supabasePublicKey
  ),
};
