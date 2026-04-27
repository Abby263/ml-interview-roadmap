"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

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
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(
    null
  );
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

  const selectedDay =
    dailyPlan.find((day) => day.day === (selectedDayNumber ?? nextDay?.day)) ??
    nextDay ??
    dailyPlan[0];
  const selectedDayStats = selectedDay
    ? (dayStats.get(selectedDay.day) ??
      getDayStats(selectedDay, progress, canTrack))
    : undefined;
  const selectedChecked = new Set(
    selectedDay ? progress[selectedDay.day] ?? [] : []
  );
  const selectedWeek = selectedDay
    ? weeks.find((week) =>
        week.days.some((day) => day.day === selectedDay.day)
      )
    : undefined;
  const selectedStatus = selectedDayStats?.isDone
    ? "Complete"
    : selectedDayStats?.isStarted
      ? "In progress"
      : "Not started";
  const selectedPillarLabel = selectedDay
    ? (pillarMeta.find((pillar) => pillar.slug === selectedDay.pillar)
        ?.label ?? selectedDay.pillar)
    : "";

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

      <section
        id="planner"
        className="grid scroll-mt-24 gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]"
      >
        <aside className="section-card overflow-hidden rounded-[2rem] lg:sticky lg:top-[5.25rem] lg:max-h-[calc(100vh-6.5rem)]">
          <div className="border-b border-line bg-surface-strong p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="panel-label">Roadmap browser</p>
                <h2 className="mt-1 font-display text-xl font-extrabold text-foreground">
                  Weeks and days
                </h2>
              </div>
              <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
                {dailyPlan.length} days
              </span>
            </div>
          </div>

          <div className="max-h-[34rem] space-y-5 overflow-y-auto p-4 lg:max-h-[calc(100vh-14rem)]">
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
                weekItems === 0
                  ? 0
                  : Math.round((weekDone / weekItems) * 100);

              return (
                <div key={week.number} className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
                        Week {week.number}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold leading-5 text-foreground">
                        {week.title}
                      </p>
                    </div>
                    <span className="font-mono text-[0.68rem] font-semibold text-muted">
                      {weekPct}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight"
                      style={{ width: `${weekPct}%` }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    {week.days.map((day) => {
                      const stats = dayStats.get(day.day) ?? {
                        total: dayItemCount(day),
                        done: 0,
                        pct: 0,
                        isDone: false,
                        isStarted: false,
                      };
                      const isSelected = selectedDay?.day === day.day;
                      const statusDot = stats.isDone
                        ? "bg-accent"
                        : stats.isStarted
                          ? "bg-primary"
                          : "bg-line";

                      return (
                        <button
                          key={day.day}
                          type="button"
                          onClick={() => setSelectedDayNumber(day.day)}
                          className={`group w-full rounded-xl border px-3 py-2.5 text-left transition ${
                            isSelected
                              ? "border-primary bg-surface-strong shadow-panel"
                              : "border-transparent hover:border-line hover:bg-surface-strong"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${statusDot}`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
                                  Day {String(day.day).padStart(2, "0")}
                                </span>
                                <span className="font-mono text-[0.66rem] font-semibold text-primary">
                                  {stats.done}/{stats.total}
                                </span>
                              </div>
                              <p
                                className={`mt-1 line-clamp-2 text-sm font-semibold leading-5 ${
                                  isSelected
                                    ? "text-primary"
                                    : "text-foreground group-hover:text-primary"
                                }`}
                              >
                                {day.title}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {selectedDay ? (
          <section className="section-card overflow-hidden rounded-[2rem]">
            <div className="border-b border-line bg-surface-strong p-5 md:p-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="data-chip">
                      Week {selectedWeek?.number ?? "-"}
                    </span>
                    <span className="data-chip">Day {selectedDay.day}</span>
                    <span
                      className={`rounded-full border px-3 py-1.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${
                        selectedDayStats?.isDone
                          ? "border-accent text-accent"
                          : selectedDayStats?.isStarted
                            ? "border-primary text-primary"
                            : "border-line text-muted"
                      }`}
                    >
                      {selectedStatus}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
                    {selectedDay.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-muted md:text-lg">
                    {selectedDay.focus}
                  </p>
                </div>

                <div className="min-w-[14rem] rounded-2xl border border-line bg-surface p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="panel-label">Day progress</p>
                    <span className="font-mono text-sm font-semibold text-primary">
                      {selectedDayStats?.pct ?? 0}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight"
                      style={{ width: `${selectedDayStats?.pct ?? 0}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    {selectedDayStats?.done ?? 0} of{" "}
                    {selectedDayStats?.total ?? 0} checklist items complete.
                  </p>
                  <Link
                    href={`/day/${selectedDay.day}`}
                    className="button-primary-accent mt-4 w-full justify-center"
                  >
                    Open full checklist →
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 md:p-7 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-5">
                {selectedDay.tracks.map((track) => {
                  const trackDone = track.items.filter((item) =>
                    selectedChecked.has(item.id)
                  ).length;
                  const trackPct =
                    track.items.length === 0
                      ? 0
                      : Math.round((trackDone / track.items.length) * 100);

                  return (
                    <section
                      key={track.label}
                      className="rounded-[1.5rem] border border-line bg-surface-strong p-4 md:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="panel-label">Topic section</p>
                          <h3 className="mt-1 font-display text-xl font-extrabold text-foreground">
                            {track.label}
                          </h3>
                        </div>
                        <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
                          {trackDone}/{track.items.length} · {trackPct}%
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {track.items.map((item) => {
                          const isChecked = selectedChecked.has(item.id);

                          return (
                            <div
                              key={item.id}
                              className={`rounded-2xl border p-4 ${
                                isChecked
                                  ? "border-accent bg-surface"
                                  : "border-line bg-surface"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border text-[0.68rem] ${
                                    isChecked
                                      ? "border-accent bg-accent text-white"
                                      : "border-line text-muted"
                                  }`}
                                >
                                  {isChecked ? "✓" : ""}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    {item.href ? (
                                      <a
                                        href={item.href}
                                        target={
                                          item.href.startsWith("http")
                                            ? "_blank"
                                            : undefined
                                        }
                                        rel={
                                          item.href.startsWith("http")
                                            ? "noopener noreferrer"
                                            : undefined
                                        }
                                        className="font-semibold leading-snug text-primary underline decoration-dotted underline-offset-4 hover:decoration-solid"
                                      >
                                        {item.label} ↗
                                      </a>
                                    ) : (
                                      <span className="font-semibold leading-snug text-foreground">
                                        {item.label}
                                      </span>
                                    )}
                                    {item.meta ? (
                                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                                        {item.meta}
                                      </span>
                                    ) : null}
                                  </div>

                                  {item.interviewQuestions?.length ? (
                                    <div className="mt-3 border-l-2 border-accent/50 pl-3">
                                      <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-accent">
                                        Interview questions
                                      </p>
                                      <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-[0.85rem] leading-6 text-muted">
                                        {item.interviewQuestions.map(
                                          (question) => (
                                            <li key={question}>{question}</li>
                                          )
                                        )}
                                      </ol>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>

              <aside className="space-y-4">
                <div className="rounded-[1.5rem] border border-line bg-surface-strong p-5">
                  <p className="panel-label">Day summary</p>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted">Topic sections</dt>
                      <dd className="font-mono font-semibold text-foreground">
                        {selectedDay.tracks.length}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted">Checklist items</dt>
                      <dd className="font-mono font-semibold text-foreground">
                        {selectedDayStats?.total ?? 0}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted">Pillar</dt>
                      <dd className="font-mono font-semibold text-foreground">
                        {selectedPillarLabel}
                      </dd>
                    </div>
                  </dl>
                </div>

                {selectedDay.references.length > 0 ? (
                  <div className="rounded-[1.5rem] border border-line bg-surface-strong p-5">
                    <p className="panel-label">References</p>
                    <ul className="mt-4 space-y-3">
                      {selectedDay.references.map((reference) => (
                        <li key={reference.href}>
                          <a
                            href={reference.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold leading-6 text-primary hover:underline"
                          >
                            {reference.label} ↗
                          </a>
                          {reference.source ? (
                            <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                              {reference.source}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </aside>
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
}
