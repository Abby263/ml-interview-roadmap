"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

import { publicFlags } from "@/lib/feature-flags";
import {
  readAllProgress,
  setDayChecks,
  subscribeProgress,
} from "@/lib/progress-store";
import { dailyPlan, dayItemCount, type DayPlan } from "@/lib/site-data";

interface Week {
  number: number;
  title: string;
  days: DayPlan[];
}

// Explicit per-week titles. Derived from a content map of what each week
// actually covers (DSA + ML/concept), not from any single day's pillar.
const WEEK_TITLES: Record<number, string> = {
  1: "Statistics, probability, linear algebra, and optimization",
  2: "Traditional ML basics + stack / binary search practice",
  3: "Traditional ML practicals: trees, imbalance, features, ML coding",
  4: "SQL support + deep learning foundations",
  5: "Deep learning finish + MLOps launch",
  6: "MLOps finish + GenAI foundations",
  7: "GenAI: prompting, RAG, retrieval, eval, fine-tuning, agents",
  8: "Guardrails + LLMOps release gates, tracing, cost, safety",
  9: "LLMOps finish + ML system design framework",
  10: "ML system design cases: recommendations, ads, search, fraud",
  11: "GenAI system cases + cross-case trade-off rehearsal",
  12: "OOP, concurrency, AI coding, and company-tag drilling",
  13: "DSA hard practice + behavioral story construction",
  14: "Company prep + coding, ML design, and GenAI design mocks",
  15: "Behavioral mock + weak-area repair + paper/case reading",
  16: "Mock sprint, system mini-designs, and project deep dives",
  17: "Final weak-area repair + taper",
  18: "Final logistics, light review, and day-of prep",
  19: "Specialization deep dives — CV, NLP, speech, RL, RecSys, infra",
};

function chunkWeeks(plan: DayPlan[]): Week[] {
  const weeks: Week[] = [];
  for (let i = 0; i < plan.length; i += 7) {
    const days = plan.slice(i, i + 7);
    if (days.length === 0) break;
    const number = Math.floor(i / 7) + 1;
    weeks.push({
      number,
      title: WEEK_TITLES[number] ?? "",
      days,
    });
  }
  return weeks;
}

const emptyProgress: Record<number, number> = {};

function useAuthState(): { canTrack: boolean } {
  if (!publicFlags.clerkEnabled) {
    return { canTrack: true };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isSignedIn } = useUser();
  return { canTrack: Boolean(isSignedIn) };
}

export default function HomeRoadmap() {
  const { canTrack } = useAuthState();
  const progress = useSyncExternalStore(
    subscribeProgress,
    readAllProgress,
    () => emptyProgress
  );

  // One-shot hydration from server: when the user is signed in and
  // Supabase is configured, pull their saved progress and merge it into
  // localStorage so the UI reflects cross-device state.
  useEffect(() => {
    if (!canTrack) return;
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
          const local = JSON.parse(
            window.localStorage.getItem(`ml-roadmap-progress:day:${day}`) ??
              "[]"
          );
          const merged = Array.from(new Set([...(local as string[]), ...items]));
          setDayChecks(day, merged);
        }
      } catch {
        // Local state already works.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canTrack]);

  const weeks = chunkWeeks(dailyPlan);

  // Site-wide totals — only shown to signed-in users.
  const totalItems = dailyPlan.reduce((s, d) => s + dayItemCount(d), 0);
  const totalDone = canTrack
    ? Object.values(progress).reduce((s, n) => s + n, 0)
    : 0;
  const totalPct =
    totalItems === 0 ? 0 : Math.round((totalDone / totalItems) * 100);

  return (
    <div className="space-y-12">
      {canTrack ? (
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
            <p className="text-sm text-muted">Synced to your account.</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight transition-all duration-300"
              style={{ width: `${totalPct}%` }}
            />
          </div>
        </section>
      ) : null}

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
          const weekDone = canTrack
            ? week.days.reduce((s, d) => s + (progress[d.day] ?? 0), 0)
            : 0;
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
                  {canTrack ? (
                    <span className="font-mono font-semibold text-primary">
                      {weekPct}%
                    </span>
                  ) : null}
                </div>
              </div>

              <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {week.days.map((entry) => {
                  const total = dayItemCount(entry);
                  const done = canTrack ? progress[entry.day] ?? 0 : 0;
                  const pct =
                    total === 0 ? 0 : Math.round((done / total) * 100);
                  const isDone = canTrack && total > 0 && done >= total;

                  return (
                    <li key={entry.day}>
                      <Link
                        href={`/day/${entry.day}`}
                        className="group relative block h-full min-h-[5.5rem] overflow-hidden rounded-xl border border-line border-l-[3px] border-l-primary bg-surface px-4 py-3 transition hover:border-primary hover:bg-surface-strong"
                      >
                        {/* Progress fill in the background (only when signed in) */}
                        {canTrack ? (
                          <div
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 transition-all"
                            style={{
                              width: `${pct}%`,
                              background:
                                "color-mix(in srgb, var(--primary) 12%, transparent)",
                            }}
                          />
                        ) : null}
                        <div className="relative flex h-full flex-col gap-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                              Day {String(entry.day).padStart(2, "0")}
                            </span>
                            {canTrack ? (
                              <span className="font-mono text-[0.65rem] font-semibold text-primary">
                                {done}/{total}
                              </span>
                            ) : (
                              <span
                                className="font-mono text-[0.65rem] font-semibold text-muted"
                                title="Sign in to track items"
                              >
                                {total} items
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[0.95rem] font-semibold leading-snug group-hover:text-primary ${
                              isDone
                                ? "text-muted line-through"
                                : "text-foreground"
                            }`}
                          >
                            {entry.title}
                          </span>
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
