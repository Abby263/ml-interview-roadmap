"use client";

import { useSyncExternalStore } from "react";

import {
  emptyWorkspaceSnapshot,
  readWorkspaceSnapshot,
  subscribeWorkspace,
  toggleBucketItem,
} from "@/lib/workspace-store";

export default function QuestionSaveButton({
  questionId,
}: {
  questionId: string;
}) {
  const snapshot = useSyncExternalStore(
    subscribeWorkspace,
    readWorkspaceSnapshot,
    () => emptyWorkspaceSnapshot
  );
  const saved = snapshot.savedQuestions.includes(questionId);

  return (
    <button
      type="button"
      onClick={() => {
        toggleBucketItem("savedQuestions", questionId);
      }}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition ${
        saved
          ? "tone-primary border-primary"
          : "border-line bg-surface text-muted hover:border-primary hover:text-foreground"
      }`}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
