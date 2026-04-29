import { dailyPlan, getDayPlan } from "@/lib/daily-plan";
import {
  buildDailyPlanQuestionEntries,
  buildDailyPlanQuestionTags,
} from "@/lib/daily-plan-questions";
import type {
  DailyPlanQuestionEntry,
  DailyPlanQuestionTag,
} from "@/lib/daily-plan-questions";
import type { AiTutorMemory, AiTutorProfile } from "@/lib/ai-tutor-types";

export interface AiTutorTopicContext {
  day: number;
  tagId: string;
  tagLabel: string;
  trackLabel: string;
  topicLabel: string;
  dayTitle: string;
  dayFocus: string;
  interviewQuestions: string[];
  href?: string;
  itemId?: string;
  references?: { label: string; href: string }[];
}

const allQuestionEntries: DailyPlanQuestionEntry[] =
  buildDailyPlanQuestionEntries(dailyPlan).filter(
    (entry) => entry.interviewQuestions.length > 0
  );

const entriesById = new Map<string, DailyPlanQuestionEntry>(
  allQuestionEntries.map((entry) => [entry.id, entry])
);

const entriesByDay = new Map<number, DailyPlanQuestionEntry[]>();
for (const entry of allQuestionEntries) {
  const list = entriesByDay.get(entry.day) ?? [];
  list.push(entry);
  entriesByDay.set(entry.day, list);
}

// Pull the day-level references (cached) so we can surface them with each
// topic context. The agent uses these to give the learner a "↗ reference"
// link beside the question — so if they're stuck they have somewhere to go
// look it up before answering.
const referencesByDay = new Map<number, { label: string; href: string }[]>();
for (const day of dailyPlan) {
  referencesByDay.set(
    day.day,
    day.references.map((ref) => ({ label: ref.label, href: ref.href }))
  );
}

function entryToTopic(entry: DailyPlanQuestionEntry): AiTutorTopicContext {
  return {
    day: entry.day,
    tagId: entry.tagId,
    tagLabel: entry.tagLabel,
    trackLabel: entry.trackLabel,
    topicLabel: entry.topicLabel,
    dayTitle: entry.dayTitle,
    dayFocus: entry.dayFocus,
    interviewQuestions: entry.interviewQuestions,
    href: entry.href,
    itemId: entry.id.replace(/^day-\d+-/, ""),
    references: referencesByDay.get(entry.day) ?? [],
  };
}

export function getAiTutorTagOptions(): DailyPlanQuestionTag[] {
  return buildDailyPlanQuestionTags(allQuestionEntries);
}

export function getAiTutorTopicContext(
  profile: AiTutorProfile,
  memory: AiTutorMemory,
  limit = 12
): AiTutorTopicContext[] {
  const weakTags = new Set(profile.weakTags);
  const scored = allQuestionEntries.map((entry, index) => {
    const masteryScore = memory.mastery[entry.tagId]?.score ?? 45;
    const focusBoost = weakTags.has(entry.tagId) ? 1000 : 0;
    const lowMasteryBoost = Math.max(0, 70 - masteryScore);
    return {
      entry,
      rank: focusBoost + lowMasteryBoost - entry.day * 0.05 - index * 0.001,
    };
  });

  return scored
    .sort((left, right) => right.rank - left.rank)
    .slice(0, limit)
    .map(({ entry }) => entryToTopic(entry));
}

/** Look up topic + interview questions for a specific day number. */
export function getTopicsForDay(day: number): AiTutorTopicContext[] {
  const list = entriesByDay.get(day) ?? [];
  return list.map(entryToTopic);
}

/** Look up a single topic by its question entry id (e.g. "ml-bias-variance"). */
export function getTopicByItemId(
  day: number,
  itemId: string
): AiTutorTopicContext | undefined {
  const entry = entriesById.get(`day-${day}-${itemId}`);
  return entry ? entryToTopic(entry) : undefined;
}

/** Look up topic context by tagId (e.g. "pillar:deep-learning") — returns
 *  the highest-priority entries for that tag, ranked by day. */
export function getTopicsForTag(
  tagId: string,
  limit = 6
): AiTutorTopicContext[] {
  return allQuestionEntries
    .filter((entry) => entry.tagId === tagId)
    .slice(0, limit)
    .map(entryToTopic);
}

/** Returns the full day-plan content for a specific day — focus statement,
 *  every track + item, references, all interview questions across items.
 *  Used by the retrieval tool when the agent needs to plan a teaching arc
 *  rather than just look up a single question. */
export function retrieveDailyPlanContent(day: number) {
  const plan = getDayPlan(day);
  if (!plan) return null;
  return {
    day: plan.day,
    title: plan.title,
    pillar: plan.pillar,
    focus: plan.focus,
    tracks: plan.tracks.map((track) => ({
      label: track.label,
      items: track.items.map((item) => ({
        id: item.id,
        label: item.label,
        meta: item.meta,
        href: item.href,
        interviewQuestions: item.interviewQuestions ?? [],
      })),
    })),
    references: plan.references.map((ref) => ({
      label: ref.label,
      href: ref.href,
      source: ref.source,
    })),
  };
}

/** Lightweight in-memory keyword search across the question bank. Used as
 *  the agent's `search_questions` tool until we move to embeddings. */
export function searchAiTutorQuestions(
  query: string,
  limit = 8
): AiTutorTopicContext[] {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 2);
  if (tokens.length === 0) return [];

  const scored = allQuestionEntries.map((entry) => {
    const haystack = [
      entry.tagLabel,
      entry.dayTitle,
      entry.dayFocus,
      entry.topicLabel,
      entry.trackLabel,
      ...entry.interviewQuestions,
    ]
      .join(" \n ")
      .toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) score += 1;
    }
    return { entry, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || left.entry.day - right.entry.day)
    .slice(0, limit)
    .map(({ entry }) => entryToTopic(entry));
}
