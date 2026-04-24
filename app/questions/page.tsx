import QuestionBankExplorer from "@/components/QuestionBankExplorer";
import SectionHeading from "@/components/SectionHeading";
import { questions } from "@/lib/site-data";

export default function QuestionsPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <p className="eyebrow">Question Bank</p>
        <h1 className="hero-title">
          Interview questions with answer structure, expected signals, and traps.
        </h1>
        <p className="hero-copy">
          This page is designed for rehearsal. Search by topic, filter by
          category, and study the difference between a merely correct answer and
          a strong interview answer.
        </p>
      </section>

      <SectionHeading
        eyebrow="Practice library"
        title="Questions across ML, GenAI, system design, and behavioral prep"
        description="Each card includes an answer outline, what interviewers are actually listening for, and common mistakes that weaken otherwise strong candidates."
      />

      <QuestionBankExplorer questions={questions} />
    </div>
  );
}
