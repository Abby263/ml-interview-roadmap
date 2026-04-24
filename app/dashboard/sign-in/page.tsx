import { redirect } from "next/navigation";

import { createWorkspaceSession } from "@/app/dashboard/actions";
import { getSessionProfile } from "@/lib/auth";

export default async function DashboardSignInPage() {
  const profile = await getSessionProfile();

  if (profile) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section className="space-y-6">
        <p className="eyebrow">Dashboard setup</p>
        <h1 className="hero-title text-[3.2rem] md:text-[4rem]">
          Create your study workspace.
        </h1>
        <p className="hero-copy">
          This is a lightweight local sign-in for the V2 dashboard. It stores
          your study profile in a secure cookie and keeps progress bookmarks in
          your browser.
        </p>
      </section>

      <form action={createWorkspaceSession} className="section-card rounded-[2rem] p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Name</span>
            <input name="name" required className="field-shell" placeholder="Abby" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Target role</span>
            <select name="role" className="field-shell" defaultValue="AI Engineer">
              <option>AI Engineer</option>
              <option>ML Engineer</option>
              <option>Data Scientist</option>
              <option>Senior MLE</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Timeline</span>
            <select name="timeline" className="field-shell" defaultValue="60">
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Daily hours</span>
            <select name="dailyHours" className="field-shell" defaultValue="2">
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4+ hours</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Interview date</span>
            <input name="interviewDate" type="date" className="field-shell" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Primary focus</span>
            <select name="focus" className="field-shell" defaultValue="System Design">
              <option>Theory</option>
              <option>Coding</option>
              <option>System Design</option>
              <option>Projects</option>
            </select>
          </label>
        </div>

        <button type="submit" className="button-primary mt-6">
          Create dashboard
        </button>
      </form>
    </div>
  );
}
