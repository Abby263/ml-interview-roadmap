import Link from "next/link";
import { notFound } from "next/navigation";

import SectionHeading from "@/components/SectionHeading";
import {
  getTopicsByPillar,
  pillars,
  questions,
  type PillarSlug,
} from "@/lib/site-data";

export default function PillarPage({ slug }: { slug: PillarSlug }) {
  const pillar = pillars.find((item) => item.slug === slug);

  if (!pillar) {
    notFound();
  }

  const pillarTopics = getTopicsByPillar(slug);
  const relatedQuestions = questions.filter((question) =>
    question.relatedTopics.some((topicId) =>
      pillarTopics.some((topic) => topic.id === topicId)
    )
  );

  return (
    <div className="space-y-16">
      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="eyebrow">{pillar.heroLabel}</p>
          <h1 className="hero-title">{pillar.title}</h1>
          <p className="hero-copy">{pillar.summary}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/questions" className="button-primary">
              Open question bank
            </Link>
            <Link href="/case-studies" className="button-secondary">
              Browse case studies
            </Link>
          </div>
        </div>

        <aside className="section-card rounded-[32px] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Interview signal
          </p>
          <p className="mt-4 text-lg leading-8 text-foreground">
            {pillar.interviewSignal}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {pillar.modules.map((module) => (
              <div
                key={module}
                className="surface-muted rounded-[20px] border border-line p-4"
              >
                <p className="text-sm font-semibold text-foreground">{module}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Featured topics"
          title={`${pillarTopics.length} topic cards built for interview prep`}
          description="Each topic includes a summary, practical learning goals, representative interview prompts, and a suggested roadmap day."
        />

        <div className="grid gap-5 xl:grid-cols-2">
          {pillarTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.id}`}
              className="section-card rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="tone-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  {topic.difficulty}
                </span>
                <span className="tone-highlight rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  {topic.estimatedTimeMinutes} min
                </span>
                {topic.roadmapDay ? (
                  <span className="tone-accent rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    Day {topic.roadmapDay}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                {topic.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">{topic.summary}</p>

              <div className="mt-5 space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Learning objectives
                </p>
                <ul className="space-y-2 text-sm leading-6 text-muted">
                  {topic.learningObjectives.slice(0, 2).map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Practice prompts"
          title="Questions tied directly to this pillar"
          description="Use these to rehearse concise, signal-rich answers instead of passive reading."
        />
        <div className="grid gap-5 xl:grid-cols-2">
          {relatedQuestions.map((question) => (
            <article key={question.id} className="section-card rounded-[24px] p-6">
              <div className="flex flex-wrap gap-2">
                <span className="tone-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  {question.category}
                </span>
                <span className="tone-accent rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  {question.difficulty}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                {question.question}
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
                {question.expectedSignals.map((signal) => (
                  <li key={signal}>• {signal}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
