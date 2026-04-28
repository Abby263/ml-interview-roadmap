import { NextResponse } from "next/server";

import { getSignedInUserId } from "@/lib/auth";
import { getAiTutorTopicContext } from "@/lib/ai-tutor-context";
import {
  appendAiTutorMessage,
  consumeAiTutorUsage,
  createAiTutorSession,
  getAiTutorMemory,
  mergeAndSaveAiTutorMemory,
  saveAiTutorProfile,
} from "@/lib/ai-tutor-store";
import {
  defaultAiTutorMemory,
  emptyAiTutorEvaluation,
  normalizeAiTutorProfile,
  type AiTutorEvaluation,
  type AiTutorMemoryPatch,
  type AiTutorNextTopic,
  type AiTutorSuggestedAction,
  type AiTutorTurn,
} from "@/lib/ai-tutor-types";
import { aiTutorOpenAIEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

interface TutorRequestBody {
  message?: unknown;
  profile?: unknown;
  sessionId?: unknown;
}

interface OpenAIResponseShape {
  output_text?: unknown;
  output?: unknown;
  error?: { message?: string };
}

const turnSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "assistantMessage",
    "evaluation",
    "memoryPatch",
    "nextTopic",
    "suggestedAction",
  ],
  properties: {
    assistantMessage: { type: "string" },
    evaluation: {
      type: "object",
      additionalProperties: false,
      required: ["score", "summary", "strengths", "gaps", "rubric"],
      properties: {
        score: { type: "number", minimum: 0, maximum: 100 },
        summary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        gaps: { type: "array", items: { type: "string" } },
        rubric: { type: "array", items: { type: "string" } },
      },
    },
    memoryPatch: {
      type: "object",
      additionalProperties: false,
      required: [
        "masteryUpdates",
        "recurringMistakesAdd",
        "strengthsAdd",
        "nextRecommendations",
      ],
      properties: {
        masteryUpdates: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["tagId", "tagLabel", "scoreDelta", "evidence"],
            properties: {
              tagId: { type: "string" },
              tagLabel: { type: "string" },
              scoreDelta: { type: "number", minimum: -30, maximum: 30 },
              evidence: { type: "string" },
            },
          },
        },
        recurringMistakesAdd: { type: "array", items: { type: "string" } },
        strengthsAdd: { type: "array", items: { type: "string" } },
        nextRecommendations: { type: "array", items: { type: "string" } },
      },
    },
    nextTopic: {
      type: "object",
      additionalProperties: false,
      required: ["tagId", "tagLabel", "day", "topicLabel", "reason"],
      properties: {
        tagId: { type: "string" },
        tagLabel: { type: "string" },
        day: { type: "integer", minimum: 0 },
        topicLabel: { type: "string" },
        reason: { type: "string" },
      },
    },
    suggestedAction: {
      type: "object",
      additionalProperties: false,
      required: ["label", "href"],
      properties: {
        label: { type: "string" },
        href: { type: "string" },
      },
    },
  },
} as const;

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeEvaluation(input: unknown): AiTutorEvaluation {
  const record = asRecord(input);
  return {
    score: Math.max(0, Math.min(100, asNumber(record.score, 0))),
    summary: asString(record.summary, "No summary returned."),
    strengths: asStringArray(record.strengths).slice(0, 5),
    gaps: asStringArray(record.gaps).slice(0, 5),
    rubric: asStringArray(record.rubric).slice(0, 6),
  };
}

function normalizeMemoryPatch(input: unknown): AiTutorMemoryPatch {
  const record = asRecord(input);
  const updates = Array.isArray(record.masteryUpdates)
    ? record.masteryUpdates.map((item) => {
        const update = asRecord(item);
        return {
          tagId: asString(update.tagId),
          tagLabel: asString(update.tagLabel),
          scoreDelta: Math.max(-30, Math.min(30, asNumber(update.scoreDelta, 0))),
          evidence: asString(update.evidence),
        };
      })
    : [];

  return {
    masteryUpdates: updates.filter((update) => update.tagId).slice(0, 4),
    recurringMistakesAdd: asStringArray(record.recurringMistakesAdd).slice(0, 4),
    strengthsAdd: asStringArray(record.strengthsAdd).slice(0, 4),
    nextRecommendations: asStringArray(record.nextRecommendations).slice(0, 6),
  };
}

function normalizeNextTopic(input: unknown): AiTutorNextTopic {
  const record = asRecord(input);
  return {
    tagId: asString(record.tagId),
    tagLabel: asString(record.tagLabel),
    day: Math.max(0, Math.round(asNumber(record.day, 0))),
    topicLabel: asString(record.topicLabel),
    reason: asString(record.reason),
  };
}

function normalizeSuggestedAction(input: unknown): AiTutorSuggestedAction {
  const record = asRecord(input);
  return {
    label: asString(record.label, "Open study plan"),
    href: asString(record.href, "/study-plan") || "/study-plan",
  };
}

function normalizeTurn(input: unknown): AiTutorTurn {
  const record = asRecord(input);
  return {
    assistantMessage: asString(
      record.assistantMessage,
      "I could not format the tutor response. Try answering again with more detail."
    ),
    evaluation: normalizeEvaluation(record.evaluation),
    memoryPatch: normalizeMemoryPatch(record.memoryPatch),
    nextTopic: normalizeNextTopic(record.nextTopic),
    suggestedAction: normalizeSuggestedAction(record.suggestedAction),
  };
}

