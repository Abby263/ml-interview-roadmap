import { getRoadmapGuide } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";

import FocusMix from "@/components/FocusMix";
import SectionHeading from "@/components/SectionHeading";
import { caseStudies, getRoadmapBySlug, topics, type RoadmapSlug } from "@/lib/site-data";

export default async function RoadmapPage({ slug }: { slug: RoadmapSlug }) {
  const roadmap = getRoadmapBySlug(slug);
  const guide = await getRoadmapGuide(slug);

  if (!roadmap) {
    notFound();
  }

  const featuredTopics = topics.filter((topic) => {
    if (!topic.roadmapDay) {
      return false;
    }

    if (slug === "30-day") {
      return topic.roadmapDay <= 30;
    }

    if (slug === "60-day") {
      return topic.roadmapDay <= 60;
    }

    return topic.roadmapDay <= 90;
  });

  return (
    <div className="space-y-16">
      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="eyebrow">{roadmap.durationLabel}</p>
          <h1 className="hero-title">{roadmap.title}</h1>
          <p className="hero-copy">{roadmap.headline}</p>
          <p className="max-w-2xl text-base leading-8 text-muted">
            {roadmap.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {roadmap.targetRoles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        <aside className="section-card rounded-[32px] p-6 md:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                Daily commitment
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {roadmap.dailyCommitment}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                Best for
              </p>
              <div className="mt-3 space-y-2 text-sm leading-6 text-muted">
                {roadmap.audience.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-muted mt-8 rounded-[24px] border border-line p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
              Focus mix
            </p>
            <div className="mt-4">
              <FocusMix items={roadmap.focusMix} />
            </div>
          </div>
        </aside>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Timeline"
          title="A paced roadmap, not a flat checklist"
          description="Each phase has a clear focus, a bounded scope, and a role in the overall interview loop."
        />

        <div className="grid gap-5 xl:grid-cols-2">
          {roadmap.phases.map((phase) => (
            <article key={phase.title} className="section-card rounded-[28px] p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tone-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  {phase.startDay && phase.endDay
                    ? `Days ${phase.startDay}-${phase.endDay}`
                    : phase.label}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                {phase.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">{phase.focus}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {phase.topics.map((item) => (
                  <div
                    key={item}
                    className="surface-muted rounded-[18px] border border-line px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {guide ? (
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Editorial guide"
            title={guide.frontmatter.title}
            description={guide.frontmatter.summary}
          />
          <article className="section-card article-prose rounded-[2rem] p-6 md:p-10">
            {guide.content}
          </article>
        </section>
      ) : null}

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Featured study items"
          title="Topics to attack inside this roadmap"
          description="These topic cards act as the bridge between the big timeline and the specific interview prompts you need to rehearse."
        />
        <div className="grid gap-5 xl:grid-cols-3">
          {featuredTopics.slice(0, 6).map((topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.id}`}
              className="section-card rounded-[24px] p-5 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Day {topic.roadmapDay}
              </p>
              <h3 className="mt-3 font-display text-xl font-bold text-foreground">
                {topic.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{topic.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Case studies"
          title="Practice architecture, not only recall"
          description="Real interview loops increasingly test your ability to reason across product goals, data, models, infra, and operational risk."
        />
        <div className="grid gap-5 xl:grid-cols-2">
          {caseStudies.slice(0, 4).map((study) => (
            <article key={study.slug} className="section-card rounded-[24px] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {study.track}
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
                {study.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">{study.prompt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {study.concepts.map((concept) => (
                  <span
                    key={concept}
                    className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
