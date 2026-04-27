"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

import { publicFlags } from "@/lib/feature-flags";
import {
  readAllProgressItems,
  setDayChecks,
  subscribeProgress,
} from "@/lib/progress-store";
import {
  dayItemCount,
  type DailyPlanWeek,
  type DayPlan,
} from "@/lib/daily-plan-schema";
import type { PillarSlug } from "@/lib/site-data";

interface Week {
  number: number;
  title: string;
  days: DayPlan[];
}

interface DayStats {
  total: number;
  done: number;
  pct: number;
  isDone: boolean;
  isStarted: boolean;
}

const pillarMeta: Array<{
  slug: PillarSlug;
  label: string;
  shortLabel: string;
}> = [
  { slug: "math-stats", label: "Statistics", shortLabel: "Stats" },
  { slug: "traditional-ml", label: "Traditional ML", shortLabel: "ML" },
  { slug: "deep-learning", label: "Deep Learning", shortLabel: "DL" },
  { slug: "mlops", label: "MLOps", shortLabel: "MLOps" },
  { slug: "generative-ai", label: "Generative AI", shortLabel: "GenAI" },
  { slug: "llmops", label: "LLMOps", shortLabel: "LLMOps" },
  {
    slug: "ml-system-design",
    label: "ML System Design",
    shortLabel: "Design",
  },
];

const emptyProgressItems: Record<number, string[]> = {};

function chunkWeeks(plan: DayPlan[], weekConfig: DailyPlanWeek[]): Week[] {
  const weekTitles = new Map(weekConfig.map((week) => [week.week, week.title]));
  const weeks: Week[] = [];
  for (let i = 0; i < plan.length; i += 7) {
    const days = plan.slice(i, i + 7);
    if (days.length === 0) break;
    const number = Math.floor(i / 7) + 1;
    weeks.push({
      number,
      title: weekTitles.get(number) ?? "",
      days,
    });
  }
  return weeks;
}

function useAuthState(): { canTrack: boolean } {
  if (!publicFlags.clerkEnabled) {
    return { canTrack: true };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isSignedIn } = useUser();
  return { canTrack: Boolean(isSignedIn) };
}

function getDayStats(
  day: DayPlan,
  progress: Record<number, string[]>,
  canTrack: boolean
): DayStats {
  const total = dayItemCount(day);
  const done = canTrack ? Math.min(progress[day.day]?.length ?? 0, total) : 0;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return {
    total,
    done,
    pct,
    isDone: canTrack && total > 0 && done >= total,
    isStarted: canTrack && done > 0,
  };
}

function clampPct(value: number) {
  return Math.max(0, Math.min(100, value));
}

