import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
);

// When Clerk is configured, run its middleware so auth context (user id,
// session) is available on every request. When it isn't, fall through
// without doing any work — the app stays 100% localStorage.
const handler = clerkConfigured
  ? clerkMiddleware()
  : (_req: NextRequest) => {
      void _req;
      return NextResponse.next();
    };

export default handler;

export const config = {
  // Skip Next.js internals and all static files; run on everything else +
  // API routes.
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
