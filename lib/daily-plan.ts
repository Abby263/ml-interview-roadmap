import { dailyPlanContent } from "@/content/daily-plan";
import type { DayPlan, PillarSlug } from "@/lib/site-data";

const validPillars = new Set<PillarSlug>([
  "foundations",
  "math-stats",
  "traditional-ml",
  "deep-learning",
  "generative-ai",
  "llmops",
  "ml-system-design",
  "mlops",
  "behavioral-storytelling",
]);

const mlPillars = new Set<PillarSlug>([
  "math-stats",
  "traditional-ml",
  "deep-learning",
  "generative-ai",
  "llmops",
  "ml-system-design",
  "mlops",
]);

function assertString(value: unknown, field: string, file: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${file}: ${field} must be a non-empty string`);
  }
}

function assertOptionalString(value: unknown, field: string, file: string) {
  if (value !== undefined && typeof value !== "string") {
    throw new Error(`${file}: ${field} must be a string when present`);
  }
}

function validateDayPlan(day: DayPlan, file: string) {
  if (!Number.isInteger(day.day) || day.day < 1) {
    throw new Error(`${file}: day must be a positive integer`);
  }
  assertString(day.title, "title", file);
  assertString(day.focus, "focus", file);
  if (!validPillars.has(day.pillar)) {
    throw new Error(`${file}: pillar "${day.pillar}" is not valid`);
  }

  if (!Array.isArray(day.tracks) || day.tracks.length === 0) {
    throw new Error(`${file}: tracks must be a non-empty array`);
  }

  const itemIds = new Set<string>();
  for (const [trackIndex, track] of day.tracks.entries()) {
    assertString(track.label, `tracks[${trackIndex}].label`, file);
    if (!Array.isArray(track.items) || track.items.length === 0) {
      throw new Error(`${file}: tracks[${trackIndex}].items must be non-empty`);
    }
    for (const [itemIndex, item] of track.items.entries()) {
      assertString(item.id, `tracks[${trackIndex}].items[${itemIndex}].id`, file);
      assertString(item.label, `tracks[${trackIndex}].items[${itemIndex}].label`, file);
      assertOptionalString(item.href, `tracks[${trackIndex}].items[${itemIndex}].href`, file);
      assertOptionalString(item.meta, `tracks[${trackIndex}].items[${itemIndex}].meta`, file);
      if (itemIds.has(item.id)) {
        throw new Error(`${file}: duplicate item id "${item.id}"`);
      }
      itemIds.add(item.id);
    }
  }

  if (!Array.isArray(day.interviewQuestions)) {
    throw new Error(`${file}: interviewQuestions must be an array`);
  }
  for (const [index, question] of day.interviewQuestions.entries()) {
    assertString(question, `interviewQuestions[${index}]`, file);
  }
  if (
    mlPillars.has(day.pillar) &&
    (day.interviewQuestions.length < 2 || day.interviewQuestions.length > 5)
  ) {
    throw new Error(`${file}: ML days must have 2-5 interviewQuestions`);
  }

  if (!Array.isArray(day.references)) {
    throw new Error(`${file}: references must be an array`);
  }
  for (const [index, reference] of day.references.entries()) {
    assertString(reference.label, `references[${index}].label`, file);
    assertString(reference.href, `references[${index}].href`, file);
    assertOptionalString(reference.source, `references[${index}].source`, file);
  }

  assertOptionalString(day.topicId, "topicId", file);
  assertOptionalString(day.caseStudySlug, "caseStudySlug", file);
  if (day.questionIds !== undefined && !Array.isArray(day.questionIds)) {
    throw new Error(`${file}: questionIds must be an array when present`);
  }
}

function loadDailyPlan(): DayPlan[] {
  const days = dailyPlanContent.map((raw, index) => {
    const day = raw as unknown as DayPlan;
    const file = `day-${String(index + 1).padStart(3, "0")}.json`;
    validateDayPlan(day, file);
    const expectedDay = index + 1;
    if (day.day !== expectedDay) {
      throw new Error(`${file}: day must match file name (${expectedDay})`);
    }
    return day;
  });

  for (let index = 0; index < days.length; index += 1) {
    const expected = index + 1;
    if (days[index].day !== expected) {
      throw new Error(`Daily plan is missing day ${expected}`);
    }
  }

  return days;
}

export const dailyPlan = loadDailyPlan();

export function getDayPlan(day: number) {
  return dailyPlan.find((entry) => entry.day === day);
}
