"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { AiTutorSessionSummary } from "@/lib/ai-tutor-store";
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
  initialSessions: AiTutorSessionSummary[];
  initialActiveSessionId?: string;
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

// Threshold matches the agent's `readyToAdvance` flag. A topic is treated
// as mastered once score >= 75 across at least 2 attempts.
const MASTERY_SCORE = 75;
const MASTERY_ATTEMPTS = 2;

// When the chat has more than this many messages, hide the oldest ones
// behind an expander so the user isn't drowning in scroll.
const VISIBLE_TAIL = 8;

function nowIso() {
  return new Date().toISOString();
}

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return "";
  const min = Math.round(ms / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
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

function PlanPill({
  plan,
  expanded,
  onToggle,
}: {
  plan: AiTutorPlan;
  expanded: boolean;
  onToggle: () => void;
}) {
  const total = plan.steps.length;
  const done = plan.steps.filter((step) => step.status === "done").length;
  const active = plan.steps.find((step) => step.status === "in_progress");
  return (
    <div className="rounded-2xl border border-line bg-surface-strong">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Lesson plan · {done}/{total}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {active?.title ?? plan.goal}
          </p>
        </div>
        <span className="text-xs font-semibold text-muted">
          {expanded ? "Hide" : "Show"}
        </span>
      </button>
      {expanded ? (
        <ol className="space-y-1.5 border-t border-line px-4 py-3">
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
      ) : null}
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
          a({ children: childNodes, ...props }) {
            return (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline decoration-current underline-offset-2 hover:opacity-80"
              >
                {childNodes}
              </a>
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
  initialSessions,
  initialActiveSessionId,
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
  const [sessionId, setSessionId] = useState(initialActiveSessionId ?? "");
  const [sessions, setSessions] = useState<AiTutorSessionSummary[]>(
    initialSessions
  );
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(persistenceWarning ?? null);
  const [lastAction, setLastAction] = useState<AiTutorSuggestedAction | null>(
    null
  );
  const [phase, setPhase] = useState<AiTutorPhase>("warmup");
  const [plan, setPlan] = useState<AiTutorPlan | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(true);
  const [showOlder, setShowOlder] = useState(false);
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
  const masteredCount = masteryValues.filter(
    (m) =>
      (m.bestScore ?? m.score) >= MASTERY_SCORE &&
      (m.attempts ?? 0) >= MASTERY_ATTEMPTS
  ).length;
  const topMastered = useMemo(
    () =>
      Object.entries(memory.mastery)
        .filter(
          ([, m]) =>
            (m.bestScore ?? m.score) >= MASTERY_SCORE &&
            (m.attempts ?? 0) >= MASTERY_ATTEMPTS
        )
        .sort(
          (a, b) => (b[1].bestScore ?? b[1].score) - (a[1].bestScore ?? a[1].score)
        )
        .slice(0, 4)
        .map(([, m]) => m.tagLabel),
    [memory.mastery]
  );

  const selectedTagLabels = tags
    .filter((tag) => profile.weakTags.includes(tag.id))
    .map((tag) => tag.label);

  const showEmptyHint = messages.length === 0;
  const visibleMessages = showEmptyHint
    ? [
        makeLocalMessage(
          "assistant",
          "Hi — I'm Maya, your interview coach. Whenever you're ready, tell me a bit about yourself: **what role you're targeting**, **when the interview is**, and **where you'd like to start**. We'll go at your pace.",
          undefined,
          undefined,
          "warmup"
        ),
      ]
    : messages;

  const tail = visibleMessages.slice(-VISIBLE_TAIL);
  const olderCount = Math.max(0, visibleMessages.length - tail.length);
  const messagesToRender =
    olderCount === 0 || showOlder ? visibleMessages : tail;

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

  async function startNewSession() {
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch("/api/ai-tutor/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: profile.preferredMode }),
      });
      const data = (await response.json()) as {
        id?: string;
        warning?: string;
      };
      if (data.id) {
        setSessionId(data.id);
        setMessages([]);
        setPhase("warmup");
        setPlan(null);
        setLastAction(null);
        setShowOlder(false);
        setStatus("Started a fresh session — your memory and progress carry over.");
        setSessions((current) => [
          {
            id: data.id!,
            startedAt: nowIso(),
            status: "active",
            mode: profile.preferredMode,
            messageCount: 0,
            phase: "warmup",
          },
          ...current,
        ]);
      } else if (data.warning) {
        setStatus(data.warning);
      }
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not start a new session."
      );
    } finally {
      setBusy(false);
    }
  }

  async function switchSession(targetId: string) {
    if (!targetId || targetId === sessionId) return;
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch(
        `/api/ai-tutor/sessions?sessionId=${encodeURIComponent(targetId)}`
      );
      const data = (await response.json()) as {
        messages?: AiTutorMessage[];
        warning?: string;
      };
      if (Array.isArray(data.messages)) {
        setMessages(
          data.messages as (AiTutorMessage & { toolTrace?: AiTutorToolTrace[] })[]
        );
        setSessionId(targetId);
        const lastAssistant = [...data.messages]
          .reverse()
          .find((m) => m.role === "assistant" && m.phase);
        if (lastAssistant?.phase) setPhase(lastAssistant.phase);
        setPlan(null);
        setShowOlder(false);
      } else if (data.warning) {
        setStatus(data.warning);
      }
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not load that session."
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

      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
      }
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

  return (
    <section className="section-card flex min-h-[calc(100vh-12rem)] flex-col rounded-[28px] p-4 md:p-6">
      {/* ── Top bar: session switcher · profile chip · phase progress ── */}
      <div className="flex flex-col gap-3 border-b border-line pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={sessionId}
              onChange={(event) => void switchSession(event.target.value)}
              className="field-shell h-9 max-w-xs text-xs"
              disabled={busy}
            >
              {sessions.length === 0 ? (
                <option value="">New session</option>
              ) : null}
              {sessions.map((s) => {
                const labelDate = new Date(s.startedAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                });
                return (
                  <option key={s.id} value={s.id}>
                    {labelDate} · {phaseLabels[s.phase]} ({s.messageCount} msg)
                  </option>
                );
              })}
            </select>
            <button
              type="button"
              onClick={() => void startNewSession()}
              disabled={busy}
              className="rounded-full border border-line bg-surface-strong px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground disabled:opacity-60"
            >
              + New session
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-line bg-surface-strong px-3 py-1.5 text-xs text-muted transition hover:border-primary hover:text-foreground"
            >
              <span className="font-semibold text-foreground">
                {profile.targetRole}
              </span>
              <span className="text-line">·</span>
              <span>{profile.currentLevel}</span>
              {profile.interviewDate ? (
                <>
                  <span className="text-line">·</span>
                  <span>{profile.interviewDate}</span>
                </>
              ) : null}
              <span className="ml-1">{profileOpen ? "▴" : "▾"}</span>
            </button>
            {lastAction ? (
              <Link
                href={lastAction.href || "/study-plan"}
                className="button-primary-accent !px-3 !py-1.5 text-xs"
              >
                {lastAction.label}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <PhaseProgress phase={phase} />
          {masteryValues.length > 0 ? (
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>
                Avg mastery:{" "}
                <span className="font-mono font-semibold text-foreground">
                  {averageMastery}
                </span>
              </span>
              <span className="text-line">·</span>
              <span>
                Mastered:{" "}
                <span className="font-mono font-semibold text-primary">
                  {masteredCount}
                </span>
                /{masteryValues.length}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Profile drawer (collapsed by default, opens above the chat) ── */}
      {profileOpen ? (
        <div className="mt-4 grid gap-4 rounded-2xl border border-line bg-surface-strong p-4 md:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
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

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Level
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
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
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

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
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
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
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

          <details className="md:col-span-2">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted">
              Focus areas{" "}
              <span className="text-foreground">({profile.weakTags.length})</span>
            </summary>
            <div className="mt-3 flex max-h-48 flex-wrap gap-1.5 overflow-auto pr-1">
              {tags.map((tag) => {
                const active = profile.weakTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleWeakTag(tag.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
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

          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
            <div className="text-xs text-muted">
              {selectedTagLabels.length > 0
                ? `Focus: ${selectedTagLabels.slice(0, 3).join(", ")}${selectedTagLabels.length > 3 ? "…" : ""}`
                : "No focus areas picked yet."}
              {topMastered.length > 0
                ? ` · Mastered so far: ${topMastered.join(", ")}.`
                : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="rounded-full border border-line bg-background px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => void saveProfile()}
                disabled={busy}
                className="button-primary-accent !px-3 !py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save profile
              </button>
            </div>
          </div>

          <p
            className={`md:col-span-2 text-[11px] ${
              memoryConfigured ? "text-muted" : "text-amber-700 dark:text-amber-300"
            }`}
          >
            {memoryConfigured
              ? "Memory is on — coach remembers your progress across sessions."
              : "Memory storage isn't configured — progress this turn won't persist."}
          </p>
        </div>
      ) : null}

      {/* ── Plan pill ── */}
      {plan ? (
        <div className="mt-4">
          <PlanPill
            plan={plan}
            expanded={planOpen}
            onToggle={() => setPlanOpen((v) => !v)}
          />
        </div>
      ) : null}

      {/* ── Warnings / status ── */}
      {!openaiConfigured ? (
        <div className="mt-4 rounded-2xl border border-line bg-surface-strong p-3 text-xs leading-5 text-muted">
          Add <code>OPENAI_API_KEY</code> to enable live coaching.
        </div>
      ) : null}
      {status ? (
        <div className="mt-4 rounded-2xl border border-amber-300/50 bg-amber-50/50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          {status}
        </div>
      ) : null}

      {/* ── Chat scroller ── */}
      <div
        ref={scrollerRef}
        className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1"
      >
        {olderCount > 0 && !showOlder ? (
          <button
            type="button"
            onClick={() => setShowOlder(true)}
            className="block w-full rounded-2xl border border-dashed border-line bg-background/60 px-4 py-2 text-center text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground"
          >
            Show {olderCount} earlier message{olderCount === 1 ? "" : "s"}
          </button>
        ) : null}

        {messagesToRender.map((message) => (
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
              <span
                className={`text-[10px] tracking-normal ${
                  message.role === "assistant" ? "text-muted" : "text-white/60"
                }`}
              >
                {formatRelative(message.createdAt)}
              </span>
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

      {/* ── Quick actions + composer ── */}
      <div className="mt-4 flex flex-wrap gap-2">
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

      <form onSubmit={submitMessage} className="mt-3 flex gap-3">
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

      <p className="mt-2 text-[11px] leading-4 text-muted">
        Answers scoring 70+ are recorded on your tracker. Topics are
        considered mastered once you score 75+ across 2+ attempts. Memory
        and progress carry across all sessions.
      </p>
    </section>
  );
}
