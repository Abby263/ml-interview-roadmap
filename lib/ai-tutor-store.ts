import {
  AI_TUTOR_MEMORY_TABLE,
  AI_TUTOR_MESSAGES_TABLE,
  AI_TUTOR_PROFILES_TABLE,
  AI_TUTOR_SESSIONS_TABLE,
  AI_TUTOR_USAGE_TABLE,
  getSupabaseAdmin,
} from "@/lib/supabase";
import {
  defaultAiTutorMemory,
  defaultAiTutorProfile,
  normalizeAiTutorMemory,
  normalizeAiTutorProfile,
  type AiTutorMemory,
  type AiTutorMemoryPatch,
  type AiTutorMessage,
  type AiTutorMode,
  type AiTutorPhase,
  type AiTutorPlan,
  type AiTutorPlanStatus,
  type AiTutorProfile,
  type AiTutorSessionSummary,
} from "@/lib/ai-tutor-types";

const validPhases: AiTutorPhase[] = ["warmup", "calibration", "practice", "recap"];
const validPlanStatuses: AiTutorPlanStatus[] = [
  "planned",
  "in_progress",
  "done",
];

interface ProfileRow {
  target_role: string | null;
  current_level: string | null;
  interview_date: string | null;
  daily_hours: number | null;
  weak_tags: string[] | null;
  preferred_mode: string | null;
}

interface MemoryRow {
  mastery: Record<string, unknown> | null;
  recurring_mistakes: string[] | null;
  strengths: string[] | null;
  next_recommendations: string[] | null;
  updated_at: string | null;
}

interface MessageRow {
  id: string;
  session_id?: string | null;
  role: string;
  content: string;
  created_at: string;
  evaluation: unknown;
  topic_ref: unknown;
}

interface SessionRow {
  id: string;
  status: string | null;
  mode: string | null;
  current_tag: string | null;
  summary: Record<string, unknown> | null;
  started_at: string | null;
  ended_at: string | null;
}

interface UsageRow {
  message_count: number | null;
  token_estimate: number | null;
}

export interface AiTutorState {
  profile: AiTutorProfile;
  memory: AiTutorMemory;
  recentMessages: AiTutorMessage[];
  sessions: AiTutorSessionSummary[];
  activeSessionId?: string;
  persistenceReady: boolean;
  persistenceWarning?: string;
}

function uniqueLimited(items: string[], limit: number) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))].slice(
    0,
    limit
  );
}

