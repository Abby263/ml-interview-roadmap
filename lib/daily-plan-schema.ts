import type { PillarSlug } from "@/lib/site-data";

export const validDailyPlanPillars = [
  "foundations",
  "math-stats",
  "traditional-ml",
  "deep-learning",
  "generative-ai",
  "llmops",
  "ml-system-design",
  "mlops",
  "behavioral-storytelling",
] as const satisfies readonly PillarSlug[];

export const mlDailyPlanPillars = [
  "math-stats",
  "traditional-ml",
  "deep-learning",
  "generative-ai",
  "llmops",
  "ml-system-design",
  "mlops",
] as const satisfies readonly PillarSlug[];

export interface DayItem {
  /** Stable id used for per-day check tracking. Must be unique within a day. */
  id: string;
  label: string;
  /** Optional external link, such as LeetCode, a blog, a paper, or docs. */
  href?: string;
  /** Optional small badge, such as "Easy", "LeetCode", or "30 min". */
  meta?: string;
  /**
   * Optional 2-5 interview questions a candidate could be asked on this
   * specific topic. Encouraged for ML-concept items so users can rehearse
   * answers, then deepen with the reference link.
   */
  interviewQuestions?: string[];
}

export interface DayTrack {
  /** Track label like "DSA practice", "ML fundamentals", or "Reading". */
  label: string;
  items: DayItem[];
}

export interface DayReference {
  label: string;
  href: string;
  source?: string;
}

export interface DayPlan {
  day: number;
  title: string;
  pillar: PillarSlug;
  focus: string;
  tracks: DayTrack[];
  /** Concept-oriented interview questions tied to this day's content. */
  interviewQuestions: string[];
  /** External reading: blogs, papers, docs, or courses. */
  references: DayReference[];
  topicId?: string;
  caseStudySlug?: string;
  questionIds?: string[];
}

export interface DailyPlanWeek {
  week: number;
  title: string;
}

export function dayItemCount(plan: DayPlan) {
  return plan.tracks.reduce((sum, track) => sum + track.items.length, 0);
}

export function dayItemIds(plan: DayPlan) {
  return plan.tracks.flatMap((track) => track.items.map((item) => item.id));
}
