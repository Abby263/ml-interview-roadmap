"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useSyncExternalStore } from "react";

import { publicFlags } from "@/lib/feature-flags";
import {
  readDayChecks,
  subscribeProgress,
  toggleDayCheck,
} from "@/lib/progress-store";
import type { DayPlan } from "@/lib/site-data";

interface DayChecklistProps {
  plan: DayPlan;
}

const emptyChecks: string[] = [];

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

  return (
    <div className="space-y-8">
      {publicFlags.clerkEnabled && !canTrack && isLoaded ? (
        <div className="section-card flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-5 md:p-6">
          <div>
            <p className="panel-label">Tracking is for signed-in users</p>
            <p className="mt-1 text-sm leading-6 text-foreground">
              Browse the plan freely. Sign in to check items off and have
              your progress sync across devices.
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
        </div>
      ) : null}

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
                          className={`text-[0.98rem] font-semibold leading-snug hover:underline ${
                            isChecked
                              ? "text-muted line-through"
                              : "text-foreground"
                          }`}
                        >
                          {item.label}
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
                      {item.meta ? (
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                          {item.meta}
                        </span>
                      ) : null}
                    </div>
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
