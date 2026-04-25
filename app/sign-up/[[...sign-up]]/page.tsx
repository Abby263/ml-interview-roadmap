import { SignUp } from "@clerk/nextjs";

import { clerkEnabled } from "@/lib/feature-flags";

export default function SignUpPage() {
  if (!clerkEnabled) {
    return (
      <div className="mx-auto max-w-xl space-y-3 py-16 text-center">
        <h1 className="font-display text-3xl font-bold">Sign-up not configured</h1>
        <p className="text-muted">
          Add Clerk environment variables to enable account sign-up. See SETUP.md.
        </p>
      </div>
    );
  }
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <SignUp />
    </div>
  );
}
