import HomeRoadmap from "@/components/HomeRoadmap";

export default function Home() {
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          ML Interview Roadmap · 120 days
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-foreground md:text-5xl">
          Click any day to open the plan.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted md:text-lg">
          A focused day-by-day path: NeetCode 150 in parallel with ML
          fundamentals, system design cases, MLOps, and behavioral. Every day
          is checkable. Every day has references and the interview questions
          you should be ready for.
        </p>
      </header>

      <HomeRoadmap />

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
          guide, expanded across 120 days. NeetCode 150 problems link
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