function extractOutputText(data: OpenAIResponseShape): string {
  if (typeof data.output_text === "string") return data.output_text;

  const output = Array.isArray(data.output) ? data.output : [];
  const chunks: string[] = [];
  for (const item of output) {
    const itemRecord = asRecord(item);
    const content = Array.isArray(itemRecord.content) ? itemRecord.content : [];
    for (const part of content) {
      const partRecord = asRecord(part);
      const text = asString(partRecord.text);
      if (text) chunks.push(text);
    }
  }
  return chunks.join("\n").trim();
}

function fallbackTurn(errorMessage: string): AiTutorTurn {
  return {
    assistantMessage:
      "I could not complete the AI Tutor turn. Check the OpenAI configuration and try again.",
    evaluation: {
      ...emptyAiTutorEvaluation(),
      summary: errorMessage,
    },
    memoryPatch: {
      masteryUpdates: [],
      recurringMistakesAdd: [],
      strengthsAdd: [],
      nextRecommendations: ["Retry the tutor session after fixing configuration."],
    },
    nextTopic: {
      tagId: "",
      tagLabel: "",
      day: 0,
      topicLabel: "",
      reason: "",
    },
    suggestedAction: {
      label: "Open study plan",
      href: "/study-plan",
    },
  };
}

async function callOpenAITutor(input: {
  message: string;
  profile: ReturnType<typeof normalizeAiTutorProfile>;
  memory: typeof defaultAiTutorMemory;
  topics: ReturnType<typeof getAiTutorTopicContext>;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const model = process.env.AI_TUTOR_MODEL || "gpt-4.1-mini";
  const instructions = [
    "You are AI Tutor Deep Agent for ML Interview Roadmap.",
    "Coach the learner for ML, deep learning, MLOps, GenAI, LLMOps, ML system design, and DSA interviews.",
    "Use the supplied daily-plan topics as the source of truth.",
    "Run a guided interview: ask one focused question at a time, evaluate the user's answer, teach the missing concept, and choose the next best topic.",
    "Be direct, practical, and interview-shaped. Do not dump long lectures.",
    "Return only JSON that matches the schema.",
  ].join(" ");

  const prompt = JSON.stringify(
    {
      learnerProfile: input.profile,
      memory: input.memory,
      relevantRoadmapTopics: input.topics,
      userMessage: input.message,
      responseRules: [
        "If the user asks to start, ask the first assessment question and explain what you are testing.",
        "If the user answered a prior question, score it and give concrete fixes.",
        "Use scoreDelta to update mastery: negative for weak answers, positive for strong answers.",
        "Set suggestedAction.href to /day/{day} when a matching day is available.",
      ],
    },
    null,
    2
  );

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions,
      input: prompt,
      temperature: 0.35,
      text: {
        format: {
          type: "json_schema",
          name: "ai_tutor_turn",
          strict: true,
          schema: turnSchema,
        },
      },
    }),
  });

  const data = (await response.json().catch(() => ({}))) as OpenAIResponseShape;
  if (!response.ok) {
    throw new Error(
      data.error?.message || `OpenAI request failed with ${response.status}.`
    );
  }

  const outputText = extractOutputText(data);
  if (!outputText) throw new Error("OpenAI returned an empty tutor response.");

  return normalizeTurn(JSON.parse(outputText) as unknown);
}

export async function POST(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (!aiTutorOpenAIEnabled) {
    return NextResponse.json(
      { error: "AI Tutor is not configured. Add OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as TutorRequestBody;
  const message = asString(body.message).slice(0, 5000);
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const profile = normalizeAiTutorProfile(body.profile);
  const profileResult = await saveAiTutorProfile(userId, profile);
  const usage = await consumeAiTutorUsage(
    userId,
    Math.ceil(message.length / 4)
  );
  if (!usage.ok) {
    return NextResponse.json({ error: usage.warning }, { status: 429 });
  }

  const memory = await getAiTutorMemory(userId);
  const topics = getAiTutorTopicContext(profile, memory, 12);
  const currentTag = topics[0]?.tagId;
  const existingSessionId = asString(body.sessionId);
  const session = existingSessionId
    ? { id: existingSessionId, persisted: !existingSessionId.startsWith("local-") }
    : await createAiTutorSession(userId, profile.preferredMode, currentTag);

  await appendAiTutorMessage(userId, session.id, {
    role: "user",
    content: message,
  });

  const warnings = [
    profileResult.warning,
    usage.warning,
    "warning" in session ? session.warning : undefined,
  ].filter((warning): warning is string => Boolean(warning));

  let turn: AiTutorTurn;
  let openAIWarning: string | undefined;
  try {
    turn = await callOpenAITutor({ message, profile, memory, topics });
  } catch (error) {
    openAIWarning =
      error instanceof Error ? error.message : "Unknown OpenAI error.";
    turn = fallbackTurn(openAIWarning);
  }

  const memoryResult = await mergeAndSaveAiTutorMemory(
    userId,
    memory,
    turn.memoryPatch
  );
  if (memoryResult.warning) warnings.push(memoryResult.warning);
  if (openAIWarning) warnings.push(openAIWarning);

  await appendAiTutorMessage(userId, session.id, {
    role: "assistant",
    content: turn.assistantMessage,
    evaluation: turn.evaluation,
    topicRef: turn.nextTopic,
  });

  return NextResponse.json({
    sessionId: session.id,
    assistantMessage: turn.assistantMessage,
    evaluation: turn.evaluation,
    memory: memoryResult.memory,
    nextTopic: turn.nextTopic,
    suggestedAction: turn.suggestedAction,
    warnings,
  });
}
