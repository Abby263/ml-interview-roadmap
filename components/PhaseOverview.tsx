"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  readAllProgress,
  subscribeProgress,
} from "@/lib/progress-store";
import { dailyPlan, dayItemCount, type DayPlan } from "@/lib/site-data";

interface Phase {
  number: number;
  title: string;
  blurb: string;
  fromDay: number;
  toDay: number;
  days: DayPlan[];
}

const PHASES: Omit<Phase, "days">[] = [
  {
    number: 1,
    title: "Phase 1 · Coding & ML basics in parallel",
    blurb: "DSA via NeetCode 150 alongside stats, traditional ML, deep learning, and GenAI fundamentals.",
    fromDay: 1,
    toDay: 49,
  },
  {
    number: 2,
    title: "Phase 2 · ML system design + cases",
    blurb: "Framework, recsys, ads CTR, search, fraud, RAG, agent, eval-platform deep dives.",
    fromDay: 50,
    toDay: 60,
  },
  {
    number: 3,
    title: "Phase 3 · ML infrastructure + production",
    blurb: "Training pipelines, registry, deployment, monitoring, cost, multi-tenant, governance, migration.",
    fromDay: 61,
    toDay: 70,
  },
  {
    number: 4,
    title: "Phase 4 · OOP, AI-coding round, behavioral",
    blurb: "OOP design problems, AI-pair-programming round, company tags, behavioral story arc.",
    fromDay: 71,
    toDay: 86,
  },
  {
    number: 5,
    title: "Phase 5 · Mocks, taper, walk in",
    blurb: "Coding (Meta/Google/OpenAI styles), ML model + infra mocks, cross-loop sims, taper.",
    fromDay: 87,
    toDay: 120,
  },
  {
    number: 6,
    title: "Phase 6 · Specialization deep dives (optional)",
    blurb: "Pick the subdomains you'll be tested on: CV, NLP, Speech, RL, RecSys deep, Distributed ML.",
    fromDay: 121,
    toDay: 126,
  },
];

const PHASES_HYDRATED: Phase[] = PHASES.map((p) => ({
  ...p,
  days: dailyPlan.filter((d) => d.day >= p.fromDay && d.day <= p.toDay),
}));

const emptyProgress: Record<number, number> = {};

export default function PhaseOverview({ canTrack }: { canTrack: boolean }) {
  const progress = useSyncExternalStore(
    subscribeProgress,
    readAllProgress,
    () => emptyProgress
  );

  return (
    <div className="space-y-4">
      {PHASES_HYDRATED.map((phase) => {
        const total = phase.days.reduce((s, d) => s + dayItemCount(d), 0);
        const done = canTrack
          ? phase.days.reduce((s, d) => s + (progress[d.day] ?? 0), 0)
          : 0;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        return (
          <article
            key={phase.number}
            className="section-card relative overflow-hidden rounded-[24px] p-5 md:p-6"
          >
            {/* progress fill background */}
            {canTrack && pct > 0 ? (
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 transition-all"
                style={{
                  width: `${pct}%`,
                  background:
                    "color-mix(in srgb, var(--primary) 8%, transparent)",
                }}
              />
            ) : null}
            <div className="relative flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-foreground md:text-xl">
                {phase.title}
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-mono uppercase tracking-[0.18em] text-muted">
                  Days {phase.fromDay}–{phase.toDay}
                </span>
                {canTrack ? (
                  <span className="font-mono font-semibold text-primary">
                    {done}/{total} · {pct}%
                  </span>
                ) : (
                  <span className="font-mono font-semibold text-muted">
                    {total} items
                  </span>
                )}
              </div>
            </div>
            <p className="relative mt-2 text-sm leading-6 text-muted">
              {phase.blurb}
            </p>
            <div className="relative mt-4 flex flex-wrap gap-2">
              <Link
                href={`/day/${phase.fromDay}`}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-foreground transition hover:border-primary"
              >
                Open day {phase.fromDay} →
              </Link>
              <Link
                href={`/#week-${Math.ceil(phase.fromDay / 7)}`}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground"
              >
                Jump in daily plan
              </Link>
            </div>
            {canTrack ? (
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
