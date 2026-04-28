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
  type AiTutorPhase,
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
  phase?: AiTutorPhase;
  warnings?: string[];
}

const phaseLabels: Record<AiTutorPhase, string> = {
  warmup: "Getting to know you",
  calibration: "Finding your level",
  practice: "Interview practice",
  recap: "Wrap-up",
};

function nowIso() {
  return new Date().toISOString();
}

function makeLocalMessage(
  role: AiTutorMessage["role"],
  content: string,
  evaluation?: AiTutorEvaluation,
  topicRef?: AiTutorNextTopic,
  phase?: AiTutorPhase
): AiTutorMessage {
  return {
    id: `local-${crypto.randomUUID()}`,
    role,
    content,
    createdAt: nowIso(),
    evaluation,
    topicRef,
    phase,
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
  const [phase, setPhase] = useState<AiTutorPhase>("warmup");

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
            "Hi — I'm Maya, your interview coach. Whenever you're ready, tell me a bit about yourself: what role you're targeting, when the interview is, and where you'd like to start. We'll go at your pace.",
            undefined,
            undefined,
            "warmup"
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
          (data.ok ? "Profile saved." : "Profile was accepted locally.")
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
      setStatus("Add OPENAI_API_KEY to enable live coaching responses.");
      return;
    }

    const userMessage = makeLocalMessage("user", trimmed);
    const conversationSnapshot = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
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
          conversation: conversationSnapshot,
        }),
      });
      const data = (await response.json()) as TutorResponse;
      if (!response.ok || data.error) {
        throw new Error(data.error ?? "Coach is unavailable right now.");
      }

      if (data.sessionId) setSessionId(data.sessionId);
      if (data.memory) setMemory(data.memory);
      if (data.suggestedAction) setLastAction(data.suggestedAction);
      if (data.phase) setPhase(data.phase);
      if (data.warnings?.length) setStatus(data.warnings.join(" "));

      setMessages((current) => [
        ...current,
        makeLocalMessage(
          "assistant",
          data.assistantMessage ?? "Sorry — I missed that. Could you say that again?",
          data.evaluation,
          data.nextTopic,
          data.phase
        ),
      ]);
    } catch (error) {
      // Soft-fail: just append a chat-style apology, no fake 0/100 score.
      setMessages((current) => [
        ...current,
        makeLocalMessage(
          "assistant",
          "Hmm, I couldn't reach the coach service. Let's try that again in a moment.",
          undefined,
          undefined,
          phase
        ),
      ]);
      setStatus(
        error instanceof Error ? error.message : "Coach is unavailable right now."
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
              <p className="panel-label">Your profile</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
                What we&rsquo;re working with
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
                Session style
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
                Focus areas{" "}
                <span className="text-muted">({profile.weakTags.length})</span>
              </summary>
              <p className="mt-2 text-xs leading-5 text-muted">
                Pick a few topics you want extra time on — your coach will
                weight these higher when choosing what to teach next.
              </p>
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
          <p className="panel-label">Progress so far</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="metric-slab">
              <p className="panel-label">Avg mastery</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                {averageMastery || "--"}
              </p>
            </div>
            <div className="metric-slab">
              <p className="panel-label">Topics tracked</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
                {masteryValues.length}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <p>
              Focus areas:{" "}
              <span className="font-semibold text-foreground">
                {selectedTagLabels.length > 0
                  ? selectedTagLabels.join(", ")
                  : "Pick a few when you're ready"}
              </span>
            </p>
            {memory.strengths.length > 0 ? (
              <p>
                Strengths spotted:{" "}
                <span className="font-semibold text-foreground">
                  {memory.strengths.slice(0, 4).join(", ")}
                </span>
              </p>
            ) : null}
            {memory.recurringMistakes.length > 0 ? (
              <p>
                To strengthen next:{" "}
                <span className="font-semibold text-foreground">
                  {memory.recurringMistakes.slice(0, 3).join("; ")}
                </span>
              </p>
            ) : null}
            {memory.nextRecommendations.length > 0 ? (
              <p>
                Coach&rsquo;s next picks: {memory.nextRecommendations.slice(0, 3).join("; ")}
              </p>
            ) : null}
          </div>
        </section>
      </aside>

      <section className="section-card flex min-h-[42rem] flex-col rounded-[28px] p-5 md:p-6">
        <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="panel-label">AI Interview Coach</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
              {phaseLabels[phase]}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              We&rsquo;ll start friendly, find your level, and ladder into
              practice questions from the daily plan. No grading until
              you&rsquo;ve actually attempted an answer.
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
            Add <code>OPENAI_API_KEY</code> to enable live coaching. Profile
            and UI setup can still be reviewed without the key.
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
                {message.role === "assistant" ? "Coach" : "You"}
                {message.role === "assistant" && message.phase ? (
                  <span className="ml-2 text-[10px] font-medium tracking-normal text-muted">
                    · {phaseLabels[message.phase]}
                  </span>
                ) : null}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                {message.content}
              </p>

              {message.evaluation ? (
                <div className="mt-4 rounded-2xl border border-line bg-background/70 p-4 text-sm leading-6 text-muted">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">
                      How that answer went: {Math.round(message.evaluation.score)}/100
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
                  {message.evaluation.summary ? (
                    <p className="mt-2">{message.evaluation.summary}</p>
                  ) : null}
                  {message.evaluation.strengths.length > 0 ? (
                    <p className="mt-2">
                      What worked: {message.evaluation.strengths.join("; ")}
                    </p>
                  ) : null}
                  {message.evaluation.gaps.length > 0 ? (
                    <p className="mt-2">
                      To strengthen: {message.evaluation.gaps.join("; ")}
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
                "Hi! Let's start. Could you ask me about my role and what I'd like to focus on?"
              )
            }
          >
            Say hi
          </button>
          <button
            type="button"
            className="rounded-full border border-line bg-surface-strong px-3 py-2 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground disabled:opacity-60"
            disabled={busy}
            onClick={() =>
              void sendMessage(
                "Could you give me a basic warm-up question on one of my focus areas, and start gentle?"
              )
            }
          >
            Start with basics
          </button>
          <button
            type="button"
            className="rounded-full border border-line bg-surface-strong px-3 py-2 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground disabled:opacity-60"
            disabled={busy}
            onClick={() =>
              void sendMessage(
                "Teach me a concept from my focus areas in plain English, then ask one short follow-up to check my understanding."
              )
            }
          >
            Teach a concept
          </button>
          <button
            type="button"
            className="rounded-full border border-line bg-surface-strong px-3 py-2 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground disabled:opacity-60"
            disabled={busy}
            onClick={() =>
              void sendMessage(
                "Wrap up the session: summarize what we covered today and what to work on next."
              )
            }
          >
            Wrap up
          </button>
        </div>

        <form onSubmit={submitMessage} className="mt-4 flex gap-3">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="field-shell"
            placeholder="Type a message — say hi, ask a question, or answer the coach..."
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
          Coach uses your daily plan, focus areas, and what you&rsquo;ve already
          checked off — so practice here also updates your tracker on the
          dashboard.
        </p>
      </section>
    </div>
  );
}