function confidenceFor(score: number): "low" | "medium" | "high" {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function mapProfile(row: ProfileRow | null): AiTutorProfile {
  if (!row) return defaultAiTutorProfile;
  return normalizeAiTutorProfile({
    targetRole: row.target_role,
    currentLevel: row.current_level,
    interviewDate: row.interview_date ?? "",
    dailyHours: row.daily_hours ?? defaultAiTutorProfile.dailyHours,
    weakTags: row.weak_tags ?? [],
    preferredMode: row.preferred_mode,
  });
}

function mapMemory(row: MemoryRow | null): AiTutorMemory {
  if (!row) return defaultAiTutorMemory;
  return normalizeAiTutorMemory({
    mastery: row.mastery ?? {},
    recurringMistakes: row.recurring_mistakes ?? [],
    strengths: row.strengths ?? [],
    nextRecommendations: row.next_recommendations ?? [],
    updatedAt: row.updated_at ?? undefined,
  });
}

function mapMessage(row: MessageRow): AiTutorMessage {
  // We tuck `phase` inside topic_ref when persisting so we don't need a
  // schema migration for the new column.
  const topicRefRaw =
    typeof row.topic_ref === "object" && row.topic_ref !== null
      ? (row.topic_ref as Record<string, unknown>)
      : null;
  const phase =
    typeof topicRefRaw?.phase === "string" &&
    validPhases.includes(topicRefRaw.phase as AiTutorPhase)
      ? (topicRefRaw.phase as AiTutorPhase)
      : undefined;

  // Don't surface "empty" evaluation objects to the UI — those produced the
  // misleading 0/100 in early sessions when the model didn't actually grade.
  const evaluationRaw =
    typeof row.evaluation === "object" && row.evaluation !== null
      ? (row.evaluation as Record<string, unknown>)
      : null;
  const hasRealEvaluation =
    evaluationRaw &&
    typeof evaluationRaw.summary === "string" &&
    evaluationRaw.summary.length > 0 &&
    typeof evaluationRaw.score === "number";

  return {
    id: row.id,
    role: row.role === "assistant" ? "assistant" : "user",
    content: row.content,
    createdAt: row.created_at,
    evaluation: hasRealEvaluation
      ? (evaluationRaw as unknown as AiTutorMessage["evaluation"])
      : undefined,
    topicRef: topicRefRaw
      ? (topicRefRaw as unknown as AiTutorMessage["topicRef"])
      : undefined,
    phase,
  };
}

function mapSession(row: SessionRow): AiTutorSessionSummary {
  const summary = row.summary ?? {};
  const plan = normalizePlan(summary.plan);
  const phaseRaw = typeof summary.phase === "string" ? summary.phase : "warmup";
  const phase = validPhases.includes(phaseRaw as AiTutorPhase)
    ? (phaseRaw as AiTutorPhase)
    : "warmup";
  const title =
    plan?.goal ||
    (row.current_tag ? `Practice: ${row.current_tag}` : "Coaching session");

  return {
    id: row.id,
    title: title.slice(0, 90),
    status: row.status ?? "active",
    mode:
      row.mode === "teach-and-quiz" || row.mode === "coding-lab"
        ? row.mode
        : "guided-interview",
    currentTag: row.current_tag ?? undefined,
    phase,
    plan,
    startedAt: row.started_at ?? new Date().toISOString(),
    endedAt: row.ended_at ?? undefined,
  };
}

export async function getAiTutorState(
  userId: string
): Promise<AiTutorState> {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return {
      profile: defaultAiTutorProfile,
      memory: defaultAiTutorMemory,
      recentMessages: [],
      sessions: [],
      persistenceReady: false,
      persistenceWarning:
        "Supabase service-role access is not configured, so tutor memory will not persist.",
    };
  }

  const [profileResult, memoryResult, sessionsResult] = await Promise.all([
    sb
      .from(AI_TUTOR_PROFILES_TABLE)
      .select(
        "target_role,current_level,interview_date,daily_hours,weak_tags,preferred_mode"
      )
      .eq("user_id", userId)
      .maybeSingle(),
    sb
      .from(AI_TUTOR_MEMORY_TABLE)
      .select(
        "mastery,recurring_mistakes,strengths,next_recommendations,updated_at"
      )
      .eq("user_id", userId)
      .maybeSingle(),
    sb
      .from(AI_TUTOR_SESSIONS_TABLE)
      .select("id,status,mode,current_tag,summary,started_at,ended_at")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(8),
  ]);

  const firstError =
    profileResult.error ?? memoryResult.error ?? sessionsResult.error;
  if (firstError) {
    return {
      profile: defaultAiTutorProfile,
      memory: defaultAiTutorMemory,
      recentMessages: [],
      sessions: [],
      persistenceReady: false,
      persistenceWarning: firstError.message,
    };
  }

  const sessions = ((sessionsResult.data ?? []) as SessionRow[]).map(mapSession);
  const activeSessionId = sessions[0]?.id;
  const recentMessages = activeSessionId
    ? await getAiTutorSessionMessages(userId, activeSessionId, 30)
    : [];

  return {
    profile: mapProfile(profileResult.data as ProfileRow | null),
    memory: mapMemory(memoryResult.data as MemoryRow | null),
    recentMessages,
    sessions,
    activeSessionId,
    persistenceReady: true,
  };
}

