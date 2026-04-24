import { redirect } from "next/navigation";

import { endWorkspaceSession } from "@/app/dashboard/actions";
import DashboardClient from "@/components/DashboardClient";
import { getSessionProfile } from "@/lib/auth";
import { listCaseStudyEntries } from "@/lib/content";
import { questions, topics } from "@/lib/site-data";

export default async function DashboardPage() {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect("/dashboard/sign-in");
  }

  const caseStudies = await listCaseStudyEntries();

  return (
    <div className="space-y-12">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-4">
          <p className="eyebrow">Dashboard</p>
          <h1 className="hero-title text-[3.2rem] md:text-[4rem]">
            Your ML interview workspace.
          </h1>
          <p className="hero-copy">
            Track completed topic cards, saved prompts, and the categories that
            still need repetition before interviews begin.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <form action={endWorkspaceSession}>
            <button type="submit" className="button-secondary">
              Reset workspace
            </button>
          </form>
        </div>
      </section>

      <DashboardClient
        caseStudies={caseStudies}
        profile={profile}
        questions={questions}
        topics={topics}
      />
    </div>
  );
}
