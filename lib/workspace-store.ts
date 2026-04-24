export const workspaceKeys = {
  completedTopics: "ml-roadmap-completed-topics",
  savedTopics: "ml-roadmap-saved-topics",
  savedQuestions: "ml-roadmap-saved-questions",
  savedCaseStudies: "ml-roadmap-saved-case-studies",
} as const;

export type WorkspaceBucket = keyof typeof workspaceKeys;
const workspaceEventName = "ml-roadmap-workspace-change";

export const emptyWorkspaceSnapshot = {
  completedTopics: [] as string[],
  savedTopics: [] as string[],
  savedQuestions: [] as string[],
  savedCaseStudies: [] as string[],
};

function safeParse(value: string | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readBucket(bucket: WorkspaceBucket) {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  return safeParse(window.localStorage.getItem(workspaceKeys[bucket]));
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
  window.dispatchEvent(new Event(workspaceEventName));
  return next;
}

export function hasBucketItem(bucket: WorkspaceBucket, itemId: string) {
  return readBucket(bucket).includes(itemId);
}

export function readWorkspaceSnapshot() {
  if (typeof window === "undefined") {
    return emptyWorkspaceSnapshot;
  }

  return {
    completedTopics: readBucket("completedTopics"),
    savedTopics: readBucket("savedTopics"),
    savedQuestions: readBucket("savedQuestions"),
    savedCaseStudies: readBucket("savedCaseStudies"),
  };
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
