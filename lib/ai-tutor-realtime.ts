// Realtime (voice) mode for the AI Tutor.
//
// Reuses the same persona/skills/phases/memory model as the chat coach,
// but speaks instead of types. The browser establishes a WebRTC peer
// connection directly to OpenAI's Realtime API; this server module owns
// two server-side concerns:
//
//   1. Minting an ephemeral session (client_secret) with the right tools,
//      voice, instructions, and turn-detection config — see
//      buildRealtimeSessionConfig.
//
//   2. Executing tool calls statelessly when the browser relays them — see
//      executeRealtimeTool. Browser-side tool execution would require the
//      Supabase service role key in JS, which is a no-go; instead the
//      browser POSTs `{ name, args }` to /api/ai-tutor/realtime/tool and
//      the server calls executeRealtimeTool, persists the resulting state,
//      and returns both the function-call output (which the browser sends
//      back to OpenAI on the data channel) and a `changes` delta the UI
//      uses to refresh memory/plan/phase live.

import {
  getAiTutorTopicContext,
  getTopicByItemId,
  getTopicsForDay,
  retrieveDailyPlanContent,
  searchAiTutorQuestions,
  type AiTutorTopicContext,
} from "@/lib/ai-tutor-context";
import { recordAiTutorCheck, getServerProgressDetailed } from "@/app/actions/progress";
import {
  conceptTeacherPrompt,
  mockInterviewerPrompt,
} from "@/lib/ai-tutor-prompts";
import {
  mergeAndSaveAiTutorMemory,
  setAiTutorSessionPhase,
  setAiTutorSessionPlan,
} from "@/lib/ai-tutor-store";
import type {
  AiTutorEvaluation,
  AiTutorMemory,
  AiTutorMemoryPatch,
  AiTutorNextTopic,
  AiTutorPhase,
  AiTutorPlan,
  AiTutorPlanStatus,
  AiTutorProfile,
  AiTutorReadiness,
  AiTutorSuggestedAction,
} from "@/lib/ai-tutor-types";

