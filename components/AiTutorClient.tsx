"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { DailyPlanQuestionTag } from "@/lib/daily-plan-questions";
import {
  aiTutorLevels,
  aiTutorModes,
  type AiTutorEvaluation,
  type AiTutorMemory,
  type AiTutorMessage,
  type AiTutorNextTopic,
  type AiTutorPhase,
  type AiTutorPlan,
  type AiTutorProfile,
  type AiTutorSuggestedAction,
  type AiTutorToolTrace,
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
  plan?: AiTutorPlan;
  toolTrace?: AiTutorToolTrace[];
  warnings?: string[];
}

const phaseLabels: Record<AiTutorPhase, string> = {
  warmup: "Getting to know you",
  calibration: "Finding your level",
  practice: "Interview practice",
  recap: "Wrap-up",
};

const phaseOrder: AiTutorPhase[] = [
  "warmup",
  "calibration",
  "practice",
  "recap",
];

const toolPrettyNames: Record<string, string> = {
  get_roadmap_topic: "Roadmap topic",
  search_questions: "Search questions",
  retrieve_daily_plan_content: "Retrieve day plan",
  get_user_mastery: "Read mastery",
  get_user_progress: "Read progress",
  pick_next_topic: "Pick next topic",
  set_phase: "Set phase",
  delegate_to_concept_teacher: "Concept teacher",
  delegate_to_mock_interviewer: "Mock interviewer",
  write_lesson_plan: "Write plan",
  update_lesson_plan_step: "Update plan",
  record_practice: "Record practice",
};

function nowIso() {
  return new Date().toISOString();
}

function makeLocalMessage(
  role: AiTutorMessage["role"],
  content: string,
  evaluation?: AiTutorEvaluation,
  topicRef?: AiTutorNextTopic,
  phase?: AiTutorPhase,
  toolTrace?: AiTutorToolTrace[]
): AiTutorMessage & { toolTrace?: AiTutorToolTrace[] } {
  return {
    id: `local-${crypto.randomUUID()}`,
    role,
    content,
    createdAt: nowIso(),
    evaluation,
    topicRef,
    phase,
    toolTrace,
  };
}

