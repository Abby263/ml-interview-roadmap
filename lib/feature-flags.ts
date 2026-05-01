/**
 * Feature-flag detection for optional integrations.
 *
 * Both Clerk (auth) and Supabase (per-user progress sync) are optional. The
 * site works as a 100%-localStorage app when neither is configured. Adding
 * env vars in Vercel and redeploying turns each feature on with no code
 * changes.
 */

export const clerkClientEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

export const clerkEnabled = Boolean(
  clerkClientEnabled && process.env.CLERK_SECRET_KEY
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

const supabaseServiceKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdminEnabled = Boolean(
  supabaseEnabled && supabaseServiceKey
);

export const aiTutorFeatureEnabled = process.env.AI_TUTOR_ENABLED !== "false";

export const aiTutorOpenAIEnabled = Boolean(
  aiTutorFeatureEnabled && process.env.OPENAI_API_KEY
);

export const aiTutorMemoryEnabled = Boolean(
  aiTutorFeatureEnabled && supabaseAdminEnabled
);

/** Public/runtime-safe view (used in client components). */
export const publicFlags = {
  clerkEnabled: clerkClientEnabled,
  supabaseEnabled: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && supabasePublicKey
  ),
  aiTutorEnabled: aiTutorFeatureEnabled,
};
