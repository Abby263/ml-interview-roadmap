import Link from "next/link";

import HomeRoadmap from "@/components/HomeRoadmap";
import { dailyPlan, dailyPlanWeeks } from "@/lib/daily-plan";

export default function StudyPlanPage() {
  const totalDays = dailyPlan.length;
  const totalWeeks = Math.ceil(totalDays / 7);

  return (
    <div className="space-y-6 md:space-y-10">
      <header className="hero-panel relative overflow-hidden p-5 md:p-8 lg:p-10">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div className="relative grid gap-5 md:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-4 md:space-y-5">
            <p className="eyebrow text-[0.68rem] md:text-[0.78rem]">
              Study Plan · {totalDays} days
            </p>
            <h1 className="max-w-4xl font-display text-[2.15rem] font-extrabold leading-[1] text-foreground md:text-[4.4rem] md:leading-[0.98]">
              Follow the roadmap day by day.
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-muted md:text-lg md:leading-8">
              A focused path that pairs NeetCode practice with ML interview
              prep in the right order: statistics, traditional ML, deep
              learning, MLOps, GenAI, LLMOps, and ML system design.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#mobile-weeks"
                className="button-primary-accent w-full justify-center sm:w-auto md:hidden"
              >
                Browse weeks
              </a>
              <Link
                href="/"
                className="button-primary-accent hidden md:inline-flex"
              >
                Open dashboard
              </Link>
              <a
                href="#week-1"
                className="button-secondary hidden md:inline-flex"
              >
                Browse all weeks
              </a>
            </div>
          </div>

          <div className="hidden gap-3 md:grid md:grid-cols-3 lg:grid-cols-1">
            <div className="metric-slab">
              <p className="panel-label">Plan length</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                {totalWeeks} weeks
              </p>
            </div>
            <div className="metric-slab">
              <p className="panel-label">Study mode</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                Daily
              </p>
            </div>
            <div className="metric-slab">
              <p className="panel-label">Practice style</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                Checkable
              </p>
            </div>
          </div>
        </div>
      </header>

      <HomeRoadmap
        dailyPlan={dailyPlan}
        dailyPlanWeeks={dailyPlanWeeks}
        variant="plan"
      />

      <footer className="space-y-3 border-t border-line pt-8 text-sm leading-7 text-muted">
        <p className="text-xs">
          Daily plan inspired by{" "}
          <a
            href="https://www.yuan-meng.com/posts/mle_interviews_2.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Yuan Meng&apos;s &ldquo;Prepare in a Hurry&rdquo;
          </a>{" "}
          guide, expanded across {totalDays} days. NeetCode 150 problems link
          directly to LeetCode; full roadmap at{" "}
          <a
            href="https://neetcode.io/roadmap"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            neetcode.io
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
