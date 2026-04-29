import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge runtime sometimes initializes this module before non-NEXT_PUBLIC_*
// envs are visible to process.env. Gating on the publishable key alone
// (always inlined by Next at build) is enough — Clerk reads the secret at
// request time inside clerkMiddleware. This avoids the silent
// "auth() was called but Clerk can't detect clerkMiddleware()" failure
// that happens when the no-op handler ships in production despite the
// secret being present in the runtime env.
const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

const handler = clerkConfigured
  ? clerkMiddleware()
  : (_req: NextRequest) => {
      void _req;
      return NextResponse.next();
    };

export default handler;

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
