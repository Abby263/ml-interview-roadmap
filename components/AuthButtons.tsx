import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { clerkClientEnabled } from "@/lib/feature-flags";

/**
 * Render Clerk auth controls when Clerk is configured. When it isn't
 * (no env vars), this component renders nothing — keeping the header
 * clean for local-only use.
 */
export default function AuthButtons() {
  if (!clerkClientEnabled) return null;
  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-surface-strong hover:text-foreground"
          >
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            className="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
