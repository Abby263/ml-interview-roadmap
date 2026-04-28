import QuestionBankExplorer from "@/components/QuestionBankExplorer";
import { dailyPlan } from "@/lib/daily-plan";
import {
  buildDailyPlanQuestionEntries,
  buildDailyPlanQuestionTags,
  countDailyPlanInterviewQuestions,
} from "@/lib/daily-plan-questions";

export default function QuestionsPage() {
  const entries = buildDailyPlanQuestionEntries(dailyPlan);
  const tags = buildDailyPlanQuestionTags(entries);
  const interviewQuestionCount = countDailyPlanInterviewQuestions(entries);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Browse Questions · {entries.length} daily topics
        </p>
        <h1 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
          Study by pillar or DSA pattern
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          Select a tag first. The page then lists the same daily-plan topics
          and interview prompts that appear across the 133-day study plan.
        </p>
      </header>

      <QuestionBankExplorer
        entries={entries}
        tags={tags}
        interviewQuestionCount={interviewQuestionCount}
      />
    </div>
  );
}
