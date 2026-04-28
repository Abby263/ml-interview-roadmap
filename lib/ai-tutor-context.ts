import { dailyPlan } from "@/lib/daily-plan";
import {
  buildDailyPlanQuestionEntries,
  buildDailyPlanQuestionTags,
} from "@/lib/daily-plan-questions";
import type { DailyPlanQuestionTag } from "@/lib/daily-plan-questions";
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
}

const allQuestionEntries = buildDailyPlanQuestionEntries(dailyPlan).filter(
  (entry) => entry.interviewQuestions.length > 0
);

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
    const weakBoost = weakTags.has(entry.tagId) ? 1000 : 0;
    const lowMasteryBoost = Math.max(0, 70 - masteryScore);
    return {
      entry,
      rank: weakBoost + lowMasteryBoost - entry.day * 0.05 - index * 0.001,
    };
  });

  return scored
    .sort((left, right) => right.rank - left.rank)
    .slice(0, limit)
    .map(({ entry }) => ({
      day: entry.day,
      tagId: entry.tagId,
      tagLabel: entry.tagLabel,
      trackLabel: entry.trackLabel,
      topicLabel: entry.topicLabel,
      dayTitle: entry.dayTitle,
      dayFocus: entry.dayFocus,
      interviewQuestions: entry.interviewQuestions,
      href: entry.href,
    }));
}
