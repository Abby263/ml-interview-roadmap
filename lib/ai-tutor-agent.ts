// AI Tutor "deep agent" — OpenAI Responses API tool-using loop with
// subagents, retrieval, persisted memory, and reusable skills.
//
// The agent is wired around three idea slots that make a coach feel deep:
//   1. MEMORY  — prior mastery + recurring mistakes are injected into the
//      system prompt every turn (see ai-tutor-prompts.buildSystemInstructions).
//   2. SKILLS  — reusable instruction blocks (interview rubric, scaffolding,
//      socratic followup) live in ai-tutor-prompts and are baked into the
//      system message so the model can lean on them by name.
//   3. SUBAGENTS — focused single-shot model calls with tighter prompts:
//        - delegate_to_concept_teacher
//        - delegate_to_mock_interviewer
//      Surfaced to the main agent as tools so it can decide when to delegate.
//
// Everything related to *what to say* lives in ai-tutor-prompts.ts; this
// file is the orchestration only.

import {
  getAiTutorTopicContext,
  getTopicByItemId,
  getTopicsForDay,
  retrieveDailyPlanContent,
  searchAiTutorQuestions,
  type AiTutorTopicContext,
} from "@/lib/ai-tutor-context";
import {
  getServerProgressDetailed,
  recordAiTutorCheck,
} from "@/app/actions/progress";
import {
  buildSystemInstructions,
  conceptTeacherPrompt,
  mockInterviewerPrompt,
} from "@/lib/ai-tutor-prompts";
import {
  mergeAndSaveAiTutorMemory,
  setAiTutorSessionPhase,
  setAiTutorSessionPlan,
} from "@/lib/ai-tutor-store";
import {
  endRun,
  langsmithEnabled,
  startRun,
} from "@/lib/ai-tutor-tracing";
import {
  type AiTutorEvaluation,
  type AiTutorMemory,
  type AiTutorMemoryPatch,
  type AiTutorNextTopic,
  type AiTutorPhase,
  type AiTutorPlan,
  type AiTutorPlanStatus,
  type AiTutorProfile,
  type AiTutorSuggestedAction,
  type AiTutorToolTrace,
  type AiTutorTurn,
} from "@/lib/ai-tutor-types";

const MAX_TOOL_ITERATIONS = 8;
const REQUEST_TIMEOUT_MS = 45_000;

// Models we trust for the function-calling loop. If AI_TUTOR_MODEL is set
// to something OpenAI rejects (e.g. a model that doesn't exist yet), we
// fall back to the first entry below so the user still gets a coherent reply
// instead of a generic "I couldn't complete the AI Tutor turn" message.
const FALLBACK_MODELS = ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4o"];

interface AgentRunInput {
  userId: string;
  sessionId: string;
  message: string;
  profile: AiTutorProfile;
  memory: AiTutorMemory;
  phase: AiTutorPhase;
  plan?: AiTutorPlan;
  conversation: { role: "user" | "assistant"; content: string }[];
}

interface AgentRunResult extends AiTutorTurn {
  warning?: string;
}

interface AgentScratch {
  evaluation?: AiTutorEvaluation;
  nextTopic?: AiTutorNextTopic;
  suggestedAction?: AiTutorSuggestedAction;
  phase: AiTutorPhase;
  plan?: AiTutorPlan;
  planDirty: boolean;
  memoryPatch: AiTutorMemoryPatch;
  toolTrace: AiTutorToolTrace[];
}

interface OpenAIResponseShape {
  id?: string;
  output?: unknown;
  output_text?: unknown;
  error?: { message?: string; code?: string; type?: string };
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
}

interface FunctionCallItem {
  type: "function_call";
  id?: string;
  call_id: string;
  name: string;
  arguments: string;
}

interface MessageItem {
  type: "message";
  id?: string;
  role: "assistant" | "user" | "system";
  content: { type?: string; text?: string }[];
}