export default function HomeRoadmap({
  dailyPlan,
  dailyPlanWeeks,
}: {
  dailyPlan: DayPlan[];
  dailyPlanWeeks: DailyPlanWeek[];
}) {
  const { canTrack } = useAuthState();
  const progress = useSyncExternalStore(
    subscribeProgress,
    readAllProgressItems,
    () => emptyProgressItems
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

  const weeks = chunkWeeks(dailyPlan, dailyPlanWeeks);
  const dayStats = new Map(
    dailyPlan.map((day) => [day.day, getDayStats(day, progress, canTrack)])
  );

  const totalItems = dailyPlan.reduce((sum, day) => sum + dayItemCount(day), 0);
  const totalDone = canTrack
    ? dailyPlan.reduce(
        (sum, day) => sum + (dayStats.get(day.day)?.done ?? 0),
        0
      )
    : 0;
  const totalPct =
    totalItems === 0 ? 0 : Math.round((totalDone / totalItems) * 100);

  const completedDays = canTrack
    ? dailyPlan.filter((day) => dayStats.get(day.day)?.isDone).length
    : 0;
  const completedTopics = canTrack
    ? dailyPlan.reduce(
        (sum, day) =>
          sum +
          day.tracks.filter((track) => {
            const checked = new Set(progress[day.day] ?? []);
            return (
              track.items.length > 0 &&
              track.items.every((item) => checked.has(item.id))
            );
          }).length,
        0
      )
    : 0;
  const totalTopics = dailyPlan.reduce((sum, day) => sum + day.tracks.length, 0);

  const nextDay =
    dailyPlan.find((day) => !(dayStats.get(day.day)?.isDone ?? false)) ??
    dailyPlan[dailyPlan.length - 1];
  const nextDayStats = nextDay ? dayStats.get(nextDay.day) : undefined;
  const continueLabel =
    totalDone === 0
      ? "Start Day 1"
      : totalPct === 100
        ? "Review final day"
        : `Continue Day ${nextDay?.day ?? 1}`;

  const pillarProgress = pillarMeta.map((pillar) => {
    const days = dailyPlan.filter((day) => day.pillar === pillar.slug);
    const total = days.reduce((sum, day) => sum + dayItemCount(day), 0);
    const done = canTrack
      ? days.reduce((sum, day) => sum + (dayStats.get(day.day)?.done ?? 0), 0)
      : 0;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { ...pillar, total, done, pct };
  });

  return (
    <div className="space-y-10">
      <section className="section-card relative overflow-hidden rounded-[2rem] p-5 md:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-8 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--accent)" }}
        />

        <div className="relative grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="data-chip">Learner tracker</span>
              <span className="data-chip">
                {canTrack ? "Progress active" : "Sign in to track"}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Overall completion
              </p>
              <div className="mt-4 flex items-center gap-5">
                <div
                  className="grid h-32 w-32 flex-shrink-0 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(var(--primary) ${clampPct(
                      totalPct
                    )}%, color-mix(in srgb, var(--line) 70%, transparent) 0)`,
                  }}
                >
                  <div className="grid h-[6.5rem] w-[6.5rem] place-items-center rounded-full bg-surface-strong">
                    <div className="text-center">
                      <p className="font-display text-3xl font-extrabold text-foreground">
                        {totalPct}%
                      </p>
                      <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
                        complete
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
                    {canTrack
                      ? `${completedTopics} topic sections completed`
                      : "Track completion as you study"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {canTrack
                      ? `${totalDone} of ${totalItems} checklist items done across ${dailyPlan.length} days.`
                      : "Sign in, open a day, and mark checklist items complete to populate this dashboard."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-line bg-surface-strong p-4">
                <p className="panel-label">Topics</p>
                <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                  {completedTopics}/{totalTopics}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-strong p-4">
                <p className="panel-label">Days</p>
                <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                  {completedDays}/{dailyPlan.length}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-strong p-4">
                <p className="panel-label">Items</p>
                <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                  {totalDone}/{totalItems}
                </p>
              </div>
            </div>
          </div>

          <div className="relative grid gap-4 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-[1.5rem] border border-line bg-surface-strong p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="panel-label">Next recommended step</p>
                  <h3 className="mt-3 font-display text-2xl font-extrabold text-foreground">
                    Day {nextDay?.day ?? 1}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {nextDay?.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {nextDay?.focus}
                  </p>
                </div>
                <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  {nextDayStats?.done ?? 0}/{nextDayStats?.total ?? 0}
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight transition-all duration-300"
                  style={{ width: `${nextDayStats?.pct ?? 0}%` }}
                />
              </div>

              <Link
                href={`/day/${nextDay?.day ?? 1}`}
                className="button-primary-accent mt-5 w-full justify-center"
              >
                {continueLabel} →
              </Link>
            </div>

            <div className="rounded-[1.5rem] border border-line bg-surface-strong p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="panel-label">Coverage by pillar</p>
                <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  {pillarProgress.length} areas
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {pillarProgress.map((pillar) => (
                  <div key={pillar.slug}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-foreground">
                        {pillar.label}
                      </span>
                      <span className="font-mono font-semibold text-primary">
                        {pillar.pct}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${pillar.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="section-card sticky top-[4.25rem] z-30 -mx-4 overflow-x-auto rounded-none border-x-0 px-4 py-3 sm:mx-0 sm:rounded-2xl sm:border-x sm:px-4">
        <div className="flex min-w-max items-center gap-2">
          <span className="mr-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
            Jump to
          </span>
          {weeks.map((week) => (
            <a
              key={week.number}
              href={`#week-${week.number}`}
              className="rounded-full border border-line bg-surface-strong px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground"
            >
              Week {week.number}
            </a>
          ))}
        </div>
      </nav>

      <div className="space-y-12">
        {weeks.map((week) => {
          const weekItems = week.days.reduce(
            (sum, day) => sum + dayItemCount(day),
            0
          );
          const weekDone = canTrack
            ? week.days.reduce(
                (sum, day) => sum + (dayStats.get(day.day)?.done ?? 0),
                0
              )
            : 0;
          const weekPct =
            weekItems === 0 ? 0 : Math.round((weekDone / weekItems) * 100);

          return (
            <section
              key={week.number}
              id={`week-${week.number}`}
              className="scroll-mt-32 space-y-4"
            >
              <div className="section-card overflow-hidden rounded-[1.75rem]">
                <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                  <div>
                    <p className="panel-label">Week {week.number}</p>
                    <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
                      {week.title}
                    </h2>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-muted">
                      Days {week.days[0].day}–
                      {week.days[week.days.length - 1].day} · {weekItems} items
                    </p>
                  </div>

                  <div className="min-w-[10rem]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-muted">
                        Week progress
                      </span>
                      <span className="font-mono text-sm font-semibold text-primary">
                        {weekPct}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight"
                        style={{ width: `${weekPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {week.days.map((entry) => {
                  const stats = dayStats.get(entry.day) ?? {
                    total: dayItemCount(entry),
                    done: 0,
                    pct: 0,
                    isDone: false,
                    isStarted: false,
                  };
                  const status = stats.isDone
                    ? "Complete"
                    : stats.isStarted
                      ? "In progress"
                      : "Not started";

                  return (
                    <li key={entry.day}>
                      <Link
                        href={`/day/${entry.day}`}
                        className="group relative block h-full min-h-[8.75rem] overflow-hidden rounded-2xl border border-line bg-surface px-4 py-4 shadow-panel transition hover:-translate-y-0.5 hover:border-primary hover:bg-surface-strong"
                      >
                        {canTrack ? (
                          <div
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 transition-all"
                            style={{
                              width: `${stats.pct}%`,
                              background:
                                "color-mix(in srgb, var(--primary) 10%, transparent)",
                            }}
                          />
                        ) : null}

                        <div className="relative flex h-full flex-col">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                              Day {String(entry.day).padStart(2, "0")}
                            </span>
                            <span
                              className={`rounded-full border px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] ${
                                stats.isDone
                                  ? "border-accent text-accent"
                                  : stats.isStarted
                                    ? "border-primary text-primary"
                                    : "border-line text-muted"
                              }`}
                            >
                              {status}
                            </span>
                          </div>

                          <h3
                            className={`mt-3 text-[1rem] font-bold leading-snug group-hover:text-primary ${
                              stats.isDone
                                ? "text-muted line-through"
                                : "text-foreground"
                            }`}
                          >
                            {entry.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                            {entry.focus}
                          </p>

                          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                            <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
                              {entry.tracks.length} topics
                            </span>
                            <span className="font-mono text-[0.68rem] font-semibold text-primary">
                              {stats.done}/{stats.total} items
                            </span>
                          </div>
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
