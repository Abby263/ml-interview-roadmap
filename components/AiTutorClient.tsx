"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import type { DailyPlanQuestionTag } from "@/lib/daily-plan-questions";
import {
  aiTutorLevels,
  aiTutorModes,
  type AiTutorEvaluation,
  type AiTutorMemory,
  type AiTutorMessage,
  type AiTutorNextTopic,
  type AiTutorProfile,
  type AiTutorSuggestedAction,
} from "@/lib/ai-tutor-types";

interface AiTutorClientProps {
  initialProfile: AiTutorProfile;
  initialMemory: AiTutorMemory;
  initialMessages: AiTutorMessage[];
  tags: DailyPlanQuestionTag[];
  openaiConfigured: boolean;
  memoryConfigured: boolean;
  persistenceWarning?: string;
}

interface TutorResponse {
  error?: string;
  sessionId?: string;
  assistantMessage?: string;
  evaluation?: AiTutorEvaluation;
  memory?: AiTutorMemory;
  nextTopic?: AiTutorNextTopic;
  suggestedAction?: AiTutorSuggestedAction;
  warnings?: string[];
}

function nowIso() {
  return new Date().toISOString();
}

function makeLocalMessage(
  role: AiTutorMessage["role"],
  content: string,
  evaluation?: AiTutorEvaluation,
  topicRef?: AiTutorNextTopic
): AiTutorMessage {
  return {
    id: `local-${crypto.randomUUID()}`,
    role,
    content,
    createdAt: nowIso(),
    evaluation,
    topicRef,
  };
}

