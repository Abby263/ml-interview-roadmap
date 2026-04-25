import { redirect } from "next/navigation";

// Legacy route. The post-sign-in destination configured in Vercel
// (NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard) lands users here;
// we just send them to the roadmap home where their progress lives.
export default function DashboardPage() {
  redirect("/");
}
