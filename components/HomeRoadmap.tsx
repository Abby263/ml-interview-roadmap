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
  { slug: "foundations", label: "OOPS / SWE", shortLabel: "OOPS" },
  {
    slug: "behavioral-storytelling",
    label: "Behavioral & Mocks",
    shortLabel: "Behav",
  },
];

// Module-level flag: hydrate from server once per SPA session. Without
// this guard, every HomeRoadmap remount re-pulls server state and
// merges it into local — which resurrects items the user just unchecked
// while the server delete was still in flight.
let serverHydrated = false;

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
  // Only count checks for item IDs that still exist in the current
  // curriculum. Without this filter, a stale localStorage / Supabase
  // row from an older curriculum (e.g., a renamed or removed item)
  // silently inflates the "done" count, leaving the day stuck at
  // "In progress" and the pillar % stuck above zero with no way for
  // the user to uncheck it (because the ghost item doesn't render in
  // any checklist).
  const validIds = new Set(
    day.tracks.flatMap((track) => track.items.map((item) => item.id))
  );
  const checked = canTrack
    ? (progress[day.day] ?? []).filter((id) => validIds.has(id))
    : [];
  const done = Math.min(checked.length, total);
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
  // Supabase is configured, pull their saved progress and replace local
  // state. We treat the server as the source of truth on first load and
  // only run this once per SPA session — otherwise re-mounting this
  // component (e.g., after navigating to /day/N and back) would race
  // with in-flight per-toggle syncs and resurrect items the user just
  // unchecked.
  useEffect(() => {
    if (!canTrack) return;
    if (serverHydrated) return;
    let cancelled = false;
    (async () => {
      try {
        const actions = await import("@/app/actions/progress");
        const serverProgress = await actions.getServerProgress();
        if (cancelled || !serverProgress) return;
        // Build a map of valid item ids per day from the current
        // curriculum. Anything in server state that isn't in this map
        // is a ghost from an older curriculum (renamed / removed item)
        // — drop it from local AND request a server-side delete so it
        // stops resurrecting on future hydrations.
        const validByDay = new Map<number, Set<string>>();
        for (const day of dailyPlan) {
          validByDay.set(
            day.day,
            new Set(day.tracks.flatMap((t) => t.items.map((it) => it.id)))
          );
        }
        for (const [dayKey, items] of Object.entries(serverProgress)) {
          const day = Number(dayKey);
          if (!Number.isFinite(day)) continue;
          const valid = validByDay.get(day) ?? new Set<string>();
          const live: string[] = [];
          const ghosts: string[] = [];
          for (const id of items) {
            if (valid.has(id)) live.push(id);
            else ghosts.push(id);
          }
          // Replace, not merge — server is the source of truth here.
          setDayChecks(day, live);
          // Best-effort cleanup of ghost server rows.
          for (const ghostId of ghosts) {
            void actions.removeServerCheck(day, ghostId).catch(() => undefined);
          }
        }
        serverHydrated = true;
      } catch {
        // Local state already works.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canTrack, dailyPlan]);

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

  // DSA isn't a per-day pillar — NeetCode problems are interleaved as
  // tracks across every day. Count items whose id starts with "lc-"
  // (LeetCode) to get a separate DSA progress bar.
  const isDsaItem = (id: string) => id.startsWith("lc-");

  // ML pillars: each day has a single `pillar` field, but most days
  // include both an ML topic track AND a DSA track. A checked DSA item
  // should count toward the DSA pillar only — not double-count into the
  // day's ML pillar — so we filter DSA item ids out of the ML totals.
  const mlPillarProgress = pillarMeta.map((pillar) => {
    const days = dailyPlan.filter((day) => day.pillar === pillar.slug);
    const total = days.reduce(
      (sum, day) =>
        sum +
        day.tracks.reduce(
          (s, t) => s + t.items.filter((it) => !isDsaItem(it.id)).length,
          0
        ),
      0
    );
    const done = canTrack
      ? days.reduce((sum, day) => {
          const validIds = new Set(
            day.tracks.flatMap((t) =>
              t.items.filter((it) => !isDsaItem(it.id)).map((it) => it.id)
            )
          );
          const checked = (progress[day.day] ?? []).filter((id) =>
            validIds.has(id)
          );
          return sum + checked.length;
        }, 0)
      : 0;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { slug: pillar.slug as string, label: pillar.label, total, done, pct };
  });
  const dsaTotal = dailyPlan.reduce(
    (sum, day) =>
      sum +
      day.tracks.reduce(
        (s, t) => s + t.items.filter((it) => isDsaItem(it.id)).length,
        0
      ),
    0
  );
  const dsaDone = canTrack
    ? dailyPlan.reduce((sum, day) => {
        const checked = new Set(progress[day.day] ?? []);
        return (
          sum +
          day.tracks.reduce(
            (s, t) =>
              s +
              t.items.filter((it) => isDsaItem(it.id) && checked.has(it.id))
                .length,
            0
          )
        );
      }, 0)
    : 0;
  const dsaPct = dsaTotal === 0 ? 0 : Math.round((dsaDone / dsaTotal) * 100);

  // DSA breakdown by NeetCode category. Each DSA item's `meta` field
  // holds its category ("Arrays & Hashing", "Two Pointers", …) — group
  // by it so the user can see how many problems they've cleared in
  // each pattern. Order = first-appearance across days, which matches
  // NeetCode's recommended progression.
  const dsaByCategory: Array<{
    label: string;
    total: number;
    done: number;
    pct: number;
  }> = [];
  {
    const byCat = new Map<string, { total: number; done: number }>();
    for (const day of dailyPlan) {
      const checked = canTrack
        ? new Set(progress[day.day] ?? [])
        : new Set<string>();
      for (const t of day.tracks) {
        for (const it of t.items) {
          if (!isDsaItem(it.id) || !it.meta) continue;
          const entry = byCat.get(it.meta) ?? { total: 0, done: 0 };
          entry.total += 1;
          if (checked.has(it.id)) entry.done += 1;
          byCat.set(it.meta, entry);
        }
      }
    }
    for (const [label, { total, done }] of byCat) {
      const pct = total === 0 ? 0 : Math.round((done / total) * 100);
      dsaByCategory.push({ label, total, done, pct });
    }
  }

  // DSA has its own pattern tracker, so keep roadmap pillar coverage focused
  // on non-DSA interview curriculum instead of duplicating the same signal.
  const pillarProgress = mlPillarProgress;
  const roadmapTotal = pillarProgress.reduce(
    (sum, pillar) => sum + pillar.total,
    0
  );
  const roadmapDone = pillarProgress.reduce(
    (sum, pillar) => sum + pillar.done,
    0
  );
  const roadmapPct =
    roadmapTotal === 0 ? 0 : Math.round((roadmapDone / roadmapTotal) * 100);
  const activeDay = nextDay?.day ?? 1;
  const activeWeekNumber =
    weeks.find((week) => week.days.some((day) => day.day === activeDay))
      ?.number ?? 1;

  return (
    <div className="space-y-6 pb-24 md:space-y-10 md:pb-0">
      <section
        id="mobile-tracker"
        className="section-card relative overflow-hidden rounded-[1.5rem] p-4 md:hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="panel-label">Next step</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
                Day {activeDay}
              </h2>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {nextDay?.title}
              </p>
            </div>
            <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
              {nextDayStats?.done ?? 0}/{nextDayStats?.total ?? 0}
            </span>
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-muted">
            {nextDay?.focus}
          </p>

          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight transition-all duration-300"
              style={{ width: `${nextDayStats?.pct ?? 0}%` }}
            />
          </div>

          <Link
            href={`/day/${activeDay}`}
            className="button-primary-accent w-full justify-center"
          >
            {continueLabel} →
          </Link>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-line bg-surface-strong p-3">
              <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted">
                Overall
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-foreground">
                {totalPct}%
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-strong p-3">
              <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted">
                Roadmap
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-foreground">
                {roadmapPct}%
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-strong p-3">
              <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted">
                DSA
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-foreground">
                {dsaPct}%
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav
        id="mobile-weeks"
        className="section-card sticky top-[4.25rem] z-30 -mx-4 overflow-x-auto rounded-none border-x-0 px-4 py-3 md:hidden"
      >
        <div className="flex min-w-max items-center gap-2">
          <span className="mr-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
            Weeks
          </span>
          {weeks.map((week) => {
            const isActive = week.number === activeWeekNumber;
            return (
              <a
                key={week.number}
                href={`#mobile-week-${week.number}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-surface-strong text-muted hover:border-primary hover:text-foreground"
                }`}
              >
                {week.number}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="space-y-4 md:hidden">
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
            <details
              key={week.number}
              id={`mobile-week-${week.number}`}
              open={week.number === activeWeekNumber}
              className="section-card scroll-mt-32 overflow-hidden rounded-[1.35rem]"
            >
              <summary className="cursor-pointer list-none p-4 [&::-webkit-details-marker]:hidden">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="panel-label">Week {week.number}</p>
                    <h2 className="mt-1 font-display text-lg font-extrabold leading-tight text-foreground">
                      {week.title}
                    </h2>
                    <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                      Days {week.days[0].day}–
                      {week.days[week.days.length - 1].day} · {weekItems} items
                    </p>
                  </div>
                  <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.62rem] font-semibold text-primary">
                    {weekPct}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight"
                    style={{ width: `${weekPct}%` }}
                  />
                </div>
              </summary>

              <ol className="space-y-2 border-t border-line p-3">
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
                        className="group relative block overflow-hidden rounded-2xl border border-line bg-surface px-3.5 py-3 transition hover:border-primary hover:bg-surface-strong"
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
                        <div className="relative">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">
                              Day {String(entry.day).padStart(2, "0")}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] ${
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
                            className={`mt-2 text-[0.96rem] font-bold leading-snug group-hover:text-primary ${
                              stats.isDone
                                ? "text-muted line-through"
                                : "text-foreground"
                            }`}
                          >
                            {entry.title}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-xs leading-5 text-muted">
                            {entry.focus}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">
                              {entry.tracks.length} topics
                            </span>
                            <span className="font-mono text-[0.62rem] font-semibold text-primary">
                              {stats.done}/{stats.total} items
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </details>
          );
        })}
      </div>

      <section className="space-y-3 md:hidden">
        <details className="section-card rounded-[1.35rem] p-4">
          <summary className="cursor-pointer list-none font-display text-lg font-extrabold text-foreground [&::-webkit-details-marker]:hidden">
            Roadmap pillar details
          </summary>
          <div className="mt-4 space-y-3">
            {pillarProgress.map((pillar) => (
              <div key={pillar.slug}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-foreground">
                    {pillar.label}
                  </span>
                  <span className="font-mono font-semibold text-primary">
                    {pillar.done}/{pillar.total}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${clampPct(pillar.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </details>

        <details className="section-card rounded-[1.35rem] p-4">
          <summary className="cursor-pointer list-none font-display text-lg font-extrabold text-foreground [&::-webkit-details-marker]:hidden">
            DSA pattern details
          </summary>
          <div className="mt-4 grid gap-3">
            {dsaByCategory.map((cat) => (
              <div
                key={cat.label}
                className="rounded-2xl border border-line bg-surface-strong p-3"
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-foreground">
                    {cat.label}
                  </span>
                  <span className="font-mono font-semibold text-accent">
                    {cat.done}/{cat.total}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${clampPct(cat.pct)}%`,
                      background: "var(--accent)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </details>
      </section>

      <section className="section-card relative hidden overflow-hidden rounded-[2rem] p-5 md:block md:p-7">
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

        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="data-chip">Learner tracker</span>
                <span className="data-chip">
                  {canTrack ? "Progress active" : "Sign in to track"}
                </span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
                Learning dashboard
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted md:text-base">
                Track overall completion, roadmap pillars, and NeetCode DSA
                patterns from one aligned view.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[26rem]">
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

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="flex min-h-full flex-col justify-between rounded-[1.5rem] border border-line bg-surface-strong p-5">
              <div className="flex items-center gap-5">
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
                  <p className="panel-label">Overall completion</p>
                  <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
                    {canTrack
                      ? `${completedTopics} topic sections completed`
                      : "Track completion as you study"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {canTrack
                      ? `${totalDone} of ${totalItems} checklist items done across ${dailyPlan.length} days.`
                      : "Sign in, open a day, and mark checklist items complete to populate this dashboard."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-line bg-surface-strong p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="panel-label">Roadmap curriculum</p>
                    <p className="mt-3 font-display text-3xl font-extrabold text-foreground">
                      {roadmapPct}%
                    </p>
                  </div>
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
                    {roadmapDone}/{roadmapTotal}
                  </span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${clampPct(roadmapPct)}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-5 text-muted">
                  Statistics, ML, DL, MLOps, GenAI, LLMOps, system design, and
                  interview storytelling.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-line bg-surface-strong p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="panel-label">DSA practice</p>
                    <p className="mt-3 font-display text-3xl font-extrabold text-foreground">
                      {dsaPct}%
                    </p>
                  </div>
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
                    {dsaDone}/{dsaTotal}
                  </span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${clampPct(dsaPct)}%`,
                      background: "var(--accent)",
                    }}
                  />
                </div>
                <p className="mt-3 text-xs leading-5 text-muted">
                  NeetCode 150 coverage grouped by interview pattern instead
                  of being mixed into ML pillars.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-line bg-surface-strong p-5 lg:col-span-2">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                  <span className="w-fit rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
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
            </div>
          </div>

          <div className="grid items-start gap-4 xl:grid-cols-2">
            <div className="h-full rounded-[1.5rem] border border-line bg-surface-strong p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="panel-label">Roadmap pillars</p>
                  <h3 className="mt-2 font-display text-xl font-extrabold text-foreground">
                    Interview curriculum coverage
                  </h3>
                </div>
                <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  {pillarProgress.length} areas
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {pillarProgress.map((pillar) => (
                  <div key={pillar.slug}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-foreground">
                        {pillar.label}
                      </span>
                      <span className="font-mono font-semibold text-primary">
                        {pillar.done}/{pillar.total}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${clampPct(pillar.pct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-full rounded-[1.5rem] border border-line bg-surface-strong p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="panel-label">DSA · NeetCode 150</p>
                  <h3 className="mt-2 font-display text-xl font-extrabold text-foreground">
                    Progress by pattern
                  </h3>
                </div>
                <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  {dsaByCategory.length} patterns
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {dsaByCategory.map((cat) => (
                  <div
                    key={cat.label}
                    className="rounded-2xl border border-line bg-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-foreground">
                        {cat.label}
                      </span>
                      <span className="font-mono font-semibold text-accent">
                        {cat.done}/{cat.total}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${clampPct(cat.pct)}%`,
                          background: "var(--accent)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="section-card sticky top-[4.25rem] z-30 -mx-4 hidden overflow-x-auto rounded-none border-x-0 px-4 py-3 sm:mx-0 sm:rounded-2xl sm:border-x sm:px-4 md:block">
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

      <div className="hidden space-y-12 md:block">
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
                    {(() => {
                      // Build the chip list once per week: unique ML
                      // pillars across the week's days + each DSA
                      // category that appears in any DSA item's meta.
                      // Order: ML pillars first (in pillarMeta order),
                      // then DSA categories in first-appearance order.
                      const seenPillars = new Set<string>();
                      const pillarChips: string[] = [];
                      for (const day of week.days) {
                        if (!seenPillars.has(day.pillar)) {
                          seenPillars.add(day.pillar);
                          const meta = pillarMeta.find(
                            (p) => p.slug === day.pillar
                          );
                          pillarChips.push(meta?.label ?? day.pillar);
                        }
                      }
                      const seenDsa = new Set<string>();
                      const dsaChips: string[] = [];
                      for (const day of week.days) {
                        for (const t of day.tracks) {
                          for (const it of t.items) {
                            if (!isDsaItem(it.id) || !it.meta) continue;
                            if (seenDsa.has(it.meta)) continue;
                            seenDsa.add(it.meta);
                            dsaChips.push(it.meta);
                          }
                        }
                      }
                      return (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {pillarChips.map((label) => (
                            <span
                              key={`pillar-${label}`}
                              className="rounded-full border px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em]"
                              style={{
                                borderColor:
                                  "color-mix(in srgb, var(--primary) 35%, transparent)",
                                color: "var(--primary)",
                                background:
                                  "color-mix(in srgb, var(--primary) 8%, transparent)",
                              }}
                            >
                              {label}
                            </span>
                          ))}
                          {dsaChips.map((label) => (
                            <span
                              key={`dsa-${label}`}
                              className="rounded-full border px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em]"
                              style={{
                                borderColor:
                                  "color-mix(in srgb, var(--accent) 45%, transparent)",
                                color: "var(--accent)",
                                background:
                                  "color-mix(in srgb, var(--accent) 8%, transparent)",
                              }}
                            >
                              DSA · {label}
                            </span>
                          ))}
                        </div>
                      );
                    })()}
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

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background/95 px-3 pt-2 shadow-panel backdrop-blur-xl pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <Link
            href={`/day/${activeDay}`}
            className="rounded-full bg-primary px-3 py-2.5 text-center text-xs font-semibold text-white"
          >
            Continue
          </Link>
          <a
            href="#mobile-weeks"
            className="rounded-full border border-line bg-surface-strong px-3 py-2.5 text-center text-xs font-semibold text-foreground"
          >
            Weeks
          </a>
          <a
            href="#mobile-tracker"
            className="rounded-full border border-line bg-surface-strong px-3 py-2.5 text-center text-xs font-semibold text-foreground"
          >
            Tracker
          </a>
        </div>
      </div>
    </div>
  );
}
