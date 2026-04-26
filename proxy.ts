import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
);

// When Clerk is configured, run its proxy so auth context is available on
// every request. Without Clerk, the app stays localStorage-only.
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
