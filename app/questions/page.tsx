import QuestionBankExplorer from "@/components/QuestionBankExplorer";
import { questions } from "@/lib/site-data";

export default function QuestionsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Question bank · {questions.length}
        </p>
        <h1 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
          Interview prompts with answer structure
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          Search and filter to rehearse. Each card shows the answer outline, the
          signals interviewers score, and common traps.
        </p>
      </header>

      <QuestionBankExplorer questions={questions} />
    </div>
  );
}
