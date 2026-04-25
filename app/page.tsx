import Link from "next/link";

import { dailyPlan, getPillarBySlug, type PillarSlug } from "@/lib/site-data";

const PILLAR_TONE: Record<PillarSlug, string> = {
  foundations: "border-l-primary",
  "math-stats": "border-l-accent",
  "traditional-ml": "border-l-primary",
  "deep-learning": "border-l-accent",
  "generative-ai": "border-l-highlight",
  "ml-system-design": "border-l-primary",
  mlops: "border-l-accent",
  "behavioral-storytelling": "border-l-highlight",
};

interface Week {
  number: number;
  title: string;
  days: typeof dailyPlan;
}

function chunkWeeks(plan: typeof dailyPlan): Week[] {
  const weeks: Week[] = [];
  for (let i = 0; i < plan.length; i += 7) {
    const days = plan.slice(i, i + 7);
    if (days.length === 0) break;
    weeks.push({
      number: Math.floor(i / 7) + 1,
      title: weekTitle(days[0]?.pillar),
      days,
    });
  }
  return weeks;
}

function weekTitle(firstPillar: PillarSlug | undefined) {
  if (!firstPillar) return "";
  const map: Record<PillarSlug, string> = {
    foundations: "Coding & SQL foundations",
    "math-stats": "Math & statistics",
    "traditional-ml": "Traditional ML",
    "deep-learning": "Deep learning & transformers",
    "generative-ai": "Generative AI",
    "ml-system-design": "ML system design",
    mlops: "MLOps & production",
    "behavioral-storytelling": "Behavioral & final polish",
  };
  return map[firstPillar];
}

export default function Home() {
  const weeks = chunkWeeks(dailyPlan);

  return (
    <div className="space-y-14">
      <header className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          ML Interview Roadmap · 90 days
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-foreground md:text-5xl">
          Click any day to open the plan.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted md:text-lg">
          A focused day-by-day path from Python and SQL to ML system design,
          GenAI, and final mocks. Skim, click, study.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {weeks.map((week) => (
          <a
            key={week.number}
            href={`#week-${week.number}`}
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground"
          >
            Week {week.number}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {weeks.map((week) => (
          <section
            key={week.number}
            id={`week-${week.number}`}
            className="scroll-mt-24 space-y-4"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
                Week {week.number}
                <span className="ml-3 text-sm font-medium text-muted">
                  {week.title}
                </span>
              </h2>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Days {week.days[0].day}–{week.days[week.days.length - 1].day}
              </span>
            </div>

            <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {week.days.map((entry) => {
                const pillar = getPillarBySlug(entry.pillar);
                return (
                  <li key={entry.day}>
                    <Link
                      href={`/day/${entry.day}`}
                      className={`group flex items-baseline gap-3 rounded-xl border border-line border-l-[3px] bg-surface px-4 py-3 transition hover:border-primary hover:bg-surface-strong ${PILLAR_TONE[entry.pillar]}`}
                    >
                      <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                        Day {String(entry.day).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[0.98rem] font-semibold leading-snug text-foreground group-hover:text-primary">
                        {entry.title}
                      </span>
                      {pillar ? (
                        <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted sm:inline">
                          {pillar.navTitle}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <footer className="space-y-3 border-t border-line pt-8 text-sm leading-7 text-muted">
        <p>
          Want a shorter timeline? See the{" "}
          <Link href="/30-day-crash-plan" className="text-primary hover:underline">
            30-day crash plan
          </Link>{" "}
          or{" "}
          <Link href="/60-day-roadmap" className="text-primary hover:underline">
            60-day roadmap
          </Link>
          . Browsing by topic? Open the{" "}
          <Link href="/questions" className="text-primary hover:underline">
            Question Bank
          </Link>{" "}
          or{" "}
          <Link href="/case-studies" className="text-primary hover:underline">
            Case Studies
          </Link>
          .
        </p>
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
          guide, expanded across 90 days.
        </p>
      </footer>
    </div>
  );
}
