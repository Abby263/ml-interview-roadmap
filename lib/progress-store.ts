// Per-day item check-tracking with localStorage persistence + a stable
// useSyncExternalStore-friendly snapshot.
//
// When Clerk + Supabase are configured (see SETUP.md), each toggle is also
// fire-and-forget pushed to the server so progress syncs across devices.
// On initial load the home page hydrates server state into localStorage
// (see HomeRoadmap), so the local read path stays instant.

const KEY_PREFIX = "ml-roadmap-progress:day:";
const ACTIVITY_KEY = "ml-roadmap-activity";
const EVENT_NAME = "ml-roadmap-progress-change";

// ── Activity tracking (per calendar date) ─────────────────────────────────
// Used by progress-aware UI to highlight active days + compute streaks.
// Format: { "YYYY-MM-DD": numberOfChecksThatDay }

function todayLocalISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

let activityCache: Record<string, number> = {};
let activityFingerprint = "__empty__";

function readActivityRaw(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ACTIVITY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function readActivity(): Record<string, number> {
  if (typeof window === "undefined") return activityCache;
  const next = readActivityRaw();
  const fp = JSON.stringify(next);
  if (fp === activityFingerprint) return activityCache;
  activityFingerprint = fp;
  activityCache = next;
  return next;
}

function bumpActivityToday() {
  if (typeof window === "undefined") return;
  const current = readActivityRaw();
  const today = todayLocalISO();
  current[today] = (current[today] ?? 0) + 1;
  window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(current));
  activityFingerprint = "__dirty__";
}

/** Replace the activity log (used when hydrating from server). */
export function setActivity(map: Record<string, number>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(map));
  activityFingerprint = "__dirty__";
  window.dispatchEvent(new Event(EVENT_NAME));
}

/**
 * Compute current and best streaks (in days) from an activity map.
 * Current = consecutive days with activity ending today or yesterday.
 * Best    = longest consecutive run anywhere.
 */
export function computeStreaks(activity: Record<string, number>): {
  current: number;
  best: number;
  total: number;
} {
  const dates = Object.keys(activity)
    .filter((d) => (activity[d] ?? 0) > 0)
    .sort();
  if (dates.length === 0) return { current: 0, best: 0, total: 0 };

  // Best streak: walk dates, count consecutive
  let best = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + "T00:00:00");
    const cur = new Date(dates[i] + "T00:00:00");
    const diff = Math.round(
      (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 1) {
      run += 1;
      best = Math.max(best, run);
    } else if (diff > 1) {
      run = 1;
    }
  }

  // Current streak: from today (or yesterday) backward
  const today = todayLocalISO();
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  })();
  let cursor =
    activity[today] && activity[today] > 0 ? today : yesterday;
  let current = 0;
  while (activity[cursor] && activity[cursor] > 0) {
    current += 1;
    const d = new Date(cursor + "T00:00:00");
    d.setDate(d.getDate() - 1);
    cursor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  return { current, best, total: dates.length };
}

function safeParse(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function readDayRaw(day: number): string[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(KEY_PREFIX + day));
}

// useSyncExternalStore requires a stable snapshot reference for unchanged data.
// We cache by day, keyed on a fingerprint.
const dayCache = new Map<number, { fingerprint: string; snapshot: string[] }>();
const emptySet: string[] = [];

export function readDayChecks(day: number): string[] {
  if (typeof window === "undefined") return emptySet;
  const next = readDayRaw(day);
  const fingerprint = JSON.stringify(next);
  const cached = dayCache.get(day);
  if (cached && cached.fingerprint === fingerprint) {
    return cached.snapshot;
  }
  dayCache.set(day, { fingerprint, snapshot: next });
  return next;
}

export function toggleDayCheck(day: number, itemId: string): string[] {
  if (typeof window === "undefined") return emptySet;
  const current = readDayRaw(day);
  const wasChecked = current.includes(itemId);
  const next = wasChecked
    ? current.filter((id) => id !== itemId)
    : [...current, itemId];
  window.localStorage.setItem(KEY_PREFIX + day, JSON.stringify(next));
  // Invalidate caches so the next read sees the new value.
  dayCache.delete(day);
  allCacheFingerprint = "__dirty__";
  // Only count as activity when the user CHECKS something (not on uncheck).
  if (!wasChecked) {
    bumpActivityToday();
  }
  window.dispatchEvent(new Event(EVENT_NAME));

  // Fire-and-forget server sync. Imports lazily to avoid pulling server
  // action code into pages that don't need it. If the user isn't signed
  // in, or Supabase isn't configured, the server action silently no-ops.
  void (async () => {
    try {
      const { addServerCheck, removeServerCheck } = await import(
        "@/app/actions/progress"
      );
      if (wasChecked) await removeServerCheck(day, itemId);
      else await addServerCheck(day, itemId);
    } catch {
      // Network or import error — local state still wins.
    }
  })();

  return next;
}

/**
 * Replace local state for a day with the given set of checked item IDs.
 * Used when hydrating from the server on initial load.
 */
export function setDayChecks(day: number, itemIds: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_PREFIX + day, JSON.stringify(itemIds));
  dayCache.delete(day);
  allCacheFingerprint = "__dirty__";
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeProgress(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

// Cache for readAllProgress so useSyncExternalStore sees a stable reference
// when nothing has changed.
const emptyProgress: Record<number, number> = {};
let allCache: Record<number, number> = emptyProgress;
let allCacheFingerprint = "__empty__";

/** Read total checked counts across all days, used for site-wide progress. */
export function readAllProgress(): Record<number, number> {
  if (typeof window === "undefined") return emptyProgress;
  const out: Record<number, number> = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(KEY_PREFIX)) continue;
    const day = Number(key.slice(KEY_PREFIX.length));
    if (!Number.isFinite(day)) continue;
    out[day] = safeParse(window.localStorage.getItem(key)).length;
  }
  const fingerprint = JSON.stringify(out);
  if (fingerprint === allCacheFingerprint) {
    return allCache;
  }
  allCacheFingerprint = fingerprint;
  allCache = out;
  return out;
}
