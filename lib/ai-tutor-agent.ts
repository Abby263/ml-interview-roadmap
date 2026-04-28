// AI Tutor agent loop — OpenAI Responses API with function-calling tools.
//
// Why a real loop instead of one structured-output call:
//   - Lets the agent fetch only the topics it actually needs, on-demand.
//   - Lets the agent record practice (mastery + tracker check) when, and
//     only when, the user gave a real attempt — not on every "hi".
//   - Cleans up the conversational tone, since we no longer force a JSON
//     schema with a mandatory "evaluation" field on every reply.
//
// The tools are the agent's "deep agent" surface:
//   - get_roadmap_topic(day)
//   - search_questions(query)
//   - get_user_mastery()
//   - get_user_progress()
//   - record_practice(...)
//   - set_phase(phase)
//   - pick_next_topic(prefer_focus_areas)
//
// State changes (mastery, progress, phase) happen as side effects in the
// tool implementations so we don't have to re-derive them from a
// post-hoc JSON blob.

import {
  getAiTutorTopicContext,
  getTopicByItemId,
  getTopicsForDay,
  searchAiTutorQuestions,
  type AiTutorTopicContext,
} from "@/lib/ai-tutor-context";
import { recordAiTutorCheck } from "@/app/actions/progress";
import { getServerProgressDetailed } from "@/app/actions/progress";
import {
  mergeAndSaveAiTutorMemory,
  setAiTutorSessionPhase,
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
  type AiTutorProfile,
  type AiTutorSuggestedAction,
  type AiTutorToolTrace,
  type AiTutorTurn,
} from "@/lib/ai-tutor-types";

const MAX_TOOL_ITERATIONS = 8;
const REQUEST_TIMEOUT_MS = 45_000;

interface AgentRunInput {
  userId: string;
  sessionId: string;
  message: string;
  profile: AiTutorProfile;
  memory: AiTutorMemory;
  phase: AiTutorPhase;
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
  memoryPatch: AiTutorMemoryPatch;
  toolTrace: AiTutorToolTrace[];
}