export async function saveAiTutorProfile(
  userId: string,
  profile: AiTutorProfile
) {
  const normalized = normalizeAiTutorProfile(profile);
  const sb = getSupabaseAdmin();
  if (!sb) {
    return {
      ok: false,
      profile: normalized,
      warning: "Supabase is not configured, so profile changes are not saved.",
    };
  }

  const { error } = await sb.from(AI_TUTOR_PROFILES_TABLE).upsert(
    {
      user_id: userId,
      target_role: normalized.targetRole,
      current_level: normalized.currentLevel,
      interview_date: normalized.interviewDate || null,
      daily_hours: normalized.dailyHours,
      weak_tags: normalized.weakTags,
      preferred_mode: normalized.preferredMode,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  return error
    ? { ok: false, profile: normalized, warning: error.message }
    : { ok: true, profile: normalized };
}

export async function createAiTutorSession(
  userId: string,
  mode: AiTutorMode,
  currentTag?: string
) {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return {
      id: `local-${crypto.randomUUID()}`,
      persisted: false,
      warning: "Tutor session is running without persistent Supabase storage.",
    };
  }

  const { data, error } = await sb
    .from(AI_TUTOR_SESSIONS_TABLE)
    .insert({
      user_id: userId,
      status: "active",
      mode,
      current_tag: currentTag ?? null,
      summary: { phase: "warmup" satisfies AiTutorPhase },
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      id: `local-${crypto.randomUUID()}`,
      persisted: false,
      warning: error?.message ?? "Could not create tutor session.",
    };
  }

  return { id: String((data as { id: string }).id), persisted: true };
}

export async function getAiTutorSessions(
  userId: string,
  limit = 12
): Promise<AiTutorSessionSummary[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return [];

  const { data, error } = await sb
    .from(AI_TUTOR_SESSIONS_TABLE)
    .select("id,status,mode,current_tag,summary,started_at,ended_at")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as SessionRow[]).map(mapSession);
}

export async function getAiTutorSessionMessages(
  userId: string,
  sessionId: string,
  limit = 40
): Promise<AiTutorMessage[]> {
  const sb = getSupabaseAdmin();
  if (!sb || sessionId.startsWith("local-")) return [];

  const { data, error } = await sb
    .from(AI_TUTOR_MESSAGES_TABLE)
    .select("id,session_id,role,content,created_at,evaluation,topic_ref")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as MessageRow[]).map(mapMessage).reverse();
}

/** Read the conversational phase for a session. Phase is stored on the
 *  existing `summary` jsonb so we don't need a schema migration. */
export async function getAiTutorSessionPhase(
  sessionId: string
): Promise<AiTutorPhase> {
  if (sessionId.startsWith("local-")) return "warmup";
  const sb = getSupabaseAdmin();
  if (!sb) return "warmup";

  const { data, error } = await sb
    .from(AI_TUTOR_SESSIONS_TABLE)
    .select("summary")
    .eq("id", sessionId)
    .maybeSingle();
  if (error || !data) return "warmup";

  const summary = (data as { summary: Record<string, unknown> | null }).summary;
  const phase = typeof summary?.phase === "string" ? summary.phase : "warmup";
  return validPhases.includes(phase as AiTutorPhase)
    ? (phase as AiTutorPhase)
    : "warmup";
}

