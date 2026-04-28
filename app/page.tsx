import Link from "next/link";

import HomeRoadmap from "@/components/HomeRoadmap";
import { dailyPlan, dailyPlanWeeks } from "@/lib/daily-plan";
import { questions } from "@/lib/site-data";

export default function Home() {
  const totalDays = dailyPlan.length;
  const totalWeeks = Math.ceil(totalDays / 7);

  return (
    <div className="space-y-8 md:space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Prep dashboard
        </p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              Pick up where you left off.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted md:text-base md:leading-7">
              Track roadmap completion, DSA practice, and your next recommended
              study action before choosing how you want to continue.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:min-w-[24rem]">
            <div className="metric-slab p-3 md:p-4">
              <p className="panel-label">Days</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                {totalDays}
              </p>
            </div>
            <div className="metric-slab p-3 md:p-4">
              <p className="panel-label">Weeks</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                {totalWeeks}
              </p>
            </div>
            <div className="metric-slab p-3 md:p-4">
              <p className="panel-label">Questions</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                {questions.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <HomeRoadmap
        dailyPlan={dailyPlan}
        dailyPlanWeeks={dailyPlanWeeks}
        variant="dashboard"
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/study-plan"
          className="section-card group relative overflow-hidden rounded-[1.75rem] p-5 transition hover:-translate-y-0.5 hover:border-primary md:p-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-25 blur-3xl"
            style={{ background: "var(--primary)" }}
          />
          <div className="relative">
            <p className="panel-label">Option 1</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-foreground group-hover:text-primary">
              Study Plan
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Follow the current day-by-day and week-by-week roadmap in the
              right interview order.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="data-chip">{totalDays} days</span>
              <span className="data-chip">{totalWeeks} weeks</span>
              <span className="data-chip">Checkable</span>
            </div>
            <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Open study plan →
            </p>
          </div>
        </Link>

        <Link
          href="/questions"
          className="section-card group relative overflow-hidden rounded-[1.75rem] p-5 transition hover:-translate-y-0.5 hover:border-accent md:p-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-25 blur-3xl"
            style={{ background: "var(--accent)" }}
          />
          <div className="relative">
            <p className="panel-label">Option 2</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-foreground group-hover:text-accent">
              Question Bank
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Search and filter questions by topic tag, category, difficulty,
              and interview signal.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="data-chip">{questions.length} prompts</span>
              <span className="data-chip">Tags</span>
              <span className="data-chip">Rubrics</span>
            </div>
            <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Browse questions →
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
