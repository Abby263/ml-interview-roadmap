"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

import Calendar from "@/components/Calendar";
import RoadmapFlow from "@/components/RoadmapFlow";
import { publicFlags } from "@/lib/feature-flags";
import { setDayChecks } from "@/lib/progress-store";

function useAuthState(): { canTrack: boolean } {
  if (!publicFlags.clerkEnabled) {
    return { canTrack: true };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isSignedIn } = useUser();
  return { canTrack: Boolean(isSignedIn) };
}

export default function RoadmapView() {
  const { canTrack } = useAuthState();

  // Pull server progress so node progress bars + calendar reflect
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

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          ML Architect Roadmap · 126 days
        </p>
        <h1 className="font-display text-3xl font-extrabold leading-[1.1] text-foreground md:text-4xl">
          The full path, at a glance.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          Click any node to jump into its first day. Branches show what runs
          in parallel; the vertical line is the order of progression.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <RoadmapFlow canTrack={canTrack} />
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Calendar />
        </aside>
      </div>
    </div>
  );
}
