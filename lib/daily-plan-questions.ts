import type { DayPlan } from "@/lib/daily-plan-schema";
import type { PillarSlug } from "@/lib/site-data";

export type DailyPlanQuestionTagGroup = "Roadmap Pillars" | "DSA Patterns";

export interface DailyPlanQuestionTag {
  id: string;
  label: string;
  group: DailyPlanQuestionTagGroup;
  itemCount: number;
  questionCount: number;
}

export interface DailyPlanQuestionEntry {
  id: string;
  day: number;
  dayTitle: string;
  dayFocus: string;
  pillar: PillarSlug;
  tagId: string;
  tagLabel: string;
  tagGroup: DailyPlanQuestionTagGroup;
  trackLabel: string;
  topicLabel: string;
  meta?: string;
  href?: string;
  interviewQuestions: string[];
}

const pillarLabels: Record<PillarSlug, string> = {
  "math-stats": "Statistics",
  "traditional-ml": "Traditional ML",
  "deep-learning": "Deep Learning",
  mlops: "MLOps",
  "generative-ai": "Generative AI",
  llmops: "LLMOps",
  "ml-system-design": "ML System Design",
  foundations: "OOPS / SWE",
  "behavioral-storytelling": "Behavioral & Mocks",
};

const pillarOrder: PillarSlug[] = [
  "math-stats",
  "traditional-ml",
  "deep-learning",
  "mlops",
  "generative-ai",
  "llmops",
  "ml-system-design",
  "foundations",
  "behavioral-storytelling",
];

function isDsaItem(id: string) {
  return id.startsWith("lc-");
}

export function buildDailyPlanQuestionEntries(
  plan: DayPlan[]
): DailyPlanQuestionEntry[] {
  return plan.flatMap((day) =>
    day.tracks.flatMap((track) =>
      track.items.map((item) => {
        const dsa = isDsaItem(item.id);
        const dsaLabel = item.meta ? `DSA · ${item.meta}` : "DSA";
        const tagLabel = dsa ? dsaLabel : pillarLabels[day.pillar];

        return {
          id: `day-${day.day}-${item.id}`,
          day: day.day,
          dayTitle: day.title,
          dayFocus: day.focus,
          pillar: day.pillar,
          tagId: dsa
            ? `dsa:${item.meta ?? "General"}`
            : `pillar:${day.pillar}`,
          tagLabel,
          tagGroup: dsa ? "DSA Patterns" : "Roadmap Pillars",
          trackLabel: track.label,
          topicLabel: item.label,
          meta: item.meta,
          href: item.href,
          interviewQuestions: item.interviewQuestions ?? [],
        };
      })
    )
  );
}

export function buildDailyPlanQuestionTags(
  entries: DailyPlanQuestionEntry[]
): DailyPlanQuestionTag[] {
  const byId = new Map<string, DailyPlanQuestionTag>();
  const firstSeenRank = new Map<string, number>();

  for (const entry of entries) {
    if (!firstSeenRank.has(entry.tagId)) {
      firstSeenRank.set(entry.tagId, firstSeenRank.size);
    }
    const current = byId.get(entry.tagId) ?? {
      id: entry.tagId,
      label: entry.tagLabel,
      group: entry.tagGroup,
      itemCount: 0,
      questionCount: 0,
    };
    current.itemCount += 1;
    current.questionCount += entry.interviewQuestions.length;
    byId.set(entry.tagId, current);
  }

  const tags = [...byId.values()];
  const pillarRank = new Map(
    pillarOrder.map((pillar, index) => [`pillar:${pillar}`, index])
  );

  return tags.sort((left, right) => {
    if (left.group !== right.group) {
      return left.group === "Roadmap Pillars" ? -1 : 1;
    }
    if (left.group === "Roadmap Pillars") {
      return (pillarRank.get(left.id) ?? 999) - (pillarRank.get(right.id) ?? 999);
    }
    return (firstSeenRank.get(left.id) ?? 999) - (firstSeenRank.get(right.id) ?? 999);
  });
}

export function countDailyPlanInterviewQuestions(
  entries: DailyPlanQuestionEntry[]
) {
  return entries.reduce(
    (sum, entry) => sum + entry.interviewQuestions.length,
    0
  );
}
