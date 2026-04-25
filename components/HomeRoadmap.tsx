"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

import {
  readAllProgress,
  setDayChecks,
  subscribeProgress,
} from "@/lib/progress-store";
import {
  dailyPlan,
  dayItemCount,
  getPillarBySlug,
  type DayPlan,
  type PillarSlug,
} from "@/lib/site-data";

const PILLAR_BORDER: Record<PillarSlug, string> = {
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
  days: DayPlan[];
}

function chunkWeeks(plan: DayPlan[]): Week[] {
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

const emptyProgress: Record<number, number> = {};

export default function HomeRoadmap() {
  const progress = useSyncExternalStore(
    subscribeProgress,
    readAllProgress,
    () => emptyProgress
  );

  // One-shot hydration from server: when the user is signed in and
  // Supabase is configured, pull their saved progress and merge it into
  // localStorage so the UI reflects cross-device state.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getServerProgress } = await import(
          "@/app/actions/progress"
        );
        const serverProgress = await getServerProgress();
        if (cancelled || !serverProgress) return;
        for (const [dayKey, items] of Object.entries(serverProgress)) {
          const day = Number(dayKey);
          if (!Number.isFinite(day)) continue;
          // Merge: prefer the union of local + server checks.
          const local = JSON.parse(
            window.localStorage.getItem(`ml-roadmap-progress:day:${day}`) ??
              "[]"
          );
          const merged = Array.from(new Set([...(local as string[]), ...items]));
          setDayChecks(day, merged);
        }
      } catch {
        // Ignore — local state already works.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const weeks = chunkWeeks(dailyPlan);

  // Site-wide totals
  const totalItems = dailyPlan.reduce((s, d) => s + dayItemCount(d), 0);
  const totalDone = Object.values(progress).reduce((s, n) => s + n, 0);
  const totalPct =
    totalItems === 0 ? 0 : Math.round((totalDone / totalItems) * 100);

  return (
    <div className="space-y-12">
      <section className="section-card rounded-[28px] p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="panel-label">Overall progress</p>
            <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
              {totalDone} / {totalItems} items
              <span className="ml-3 font-mono text-base font-semibold text-primary">
                {totalPct}%
              </span>
            </p>
          </div>
          <p className="text-sm text-muted">
            Tracking saved in your browser. Sign in to sync across devices.
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight transition-all duration-300"
            style={{ width: `${totalPct}%` }}
          />
        </div>
      </section>

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
        {weeks.map((week) => {
          const weekItems = week.days.reduce(
            (s, d) => s + dayItemCount(d),
            0
          );
          const weekDone = week.days.reduce(
            (s, d) => s + (progress[d.day] ?? 0),
            0
          );
          const weekPct =
            weekItems === 0 ? 0 : Math.round((weekDone / weekItems) * 100);

          return (
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
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="font-mono uppercase tracking-[0.18em]">
                    Days {week.days[0].day}–
                    {week.days[week.days.length - 1].day}
                  </span>
                  <span className="font-mono font-semibold text-primary">
                    {weekPct}%
                  </span>
                </div>
              </div>

              <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {week.days.map((entry) => {
                  const total = dayItemCount(entry);
                  const done = progress[entry.day] ?? 0;
                  const pct =
                    total === 0 ? 0 : Math.round((done / total) * 100);
                  const isDone = total > 0 && done >= total;

                  const pillar = getPillarBySlug(entry.pillar);
                  return (
                    <li key={entry.day}>
                      <Link
                        href={`/day/${entry.day}`}
                        className={`group relative block overflow-hidden rounded-xl border border-line border-l-[3px] bg-surface px-4 py-3 transition hover:border-primary hover:bg-surface-strong ${PILLAR_BORDER[entry.pillar]}`}
                      >
                        {/* Progress fill in the background */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-y-0 left-0 transition-all"
                          style={{
                            width: `${pct}%`,
                            background:
                              "color-mix(in srgb, var(--primary) 12%, transparent)",
                          }}
                        />
                        <div className="relative flex items-baseline gap-3">
                          <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            Day {String(entry.day).padStart(2, "0")}
                          </span>
                          <span
                            className={`flex-1 truncate text-[0.95rem] font-semibold leading-snug group-hover:text-primary ${
                              isDone
                                ? "text-muted line-through"
                                : "text-foreground"
                            }`}
                          >
                            {entry.title}
                          </span>
                          <span className="font-mono text-[0.65rem] font-semibold text-primary">
                            {done}/{total}
                          </span>
                          {pillar ? (
                            <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted sm:inline">
                              {pillar.navTitle}
                            </span>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
