import HomeRoadmap from "@/components/HomeRoadmap";
import { dailyPlan, dailyPlanWeeks } from "@/lib/daily-plan";

export default function Home() {
  const totalDays = dailyPlan.length;
  const totalWeeks = Math.ceil(totalDays / 7);

  return (
    <div className="space-y-10">
      <header className="hero-panel relative overflow-hidden p-6 md:p-8 lg:p-10">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <p className="eyebrow">ML Interview Roadmap · {totalDays} days</p>
            <h1 className="max-w-4xl font-display text-[2.55rem] font-extrabold leading-[0.98] text-foreground md:text-[4.4rem]">
              Know exactly what to study next.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted md:text-lg">
              A focused day-by-day path that pairs NeetCode practice with ML
              interview prep in the right order: statistics, traditional ML,
              deep learning, MLOps, GenAI, LLMOps, and ML system design.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#tracker" className="button-primary-accent">
                View my tracker
              </a>
              <a href="#planner" className="button-secondary">
                Open day browser
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
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

      <div id="tracker" className="scroll-mt-24">
        <HomeRoadmap dailyPlan={dailyPlan} dailyPlanWeeks={dailyPlanWeeks} />
      </div>

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
