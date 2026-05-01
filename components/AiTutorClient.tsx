"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import AiTutorVoicePanel from "@/components/AiTutorVoicePanel";
import type { DailyPlanQuestionTag } from "@/lib/daily-plan-questions";
import { markDayCheckLocal } from "@/lib/progress-store";
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
  type AiTutorReferenceLink,
  type AiTutorSessionSummary,
  type AiTutorSuggestedAction,
  type AiTutorToolTrace,
} from "@/lib/ai-tutor-types";

interface AiTutorClientProps {
  initialProfile: AiTutorProfile;
  initialMemory: AiTutorMemory;
  initialMessages: AiTutorMessage[];
  initialSessions: AiTutorSessionSummary[];
  initialSessionId?: string;
  tags: DailyPlanQuestionTag[];
  openaiConfigured: boolean;
  signedIn: boolean;
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
  sessions?: AiTutorSessionSummary[];
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

type CoachDeliveryMode = "chat" | "voice";

const deliveryModeDetails: Record<
  CoachDeliveryMode,
  {
    label: string;
    title: string;
    description: string;
    signal: string;
  }
> = {
  chat: {
    label: "Chat mode",
    title: "Chat agent",
    description:
      "Type answers, review markdown/code feedback, and keep a searchable transcript.",
    signal: "Best for coding, detailed rubrics, and reference links.",
  },
  voice: {
    label: "Voice mode",
    title: "Voice agent",
    description:
      "Talk live with Maya while the same roadmap, mastery, tracker, and questions run behind the scenes.",
    signal: "Best for spoken interview practice and quick calibration.",
  },
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

function ReadinessBadge({ evaluation }: { evaluation: AiTutorEvaluation }) {
  const readiness = evaluation.readiness ?? "not_assessed";
  const ready = readiness === "interview_ready" && evaluation.trackerUpdated;
  const needsPractice = readiness === "needs_practice" || !evaluation.trackerUpdated;
  return (
    <div
      className={`rounded-2xl border px-3 py-2 text-xs leading-5 ${
        ready
          ? "border-emerald-400/40 bg-emerald-50/70 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
          : needsPractice
            ? "border-amber-400/40 bg-amber-50/70 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
            : "border-line bg-background/70 text-muted"
      }`}
    >
      <span className="font-semibold">
        {ready
          ? "Tracker updated"
          : readiness === "interview_ready"
            ? "Interview-ready, not auto-checked"
            : "Keep practicing"}
      </span>
      {evaluation.trackerReason ? (
        <span className="ml-1">{evaluation.trackerReason}</span>
      ) : null}
    </div>
  );
}

function ReferenceLinks({
  links,
  compact = false,
}: {
  links?: AiTutorReferenceLink[];
  compact?: boolean;
}) {
  const uniqueLinks = [...(links ?? [])]
    .filter((link) => link.href)
    .filter(
      (link, index, arr) =>
        arr.findIndex((candidate) => candidate.href === link.href) === index
    )
    .slice(0, 4);
  if (uniqueLinks.length === 0) return null;

  return (
    <div className={compact ? "mt-2" : "mt-4"}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        Use if stuck
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {uniqueLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line bg-background/70 px-3 py-1 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground"
          >
            {link.label || link.source || "Reference"} ↗
          </a>
        ))}
      </div>
    </div>
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

interface CoachInsightTopic {
  id: string;
  label: string;
  score: number;
  confidence: string;
}

function InsightTopicChips({
  topics,
  tone,
  empty,
}: {
  topics: CoachInsightTopic[];
  tone: "strength" | "weakness";
  empty: string;
}) {
  if (topics.length === 0) {
    return <p className="mt-2 text-xs leading-5 text-muted">{empty}</p>;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {topics.slice(0, 6).map((topic) => (
        <span
          key={topic.id}
          title={`${topic.confidence} confidence`}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            tone === "strength"
              ? "border-emerald-400/40 bg-emerald-50/70 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-amber-400/40 bg-amber-50/70 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
          }`}
        >
          {topic.label} · {topic.score}
        </span>
      ))}
    </div>
  );
}

function TextInsightChips({
  items,
  empty,
}: {
  items: string[];
  empty: string;
}) {
  if (items.length === 0) {
    return <p className="mt-2 text-xs leading-5 text-muted">{empty}</p>;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.slice(0, 5).map((item) => (
        <span
          key={item}
          className="rounded-full border border-line bg-background/70 px-3 py-1 text-xs font-semibold text-muted"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function AiTutorClient({
  initialProfile,
  initialMemory,
  initialMessages,
  initialSessions,
  initialSessionId,
  tags,
  openaiConfigured,
  signedIn,
  persistenceWarning,
}: AiTutorClientProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [memory, setMemory] = useState(initialMemory);
  const [messages, setMessages] = useState<
    (AiTutorMessage & { toolTrace?: AiTutorToolTrace[] })[]
  >(initialMessages);
  const [sessions, setSessions] = useState(initialSessions);
  const [draft, setDraft] = useState("");
  const [sessionId, setSessionId] = useState(initialSessionId ?? "");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(
    signedIn ? (persistenceWarning ?? null) : null
  );
  const [lastAction, setLastAction] = useState<AiTutorSuggestedAction | null>(
    null
  );
  const [phase, setPhase] = useState<AiTutorPhase>("warmup");
  const [plan, setPlan] = useState<AiTutorPlan | null>(
    initialSessions.find((session) => session.id === initialSessionId)?.plan ??
      null
  );
  const [showOlder, setShowOlder] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null
  );
  const [coachMode, setCoachMode] = useState<CoachDeliveryMode>("chat");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const coachAvailable = signedIn && openaiConfigured;
  const authRequiredMessage =
    "Sign in or create an account to use AI Tutor chat or voice mode, save sessions, and persist coach insights.";

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  const masteryInsights: CoachInsightTopic[] = Object.entries(memory.mastery).map(
    ([tagId, item]) => ({
      id: tagId,
      label: item.tagLabel || tagId,
      score: item.score,
      confidence: item.confidence,
    })
  );
  const strengthTopicInsights = masteryInsights
    .filter((item) => item.score >= 75)
    .sort((a, b) => b.score - a.score);
  const weaknessTopicInsights = masteryInsights
    .filter((item) => item.score < 75)
    .sort((a, b) => a.score - b.score);
  const insightCount =
    masteryInsights.length +
    memory.strengths.length +
    memory.recurringMistakes.length;
  const nextLearningMove =
    memory.nextRecommendations[0] ??
    (weaknessTopicInsights[0]
      ? `Practice ${weaknessTopicInsights[0].label} next`
      : strengthTopicInsights[0]
        ? `Move to harder follow-ups for ${strengthTopicInsights[0].label}`
        : "Start a coaching session so the tutor can assess your current level.");

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

  const displayMessages =
    showOlder || visibleMessages.length <= 14
      ? visibleMessages
      : visibleMessages.slice(-14);
  const hiddenMessageCount = Math.max(0, visibleMessages.length - displayMessages.length);

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
    if (!signedIn) {
      setStatus("Sign in to save this profile and use it in coaching sessions.");
      return;
    }
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

  async function refreshSessions() {
    if (!signedIn) return;
    try {
      const response = await fetch("/api/ai-tutor/sessions");
      const data = (await response.json()) as {
        sessions?: AiTutorSessionSummary[];
      };
      if (Array.isArray(data.sessions)) setSessions(data.sessions);
    } catch {
      // Non-critical; chat still works with the active session id.
    }
  }

  async function loadSession(nextSessionId: string) {
    if (!signedIn) {
      setStatus(authRequiredMessage);
      return;
    }
    if (!nextSessionId || nextSessionId === sessionId || busy) return;
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch(
        `/api/ai-tutor/sessions?sessionId=${encodeURIComponent(nextSessionId)}`
      );
      const data = (await response.json()) as {
        messages?: AiTutorMessage[];
        error?: string;
      };
      if (!response.ok || data.error) {
        throw new Error(data.error ?? "Could not load session.");
      }
      setSessionId(nextSessionId);
      setMessages(data.messages ?? []);
      setShowOlder(false);
      const session = sessions.find((item) => item.id === nextSessionId);
      if (session?.phase) setPhase(session.phase);
      setPlan(session?.plan ?? null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load session.");
    } finally {
      setBusy(false);
    }
  }

  async function startNewSession() {
    if (!signedIn) {
      setStatus(authRequiredMessage);
      return;
    }
    if (busy) return;
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch("/api/ai-tutor/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = (await response.json()) as {
        sessionId?: string;
        sessions?: AiTutorSessionSummary[];
        warning?: string;
        error?: string;
      };
      if (!response.ok || data.error || !data.sessionId) {
        throw new Error(data.error ?? "Could not start a new session.");
      }
      setSessionId(data.sessionId);
      setSessions(data.sessions ?? []);
      setMessages([]);
      setPhase("warmup");
      setPlan(null);
      setLastAction(null);
      setShowOlder(false);
      setStatus(data.warning ?? "Started a new coaching session. Insights are shared.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not start a new session."
      );
    } finally {
      setBusy(false);
    }
  }

  async function deleteSession(targetSession: AiTutorSessionSummary) {
    if (!signedIn) {
      setStatus(authRequiredMessage);
      return;
    }
    if (busy || deletingSessionId) return;
    const confirmed = window.confirm(
      "Delete this AI Tutor session? This removes the transcript and rebuilds coach insights from your remaining sessions."
    );
    if (!confirmed) return;

    setDeletingSessionId(targetSession.id);
    setStatus(null);
    try {
      const response = await fetch(
        `/api/ai-tutor/sessions?sessionId=${encodeURIComponent(targetSession.id)}`,
        { method: "DELETE" }
      );
      const data = (await response.json()) as {
        sessions?: AiTutorSessionSummary[];
        activeSessionId?: string;
        messages?: AiTutorMessage[];
        memory?: AiTutorMemory;
        warning?: string;
        error?: string;
      };
      if (!response.ok || data.error) {
        throw new Error(data.error ?? "Could not delete session.");
      }

      const nextSessions = data.sessions ?? [];
      const nextActiveSession = data.activeSessionId
        ? nextSessions.find((item) => item.id === data.activeSessionId)
        : undefined;
      setSessions(nextSessions);
      if (data.memory) setMemory(data.memory);
      if (targetSession.id === sessionId) {
        setSessionId(data.activeSessionId ?? "");
        setMessages(data.messages ?? []);
        setPhase(nextActiveSession?.phase ?? "warmup");
        setPlan(nextActiveSession?.plan ?? null);
        setLastAction(null);
        setShowOlder(false);
      }
      setStatus(data.warning ?? "Session deleted and coach insights rebuilt.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not delete session.");
    } finally {
      setDeletingSessionId(null);
    }
  }

  async function sendMessage(message: string) {
    const trimmed = message.trim();
    if (!trimmed || busy) return;
    if (!signedIn) {
      setStatus(authRequiredMessage);
      return;
    }
    if (!openaiConfigured) {
      setStatus("Add OPENAI_API_KEY to enable live coaching responses.");
      return;
    }

    const userMessage = makeLocalMessage("user", trimmed);
    const conversationSnapshot = messages.slice(-10).map((m) => ({
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
      if (data.evaluation?.trackerUpdated && data.nextTopic?.day && data.nextTopic.itemId) {
        markDayCheckLocal(data.nextTopic.day, data.nextTopic.itemId);
      }
      void refreshSessions();

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
  const activeSession = sessions.find((item) => item.id === sessionId);

  return (
    <div className="space-y-5">
      <section className="section-card rounded-[28px] p-5 md:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
          <div>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="panel-label">Profile & focus</p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
                  Configure what the coach should optimize for.
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                  This is the single profile source for the tutor. Updates here
                  are used by new sessions, lesson plans, and follow-up
                  questions.
                </p>
              </div>
              <span className="tone-accent w-fit rounded-full px-3 py-1 text-xs font-semibold">
                {selectedTagLabels.length || 0} focus area
                {selectedTagLabels.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
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

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => void saveProfile()}
                  disabled={busy}
                  className="button-secondary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save profile
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-line bg-surface-strong p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Starting focus areas
                  </p>
                  <p className="text-xs leading-5 text-muted">
                    Use these to seed early sessions. Coach insights take over
                    once enough answers are evaluated.
                  </p>
                </div>
                <span className="text-xs font-semibold text-muted">
                  {selectedTagLabels.length}/12 selected
                </span>
              </div>
              <div className="mt-3 flex max-h-44 flex-wrap gap-2 overflow-auto pr-1">
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
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface-strong p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="panel-label">Sessions</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    Shared insights, separate chats
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {signedIn
                      ? "Delete removes the transcript and rebuilds insights from the remaining sessions."
                      : "Preview the session system here. Sign in to create saved sessions."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void startNewSession()}
                  disabled={busy || !signedIn}
                  className="rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  New session
                </button>
              </div>

              {sessions.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {sessions.slice(0, 5).map((session) => {
                    const active = session.id === sessionId;
                    const deleting = deletingSessionId === session.id;
                    return (
                      <div
                        key={session.id}
                        className={`flex items-center gap-2 rounded-2xl border p-2 transition ${
                          active
                            ? "border-primary bg-primary text-white"
                            : "border-line bg-background text-muted"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => void loadSession(session.id)}
                          disabled={busy || active || Boolean(deletingSessionId)}
                          className={`min-w-0 flex-1 rounded-xl px-2 py-1 text-left transition ${
                            active
                              ? "text-white"
                              : "hover:bg-surface-strong hover:text-foreground"
                          } disabled:cursor-not-allowed`}
                        >
                          <span className="block truncate text-xs font-semibold">
                            {session.title}
                          </span>
                          <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] opacity-75">
                            {phaseLabels[session.phase]} ·{" "}
                            {new Date(session.startedAt).toLocaleDateString()}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteSession(session)}
                          disabled={busy || Boolean(deletingSessionId)}
                          aria-label={`Delete session ${session.title}`}
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            active
                              ? "border-white/30 text-white/85 hover:bg-white/15"
                              : "border-rose-300/50 text-rose-600 hover:border-rose-400 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                          }`}
                        >
                          {deleting ? "Deleting" : "Delete"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted">
                  {signedIn
                    ? "Your first message will create a session automatically."
                    : "Session history appears here after sign in."}
                </p>
              )}
            </div>

            {plan ? <PlanPanel plan={plan} /> : null}

            <div className="rounded-2xl border border-line bg-surface-strong p-4 text-sm leading-6 text-muted">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">Coach insights</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Generated from evaluated answers across your sessions.
                  </p>
                </div>
                <span className="rounded-full border border-line bg-background/70 px-2.5 py-1 text-[11px] font-semibold text-muted">
                  {insightCount} signal{insightCount === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-line bg-background/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Next learning move
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-foreground">
                  {nextLearningMove}
                </p>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                    Strengths
                  </p>
                  <InsightTopicChips
                    topics={strengthTopicInsights}
                    tone="strength"
                    empty="No strength topics yet."
                  />
                  <TextInsightChips
                    items={memory.strengths}
                    empty="No qualitative strengths recorded yet."
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
                    Weaknesses
                  </p>
                  <InsightTopicChips
                    topics={weaknessTopicInsights}
                    tone="weakness"
                    empty="No weakness topics yet."
                  />
                  <TextInsightChips
                    items={memory.recurringMistakes}
                    empty="No recurring mistakes recorded yet."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card flex min-h-[70vh] flex-col rounded-[28px] p-4 md:p-6">
        <div className="flex flex-col gap-4 border-b border-line pb-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="panel-label">AI Interview Coach</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
                {phaseLabels[phase]}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                Full-width coaching space. The coach asks one question at a
                time, provides references when useful, and marks roadmap
                progress only when your evaluated answer is interview-ready.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeSession ? (
                <span className="data-chip">Session active</span>
              ) : null}
              <span className="data-chip">
                {deliveryModeDetails[coachMode].label}
              </span>
              {lastAction ? (
                <Link
                  href={lastAction.href || "/study-plan"}
                  className="button-primary-accent"
                >
                  {lastAction.label}
                </Link>
              ) : null}
            </div>
          </div>
          <PhaseProgress phase={phase} />

          <div className="grid gap-3 md:grid-cols-2">
            {(Object.keys(deliveryModeDetails) as CoachDeliveryMode[]).map(
              (mode) => {
                const selected = coachMode === mode;
                const disabled = mode === "voice" && !coachAvailable;
                const details = deliveryModeDetails[mode];
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      if (!disabled) setCoachMode(mode);
                    }}
                    disabled={disabled}
                    className={`rounded-3xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${
                      selected
                        ? "border-primary bg-primary text-white shadow-[0_18px_45px_rgba(20,184,166,0.20)]"
                        : "border-line bg-surface-strong text-foreground hover:border-primary"
                    }`}
                    aria-pressed={selected}
                  >
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                        selected ? "text-white/80" : "text-primary"
                      }`}
                    >
                      {details.label}
                    </span>
                    <span className="mt-2 block text-lg font-extrabold">
                      {details.title}
                    </span>
                    <span
                      className={`mt-2 block text-sm leading-6 ${
                        selected ? "text-white/85" : "text-muted"
                      }`}
                    >
                      {disabled
                        ? signedIn
                          ? "Add OPENAI_API_KEY to enable live voice practice."
                          : "Sign in to start live voice practice."
                        : details.description}
                    </span>
                    <span
                      className={`mt-3 block text-xs font-semibold ${
                        selected ? "text-white/85" : "text-foreground"
                      }`}
                    >
                      {details.signal}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {!signedIn ? (
          <div className="mt-5 rounded-2xl border border-line bg-surface-strong p-4 text-sm leading-6 text-muted">
            <p className="font-semibold text-foreground">
              Sign in to start the coach.
            </p>
            <p className="mt-1">
              You can preview the profile, session, insights, and chat/voice
              surfaces here. Chat and voice require an account because they
              store your transcript, mastery, strengths, weaknesses, and
              roadmap progress.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/sign-in" className="button-primary-accent">
                Sign in
              </Link>
              <Link href="/sign-up" className="button-secondary">
                Create account
              </Link>
            </div>
          </div>
        ) : !openaiConfigured ? (
          <div className="mt-5 rounded-2xl border border-line bg-surface-strong p-4 text-sm leading-6 text-muted">
            Add <code>OPENAI_API_KEY</code> to enable live coaching. Profile
            and UI setup can still be reviewed without the key.
          </div>
        ) : null}

        {coachMode === "voice" && coachAvailable ? (
          <div className="mt-5">
            <AiTutorVoicePanel
              profile={profile}
              sessionId={sessionId}
              onSessionId={(id) => setSessionId(id)}
              onMemory={(m) => setMemory(m)}
              onPlan={(p) => setPlan(p)}
              onPhase={(p) => setPhase(p)}
              onSuggestedAction={(action) => setLastAction(action)}
              onTrackerUpdate={(day, itemId) => markDayCheckLocal(day, itemId)}
              onSessionRefresh={() => void refreshSessions()}
              onClose={() => setCoachMode("chat")}
            />
          </div>
        ) : null}

        {status ? (
          <div className="mt-5 rounded-2xl border border-amber-300/50 bg-amber-50/50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            {status}
          </div>
        ) : null}

        {coachMode === "chat" ? (
        <>
        <div ref={scrollerRef} className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
          {hiddenMessageCount > 0 ? (
            <button
              type="button"
              onClick={() => setShowOlder(true)}
              className="mx-auto block rounded-full border border-line bg-surface-strong px-4 py-2 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground"
            >
              Show {hiddenMessageCount} earlier message
              {hiddenMessageCount === 1 ? "" : "s"}
            </button>
          ) : null}

          {displayMessages.map((message) => {
            const references =
              message.evaluation?.referenceLinks ??
              message.topicRef?.referenceLinks;
            return (
            <article
              key={message.id}
              className={`rounded-3xl border p-4 md:p-5 ${
                message.role === "assistant"
                  ? "max-w-[76rem] border-line bg-surface-strong"
                  : "ml-auto max-w-[min(48rem,88%)] border-primary bg-primary text-white"
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
              {message.role === "assistant" ? (
                <ReferenceLinks links={references} compact />
              ) : null}

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
                  <div className="mt-3">
                    <ReadinessBadge evaluation={message.evaluation} />
                  </div>
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
                  <ReferenceLinks links={message.evaluation.referenceLinks} />
                </div>
              ) : null}

              {message.role === "assistant" && message.toolTrace?.length ? (
                <ToolTracePanel trace={message.toolTrace} />
              ) : null}
            </article>
          );
          })}

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
            disabled={busy || !coachAvailable}
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
            disabled={busy || !coachAvailable}
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
            disabled={busy || !coachAvailable}
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
            disabled={busy || !coachAvailable}
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
            disabled={busy || !coachAvailable}
            onClick={() =>
              void sendMessage(
                "Wrap up the session: summarize what we covered today and what to work on next."
              )
            }
          >
            Wrap up
          </button>
        </div>

        <form onSubmit={submitMessage} className="mt-4 flex flex-col gap-3 md:flex-row">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="field-shell min-h-24 resize-y md:min-h-14"
            placeholder="Type a message — say hi, ask a question, or answer the coach..."
            disabled={busy || !coachAvailable}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                void sendMessage(draft);
              }
            }}
          />
          <button
            type="submit"
            disabled={busy || !draft.trim() || !coachAvailable}
            className="button-primary-accent shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Thinking" : "Send"}
          </button>
        </form>

        <p className="mt-3 text-xs leading-5 text-muted">
          Coach uses your daily plan, focus areas, and memory. The dashboard is
          updated only when the coach records an interview-ready answer for a
          specific roadmap item. Press Cmd/Ctrl + Enter to send.
        </p>
        </>
        ) : (
          <p className="mt-5 text-xs leading-5 text-muted">
            Voice mode uses the same daily plan, question tools, coach insights,
            and tracker rules as chat. Switch back to chat any time if you want
            typed answers, code snippets, or clickable references.
          </p>
        )}
      </section>
    </div>
  );
}
