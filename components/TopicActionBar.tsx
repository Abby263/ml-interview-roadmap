"use client";

import { useSyncExternalStore } from "react";

import {
  emptyWorkspaceSnapshot,
  readWorkspaceSnapshot,
  subscribeWorkspace,
  toggleBucketItem,
} from "@/lib/workspace-store";

export default function TopicActionBar({ topicId }: { topicId: string }) {
  const snapshot = useSyncExternalStore(
    subscribeWorkspace,
    readWorkspaceSnapshot,
    () => emptyWorkspaceSnapshot
  );
  const completed = snapshot.completedTopics.includes(topicId);
  const saved = snapshot.savedTopics.includes(topicId);

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => {
          toggleBucketItem("completedTopics", topicId);
        }}
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
          completed
            ? "tone-accent border-accent"
            : "border-line bg-surface text-foreground hover:border-accent"
        }`}
      >
        {completed ? "Completed" : "Mark complete"}
      </button>

      <button
        type="button"
        onClick={() => {
          toggleBucketItem("savedTopics", topicId);
        }}
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
          saved
            ? "tone-primary border-primary"
            : "border-line bg-surface text-foreground hover:border-primary"
        }`}
      >
        {saved ? "Saved" : "Save topic"}
      </button>
    </div>
  );
}