interface OpenAIResponseShape {
  id?: string;
  output?: unknown;
  output_text?: unknown;
  error?: { message?: string };
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

function buildSystemInstructions(profile: AiTutorProfile, phase: AiTutorPhase) {
  const interviewBlock = profile.interviewDate
    ? `Interview date: ${profile.interviewDate}. Pace and topic choice should reflect how close it is.`
    : `Interview date: not set. Encourage the learner to set one when natural.`;

  return [
    "You are Maya, an experienced ML engineer who is now this learner's interview coach.",
    "Your voice is warm, sharp, and concrete — like a senior teammate who has prepped many candidates.",
    "Always acknowledge what the learner just said before redirecting. Never drop them into a hard question cold.",
    "Match difficulty to where they are. If they say 'I don't know' or sound uncertain, scaffold — back up to the closest concept they DO know and build forward from there. Never grade them for not knowing.",
    "Ladder difficulty: basic → applied → trade-offs → system-design. Don't jump levels in one turn.",
    "Stay conversational. Replies under 6 sentences unless you're teaching a concept; then up to ~10. Plain English.",
    "",
    `Learner profile — target role: ${profile.targetRole}, self-rated level: ${profile.currentLevel}, daily hours: ${profile.dailyHours}, mode: ${profile.preferredMode}.`,
    interviewBlock,
    "",
    "PHASE GUIDANCE:",
    "- warmup: just chat. Learn their target role, comfort level, what they want to focus on. NO grading. Two or three turns max.",
    "- calibration: ask a couple of broad questions across pillars to find their level. Light scoring only when they actually attempt.",
    "- practice: real interview-style quizzing on a chosen topic, with full evaluations after substantive attempts.",
    "- recap: summarize what we covered today, what's next, congratulate. NO grading.",
    `Current phase: ${phase}.`,
    "",
    "TOOL USAGE:",
    "- Call get_roadmap_topic(day) or search_questions(query) to ground questions in the daily plan.",
    "- Only call record_practice AFTER the user gave a substantive attempt at a question. Don't grade hellos, 'I don't know', or follow-up questions.",
    "- Call set_phase when transitioning (warmup → calibration → practice → recap). Don't stay in warmup forever; once you have role + comfort + a focus area, advance.",
    "- Call pick_next_topic when you need to choose what to teach or quiz next.",
    "",
    "RESPONSE: After your tool calls, write a single conversational reply to the learner. No JSON, no headers, no bullet lists unless teaching. Talk like a person.",
  ].join("\n");
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
    name: "get_user_mastery",
    description:
      "Read the learner's current mastery scores per tag (e.g. pillar:deep-learning). Useful before deciding what to quiz.",
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
      "List which roadmap items the learner has already checked off (manual study or AI tutor practice).",
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
    name: "record_practice",
    description:
      "Record that the user attempted a question. Updates mastery (+ delta if strong, - if weak), writes a tracker check tagged ai_tutor, and stores evidence. ONLY call after a substantive answer attempt — NEVER for hellos, 'I don't know', or clarifying questions.",
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

async function executeTool(
  name: string,
  args: Record<string, unknown>,
  input: AgentRunInput,
  scratch: AgentScratch
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

async function callOpenAI(
  body: Record<string, unknown>,
  apiKey: string
): Promise<OpenAIResponseShape> {
  // Two attempts on transient 5xx — OpenAI Responses occasionally returns
  // 502/503 even on healthy projects.
  let lastError: string | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
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
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => ({}))) as OpenAIResponseShape;
      if (response.ok) return data;
      lastError = data.error?.message || `OpenAI ${response.status}`;
      // Don't retry 4xx — those are our fault, won't get better.
      if (response.status < 500) {
        throw new Error(lastError);
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    } finally {
      clearTimeout(timeoutId);
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  throw new Error(lastError ?? "OpenAI request failed.");
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
  const model = process.env.AI_TUTOR_MODEL || "gpt-4o-mini";

  const scratch: AgentScratch = {
    phase: input.phase,
    memoryPatch: {
      masteryUpdates: [],
      recurringMistakesAdd: [],
      strengthsAdd: [],
      nextRecommendations: [],
    },
    toolTrace: [],
  };

  const instructions = buildSystemInstructions(input.profile, input.phase);

  // Build the running input list ourselves (don't rely on previous_response_id)
  // so a single failed iteration doesn't poison the whole session.
  const inputItems: Record<string, unknown>[] = [];

  // Prior conversation context (last few messages so the model has continuity).
  for (const turn of input.conversation.slice(-8)) {
    inputItems.push({
      role: turn.role,
      content: [{ type: "input_text", text: turn.content }],
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
    metadata: { userId: input.userId, sessionId: input.sessionId, model },
  });

  let assistantText = "";
  let lastError: string | undefined;

  try {
    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const llmRun = startRun({
        name: `openai.responses.${iteration}`,
        runType: "llm",
        inputs: { iteration, items: inputItems.length },
        metadata: { model, phase: scratch.phase },
        parentRunId: parentRun.id ?? undefined,
      });

      let data: OpenAIResponseShape;
      try {
        data = await callOpenAI(
          {
            model,
            instructions,
            input: inputItems,
            tools,
            tool_choice: "auto",
            temperature: 0.6,
          },
          apiKey
        );
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        await endRun(llmRun, {}, msg);
        lastError = msg;
        break;
      }
      await endRun(llmRun, {
        usage: data.usage ?? {},
        outputCount: Array.isArray(data.output) ? data.output.length : 0,
      });

      const output = (Array.isArray(data.output) ? data.output : []) as OutputItem[];
      const calls = extractFunctionCalls(output);

      if (calls.length === 0) {
        assistantText = extractAssistantText(output) || (typeof data.output_text === "string" ? data.output_text : "");
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
          result = await executeTool(call.name, args, input, scratch);
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

  return {
    assistantMessage: assistantText.slice(0, 6000),
    evaluation: scratch.evaluation,
    memoryPatch: scratch.memoryPatch,
    nextTopic: scratch.nextTopic,
    suggestedAction: scratch.suggestedAction,
    phase: scratch.phase,
    toolTrace: scratch.toolTrace,
    warning: lastError,
  };
}
