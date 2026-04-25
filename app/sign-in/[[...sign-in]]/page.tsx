import { SignIn } from "@clerk/nextjs";

import { clerkEnabled } from "@/lib/feature-flags";

export default function SignInPage() {
  if (!clerkEnabled) {
    return (
      <div className="mx-auto max-w-xl space-y-3 py-16 text-center">
        <h1 className="font-display text-3xl font-bold">Sign-in not configured</h1>
        <p className="text-muted">
          Add Clerk environment variables to enable account sign-in. See SETUP.md.
        </p>
      </div>
    );
  }
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <SignIn />
    </div>
  );
}