// Shared tool list — same shape as the chat agent's `tools` array. Both
// modes can retrieve roadmap topics/questions, read mastery/progress, write
// lesson plans, delegate focused teaching/interview prompts, and record
// evaluated practice back to memory + tracker.
export const aiTutorRealtimeTools = [
  {
    type: "function" as const,
    name: "get_roadmap_topic",
    description:
      "Get the daily-plan topic + interview questions for a specific day number. Use to ground a question in the official roadmap.",
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
    name: "search_questions",
    description:
      "Keyword-search the daily plan question bank. Returns up to 8 matching topics with their interview questions.",
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
      "Retrieve the full daily plan content for a specific day — focus, every track item, every interview question, and references.",
    parameters: {
      type: "object" as const,
      properties: { day: { type: "integer" as const } },
      required: ["day"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "get_user_mastery",
    description:
      "Read the learner's current mastery scores per tag, plus strengths and recurring mistakes from memory.",
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
      "List which roadmap items the learner has already checked off (manual study vs AI tutor practice).",
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
        prefer_focus_areas: { type: "boolean" as const },
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
      "Delegate a focused teaching task to a concept-teacher subagent. Use when the learner needs a crisp explanation before the next spoken check.",
    parameters: {
      type: "object" as const,
      properties: {
        concept: { type: "string" as const },
        level: {
          type: "string" as const,
          enum: ["beginner", "intermediate", "advanced", "architect"],
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
      "Delegate to a mock-interviewer subagent that returns one interview-grade question for the role and difficulty.",
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
      "Write or replace the structured lesson plan for this session — 2-6 concrete steps the learner can see. Call ONCE after warmup.",
    parameters: {
      type: "object" as const,
      properties: {
        goal: { type: "string" as const },
        steps: {
          type: "array" as const,
          items: {
            type: "object" as const,
            properties: { title: { type: "string" as const } },
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
      "Update the status of a single step in the lesson plan: 'in_progress' when starting, 'done' when completed.",
    parameters: {
      type: "object" as const,
      properties: {
        step_index: { type: "integer" as const },
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
      "Record a substantive answer attempt. Updates mastery and writes a tracker check tagged ai_tutor only when the learner is interview-ready. NEVER call for 'I don't know' or warmup/recap-phase chatter.",
    parameters: {
      type: "object" as const,
      properties: {
        tag_id: { type: "string" as const },
        tag_label: { type: "string" as const },
        day: { type: "integer" as const },
        item_id: {
          type: "string" as const,
          description:
            "The canonical roadmap item id returned by get_roadmap_topic or retrieve_daily_plan_content.",
        },
        topic_label: { type: "string" as const },
        score: { type: "number" as const },
        score_delta: { type: "number" as const },
        readiness: {
          type: "string" as const,
          enum: ["needs_practice", "interview_ready"],
          description:
            "Use interview_ready only when the learner can pass follow-ups for this topic.",
        },
        readiness_reason: {
          type: "string" as const,
          description:
            "One concise reason explaining whether the learner is ready to move on.",
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
        "readiness",
        "readiness_reason",
        "summary",
      ],
      additionalProperties: false,
    },
  },
] as const;

// ── Helpers ──────────────────────────────────────────────────────────────

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
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
    referenceLinks: topic.referenceLinks.slice(0, 2),
  }));
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

interface ResponsesApiShape {
  output?: unknown;
  output_text?: unknown;
  error?: { message?: string };
}

function extractResponseText(output: unknown): string {
  if (!Array.isArray(output)) return "";
  const parts: string[] = [];
  for (const item of output) {
    const record = asRecord(item);
    if (record.type !== "message" || !Array.isArray(record.content)) continue;
    for (const contentItem of record.content) {
      const contentRecord = asRecord(contentItem);
      if (typeof contentRecord.text === "string" && contentRecord.text.trim()) {
        parts.push(contentRecord.text.trim());
      }
    }
  }
  return parts.join("\n").trim();
}

async function callRealtimeSubagentText(
  instructions: string,
  userText: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return "The OpenAI key is not configured for this subagent.";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.AI_TUTOR_MODEL || "gpt-4o-mini",
      instructions,
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: userText }],
        },
      ],
      temperature: 0.5,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as ResponsesApiShape;
  if (!response.ok) {
    return data.error?.message ?? `Subagent request failed (${response.status}).`;
  }
  return (
    extractResponseText(data.output) ||
    (typeof data.output_text === "string" ? data.output_text : "") ||
    "No subagent response was returned."
  );
}

// ── Tool execution ──────────────────────────────────────────────────────

export interface RealtimeToolContext {
  userId: string;
  sessionId: string;
  profile: AiTutorProfile;
  memory: AiTutorMemory;
  currentPhase: AiTutorPhase;
  currentPlan?: AiTutorPlan;
}

export interface RealtimeToolChanges {
  phase?: AiTutorPhase;
  plan?: AiTutorPlan;
  evaluation?: AiTutorEvaluation;
  nextTopic?: AiTutorNextTopic;
  suggestedAction?: AiTutorSuggestedAction;
  memoryPatch?: AiTutorMemoryPatch;
  // After applying memoryPatch, the agent persists and the UI gets the
  // new memory snapshot for live updates.
  memory?: AiTutorMemory;
  trackerWrote?: boolean;
}

export interface RealtimeToolResult {
  output: unknown;
  preview: string;
  changes: RealtimeToolChanges;
}

export async function executeRealtimeTool(
  name: string,
  args: Record<string, unknown>,
  ctx: RealtimeToolContext
): Promise<RealtimeToolResult> {
  const changes: RealtimeToolChanges = {};

  switch (name) {
    case "get_roadmap_topic": {
      const day = Number(args.day ?? 0);
      const topics = getTopicsForDay(day);
      return {
        output: { day, topics: topicsToBrief(topics, 6) },
        preview:
          topics.length > 0
            ? `Day ${day}: ${topics[0].dayTitle}`
            : `Day ${day}: no entries.`,
        changes,
      };
    }

    case "search_questions": {
      const query = String(args.query ?? "");
      const matches = searchAiTutorQuestions(query);
      return {
        output: { query, matches: topicsToBrief(matches, 6) },
        preview: `Found ${matches.length} topic(s) for "${query}".`,
        changes,
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
        changes,
      };
    }

    case "get_user_mastery": {
      const mastery = Object.entries(ctx.memory.mastery).map(
        ([tagId, value]) => ({
          tagId,
          tagLabel: value.tagLabel,
          score: value.score,
          confidence: value.confidence,
        })
      );
      return {
        output: {
          focusAreas: ctx.profile.weakTags,
          mastery,
          strengths: ctx.memory.strengths,
          recurringMistakes: ctx.memory.recurringMistakes,
        },
        preview: `Returned mastery for ${mastery.length} tag(s).`,
        changes,
      };
    }

    case "get_user_progress": {
      const rows = await getServerProgressDetailed(ctx.userId);
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
        changes,
      };
    }

    case "pick_next_topic": {
      const preferFocus = Boolean(args.prefer_focus_areas);
      const ranked = getAiTutorTopicContext(
        ctx.profile,
        ctx.memory,
        preferFocus ? 4 : 6
      );
      const pick = ranked[0];
      if (pick) {
        changes.nextTopic = {
          tagId: pick.tagId,
          tagLabel: pick.tagLabel,
          day: pick.day,
          topicLabel: pick.topicLabel,
          reason: preferFocus
            ? "Selected from your focus areas"
            : "Lowest-mastery topic on the roadmap",
          itemId: pick.itemId,
          referenceLinks: pick.referenceLinks,
        };
        changes.suggestedAction = pick.day
          ? { label: `Open Day ${pick.day}`, href: `/day/${pick.day}` }
          : { label: "Open study plan", href: "/study-plan" };
      }
      return {
        output: { suggestion: pick, alternatives: topicsToBrief(ranked.slice(1), 3) },
        preview: pick
          ? `Next: Day ${pick.day} — ${pick.topicLabel}`
          : "No suggestion.",
        changes,
      };
    }

    case "set_phase": {
      const next = String(args.phase ?? "");
      const valid: AiTutorPhase[] = [
        "warmup",
        "calibration",
        "practice",
        "recap",
      ];
      if (!valid.includes(next as AiTutorPhase)) {
        return {
          output: { ok: false, reason: "invalid phase" },
          preview: `Rejected phase: ${next}`,
          changes,
        };
      }
      changes.phase = next as AiTutorPhase;
      await setAiTutorSessionPhase(ctx.sessionId, changes.phase);
      return {
        output: { ok: true, phase: changes.phase },
        preview: `Phase → ${changes.phase}`,
        changes,
      };
    }

    case "delegate_to_concept_teacher": {
      const concept = String(args.concept ?? "");
      const level = String(args.level ?? ctx.profile.currentLevel);
      const teachingReply = await callRealtimeSubagentText(
        conceptTeacherPrompt(concept, level),
        `Teach: ${concept}`
      );
      return {
        output: { teaching_reply: teachingReply },
        preview: `Concept teacher: "${concept}"`,
        changes,
      };
    }

    case "delegate_to_mock_interviewer": {
      const role = String(args.role ?? ctx.profile.targetRole);
      const difficulty = String(args.difficulty ?? "intermediate");
      const question = await callRealtimeSubagentText(
        mockInterviewerPrompt(role, difficulty),
        "Ask one question."
      );
      return {
        output: { question },
        preview: `Mock interviewer: ${difficulty} ${role}`,
        changes,
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
          changes,
        };
      }

      const newPlan: AiTutorPlan = {
        goal: goal.slice(0, 240),
        steps,
        updatedAt: new Date().toISOString(),
      };
      changes.plan = newPlan;
      await setAiTutorSessionPlan(ctx.sessionId, newPlan);
      return {
        output: { ok: true, stepCount: steps.length },
        preview: `Wrote plan: ${steps.length} step(s)`,
        changes,
      };
    }

    case "update_lesson_plan_step": {
      const plan = ctx.currentPlan;
      if (!plan) {
        return {
          output: { ok: false, reason: "No plan exists. Call write_lesson_plan first." },
          preview: "Plan update rejected (no plan)",
          changes,
        };
      }
      const stepIndex = Math.round(Number(args.step_index ?? -1));
      if (stepIndex < 0 || stepIndex >= plan.steps.length) {
        return {
          output: { ok: false, reason: "step_index out of range." },
          preview: `Plan update rejected (index ${stepIndex})`,
          changes,
        };
      }
      const status = String(args.status ?? "planned") as AiTutorPlanStatus;
      const note = typeof args.note === "string" ? args.note : undefined;
      const updatedSteps = plan.steps.map((step, idx) =>
        idx === stepIndex
          ? { ...step, status, note: note ?? step.note }
          : step
      );
      const updatedPlan: AiTutorPlan = {
        ...plan,
        steps: updatedSteps,
        updatedAt: new Date().toISOString(),
      };
      changes.plan = updatedPlan;
      await setAiTutorSessionPlan(ctx.sessionId, updatedPlan);
      return {
        output: { ok: true, step_index: stepIndex, status },
        preview: `Step ${stepIndex + 1} → ${status}`,
        changes,
      };
    }

    case "record_practice": {
      // Mirror the chat agent's record_practice rules exactly so voice and
      // chat update mastery + tracker the same way.
      if (
        ctx.currentPhase === "warmup" ||
        ctx.currentPhase === "recap"
      ) {
        return {
          output: {
            ok: false,
            reason: `Cannot record_practice in phase '${ctx.currentPhase}'.`,
          },
          preview: `Skipped record_practice (phase: ${ctx.currentPhase})`,
          changes,
        };
      }

      const tagId = String(args.tag_id ?? "");
      const tagLabel = String(args.tag_label ?? tagId);
      const day = Math.max(0, Math.round(Number(args.day ?? 0)));
      const rawItemId =
        typeof args.item_id === "string" ? args.item_id.trim() : undefined;
      const itemId =
        rawItemId && day
          ? rawItemId.replace(new RegExp(`^day-${day}-`), "")
          : rawItemId;
      const topicLabel = String(args.topic_label ?? "");
      const score = clampScore(Number(args.score ?? 0));
      const scoreDelta = Math.max(
        -30,
        Math.min(30, Number(args.score_delta ?? 0))
      );
      const readiness: AiTutorReadiness =
        args.readiness === "interview_ready"
          ? "interview_ready"
          : "needs_practice";
      const readinessReason = String(args.readiness_reason ?? "").slice(0, 240);
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

      const known = day && itemId ? getTopicByItemId(day, itemId) : undefined;
      const previousScore = ctx.memory.mastery[tagId]?.score ?? 45;
      const projectedScore = clampScore(previousScore + scoreDelta);
      const hasBlockingGaps = gaps.length > 1;
      const trackerReady =
        readiness === "interview_ready" &&
        scoreDelta > 0 &&
        ((score >= 80 && !hasBlockingGaps) ||
          (score >= 75 && projectedScore >= 70 && !hasBlockingGaps));
      let trackerUpdated = false;
      let trackerReason =
        readinessReason || "Needs another strong answer before marking complete.";

      if (known && itemId && trackerReady) {
        await recordAiTutorCheck(ctx.userId, day, itemId);
        trackerUpdated = true;
        trackerReason =
          readinessReason ||
          "Marked complete because the answer met the interview-ready threshold.";
      } else if (!known && trackerReady) {
        trackerReason =
          "Strong answer, but no exact roadmap item was resolved, so the tracker was not changed.";
      } else if (readiness === "interview_ready" && !trackerReady) {
        trackerReason =
          readinessReason ||
          "Close, but the score/mastery threshold was not high enough for auto-complete.";
      }

      changes.evaluation = {
        score,
        summary,
        strengths,
        gaps,
        rubric,
        readiness,
        trackerUpdated,
        trackerReason,
        referenceLinks: known?.referenceLinks ?? [],
      };

      changes.memoryPatch = {
        masteryUpdates: [
          {
            tagId,
            tagLabel,
            scoreDelta,
            evidence: summary.slice(0, 240),
          },
        ],
        recurringMistakesAdd: gaps.slice(0, 2),
        strengthsAdd: strengths.slice(0, 2),
        nextRecommendations: [],
      };

      // Persist memory patch — same merge logic as chat agent.
      const persisted = await mergeAndSaveAiTutorMemory(
        ctx.userId,
        ctx.memory,
        changes.memoryPatch
      );
      if (persisted.memory) changes.memory = persisted.memory;

      if (day && itemId) {
        changes.nextTopic = {
          tagId,
          tagLabel,
          day,
          topicLabel: known?.topicLabel ?? topicLabel,
          reason: trackerUpdated
            ? "You proved this topic at interview-ready level"
            : "You just practiced this topic",
          itemId,
          readiness,
          referenceLinks: known?.referenceLinks ?? [],
        };
        if (known) {
          changes.suggestedAction = {
            label: `Open Day ${day}`,
            href: `/day/${day}`,
          };
        }
      }
      if (trackerUpdated) changes.trackerWrote = true;

      return {
        output: {
          ok: true,
          score,
          score_delta: scoreDelta,
          projected_score: projectedScore,
          readiness,
          tracker_updated: trackerUpdated,
          tracker_reason: trackerReason,
        },
        preview: `Recorded ${tagLabel} (${score}/100, Δ${scoreDelta}, ${readiness}${trackerUpdated ? ", tracker updated" : ""})`,
        changes,
      };
    }

    default:
      return {
        output: { error: `Unknown tool: ${name}` },
        preview: `Unknown tool: ${name}`,
        changes,
      };
  }
}

// ── Realtime session config ─────────────────────────────────────────────

export interface RealtimeSessionConfigInput {
  profile: AiTutorProfile;
  memory: AiTutorMemory;
  phase: AiTutorPhase;
  plan?: AiTutorPlan;
  voice?: string;
}

/** Build the body we POST to OpenAI's /v1/realtime/sessions endpoint. */
export function buildRealtimeSessionConfig(
  input: RealtimeSessionConfigInput,
  voiceInstructions: string
) {
  const model = process.env.AI_TUTOR_REALTIME_MODEL || "gpt-realtime-mini";
  const voice =
    input.voice || process.env.AI_TUTOR_REALTIME_VOICE || "alloy";

  return {
    model,
    voice,
    instructions: voiceInstructions,
    modalities: ["text", "audio"],
    input_audio_format: "pcm16",
    output_audio_format: "pcm16",
    input_audio_transcription: { model: "whisper-1" },
    turn_detection: {
      type: "server_vad",
      threshold: 0.5,
      prefix_padding_ms: 300,
      silence_duration_ms: 600,
      create_response: true,
    },
    tools: aiTutorRealtimeTools,
    tool_choice: "auto",
    temperature: 0.7,
  };
}
