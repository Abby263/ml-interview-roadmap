import type { Metadata } from "next";
import Link from "next/link";

import StudyMethod from "@/components/StudyMethod";
import SectionHeading from "@/components/SectionHeading";
import { getRoadmapHref, roadmaps } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Start here",
  description:
    "Build a realistic ML interview study plan in under 10 minutes. Choose a timeline, pick a role track, and learn the four-stage study loop used by candidates who actually get the offer.",
};

const decisionTree = [
  {
    question: "How far is your next interview?",
    answers: [
      {
        label: "Less than 4 weeks",
        recommend: "30-day" as const,
        why: "Prioritize fundamentals you'll be tested on first: SQL, metrics, ML basics, then one system design case per week.",
      },
      {
        label: "1 to 2 months",
        recommend: "60-day" as const,
        why: "Balanced plan: foundations, deep learning, GenAI, and system design — with two weeks reserved for mocks.",
      },
      {
        label: "More than 2 months",
        recommend: "90-day" as const,
        why: "Flagship plan. Full coverage from foundations to LLMOps, with time to build projects and rehearse stories.",
      },
    ],
  },
  {
    question: "Which role loop are you targeting?",
    answers: [
      {
        label: "Data Scientist → MLE",
        recommend: "data-scientist" as const,
        why: "Shifts focus from modeling to production systems, feature stores, serving, and monitoring.",
      },
      {
        label: "ML Engineer (generalist)",
        recommend: "ml-engineer" as const,
        why: "Balances coding, training pipelines, serving, and end-to-end case studies.",
      },
      {
        label: "AI Engineer / GenAI",
        recommend: "ai-engineer" as const,
        why: "GenAI-heavy: prompting, RAG, evaluation, agents, guardrails, LLMOps.",
      },
      {
        label: "Senior MLE",
        recommend: "senior-mle" as const,
        why: "Architecture, trade-offs, reliability, leadership stories, and case-study fluency.",
      },
      {
        label: "ML Architect / Principal",
        recommend: "ml-architect" as const,
        why: "Platform thinking, cross-team trade-offs, cost and governance — the architect rubric.",
      },
    ],
  },
];

export default function StartHerePage() {
  const roadmapBySlug = new Map(roadmaps.map((roadmap) => [roadmap.slug, roadmap]));

  return (
    <div className="space-y-20">
      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="eyebrow">Start here</p>
          <h1 className="hero-title">
            Build a realistic prep plan in under ten minutes.
          </h1>
          <p className="lede">
            Three choices, one study loop. Pick a timeline, pick a role track,
            and then run the four-stage loop the rest of this site is
            organized around.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="#choose-timeline" className="button-primary-accent">
              Choose a timeline
            </Link>
            <Link href="#study-method" className="button-secondary">
              Jump to the study method
            </Link>
          </div>
        </div>
        <aside className="section-card rounded-[32px] p-6 md:p-8">
          <p className="kicker">What you will walk away with</p>
          <ul className="mt-5 space-y-4 text-[0.98rem] leading-7 text-foreground">
            <li className="flex gap-3">
              <span className="step-number">1</span>
              <span>
                <strong>A roadmap</strong> — one of 30 / 60 / 90-day plans with a
                daily commitment you can actually keep.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="step-number">2</span>
              <span>
                <strong>A role track</strong> — MLE, AI Engineer, Senior MLE, or
                ML Architect — that bends the mix toward your loop.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="step-number">3</span>
              <span>
                <strong>A study loop</strong> — orient, learn, practice, and
                mock — with a clear output after each stage.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="step-number">4</span>
              <span>
                <strong>A gap list</strong> — the pillars where your interview
                signal is weakest, so you know where to invest next.
              </span>
            </li>
          </ul>
        </aside>
      </section>

      <section id="choose-timeline" className="space-y-8">
        <SectionHeading
          eyebrow="Step 1 · Pick a timeline"
          title="Start from your interview date, not from the strongest roadmap"
          description="The right plan is the one you can finish with energy for mocks. Overreaching on a 90-day plan while you have three weeks is the most common prep mistake."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {decisionTree[0].answers.map((answer) => {
            const roadmap = roadmapBySlug.get(answer.recommend);
            if (!roadmap) return null;
            return (
              <Link
                key={answer.label}
                href={getRoadmapHref(answer.recommend)}
                className="section-card flex h-full flex-col rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-primary"
              >
                <p className="kicker">{answer.label}</p>
                <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                  {roadmap.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">{answer.why}</p>
                <p className="panel-label mt-6">Daily commitment</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {roadmap.dailyCommitment}
                </p>
                <span className="mt-auto pt-6 text-sm font-semibold text-primary">
                  Open this roadmap →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Step 2 · Pick a role track"
          title="Bend the mix toward the loop you actually interview for"
          description="Role tracks reweight the eight pillars. An ML Architect loop is graded differently than a generalist MLE loop — the plan should reflect that."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {decisionTree[1].answers.map((answer) => {
            const roadmap = roadmapBySlug.get(answer.recommend);
            if (!roadmap) return null;
            return (
              <Link
                key={answer.label}
                href={getRoadmapHref(answer.recommend)}
                className="section-card flex h-full flex-col rounded-[24px] p-6 transition hover:-translate-y-1 hover:border-primary"
              >
                <p className="kicker">{answer.label}</p>
                <h3 className="mt-3 font-display text-xl font-bold text-foreground">
                  {roadmap.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">{answer.why}</p>
                <span className="mt-auto pt-5 text-sm font-semibold text-primary">
                  Open the role track →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="study-method" className="space-y-8">
        <SectionHeading
          eyebrow="Step 3 · Run the study loop"
          title="Four stages, each with a measurable output"
          description="Read-only prep rarely clears strong loops. Every stage below ends with something you should be able to show — notes, answered prompts, a case walkthrough, or a cleaner story."
        />
        <StudyMethod />
      </section>

      <section className="section-card rounded-[32px] p-6 md:p-10">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="kicker">Finishing move</p>
            <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
              Score yourself. Repair the gap. Repeat.
            </h2>
            <p className="text-[1rem] leading-7 text-muted">
              Great candidates are not the ones who covered everything — they
              are the ones whose weakest pillar is still respectable. Use the
              readiness weights to keep your prep honest.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/questions" className="button-primary">
                Practice with the question bank
              </Link>
              <Link href="/case-studies" className="button-secondary">
                Work a case study
              </Link>
            </div>
          </div>

          <div className="surface-muted rounded-[1.5rem] border border-line p-5 md:p-6">
            <p className="panel-label">Weekly review checklist</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-foreground">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span>Ran at least one timed mock on the weakest pillar</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span>Walked a case study end-to-end on paper, out loud</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span>Updated my readiness score and shifted hours to the gap</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span>Rehearsed one behavioral story with metrics and trade-offs</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span>Shortened my gap list by at least one prompt</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