type OutputItem = FunctionCallItem | MessageItem | { type: string };

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function safeJsonParse(text: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(text);
    return asRecord(parsed);
  } catch {
    return {};
  }
}

function topicsToBrief(topics: AiTutorTopicContext[], limit = 4) {
  return topics.slice(0, limit).map((topic) => ({
    day: topic.day,
    tagId: topic.tagId,
    tagLabel: topic.tagLabel,
    topicLabel: topic.topicLabel,
    dayTitle: topic.dayTitle,
    interviewQuestions: topic.interviewQuestions.slice(0, 5),
    href: topic.href,
    itemId: topic.itemId,
  }));
}

function fallbackTurn(
  phase: AiTutorPhase,
  errorMessage: string,
  scratch?: Partial<AgentScratch>
): AgentRunResult {
  return {
    assistantMessage:
      "Hmm, I lost my train of thought there. Mind sending that again? If it keeps happening, the OpenAI service might be having a moment — try once more in a few seconds.",
    evaluation: undefined,
    memoryPatch: scratch?.memoryPatch ?? {
      masteryUpdates: [],
      recurringMistakesAdd: [],
      strengthsAdd: [],
      nextRecommendations: [],
    },
    nextTopic: scratch?.nextTopic,
    suggestedAction: scratch?.suggestedAction,
    phase,
    plan: scratch?.plan,
    toolTrace: scratch?.toolTrace ?? [],
    warning: errorMessage,
  };
}