function PhaseProgress({ phase }: { phase: AiTutorPhase }) {
  const activeIndex = phaseOrder.indexOf(phase);
  return (
    <div className="flex items-center gap-2">
      {phaseOrder.map((step, idx) => {
        const reached = idx <= activeIndex;
        const isActive = idx === activeIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full transition ${
                isActive
                  ? "bg-primary"
                  : reached
                    ? "bg-primary opacity-60"
                    : "bg-line"
              }`}
              aria-hidden="true"
            />
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                isActive
                  ? "text-foreground"
                  : reached
                    ? "text-muted"
                    : "text-line"
              }`}
            >
              {phaseLabels[step]}
            </span>
            {idx < phaseOrder.length - 1 ? (
              <div
                className={`h-px w-4 ${reached ? "bg-primary opacity-40" : "bg-line"}`}
                aria-hidden="true"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function PlanPanel({ plan }: { plan: AiTutorPlan }) {
  const total = plan.steps.length;
  const done = plan.steps.filter((step) => step.status === "done").length;
  return (
    <div className="rounded-2xl border border-line bg-surface-strong p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Lesson plan
        </p>
        <span className="text-xs font-semibold text-muted">
          {done}/{total} done
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold text-foreground">{plan.goal}</p>
      <ol className="mt-3 space-y-2">
        {plan.steps.map((step, idx) => {
          const icon =
            step.status === "done"
              ? "✓"
              : step.status === "in_progress"
                ? "▶"
                : "·";
          const tone =
            step.status === "done"
              ? "text-primary"
              : step.status === "in_progress"
                ? "text-foreground"
                : "text-muted";
          return (
            <li key={step.id} className="flex items-start gap-2 text-sm leading-5">
              <span
                className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-line text-xs font-semibold ${tone}`}
                aria-hidden="true"
              >
                {icon}
              </span>
              <span className={tone}>
                <span className="font-semibold">{idx + 1}.</span> {step.title}
                {step.note ? (
                  <span className="ml-1 text-xs italic text-muted">
                    — {step.note}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ToolTracePanel({ trace }: { trace: AiTutorToolTrace[] }) {
  if (trace.length === 0) return null;
  return (
    <details className="mt-2 rounded-xl border border-line bg-background/60 p-2 text-xs">
      <summary className="cursor-pointer text-muted">
        Coach used {trace.length} tool{trace.length === 1 ? "" : "s"}
      </summary>
      <ul className="mt-2 space-y-1">
        {trace.map((t, idx) => (
          <li
            key={idx}
            className={`flex items-baseline gap-2 ${
              t.ok ? "text-muted" : "text-rose-500"
            }`}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground">
              {toolPrettyNames[t.name] ?? t.name}
            </span>
            <span className="truncate">{t.preview ?? ""}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

function CoachMarkdown({ children }: { children: string }) {
  return (
    <div className="tutor-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({
            inline,
            className,
            children: codeChildren,
            ...props
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) {
            if (inline) {
              return (
                <code
                  className="rounded bg-surface-strong px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
                  {...props}
                >
                  {codeChildren}
                </code>
              );
            }
            const lang = className?.replace("language-", "");
            return (
              <div className="my-3 overflow-hidden rounded-lg border border-line bg-background/80">
                {lang ? (
                  <div className="border-b border-line bg-surface-strong/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {lang}
                  </div>
                ) : null}
                <pre className="overflow-x-auto p-3 text-[12.5px] leading-5">
                  <code className={`font-mono ${className ?? ""}`} {...props}>
                    {codeChildren}
                  </code>
                </pre>
              </div>
            );
          },
          p({ children: childNodes }) {
            return <p className="mb-2 last:mb-0">{childNodes}</p>;
          },
          ul({ children: childNodes }) {
            return <ul className="my-2 list-disc pl-5">{childNodes}</ul>;
          },
          ol({ children: childNodes }) {
            return <ol className="my-2 list-decimal pl-5">{childNodes}</ol>;
          },
          li({ children: childNodes }) {
            return <li className="mb-1">{childNodes}</li>;
          },
          strong({ children: childNodes }) {
            return (
              <strong className="font-semibold text-foreground">
                {childNodes}
              </strong>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
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
  const [messages, setMessages] = useState<
    (AiTutorMessage & { toolTrace?: AiTutorToolTrace[] })[]
  >(initialMessages);
  const [draft, setDraft] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(persistenceWarning ?? null);
  const [lastAction, setLastAction] = useState<AiTutorSuggestedAction | null>(
    null
  );
  const [phase, setPhase] = useState<AiTutorPhase>("warmup");
  const [plan, setPlan] = useState<AiTutorPlan | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

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
            "Hi — I'm Maya, your interview coach. Whenever you're ready, tell me a bit about yourself: **what role you're targeting**, **when the interview is**, and **where you'd like to start**. We'll go at your pace.",
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
      if (data.plan) setPlan(data.plan);
      if (data.warnings?.length) setStatus(data.warnings.join(" "));

      setMessages((current) => [
        ...current,
        makeLocalMessage(
          "assistant",
          data.assistantMessage ?? "Sorry — I missed that. Could you say that again?",
          data.evaluation,
          data.nextTopic,
          data.phase,
          data.toolTrace
        ),
      ]);
    } catch (error) {
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

        {plan ? (
          <section className="section-card rounded-[28px] p-5 md:p-6">
            <PlanPanel plan={plan} />
          </section>
        ) : null}

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
        <div className="flex flex-col gap-4 border-b border-line pb-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="panel-label">AI Interview Coach</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
                {phaseLabels[phase]}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                A deepagent-style coach: writes a lesson plan, retrieves topics,
                delegates teaching to subagents, and grades only after a real
                attempt.
              </p>
            </div>
            {lastAction ? (
              <Link href={lastAction.href || "/study-plan"} className="button-primary-accent">
                {lastAction.label}
              </Link>
            ) : null}
          </div>
          <PhaseProgress phase={phase} />
        </div>

        {!openaiConfigured ? (
          <div className="mt-5 rounded-2xl border border-line bg-surface-strong p-4 text-sm leading-6 text-muted">
            Add <code>OPENAI_API_KEY</code> to enable live coaching. Profile
            and UI setup can still be reviewed without the key.
          </div>
        ) : null}

        {status ? (
          <div className="mt-5 rounded-2xl border border-amber-300/50 bg-amber-50/50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            {status}
          </div>
        ) : null}

        <div
          ref={scrollerRef}
          className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1"
        >
          {visibleMessages.map((message) => (
            <article
              key={message.id}
              className={`rounded-3xl border p-4 ${
                message.role === "assistant"
                  ? "border-line bg-surface-strong"
                  : "ml-auto max-w-[88%] border-primary bg-primary text-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                    message.role === "assistant" ? "text-primary" : "text-white/80"
                  }`}
                >
                  {message.role === "assistant" ? "Coach · Maya" : "You"}
                  {message.role === "assistant" && message.phase ? (
                    <span className="ml-2 text-[10px] font-medium tracking-normal text-muted">
                      · {phaseLabels[message.phase]}
                    </span>
                  ) : null}
                </p>
              </div>

              <div
                className={`mt-2 text-sm leading-6 ${
                  message.role === "assistant" ? "" : "whitespace-pre-wrap"
                }`}
              >
                {message.role === "assistant" ? (
                  <CoachMarkdown>{message.content}</CoachMarkdown>
                ) : (
                  message.content
                )}
              </div>

              {message.evaluation ? (
                <div className="mt-4 rounded-2xl border border-line bg-background/70 p-4 text-sm leading-6 text-muted">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">
                      How that answer went:{" "}
                      <span className="font-mono text-primary">
                        {Math.round(message.evaluation.score)}/100
                      </span>
                    </p>
                    {message.topicRef?.day ? (
                      <Link
                        href={`/day/${message.topicRef.day}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Day {message.topicRef.day} →
                      </Link>
                    ) : null}
                  </div>
                  {message.evaluation.summary ? (
                    <p className="mt-2">{message.evaluation.summary}</p>
                  ) : null}
                  {message.evaluation.strengths.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {message.evaluation.strengths.map((strength, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-emerald-400/40 bg-emerald-50/60 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                        >
                          ✓ {strength}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {message.evaluation.gaps.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {message.evaluation.gaps.map((gap, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-amber-400/40 bg-amber-50/60 px-2 py-0.5 text-xs font-medium text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
                        >
                          → {gap}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {message.role === "assistant" && message.toolTrace?.length ? (
                <ToolTracePanel trace={message.toolTrace} />
              ) : null}
            </article>
          ))}

          {busy ? (
            <article className="rounded-3xl border border-line bg-surface-strong p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Coach · Maya
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary opacity-60" />
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary opacity-40 [animation-delay:120ms]" />
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary opacity-20 [animation-delay:240ms]" />
                <span className="ml-2">thinking</span>
              </div>
            </article>
          ) : null}
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
                "Give me a real interview-grade question for my target role at intermediate difficulty."
              )
            }
          >
            Mock interview
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
          checked off — practice here also updates the dashboard tracker.
        </p>
      </section>
    </div>
  );
}