function normalizePlan(value: unknown): AiTutorPlan | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.steps)) return undefined;
  const steps: AiTutorPlan["steps"] = [];
  for (const step of record.steps as unknown[]) {
    if (typeof step !== "object" || step === null) continue;
    const stepRecord = step as Record<string, unknown>;
    const title =
      typeof stepRecord.title === "string" ? stepRecord.title.trim() : "";
    if (!title) continue;
    const id =
      typeof stepRecord.id === "string" && stepRecord.id
        ? stepRecord.id
        : (globalThis.crypto?.randomUUID?.() ?? `step-${Math.random()}`);
    const status =
      typeof stepRecord.status === "string" &&
      validPlanStatuses.includes(stepRecord.status as AiTutorPlanStatus)
        ? (stepRecord.status as AiTutorPlanStatus)
        : "planned";
    const entry: AiTutorPlan["steps"][number] = {
      id,
      title: title.slice(0, 200),
      status,
    };
    if (typeof stepRecord.note === "string") entry.note = stepRecord.note;
    steps.push(entry);
    if (steps.length >= 12) break;
  }
  if (steps.length === 0) return undefined;
  return {
    goal:
      typeof record.goal === "string" ? record.goal.slice(0, 240) : "Session plan",
    steps,
    updatedAt:
      typeof record.updatedAt === "string" ? record.updatedAt : undefined,
  };
}

/** Read the lesson plan attached to a session, if any. */
export async function getAiTutorSessionPlan(
  sessionId: string
): Promise<AiTutorPlan | undefined> {
  if (sessionId.startsWith("local-")) return undefined;
  const sb = getSupabaseAdmin();
  if (!sb) return undefined;

  const { data, error } = await sb
    .from(AI_TUTOR_SESSIONS_TABLE)
    .select("summary")
    .eq("id", sessionId)
    .maybeSingle();
  if (error || !data) return undefined;
  const summary =
    (data as { summary: Record<string, unknown> | null }).summary ?? {};
  return normalizePlan(summary.plan);
}

/** Write or replace the lesson plan on a session. */
export async function setAiTutorSessionPlan(
  sessionId: string,
  plan: AiTutorPlan
) {
  if (sessionId.startsWith("local-")) return { ok: false } as const;
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false } as const;

  const { data: existing } = await sb
    .from(AI_TUTOR_SESSIONS_TABLE)
    .select("summary")
    .eq("id", sessionId)
    .maybeSingle();
  const existingSummary =
    (existing as { summary: Record<string, unknown> | null } | null)?.summary ??
    {};
  const summary = {
    ...existingSummary,
    plan: { ...plan, updatedAt: new Date().toISOString() },
  };

  const { error } = await sb
    .from(AI_TUTOR_SESSIONS_TABLE)
    .update({ summary })
    .eq("id", sessionId);
  return error
    ? ({ ok: false, warning: error.message } as const)
    : ({ ok: true } as const);
}

/** Persist the conversational phase. Best-effort — failures don't break
 *  the user turn since the agent's working copy is what matters in-flight. */
export async function setAiTutorSessionPhase(
  sessionId: string,
  phase: AiTutorPhase,
  currentTag?: string
) {
  if (sessionId.startsWith("local-")) return { ok: false } as const;
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false } as const;

  const { data: existing } = await sb
    .from(AI_TUTOR_SESSIONS_TABLE)
    .select("summary")
    .eq("id", sessionId)
    .maybeSingle();
  const existingSummary =
    (existing as { summary: Record<string, unknown> | null } | null)?.summary ??
    {};

  const summary = { ...existingSummary, phase };
  const update: Record<string, unknown> = { summary };
  if (currentTag) update.current_tag = currentTag;

  const { error } = await sb
    .from(AI_TUTOR_SESSIONS_TABLE)
    .update(update)
    .eq("id", sessionId);
  return error ? ({ ok: false, warning: error.message } as const) : ({ ok: true } as const);
}

