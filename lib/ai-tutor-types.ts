export type AiTutorLevel = "beginner" | "intermediate" | "advanced" | "architect";

export type AiTutorMode =
  | "guided-interview"
  | "teach-and-quiz"
  | "coding-lab";

export type AiTutorRole = "user" | "assistant";

// Coach phases — drive tone and whether we score this turn.
//   warmup       → friendly intro, learn about the user, no grading
//   calibration  → 2-3 broad questions to find their level, light scoring
//   practice     → real interview-style quizzing with full evaluations
//   recap        → end-of-session summary, no grading
export type AiTutorPhase = "warmup" | "calibration" | "practice" | "recap";

export interface AiTutorProfile {
  targetRole: string;
  currentLevel: AiTutorLevel;
  interviewDate: string;
  dailyHours: number;
  weakTags: string[];
  preferredMode: AiTutorMode;
}

export interface AiTutorMastery {
  tagLabel: string;
  score: number;
  confidence: "low" | "medium" | "high";
  evidence: string[];
  updatedAt: string;
}

export interface AiTutorMemory {
  mastery: Record<string, AiTutorMastery>;
  recurringMistakes: string[];
  strengths: string[];
  nextRecommendations: string[];
  updatedAt?: string;
}

export interface AiTutorEvaluation {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  rubric: string[];
  readiness?: AiTutorReadiness;
  trackerUpdated?: boolean;
  trackerReason?: string;
  referenceLinks?: AiTutorReferenceLink[];
}

export interface AiTutorMemoryPatch {
  masteryUpdates: {
    tagId: string;
    tagLabel: string;
    scoreDelta: number;
    evidence: string;
  }[];
  recurringMistakesAdd: string[];
  strengthsAdd: string[];
  nextRecommendations: string[];
}

export interface AiTutorNextTopic {
  tagId: string;
  tagLabel: string;
  day: number;
  topicLabel: string;
  reason: string;
  itemId?: string;
  readiness?: AiTutorReadiness;
  referenceLinks?: AiTutorReferenceLink[];
}

export interface AiTutorSuggestedAction {
  label: string;
  href: string;
}

export type AiTutorReadiness =
  | "not_assessed"
  | "needs_practice"
  | "interview_ready";

export interface AiTutorReferenceLink {
  label: string;
  href: string;
  source?: string;
}

export interface AiTutorToolTrace {
  name: string;
  args: Record<string, unknown>;
  ok: boolean;
  preview?: string;
}

// Deepagents-style structured plan the coach maintains across the session.
// Step status: planned → in_progress → done. Persisted on the session
// `summary` jsonb so it survives across requests.
export type AiTutorPlanStatus = "planned" | "in_progress" | "done";

export interface AiTutorPlanStep {
  id: string;
  title: string;
  status: AiTutorPlanStatus;
  note?: string;
}

export interface AiTutorPlan {
  goal: string;
  steps: AiTutorPlanStep[];
  updatedAt?: string;
}

export interface AiTutorTurn {
  assistantMessage: string;
  // Evaluation is optional — only present when the user gave a real answer
  // attempt. Don't fabricate a 0/100 for "hi" or "I don't know".
  evaluation?: AiTutorEvaluation;
  memoryPatch: AiTutorMemoryPatch;
  nextTopic?: AiTutorNextTopic;
  suggestedAction?: AiTutorSuggestedAction;
  phase: AiTutorPhase;
  plan?: AiTutorPlan;
  toolTrace?: AiTutorToolTrace[];
}

export interface AiTutorMessage {
  id: string;
  role: AiTutorRole;
  content: string;
  createdAt: string;
  evaluation?: AiTutorEvaluation;
  topicRef?: AiTutorNextTopic;
  phase?: AiTutorPhase;
}

export interface AiTutorSessionSummary {
  id: string;
  title: string;
  status: string;
  mode: AiTutorMode;
  currentTag?: string;
  phase: AiTutorPhase;
  plan?: AiTutorPlan;
  startedAt: string;
  endedAt?: string;
  messageCount?: number;
}

export const aiTutorLevels: { value: AiTutorLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "architect", label: "Senior / Architect" },
];

export const aiTutorModes: { value: AiTutorMode; label: string }[] = [
  { value: "guided-interview", label: "Guided interview coach" },
  { value: "teach-and-quiz", label: "Teach, then quiz" },
  { value: "coding-lab", label: "Coding lab" },
];

export const defaultAiTutorProfile: AiTutorProfile = {
  targetRole: "ML Engineer",
  currentLevel: "intermediate",
  interviewDate: "",
  dailyHours: 2,
  weakTags: [],
  preferredMode: "guided-interview",
};

export const defaultAiTutorMemory: AiTutorMemory = {
  mastery: {},
  recurringMistakes: [],
  strengths: [],
  nextRecommendations: [],
};

const levels = new Set<AiTutorLevel>(
  aiTutorLevels.map((level) => level.value)
);
const modes = new Set<AiTutorMode>(aiTutorModes.map((mode) => mode.value));

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizeAiTutorProfile(input: unknown): AiTutorProfile {
  const record = asRecord(input);
  const currentLevel = asString(record.currentLevel);
  const preferredMode = asString(record.preferredMode);

  return {
    targetRole:
      asString(record.targetRole, defaultAiTutorProfile.targetRole).slice(0, 80) ||
      defaultAiTutorProfile.targetRole,
    currentLevel: levels.has(currentLevel as AiTutorLevel)
      ? (currentLevel as AiTutorLevel)
      : defaultAiTutorProfile.currentLevel,
    interviewDate: asString(record.interviewDate).slice(0, 20),
    dailyHours: Math.min(
      12,
      Math.max(0.5, asNumber(record.dailyHours, defaultAiTutorProfile.dailyHours))
    ),
    weakTags: asStringArray(record.weakTags).slice(0, 12),
    preferredMode: modes.has(preferredMode as AiTutorMode)
      ? (preferredMode as AiTutorMode)
      : defaultAiTutorProfile.preferredMode,
  };
}

export function normalizeAiTutorMemory(input: unknown): AiTutorMemory {
  const record = asRecord(input);
  return {
    mastery:
      typeof record.mastery === "object" &&
      record.mastery !== null &&
      !Array.isArray(record.mastery)
        ? (record.mastery as Record<string, AiTutorMastery>)
        : {},
    recurringMistakes: asStringArray(record.recurringMistakes).slice(0, 20),
    strengths: asStringArray(record.strengths).slice(0, 20),
    nextRecommendations: asStringArray(record.nextRecommendations).slice(0, 12),
    updatedAt: asString(record.updatedAt) || undefined,
  };
}

export function emptyAiTutorEvaluation(): AiTutorEvaluation {
  return {
    score: 0,
    summary: "Let's keep going — no evaluation needed for this turn.",
    strengths: [],
    gaps: [],
    rubric: [],
  };
}
