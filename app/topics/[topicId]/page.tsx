import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import TopicActionBar from "@/components/TopicActionBar";
import { getPillarBySlug, getPillarHref, getRelatedTopics, getTopicById, topics } from "@/lib/site-data";

export function generateStaticParams() {
  return topics.map((topic) => ({ topicId: topic.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicId: string }>;
}): Promise<Metadata> {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    return {};
  }

  return {
    title: topic.title,
    description: topic.summary,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    notFound();
  }

  const pillar = getPillarBySlug(topic.pillar);
  const prerequisiteTopics = getRelatedTopics(topic.prerequisites);

  return (
    <div className="space-y-16">
      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="eyebrow">{pillar?.navTitle}</p>
          <h1 className="hero-title">{topic.title}</h1>
          <p className="hero-copy">{topic.summary}</p>
          <div className="flex flex-wrap gap-3">
            {topic.roadmapDay ? (
              <span className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground">
                Recommended on day {topic.roadmapDay}
              </span>
            ) : null}
            <span className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground">
              {topic.estimatedTimeMinutes} minutes
            </span>
            <span className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground">
              {topic.difficulty}
            </span>
          </div>
          <TopicActionBar topicId={topic.id} />
        </div>

        <aside className="section-card rounded-[32px] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Fits best for
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {topic.roleTags.map((tag) => (
              <span
                key={tag}
                className="tone-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Common target companies
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {topic.companyTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          {pillar ? (
            <Link href={getPillarHref(pillar.slug)} className="button-secondary mt-8">
              Back to {pillar.navTitle}
            </Link>
          ) : null}
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="section-card rounded-[28px] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Learning objectives
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
            {topic.learningObjectives.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="section-card rounded-[28px] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Interview prompts
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
            {topic.interviewQuestions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="section-card rounded-[28px] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Prerequisites
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {prerequisiteTopics.length > 0 ? (
              prerequisiteTopics.map((item) => (
                <Link
                  key={item.id}
                  href={`/topics/${item.id}`}
                  className="rounded-full border border-line px-3 py-2 text-sm font-medium text-muted transition hover:border-primary hover:text-foreground"
                >
                  {item.title}
                </Link>
              ))
            ) : (
              <p className="text-sm leading-7 text-muted">
                No strict prerequisites. This topic can be used as an entry point.
              </p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