const tools = [
  {
    type: "function" as const,
    name: "get_roadmap_topic",
    description:
      "Get the daily-plan topic + interview questions for a specific day number. Use to ground a question in the official roadmap.",
    parameters: {
      type: "object" as const,
      properties: {
        day: {
          type: "integer" as const,
          description: "Day number from the 133-day roadmap (1-133).",
        },
      },
      required: ["day"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "search_questions",
    description:
      "Keyword-search the daily plan question bank. Returns up to 8 matching topics with their interview questions. Use when the user asks about a concept and you need to find the right questions.",
    parameters: {
      type: "object" as const,
      properties: {
        query: { type: "string" as const },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "retrieve_daily_plan_content",
    description:
      "Retrieve the FULL daily plan content for a specific day — focus, every track, every item with its interview questions, and external references. Use when planning a teaching arc or when you need richer context than search_questions provides.",
    parameters: {
      type: "object" as const,
      properties: {
        day: { type: "integer" as const },
      },
      required: ["day"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "get_user_mastery",
    description:
      "Read the learner's current mastery scores per tag (e.g. pillar:deep-learning), strengths, and recurring mistakes from memory.",
    parameters: {
      type: "object" as const,
      properties: {},
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "get_user_progress",
    description:
      "List which roadmap items the learner has already checked off, separated by source (manual study vs AI tutor practice).",
    parameters: {
      type: "object" as const,
      properties: {},
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "pick_next_topic",
    description:
      "Suggest the highest-priority next topic to work on. Picks from focus areas first, then low-mastery tags.",
    parameters: {
      type: "object" as const,
      properties: {
        prefer_focus_areas: {
          type: "boolean" as const,
          description: "If true, prioritize the learner's selected focus areas.",
        },
      },
      required: ["prefer_focus_areas"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "set_phase",
    description:
      "Update the conversation phase. warmup → calibration → practice → recap. Call when ready to advance.",
    parameters: {
      type: "object" as const,
      properties: {
        phase: {
          type: "string" as const,
          enum: ["warmup", "calibration", "practice", "recap"],
        },
      },
      required: ["phase"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "delegate_to_concept_teacher",
    description:
      "Delegate a focused teaching task to a specialized concept-teacher subagent. Returns a tight teaching reply you can pass through to the learner. Use when the learner needs an explanation rather than a quiz.",
    parameters: {
      type: "object" as const,
      properties: {
        concept: {
          type: "string" as const,
          description: "The concept to teach, in plain English.",
        },
        level: {
          type: "string" as const,
          description: "Learner's level: beginner, intermediate, advanced, or architect.",
        },
      },
      required: ["concept", "level"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "delegate_to_mock_interviewer",
    description:
      "Delegate to a mock-interviewer subagent that returns one interview-grade question for the role + difficulty. Use sparingly — only in practice phase, when the learner asks for a 'real' interview question.",
    parameters: {
      type: "object" as const,
      properties: {
        role: { type: "string" as const },
        difficulty: {
          type: "string" as const,
          enum: ["basic", "intermediate", "advanced", "system-design"],
        },
      },
      required: ["role", "difficulty"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "write_lesson_plan",
    description:
      "Write or replace the structured lesson plan for this session — a deepagents-style todo list of 2-6 steps. Use after warmup to commit to a concrete arc the learner can see. Each step gets a status of 'planned'.",
    parameters: {
      type: "object" as const,
      properties: {
        goal: {
          type: "string" as const,
          description: "One-sentence goal for the session.",
        },
        steps: {
          type: "array" as const,
          items: {
            type: "object" as const,
            properties: {
              title: { type: "string" as const },
            },
            required: ["title"],
            additionalProperties: false,
          },
          minItems: 2,
          maxItems: 6,
        },
      },
      required: ["goal", "steps"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "update_lesson_plan_step",
    description:
      "Update the status of a single step in the lesson plan. Use 'in_progress' when starting a step, 'done' when the learner has completed it. Add an optional note (e.g. score or summary).",
    parameters: {
      type: "object" as const,
      properties: {
        step_index: {
          type: "integer" as const,
          description: "Zero-based index of the step in the current plan.",
        },
        status: {
          type: "string" as const,
          enum: ["planned", "in_progress", "done"],
        },
        note: { type: "string" as const },
      },
      required: ["step_index", "status"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "record_practice",
    description:
      "Record that the user attempted a question. Updates mastery (+ delta if strong, - if weak), writes a tracker check tagged ai_tutor, and stores evidence. ONLY call after a substantive answer attempt — NEVER for hellos, 'I don't know', or clarifying questions, and NEVER in warmup or recap phase.",
    parameters: {
      type: "object" as const,
      properties: {
        tag_id: { type: "string" as const },
        tag_label: { type: "string" as const },
        day: { type: "integer" as const },
        item_id: {
          type: "string" as const,
          description:
            "The roadmap item id the question maps to (returned by get_roadmap_topic).",
        },
        topic_label: { type: "string" as const },
        score: {
          type: "number" as const,
          description: "0-100 score for this attempt.",
        },
        score_delta: {
          type: "number" as const,
          description:
            "How much to move the running mastery score, -30 to +30. Negative for weak attempts.",
        },
        summary: { type: "string" as const },
        strengths: { type: "array" as const, items: { type: "string" as const } },
        gaps: { type: "array" as const, items: { type: "string" as const } },
        rubric: { type: "array" as const, items: { type: "string" as const } },
      },
      required: [
        "tag_id",
        "tag_label",
        "day",
        "topic_label",
        "score",
        "score_delta",
        "summary",
      ],
      additionalProperties: false,
    },
  },
] as const;

async function callOpenAI(
  body: Record<string, unknown>,
  apiKey: string,
  parentRunId?: string,
  label = "openai.responses"
): Promise<{ data: OpenAIResponseShape; modelUsed: string }> {
  const requestedModel = String(body.model ?? "gpt-4o-mini");
  // Try requested model first, then fall back through FALLBACK_MODELS on
  // 4xx errors that look like "model not found" / "invalid model".
  const candidates = [
    requestedModel,
    ...FALLBACK_MODELS.filter((m) => m !== requestedModel),
  ];

  let lastError: string | undefined;

  for (const model of candidates) {
    const attemptBody = { ...body, model };
    // Two attempts on transient 5xx / network for each candidate.
    for (let attempt = 0; attempt < 2; attempt++) {
      const llmRun = startRun({
        name: `${label}.${model}.attempt${attempt}`,
        runType: "llm",
        inputs: { model, attempt },
        parentRunId,
      });
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS
      );
      try {
        const response = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attemptBody),
          signal: controller.signal,
        });
        const data = (await response.json().catch(() => ({}))) as OpenAIResponseShape;
        if (response.ok) {
          await endRun(llmRun, {
            usage: data.usage ?? {},
            model,
          });
          return { data, modelUsed: model };
        }
        lastError = data.error?.message || `OpenAI ${response.status}`;
        await endRun(llmRun, { status: response.status }, lastError);
        // 4xx with model-related code → don't retry this model, try the next.
        if (response.status < 500) {
          const errorMsg = (data.error?.message || "").toLowerCase();
          const errorCode = (data.error?.code || "").toLowerCase();
          const isModelError =
            errorCode === "model_not_found" ||
            errorCode === "invalid_model" ||
            errorMsg.includes("model") ||
            errorMsg.includes("does not exist");
          if (isModelError) break; // try next candidate
          // Other 4xx — don't retry, throw.
          throw new Error(lastError);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        lastError = msg;
        await endRun(llmRun, {}, msg);
      } finally {
        clearTimeout(timeoutId);
      }
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  throw new Error(lastError ?? "OpenAI request failed.");
}

// ── Subagents ─────────────────────────────────────────────────────────────

async function runConceptTeacher(
  concept: string,
  level: string,
  apiKey: string,
  model: string,
  parentRunId?: string
): Promise<string> {
  const { data } = await callOpenAI(
    {
      model,
      instructions: conceptTeacherPrompt(concept, level),
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: `Teach: ${concept}` }],
        },
      ],
      temperature: 0.5,
    },
    apiKey,
    parentRunId,
    "subagent.concept_teacher"
  );
  return extractAssistantText(
    Array.isArray(data.output) ? (data.output as OutputItem[]) : []
  ) || (typeof data.output_text === "string" ? data.output_text : "");
}

async function runMockInterviewer(
  role: string,
  difficulty: string,
  apiKey: string,
  model: string,
  parentRunId?: string
): Promise<string> {
  const { data } = await callOpenAI(
    {
      model,
      instructions: mockInterviewerPrompt(role, difficulty),
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: "Ask one question." }],
        },
      ],
      temperature: 0.7,
    },
    apiKey,
    parentRunId,
    "subagent.mock_interviewer"
  );
  return extractAssistantText(
    Array.isArray(data.output) ? (data.output as OutputItem[]) : []
  ) || (typeof data.output_text === "string" ? data.output_text : "");
}

// ── Tool execution ────────────────────────────────────────────────────────

async function executeTool(
  name: string,
  args: Record<string, unknown>,
  input: AgentRunInput,
  scratch: AgentScratch,
  apiKey: string,
  model: string,
  parentRunId?: string
): Promise<{ output: unknown; preview: string }> {
  switch (name) {
    case "get_roadmap_topic": {
      const day = Number(args.day ?? 0);
      const topics = getTopicsForDay(day);
      const preview =
        topics.length > 0
          ? `Day ${day}: ${topics[0].dayTitle}`
          : `Day ${day}: no entries.`;
      return { output: { day, topics: topicsToBrief(topics, 6) }, preview };
    }
    case "search_questions": {
      const query = String(args.query ?? "");
      const matches = searchAiTutorQuestions(query);
      const preview = `Found ${matches.length} topic(s) for "${query}".`;
      return {
        output: { query, matches: topicsToBrief(matches, 6) },
        preview,
      };
    }
    case "retrieve_daily_plan_content": {
      const day = Number(args.day ?? 0);
      const content = retrieveDailyPlanContent(day);
      return {
        output: content
          ? content
          : { day, error: `No daily plan content for day ${day}.` },
        preview: content
          ? `Retrieved Day ${day}: ${content.title}`
          : `No content for Day ${day}`,
      };
    }
    case "get_user_mastery": {
      const mastery = Object.entries(input.memory.mastery).map(
        ([tagId, value]) => ({
          tagId,
          tagLabel: value.tagLabel,
          score: value.score,
          confidence: value.confidence,
        })
      );
      return {
        output: {
          focusAreas: input.profile.weakTags,
          mastery,
          strengths: input.memory.strengths,
          recurringMistakes: input.memory.recurringMistakes,
        },
        preview: `Returned mastery for ${mastery.length} tag(s).`,
      };
    }
    case "get_user_progress": {
      const rows = await getServerProgressDetailed(input.userId);
      const byDay = new Map<number, { manual: string[]; ai_tutor: string[] }>();
      for (const row of rows) {
        const bucket = byDay.get(row.day) ?? { manual: [], ai_tutor: [] };
        bucket[row.source].push(row.itemId);
        byDay.set(row.day, bucket);
      }
      const days = Array.from(byDay.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([day, bucket]) => ({
          day,
          manualItemCount: bucket.manual.length,
          aiTutorItemCount: bucket.ai_tutor.length,
        }));
      return {
        output: { totalChecks: rows.length, days },
        preview: `Pulled ${rows.length} progress check(s).`,
      };
    }
    case "pick_next_topic": {
      const preferFocus = Boolean(args.prefer_focus_areas);
      const ranked = getAiTutorTopicContext(
        input.profile,
        input.memory,
        preferFocus ? 4 : 6
      );
      const pick = ranked[0];
      if (pick) {
        scratch.nextTopic = {
          tagId: pick.tagId,
          tagLabel: pick.tagLabel,
          day: pick.day,
          topicLabel: pick.topicLabel,
          reason: preferFocus
            ? "Selected from your focus areas"
            : "Lowest-mastery topic on the roadmap",
        };
        scratch.suggestedAction = pick.day
          ? { label: `Open Day ${pick.day}`, href: `/day/${pick.day}` }
          : { label: "Open study plan", href: "/study-plan" };
      }
      return {
        output: { suggestion: pick, alternatives: topicsToBrief(ranked.slice(1), 3) },
        preview: pick
          ? `Next: Day ${pick.day} — ${pick.topicLabel}`
          : "No suggestion.",
      };
    }
    case "set_phase": {
      const next = String(args.phase ?? "");
      const valid = ["warmup", "calibration", "practice", "recap"];
      if (!valid.includes(next)) {
        return {
          output: { ok: false, reason: "invalid phase" },
          preview: `Rejected phase: ${next}`,
        };
      }
      scratch.phase = next as AiTutorPhase;
      void setAiTutorSessionPhase(input.sessionId, scratch.phase);
      return { output: { ok: true, phase: scratch.phase }, preview: `Phase → ${scratch.phase}` };
    }
    case "delegate_to_concept_teacher": {
      const concept = String(args.concept ?? "");
      const level = String(args.level ?? input.profile.currentLevel);
      const reply = await runConceptTeacher(
        concept,
        level,
        apiKey,
        model,
        parentRunId
      );
      return {
        output: { teaching_reply: reply },
        preview: `Concept teacher: "${concept}"`,
      };
    }
    case "delegate_to_mock_interviewer": {
      const role = String(args.role ?? input.profile.targetRole);
      const difficulty = String(args.difficulty ?? "intermediate");
      const reply = await runMockInterviewer(
        role,
        difficulty,
        apiKey,
        model,
        parentRunId
      );
      return {
        output: { question: reply },
        preview: `Mock interviewer: ${difficulty} ${role}`,
      };
    }
    case "write_lesson_plan": {
      const goal = String(args.goal ?? "Session plan");
      const stepsRaw = Array.isArray(args.steps) ? args.steps : [];
      const steps = stepsRaw
        .map((step) => {
          const stepRecord = asRecord(step);
          const title =
            typeof stepRecord.title === "string" ? stepRecord.title.trim() : "";
          if (!title) return null;
          return {
            id:
              globalThis.crypto?.randomUUID?.() ??
              `step-${Math.random().toString(36).slice(2)}`,
            title: title.slice(0, 200),
            status: "planned" as AiTutorPlanStatus,
          };
        })
        .filter(
          (step): step is { id: string; title: string; status: AiTutorPlanStatus } =>
            Boolean(step)
        );

      if (steps.length === 0) {
        return {
          output: { ok: false, reason: "No valid steps." },
          preview: "Plan rejected (empty)",
        };
      }

      scratch.plan = {
        goal: goal.slice(0, 240),
        steps,
        updatedAt: new Date().toISOString(),
      };
      scratch.planDirty = true;
      return {
        output: { ok: true, stepCount: steps.length },
        preview: `Wrote plan: ${steps.length} step(s)`,
      };
    }
    case "update_lesson_plan_step": {
      if (!scratch.plan) {
        return {
          output: { ok: false, reason: "No plan exists. Call write_lesson_plan first." },
          preview: "Plan update rejected (no plan)",
        };
      }
      const stepIndex = Math.round(Number(args.step_index ?? -1));
      if (stepIndex < 0 || stepIndex >= scratch.plan.steps.length) {
        return {
          output: { ok: false, reason: "step_index out of range." },
          preview: `Plan update rejected (index ${stepIndex})`,
        };
      }
      const status = String(args.status ?? "planned") as AiTutorPlanStatus;
      const note = typeof args.note === "string" ? args.note : undefined;
      const updatedSteps = scratch.plan.steps.map((step, idx) =>
        idx === stepIndex
          ? { ...step, status, note: note ?? step.note }
          : step
      );
      scratch.plan = {
        ...scratch.plan,
        steps: updatedSteps,
        updatedAt: new Date().toISOString(),
      };
      scratch.planDirty = true;
      return {
        output: { ok: true, step_index: stepIndex, status },
        preview: `Step ${stepIndex + 1} → ${status}`,
      };
    }
    case "record_practice": {
      const tagId = String(args.tag_id ?? "");
      const tagLabel = String(args.tag_label ?? tagId);
      const day = Math.max(0, Math.round(Number(args.day ?? 0)));
      const itemId = typeof args.item_id === "string" ? args.item_id : undefined;
      const topicLabel = String(args.topic_label ?? "");
      const score = Math.max(0, Math.min(100, Number(args.score ?? 0)));
      const scoreDelta = Math.max(-30, Math.min(30, Number(args.score_delta ?? 0)));
      const summary = String(args.summary ?? "");
      const strengths = Array.isArray(args.strengths)
        ? (args.strengths as unknown[]).filter(
            (s): s is string => typeof s === "string"
          )
        : [];
      const gaps = Array.isArray(args.gaps)
        ? (args.gaps as unknown[]).filter(
            (s): s is string => typeof s === "string"
          )
        : [];
      const rubric = Array.isArray(args.rubric)
        ? (args.rubric as unknown[]).filter(
            (s): s is string => typeof s === "string"
          )
        : [];

      // Don't record practice in warmup or recap — phases where grading is
      // policy-disallowed. Catches model mistakes that the system prompt
      // tries to prevent.
      if (scratch.phase === "warmup" || scratch.phase === "recap") {
        return {
          output: {
            ok: false,
            reason: `Cannot record_practice in phase '${scratch.phase}'.`,
          },
          preview: `Skipped record_practice (phase: ${scratch.phase})`,
        };
      }

      scratch.evaluation = {
        score,
        summary,
        strengths,
        gaps,
        rubric,
      };
      scratch.memoryPatch.masteryUpdates.push({
        tagId,
        tagLabel,
        scoreDelta,
        evidence: summary.slice(0, 240),
      });
      for (const gap of gaps.slice(0, 2)) {
        if (!scratch.memoryPatch.recurringMistakesAdd.includes(gap)) {
          scratch.memoryPatch.recurringMistakesAdd.push(gap);
        }
      }
      for (const strength of strengths.slice(0, 2)) {
        if (!scratch.memoryPatch.strengthsAdd.includes(strength)) {
          scratch.memoryPatch.strengthsAdd.push(strength);
        }
      }

      if (day && itemId) {
        scratch.nextTopic = {
          tagId,
          tagLabel,
          day,
          topicLabel,
          reason: "You just practiced this topic",
        };
        // Resolve canonical item id via roadmap so we don't write rows that
        // don't match anything on the dashboard.
        const known = getTopicByItemId(day, itemId);
        if (known) {
          await recordAiTutorCheck(input.userId, day, itemId);
          scratch.suggestedAction = {
            label: `Open Day ${day}`,
            href: `/day/${day}`,
          };
        }
      }

      return {
        output: { ok: true, score, score_delta: scoreDelta },
        preview: `Recorded ${tagLabel} (${score}/100, Δ${scoreDelta})`,
      };
    }
    default:
      return {
        output: { error: `Unknown tool: ${name}` },
        preview: `Unknown tool: ${name}`,
      };
  }
}

function extractAssistantText(output: OutputItem[]): string {
  const messages: string[] = [];
  for (const item of output) {
    if (
      item.type === "message" &&
      "content" in item &&
      Array.isArray((item as MessageItem).content)
    ) {
      for (const part of (item as MessageItem).content) {
        if (typeof part?.text === "string" && part.text.trim()) {
          messages.push(part.text);
        }
      }
    }
  }
  return messages.join("\n").trim();
}

function extractFunctionCalls(output: OutputItem[]): FunctionCallItem[] {
  return output.filter(
    (item): item is FunctionCallItem => item.type === "function_call"
  );
}

export async function runAiTutorAgent(
  input: AgentRunInput
): Promise<AgentRunResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallbackTurn(input.phase, "OPENAI_API_KEY is not configured.");
  }
  const requestedModel = process.env.AI_TUTOR_MODEL || "gpt-4o-mini";

  const scratch: AgentScratch = {
    phase: input.phase,
    plan: input.plan,
    planDirty: false,
    memoryPatch: {
      masteryUpdates: [],
      recurringMistakesAdd: [],
      strengthsAdd: [],
      nextRecommendations: [],
    },
    toolTrace: [],
  };

  const instructions = buildSystemInstructions(
    input.profile,
    input.memory,
    input.phase
  );

  // Build the running input list ourselves (don't rely on previous_response_id)
  // so a single failed iteration doesn't poison the whole session.
  const inputItems: Record<string, unknown>[] = [];

  // Prior conversation context — last 8 messages so the model has continuity.
  for (const turn of input.conversation.slice(-8)) {
    inputItems.push({
      role: turn.role,
      content: [
        {
          type: turn.role === "assistant" ? "output_text" : "input_text",
          text: turn.content,
        },
      ],
    });
  }
  inputItems.push({
    role: "user",
    content: [{ type: "input_text", text: input.message }],
  });

  const parentRun = startRun({
    name: "ai-tutor.turn",
    runType: "chain",
    inputs: {
      message: input.message,
      phase: input.phase,
      profile: {
        targetRole: input.profile.targetRole,
        currentLevel: input.profile.currentLevel,
        interviewDate: input.profile.interviewDate,
        weakTags: input.profile.weakTags,
      },
      langsmithEnabled,
    },
    metadata: {
      userId: input.userId,
      sessionId: input.sessionId,
      requestedModel,
    },
  });

  let assistantText = "";
  let lastError: string | undefined;
  let modelUsed = requestedModel;

  try {
    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      let data: OpenAIResponseShape;
      try {
        const result = await callOpenAI(
          {
            model: requestedModel,
            instructions,
            input: inputItems,
            tools,
            tool_choice: "auto",
            temperature: 0.6,
          },
          apiKey,
          parentRun.id ?? undefined,
          `agent.iter${iteration}`
        );
        data = result.data;
        modelUsed = result.modelUsed;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        lastError = msg;
        break;
      }

      const output = (Array.isArray(data.output) ? data.output : []) as OutputItem[];
      const calls = extractFunctionCalls(output);

      if (calls.length === 0) {
        assistantText =
          extractAssistantText(output) ||
          (typeof data.output_text === "string" ? data.output_text : "");
        break;
      }

      // Append the assistant's function-call items to the running input so the
      // model sees its own decision and the matching outputs.
      for (const call of calls) {
        inputItems.push({
          type: "function_call",
          call_id: call.call_id,
          name: call.name,
          arguments: call.arguments,
        });
      }

      for (const call of calls) {
        const toolRun = startRun({
          name: `tool.${call.name}`,
          runType: "tool",
          inputs: { args: call.arguments },
          parentRunId: parentRun.id ?? undefined,
        });
        const args = safeJsonParse(call.arguments);
        let result: { output: unknown; preview: string };
        try {
          result = await executeTool(
            call.name,
            args,
            input,
            scratch,
            apiKey,
            modelUsed,
            parentRun.id ?? undefined
          );
          scratch.toolTrace.push({
            name: call.name,
            args,
            ok: true,
            preview: result.preview,
          });
          await endRun(toolRun, { preview: result.preview });
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          result = { output: { error: msg }, preview: msg };
          scratch.toolTrace.push({
            name: call.name,
            args,
            ok: false,
            preview: msg,
          });
          await endRun(toolRun, {}, msg);
        }
        inputItems.push({
          type: "function_call_output",
          call_id: call.call_id,
          output: JSON.stringify(result.output).slice(0, 6000),
        });
      }
    }
  } finally {
    await endRun(parentRun, {
      assistantTextLength: assistantText.length,
      toolCalls: scratch.toolTrace.length,
      phase: scratch.phase,
      hasEvaluation: Boolean(scratch.evaluation),
      modelUsed,
    });
  }

  if (!assistantText) {
    return fallbackTurn(
      scratch.phase,
      lastError ?? "Agent loop ended without a final reply.",
      scratch
    );
  }

  // Persist mastery / strengths / recurring mistakes from this turn.
  if (
    scratch.memoryPatch.masteryUpdates.length > 0 ||
    scratch.memoryPatch.strengthsAdd.length > 0 ||
    scratch.memoryPatch.recurringMistakesAdd.length > 0
  ) {
    await mergeAndSaveAiTutorMemory(
      input.userId,
      input.memory,
      scratch.memoryPatch
    );
  }

  // Persist the lesson plan if the agent wrote or modified it.
  if (scratch.planDirty && scratch.plan) {
    await setAiTutorSessionPlan(input.sessionId, scratch.plan);
  }

  // Surface the actual model used so we can flag it in the UI when fallback
  // kicked in (helps with debugging unfamiliar AI_TUTOR_MODEL values).
  const modelWarning =
    modelUsed !== requestedModel
      ? `Requested model "${requestedModel}" was not available — fell back to ${modelUsed}.`
      : undefined;

  return {
    assistantMessage: assistantText.slice(0, 6000),
    evaluation: scratch.evaluation,
    memoryPatch: scratch.memoryPatch,
    nextTopic: scratch.nextTopic,
    suggestedAction: scratch.suggestedAction,
    phase: scratch.phase,
    plan: scratch.plan,
    toolTrace: scratch.toolTrace,
    warning: modelWarning ?? lastError,
  };
}
