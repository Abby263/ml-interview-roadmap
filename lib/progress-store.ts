// Per-day item check-tracking with localStorage persistence + a stable
// useSyncExternalStore-friendly snapshot.
//
// When Clerk + Supabase are configured (see SETUP.md), each toggle is also
// fire-and-forget pushed to the server so progress syncs across devices.
// On initial load the home page hydrates server state into localStorage
// (see HomeRoadmap), so the local read path stays instant.

const KEY_PREFIX = "ml-roadmap-progress:day:";
const EVENT_NAME = "ml-roadmap-progress-change";

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
