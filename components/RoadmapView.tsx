"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

import Calendar from "@/components/Calendar";
import PhaseOverview from "@/components/PhaseOverview";
import { publicFlags } from "@/lib/feature-flags";
import {
  readAllProgress,
  setDayChecks,
  subscribeProgress,
} from "@/lib/progress-store";
import { dailyPlan, dayItemCount } from "@/lib/site-data";

const emptyProgress: Record<number, number> = {};

function useAuthState(): { canTrack: boolean; isLoaded: boolean } {
  if (!publicFlags.clerkEnabled) {
    return { canTrack: true, isLoaded: true };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isSignedIn, isLoaded } = useUser();
  return { canTrack: Boolean(isSignedIn), isLoaded };
}

export default function RoadmapView() {
  const { canTrack, isLoaded } = useAuthState();
  const progress = useSyncExternalStore(
    subscribeProgress,
    readAllProgress,
    () => emptyProgress
  );

  // Hydrate server progress so the calendar and phase bars reflect
  // cross-device state on first paint.
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
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [canTrack]);

  const totalItems = dailyPlan.reduce((s, d) => s + dayItemCount(d), 0);
  const totalDone = canTrack
    ? Object.values(progress).reduce((s, n) => s + n, 0)
    : 0;
  const totalPct =
    totalItems === 0 ? 0 : Math.round((totalDone / totalItems) * 100);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          ML Architect Roadmap · 126 days
        </p>
        <h1 className="font-display text-3xl font-extrabold leading-[1.1] text-foreground md:text-4xl">
          Your prep, visualized.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          Six phases from coding + ML basics to specialization rounds.
          Track progress, build a streak, and see where you are at a
          glance. Click any phase to jump straight to its first day.
        </p>
      </header>

      {publicFlags.clerkEnabled && !canTrack && isLoaded ? (
        <section className="section-card flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-5">
          <div>
            <p className="panel-label">Sign in to track progress</p>
            <p className="mt-1 text-sm leading-6 text-foreground">
              Browse the roadmap freely. Sign in to fill your calendar,
              build a streak, and have everything sync across devices.
            </p>
          </div>
          <div className="flex gap-2">
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-foreground transition hover:border-primary"
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Sign up
              </button>
            </SignUpButton>
          </div>
        </section>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          {canTrack ? (
            <section className="section-card rounded-[28px] p-5 md:p-6">
              <p className="panel-label">Overall progress</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                {totalDone} / {totalItems} items
                <span className="ml-3 font-mono text-base font-semibold text-primary">
                  {totalPct}%
                </span>
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight transition-all duration-300"
                  style={{ width: `${totalPct}%` }}
                />
              </div>
            </section>
          ) : null}

          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-lg font-bold text-foreground md:text-xl">
                Phases
              </h2>
              <Link
                href="/"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Open daily plan →
              </Link>
            </div>
            <PhaseOverview canTrack={canTrack} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Calendar />
        </aside>
      </div>
    </div>
  );
}
