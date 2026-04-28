"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useSyncExternalStore } from "react";

import { publicFlags } from "@/lib/feature-flags";
import {
  readDayChecks,
  subscribeProgress,
  toggleDayCheck,
} from "@/lib/progress-store";
import type { DayPlan } from "@/lib/daily-plan-schema";
import type { PillarSlug } from "@/lib/site-data";

interface DayChecklistProps {
  plan: DayPlan;
}

const emptyChecks: string[] = [];

// Short labels matching HomeRoadmap's "Coverage by pillar" panel so users
// see consistent pillar names across the home page and per-day view.
const PILLAR_LABEL: Record<PillarSlug, string> = {
  "math-stats": "Statistics",
  "traditional-ml": "Traditional ML",
  "deep-learning": "Deep Learning",
  mlops: "MLOps",
  "generative-ai": "Generative AI",
  llmops: "LLMOps",
  "ml-system-design": "ML System Design",
  foundations: "OOPS / SWE",
  "behavioral-storytelling": "Behavioral",
};

/**
 * Resolve which pillar a single track item rolls up to.
 * NeetCode items (id starts with "lc-") always belong to DSA. Everything
 * else inherits the day's pillar — matches the rules in HomeRoadmap so
 * pillar tags here can't disagree with the "Coverage by pillar" bars.
 */
function pillarTagForItem(itemId: string, dayPillar: PillarSlug): {
  label: string;
  isDsa: boolean;
} {
  if (itemId.startsWith("lc-")) return { label: "DSA", isDsa: true };
  return { label: PILLAR_LABEL[dayPillar] ?? dayPillar, isDsa: false };
}

/**
 * Wrap useUser so it's safe to call when Clerk isn't configured (it's
 * only valid inside a ClerkProvider). When auth is off, we treat the
 * user as "always available" — there's no login wall.
 */
function useAuthState(): { canTrack: boolean; isLoaded: boolean } {
  if (!publicFlags.clerkEnabled) {
    return { canTrack: true, isLoaded: true };
  }
  // Safe to call here only because the early return above guarantees
  // we're inside a ClerkProvider. ESLint thinks this is conditional but
  // the condition is module-level constant; calls are stable per render.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isSignedIn, isLoaded } = useUser();
  return { canTrack: Boolean(isSignedIn), isLoaded };
}

export default function DayChecklist({ plan }: DayChecklistProps) {
  const { canTrack, isLoaded } = useAuthState();
  const checked = useSyncExternalStore(
    subscribeProgress,
    () => readDayChecks(plan.day),
    () => emptyChecks
  );

  const checkedSet = canTrack ? new Set(checked) : new Set<string>();
  const totalItems = plan.tracks.reduce((sum, t) => sum + t.items.length, 0);
  const doneCount = plan.tracks.reduce(
    (sum, t) => sum + t.items.filter((i) => checkedSet.has(i.id)).length,
    0
  );
  const pct =
    totalItems === 0 ? 0 : Math.round((doneCount / totalItems) * 100);

  // Suppress unused-warning: isLoaded is part of the auth shape but not
  // currently rendered — body sign-in banner removed (lives in header now).
  void isLoaded;

  return (
    <div className="space-y-8">
      {canTrack ? (
        <div className="section-card rounded-[28px] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="panel-label">Today&apos;s progress</p>
            <span className="font-mono text-sm font-semibold text-foreground">
              {doneCount} / {totalItems} · {pct}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : null}

      {plan.tracks.map((track) => (
        <section key={track.label} className="space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground md:text-xl">
            {track.label}
          </h2>
          <ul className="space-y-2">
            {track.items.map((item) => {
              const isChecked = checkedSet.has(item.id);
              return (
                <li
                  key={item.id}
                  className={`section-card flex items-start gap-3 rounded-2xl p-4 transition ${
                    isChecked ? "border-primary" : ""
                  }`}
                >
                  {canTrack ? (
                    <button
                      type="button"
                      onClick={() => toggleDayCheck(plan.day, item.id)}
                      aria-pressed={isChecked}
                      aria-label={isChecked ? "Mark incomplete" : "Mark complete"}
                      className={`mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition ${
                        isChecked
                          ? "border-primary bg-primary text-white"
                          : "border-line bg-surface hover:border-primary"
                      }`}
                    >
                      {isChecked ? (
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                          <path
                            d="M3 8.5l3 3 7-7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </button>
                  ) : (
                    // Signed out: clicking the checkbox opens the Clerk
                    // sign-in modal so users don't have to scroll up first.
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        aria-label="Sign in to track this item"
                        title="Sign in to track this item"
                        className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 border-line bg-surface transition hover:border-primary"
                      />
                    </SignInButton>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      {item.href ? (
                        <a
                          href={item.href}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className={`group/link inline-flex items-baseline gap-1 text-[0.98rem] font-semibold leading-snug underline decoration-dotted underline-offset-4 transition hover:decoration-solid ${
                            isChecked
                              ? "text-muted line-through decoration-muted/40"
                              : "text-primary decoration-primary/50"
                          }`}
                        >
                          <span>{item.label}</span>
                          {item.href.startsWith("http") ? (
                            <svg
                              viewBox="0 0 12 12"
                              aria-hidden="true"
                              className="h-2.5 w-2.5 flex-shrink-0 self-center opacity-70 transition group-hover/link:opacity-100"
                            >
                              <path
                                d="M3 3h6v6M3 9l6-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : null}
                        </a>
                      ) : (
                        <span
                          className={`text-[0.98rem] font-semibold leading-snug ${
                            isChecked
                              ? "text-muted line-through"
                              : "text-foreground"
                          }`}
                        >
                          {item.label}
                        </span>
                      )}
                      {(() => {
                        const tag = pillarTagForItem(item.id, plan.pillar);
                        return (
                          <span
                            className="rounded-full border px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em]"
                            style={{
                              borderColor: tag.isDsa
                                ? "color-mix(in srgb, var(--accent) 45%, transparent)"
                                : "color-mix(in srgb, var(--primary) 35%, transparent)",
                              color: tag.isDsa
                                ? "var(--accent)"
                                : "var(--primary)",
                              background: tag.isDsa
                                ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                                : "color-mix(in srgb, var(--primary) 8%, transparent)",
                            }}
                          >
                            {tag.label}
                          </span>
                        );
                      })()}
                      {item.meta ? (
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                          {item.meta}
                        </span>
                      ) : null}
                    </div>

                    {item.interviewQuestions &&
                    item.interviewQuestions.length > 0 ? (
                      <div
                        className="mt-3 border-l-2 pl-3"
                        style={{
                          borderColor:
                            "color-mix(in srgb, var(--accent) 45%, transparent)",
                        }}
                      >
                        <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-accent">
                          Interview questions to prep
                        </p>
                        <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-[0.85rem] leading-6 text-muted">
                          {item.interviewQuestions.map((q) => (
                            <li key={q}>{q}</li>
                          ))}
                        </ol>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