export default function AiTutorClient({
  initialProfile,
  initialMemory,
  initialMessages,
  tags,
  openaiConfigured,
  memoryConfigured,
  persistenceWarning,
}: AiTutorClientProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [memory, setMemory] = useState(initialMemory);
  const [messages, setMessages] = useState<AiTutorMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(persistenceWarning ?? null);
  const [lastAction, setLastAction] = useState<AiTutorSuggestedAction | null>(
    null
  );

  const masteryValues = Object.values(memory.mastery);
  const averageMastery =
    masteryValues.length > 0
      ? Math.round(
          masteryValues.reduce((sum, item) => sum + item.score, 0) /
            masteryValues.length
        )
      : 0;

  const visibleMessages =
    messages.length > 0
      ? messages
      : [
          makeLocalMessage(
            "assistant",
            "Set your target role, weak areas, and interview date. Then start the readiness assessment and I will ask one question at a time from the roadmap."
          ),
        ];

  function updateProfile<K extends keyof AiTutorProfile>(
    key: K,
    value: AiTutorProfile[K]
  ) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function toggleWeakTag(tagId: string) {
    setProfile((current) => {
      const exists = current.weakTags.includes(tagId);
      return {
        ...current,
        weakTags: exists
          ? current.weakTags.filter((id) => id !== tagId)
          : [...current.weakTags, tagId].slice(0, 12),
      };
    });
  }

  async function saveProfile() {
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch("/api/ai-tutor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        warning?: string;
      };
      setStatus(
        data.warning ??
          (data.ok ? "Tutor profile saved." : "Profile was accepted locally.")
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not save profile."
      );
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(message: string) {
    const trimmed = message.trim();
    if (!trimmed || busy) return;
    if (!openaiConfigured) {
      setStatus("AI Tutor needs OPENAI_API_KEY before it can answer.");
      return;
    }

    const userMessage = makeLocalMessage("user", trimmed);
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setBusy(true);
    setStatus(null);

    try {
      const response = await fetch("/api/ai-tutor/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          profile,
          sessionId: sessionId || undefined,
        }),
      });
      const data = (await response.json()) as TutorResponse;
      if (!response.ok || data.error) {
        throw new Error(data.error ?? "AI Tutor request failed.");
      }

      if (data.sessionId) setSessionId(data.sessionId);
      if (data.memory) setMemory(data.memory);
      if (data.suggestedAction) setLastAction(data.suggestedAction);
      if (data.warnings?.length) setStatus(data.warnings.join(" "));

      setMessages((current) => [
        ...current,
        makeLocalMessage(
          "assistant",
          data.assistantMessage ?? "No tutor response returned.",
          data.evaluation,
          data.nextTopic
        ),
      ]);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "AI Tutor request failed."
      );
    } finally {
      setBusy(false);
    }
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  const selectedTagLabels = tags
    .filter((tag) => profile.weakTags.includes(tag.id))
    .map((tag) => tag.label);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <aside className="space-y-4">
        <section className="section-card rounded-[28px] p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="panel-label">Tutor profile</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
                Personalization inputs
              </h2>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                memoryConfigured ? "tone-accent" : "tone-highlight"
              }`}
            >
              {memoryConfigured ? "Memory on" : "Memory setup needed"}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">
                Target role
              </span>
              <input
                value={profile.targetRole}
                onChange={(event) =>
                  updateProfile("targetRole", event.target.value)
                }
                className="field-shell"
                placeholder="AI Engineer, Senior MLE, ML Architect"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">
                  Current level
                </span>
                <select
                  value={profile.currentLevel}
                  onChange={(event) =>
                    updateProfile(
                      "currentLevel",
                      event.target.value as AiTutorProfile["currentLevel"]
                    )
                  }
                  className="field-shell"
                >
                  {aiTutorLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">
                  Daily hours
                </span>
                <input
                  type="number"
                  min="0.5"
                  max="12"
                  step="0.5"
                  value={profile.dailyHours}
                  onChange={(event) =>
                    updateProfile("dailyHours", Number(event.target.value))
                  }
                  className="field-shell"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">
                Interview date
              </span>
              <input
                type="date"
                value={profile.interviewDate}
                onChange={(event) =>
                  updateProfile("interviewDate", event.target.value)
                }
                className="field-shell"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">
                Session mode
              </span>
              <select
                value={profile.preferredMode}
                onChange={(event) =>
                  updateProfile(
                    "preferredMode",
                    event.target.value as AiTutorProfile["preferredMode"]
                  )
                }
                className="field-shell"
              >
                {aiTutorModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </label>

            <details className="rounded-2xl border border-line bg-surface-strong p-4" open>
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                Weak areas{" "}
                <span className="text-muted">({profile.weakTags.length})</span>
              </summary>
              <div className="mt-4 flex max-h-72 flex-wrap gap-2 overflow-auto pr-1">
                {tags.map((tag) => {
                  const active = profile.weakTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleWeakTag(tag.id)}
                      className={`rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition ${
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-line bg-background text-muted hover:border-primary hover:text-foreground"
                      }`}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </details>

            <button
              type="button"
              onClick={() => void saveProfile()}
              disabled={busy}
              className="button-secondary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save profile
            </button>
          </div>
        </section>

        <section className="section-card rounded-[28px] p-5 md:p-6">
          <p className="panel-label">Memory layer</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="metric-slab">
              <p className="panel-label">Mastery</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                {averageMastery || "--"}
              </p>
            </div>
            <div className="metric-slab">
              <p className="panel-label">Tracked tags</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                {masteryValues.length}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <p>
              Weak tags:{" "}
              <span className="font-semibold text-foreground">
                {selectedTagLabels.length > 0
                  ? selectedTagLabels.join(", ")
                  : "Not selected yet"}
              </span>
            </p>
            {memory.recurringMistakes.length > 0 ? (
              <p>Recurring mistakes: {memory.recurringMistakes.join("; ")}</p>
            ) : (
              <p>No recurring mistakes recorded yet.</p>
            )}
            {memory.nextRecommendations.length > 0 ? (
              <p>Next recommendations: {memory.nextRecommendations.join("; ")}</p>
            ) : null}
          </div>
        </section>
      </aside>

      <section className="section-card flex min-h-[42rem] flex-col rounded-[28px] p-5 md:p-6">
        <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="panel-label">AI Tutor Deep Agent</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
              Guided interview coach
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              The tutor uses your daily plan topics, weak areas, and memory to
              ask one question, evaluate your answer, teach the fix, then choose
              the next topic.
            </p>
          </div>
          {lastAction ? (
            <Link href={lastAction.href || "/study-plan"} className="button-primary-accent">
              {lastAction.label}
            </Link>
          ) : null}
        </div>

        {!openaiConfigured ? (
          <div className="mt-5 rounded-2xl border border-line bg-surface-strong p-4 text-sm leading-6 text-muted">
            Add <code>OPENAI_API_KEY</code> to enable live tutor responses.
            Profile and UI setup can still be reviewed without the key.
          </div>
        ) : null}

        {status ? (
          <div className="mt-5 rounded-2xl border border-line bg-surface-strong p-4 text-sm leading-6 text-muted">
            {status}
          </div>
        ) : null}

        <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
          {visibleMessages.map((message) => (
            <article
              key={message.id}
              className={`rounded-3xl border p-4 ${
                message.role === "assistant"
                  ? "border-line bg-surface-strong"
                  : "ml-auto max-w-[88%] border-primary bg-primary text-white"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                  message.role === "assistant" ? "text-primary" : "text-white/80"
                }`}
              >
                {message.role === "assistant" ? "Tutor" : "You"}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                {message.content}
              </p>

              {message.evaluation ? (
                <div className="mt-4 rounded-2xl border border-line bg-background/70 p-4 text-sm leading-6 text-muted">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">
                      Evaluation score: {Math.round(message.evaluation.score)}/100
                    </p>
                    {message.topicRef?.day ? (
                      <Link
                        href={`/day/${message.topicRef.day}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Day {message.topicRef.day}
                      </Link>
                    ) : null}
                  </div>
                  <p className="mt-2">{message.evaluation.summary}</p>
                  {message.evaluation.gaps.length > 0 ? (
                    <p className="mt-2">
                      Gaps: {message.evaluation.gaps.join("; ")}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-line bg-surface-strong px-3 py-2 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground disabled:opacity-60"
            disabled={busy}
            onClick={() =>
              void sendMessage(
                "Start my readiness assessment. Ask one question at a time and adapt to my weak areas."
              )
            }
          >
            Start assessment
          </button>
          <button
            type="button"
            className="rounded-full border border-line bg-surface-strong px-3 py-2 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground disabled:opacity-60"
            disabled={busy}
            onClick={() =>
              void sendMessage(
                "Quiz me on the weakest topic in my profile. Ask one interview question only."
              )
            }
          >
            Quiz weak area
          </button>
          <button
            type="button"
            className="rounded-full border border-line bg-surface-strong px-3 py-2 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground disabled:opacity-60"
            disabled={busy}
            onClick={() =>
              void sendMessage(
                "Teach me the next topic briefly, then ask a follow-up interview question."
              )
            }
          >
            Teach next topic
          </button>
        </div>

        <form onSubmit={submitMessage} className="mt-4 flex gap-3">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="field-shell"
            placeholder="Answer the tutor or ask for the next question..."
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            className="button-primary-accent shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Thinking" : "Send"}
          </button>
        </form>

        <p className="mt-3 text-xs leading-5 text-muted">
          Python coding lab is planned as a browser-side Pyodide module so user
          code is not executed on the server.
        </p>
      </section>
    </div>
  );
}
