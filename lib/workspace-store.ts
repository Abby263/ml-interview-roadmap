export const workspaceKeys = {
  completedTopics: "ml-roadmap-completed-topics",
  savedTopics: "ml-roadmap-saved-topics",
  savedQuestions: "ml-roadmap-saved-questions",
  savedCaseStudies: "ml-roadmap-saved-case-studies",
} as const;

export type WorkspaceBucket = keyof typeof workspaceKeys;
const workspaceEventName = "ml-roadmap-workspace-change";

export interface WorkspaceSnapshot {
  completedTopics: string[];
  savedTopics: string[];
  savedQuestions: string[];
  savedCaseStudies: string[];
}

export const emptyWorkspaceSnapshot: WorkspaceSnapshot = {
  completedTopics: [],
  savedTopics: [],
  savedQuestions: [],
  savedCaseStudies: [],
};

function safeParse(value: string | null) {
  if (!value) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [] as string[];
  }
}

export function readBucket(bucket: WorkspaceBucket) {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  return safeParse(window.localStorage.getItem(workspaceKeys[bucket]));
}

// React's useSyncExternalStore demands a stable snapshot reference whenever
// the underlying data hasn't changed — otherwise it loops forever and crashes
// the page. We cache the snapshot keyed by a serialized fingerprint and only
// allocate a new object when at least one bucket actually changed.
let cachedSnapshot: WorkspaceSnapshot = emptyWorkspaceSnapshot;
let cachedFingerprint = "__empty__";

function buildSnapshot(): WorkspaceSnapshot {
  if (typeof window === "undefined") {
    return emptyWorkspaceSnapshot;
  }

  const completedTopics = readBucket("completedTopics");
  const savedTopics = readBucket("savedTopics");
  const savedQuestions = readBucket("savedQuestions");
  const savedCaseStudies = readBucket("savedCaseStudies");

  const fingerprint = JSON.stringify([
    completedTopics,
    savedTopics,
    savedQuestions,
    savedCaseStudies,
  ]);

  if (fingerprint === cachedFingerprint) {
    return cachedSnapshot;
  }

  cachedFingerprint = fingerprint;
  cachedSnapshot = {
    completedTopics,
    savedTopics,
    savedQuestions,
    savedCaseStudies,
  };
  return cachedSnapshot;
}

export function toggleBucketItem(bucket: WorkspaceBucket, itemId: string) {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  const current = readBucket(bucket);
  const next = current.includes(itemId)
    ? current.filter((item) => item !== itemId)
    : [...current, itemId];

  window.localStorage.setItem(workspaceKeys[bucket], JSON.stringify(next));
  // Invalidate cache so the next snapshot read sees the change.
  cachedFingerprint = "__dirty__";
  window.dispatchEvent(new Event(workspaceEventName));
  return next;
}

export function hasBucketItem(bucket: WorkspaceBucket, itemId: string) {
  return readBucket(bucket).includes(itemId);
}

export function readWorkspaceSnapshot(): WorkspaceSnapshot {
  return buildSnapshot();
}

export function subscribeWorkspace(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(workspaceEventName, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(workspaceEventName, handleChange);
  };
}
