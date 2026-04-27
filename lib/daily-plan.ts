import "server-only";

import fs from "node:fs";
import path from "node:path";

import {
  mlDailyPlanPillars,
  validDailyPlanPillars,
  type DailyPlanWeek,
  type DayPlan,
} from "@/lib/daily-plan-schema";
import type { PillarSlug } from "@/lib/site-data";

const dailyPlanRoot = path.join(process.cwd(), "content", "daily-plan");
const daysRoot = path.join(dailyPlanRoot, "days");
const weeksPath = path.join(dailyPlanRoot, "weeks.json");
const dayFilePattern = /^day-(\d{3})\.json$/;
const validPillars = new Set<PillarSlug>(validDailyPlanPillars);
const mlPillars = new Set<PillarSlug>(mlDailyPlanPillars);

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
  let itemQuestionCount = 0;
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
      if (item.interviewQuestions !== undefined) {
        if (!Array.isArray(item.interviewQuestions)) {
          throw new Error(
            `${file}: tracks[${trackIndex}].items[${itemIndex}].interviewQuestions must be an array`
          );
        }
        if (
          item.interviewQuestions.length < 2 ||
          item.interviewQuestions.length > 5
        ) {
          throw new Error(
            `${file}: tracks[${trackIndex}].items[${itemIndex}].interviewQuestions must have 2-5 items when present`
          );
        }
        for (const [questionIndex, question] of item.interviewQuestions.entries()) {
          assertString(
            question,
            `tracks[${trackIndex}].items[${itemIndex}].interviewQuestions[${questionIndex}]`,
            file
          );
        }
        itemQuestionCount += item.interviewQuestions.length;
      }
      if (itemIds.has(item.id)) {
        throw new Error(`${file}: duplicate item id "${item.id}"`);
      }
      itemIds.add(item.id);
    }
  }

  if (mlPillars.has(day.pillar) && itemQuestionCount < 2) {
    throw new Error(
      `${file}: ML days must have item-level interviewQuestions`
    );
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
  for (const [index, questionId] of (day.questionIds ?? []).entries()) {
    assertString(questionId, `questionIds[${index}]`, file);
  }
}

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function listDayFiles() {
  return fs
    .readdirSync(daysRoot)
    .filter((file) => dayFilePattern.test(file))
    .sort((left, right) => {
      const leftDay = Number(left.match(dayFilePattern)?.[1]);
      const rightDay = Number(right.match(dayFilePattern)?.[1]);
      return leftDay - rightDay;
    });
}

function loadDailyPlan(): DayPlan[] {
  const files = listDayFiles();
  if (files.length === 0) {
    throw new Error("content/daily-plan/days must contain day-###.json files");
  }

  const days = files.map((file) => {
    const day = readJsonFile<DayPlan>(path.join(daysRoot, file));
    validateDayPlan(day, file);
    const expectedDay = Number(file.match(dayFilePattern)?.[1]);
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

function validateWeek(week: DailyPlanWeek, file: string) {
  if (!Number.isInteger(week.week) || week.week < 1) {
    throw new Error(`${file}: week must be a positive integer`);
  }
  assertString(week.title, "title", file);
}

function loadDailyPlanWeeks(plan: DayPlan[]): DailyPlanWeek[] {
  const weeks = readJsonFile<DailyPlanWeek[]>(weeksPath);
  if (!Array.isArray(weeks) || weeks.length === 0) {
    throw new Error("content/daily-plan/weeks.json must be a non-empty array");
  }

  const requiredWeeks = Math.ceil(plan.length / 7);
  for (const [index, week] of weeks.entries()) {
    validateWeek(week, "weeks.json");
    const expected = index + 1;
    if (week.week !== expected) {
      throw new Error(`weeks.json: week ${week.week} must be ordered as ${expected}`);
    }
  }
  if (weeks.length < requiredWeeks) {
    throw new Error(
      `weeks.json: expected at least ${requiredWeeks} week titles for ${plan.length} days`
    );
  }

  return weeks;
}

export const dailyPlan = loadDailyPlan();
export const dailyPlanWeeks = loadDailyPlanWeeks(dailyPlan);

export function getDayPlan(day: number) {
  return dailyPlan.find((entry) => entry.day === day);
}