export async function appendAiTutorMessage(
  userId: string,
  sessionId: string,
  message: Omit<AiTutorMessage, "id" | "createdAt">
) {
  const sb = getSupabaseAdmin();
  if (!sb || sessionId.startsWith("local-")) {
    return { ok: false, warning: "Message was not persisted." };
  }

  // Pack phase into topic_ref so we can read it back without migrating the
  // ai_tutor_messages table.
  const topicRefPayload: Record<string, unknown> = {
    ...(message.topicRef ?? {}),
  };
  if (message.phase) topicRefPayload.phase = message.phase;

  const { error } = await sb.from(AI_TUTOR_MESSAGES_TABLE).insert({
    user_id: userId,
    session_id: sessionId,
    role: message.role,
    content: message.content,
    evaluation: message.evaluation ?? {},
    topic_ref: topicRefPayload,
  });

  return error ? { ok: false, warning: error.message } : { ok: true };
}

export async function getAiTutorMemory(userId: string): Promise<AiTutorMemory> {
  const sb = getSupabaseAdmin();
  if (!sb) return defaultAiTutorMemory;

  const { data, error } = await sb
    .from(AI_TUTOR_MEMORY_TABLE)
    .select("mastery,recurring_mistakes,strengths,next_recommendations,updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return defaultAiTutorMemory;
  return mapMemory(data as MemoryRow | null);
}

export async function mergeAndSaveAiTutorMemory(
  userId: string,
  currentMemory: AiTutorMemory,
  patch: AiTutorMemoryPatch
) {
  const now = new Date().toISOString();
  const mastery = { ...currentMemory.mastery };

  for (const update of patch.masteryUpdates) {
    if (!update.tagId) continue;
    const current = mastery[update.tagId];
    const score = clampScore((current?.score ?? 45) + update.scoreDelta);
    mastery[update.tagId] = {
      tagLabel: update.tagLabel || current?.tagLabel || update.tagId,
      score,
      confidence: confidenceFor(score),
      evidence: uniqueLimited(
        [...(current?.evidence ?? []), update.evidence].filter(Boolean),
        6
      ),
      updatedAt: now,
    };
  }

  const memory: AiTutorMemory = {
    mastery,
    recurringMistakes: uniqueLimited(
      [...currentMemory.recurringMistakes, ...patch.recurringMistakesAdd],
      20
    ),
    strengths: uniqueLimited(
      [...currentMemory.strengths, ...patch.strengthsAdd],
      20
    ),
    nextRecommendations: uniqueLimited(patch.nextRecommendations, 12),
    updatedAt: now,
  };

  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, memory, warning: "Memory was not persisted." };

  const { error } = await sb.from(AI_TUTOR_MEMORY_TABLE).upsert(
    {
      user_id: userId,
      mastery: memory.mastery,
      recurring_mistakes: memory.recurringMistakes,
      strengths: memory.strengths,
      next_recommendations: memory.nextRecommendations,
      updated_at: now,
    },
    { onConflict: "user_id" }
  );

  return error
    ? { ok: false, memory, warning: error.message }
    : { ok: true, memory };
}

export async function consumeAiTutorUsage(
  userId: string,
  tokenEstimate: number
) {
  const dailyLimit = Number(process.env.AI_TUTOR_DAILY_LIMIT ?? 80);
  const usageDate = new Date().toISOString().slice(0, 10);
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: true, warning: "Usage limit is not persisted." };

  const { data, error } = await sb
    .from(AI_TUTOR_USAGE_TABLE)
    .select("message_count,token_estimate")
    .eq("user_id", userId)
    .eq("usage_date", usageDate)
    .maybeSingle();

  if (error) return { ok: true, warning: error.message };

  const row = data as UsageRow | null;
  const messageCount = row?.message_count ?? 0;
  if (messageCount >= dailyLimit) {
    return { ok: false, warning: `Daily AI Tutor limit reached (${dailyLimit}).` };
  }

  const { error: upsertError } = await sb.from(AI_TUTOR_USAGE_TABLE).upsert(
    {
      user_id: userId,
      usage_date: usageDate,
      message_count: messageCount + 1,
      token_estimate: (row?.token_estimate ?? 0) + tokenEstimate,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,usage_date" }
  );

  return upsertError
    ? { ok: true, warning: upsertError.message }
    : { ok: true };
}
