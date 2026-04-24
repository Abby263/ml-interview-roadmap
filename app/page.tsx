import Link from "next/link";

import PlanBuilder from "@/components/PlanBuilder";
import RoadmapOrbit from "@/components/RoadmapOrbit";
import SectionHeading from "@/components/SectionHeading";
import { listBlogPosts, listCaseStudyEntries } from "@/lib/content";
import { featureCards, getPillarHref, getRoadmapHref, homeHighlights, pillars, readinessWeights, roadmaps } from "@/lib/site-data";

export default async function Home() {
  const editorialPosts = await listBlogPosts();
  const featuredCaseStudies = await listCaseStudyEntries();

  return (
    <div className="space-y-20">
      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="data-chip">90-day flagship roadmap</span>
            <span className="data-chip">Question bank + case studies</span>
          </div>
          <p className="eyebrow">Structured interview prep operating system</p>
          <h1 className="hero-title">
            Prepare for ML, deep learning, GenAI, and system design interviews
            in 30, 60, or 90 days.
          </h1>
          <p className="hero-copy">
            ML Interview Roadmap turns scattered prep into a structured path:
            timelines, pillar-based learning, topic cards, question banks, and
            real case studies for modern MLE and AI engineer interviews.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/90-day-roadmap" className="button-primary">
              Start the 90-day roadmap
            </Link>
            <Link href="/roadmaps" className="button-secondary">
              Compare all tracks
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {homeHighlights.map((item) => (
              <div key={item} className="metric-slab">
                <p className="panel-label">Platform signal</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="hero-panel overflow-hidden p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Why this exists</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-foreground">
                Not another flat list of ML topics.
              </h2>
            </div>
            <div className="hidden h-20 w-20 rounded-full border border-line bg-[radial-gradient(circle_at_30%_30%,rgba(21,94,239,0.14),transparent_65%)] lg:block" />
          </div>
          <p className="mt-4 text-base leading-8 text-muted">
            Interviews now mix coding, ML fundamentals, deep learning, LLM
            systems, production trade-offs, and project storytelling. This site
            organizes the full surface area into a coherent prep stack.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="surface-muted rounded-[1.5rem] border border-line p-5">
              <p className="panel-label">
                Personas
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
                <p>Beginner ML candidate</p>
                <p>Data Scientist moving to MLE</p>
                <p>Backend engineer moving to AI engineer</p>
                <p>Senior MLE and GenAI engineer</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="surface-muted rounded-[1.5rem] border border-line p-5">
                <p className="panel-label">Readiness model</p>
                <p className="mt-3 text-4xl font-black text-foreground">72 / 100</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Strong in SQL, ML foundations, and RAG basics.
                </p>
              </div>
              <div className="surface-muted rounded-[1.5rem] border border-line p-5">
                <p className="panel-label">Delivery format</p>
                <div className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  <p>Roadmaps</p>
                  <p>Topic cards</p>
                  <p>Case studies</p>
                  <p>Readiness scoring</p>
                </div>
              </div>
            </div>
            <div className="surface-muted rounded-[1.5rem] border border-line p-5">
              <p className="panel-label">
                Coverage
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="data-chip">ML fundamentals</span>
                <span className="data-chip">GenAI</span>
                <span className="data-chip">System design</span>
                <span className="data-chip">MLOps</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Choose your path"
          title="One flagship timeline plus role-based variations"
          description="Start with the time horizon that matches your interview date, then use role tracks to rebalance the mix."
        />

        <div className="grid gap-5 xl:grid-cols-4">
          {roadmaps.map((roadmap) => (
            <Link
              key={roadmap.slug}
              href={getRoadmapHref(roadmap.slug)}
              className="section-card rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {roadmap.durationLabel}
              </p>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                {roadmap.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {roadmap.headline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Interactive roadmap preview"
          title="Eight pillars connected like an interview map"
          description="Use the roadmap as a navigation surface, not just an article index. Each node opens topic cards and practical study material."
        />
        <RoadmapOrbit />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Platform features"
          title="The MVP is content-first, but it already behaves like prep infrastructure"
          description="Roadmaps, topic cards, question filters, case studies, and readiness weighting create the operating-system feel without forcing login first."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((item) => (
            <article key={item.title} className="section-card rounded-[24px] p-6">
              <h3 className="font-display text-2xl font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Personalized planner"
          title="Generate a prep mix from your role, timeline, and weak areas"
          description="This is the lightweight version of the future roadmap generator. It helps candidates stop over-studying strong areas and under-preparing weak ones."
        />
        <PlanBuilder />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Learn by pillar"
          title="Go deep by track, not just by timeline"
          description="Each pillar collects modules, topic cards, and representative interview prompts. This keeps the roadmap visual while preserving depth."
        />
        <div className="grid gap-5 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <Link
              key={pillar.slug}
              href={getPillarHref(pillar.slug)}
              className="section-card rounded-[24px] p-5 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {pillar.heroLabel}
              </p>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                {pillar.navTitle}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{pillar.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Case studies"
            title="Practice the systems questions that differentiate strong candidates"
            description="Recommendation, fraud, search ranking, enterprise RAG, and evaluation systems all show up because they reveal product judgment and operational maturity."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {featuredCaseStudies.slice(0, 4).map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="section-card rounded-[24px] p-6 transition hover:-translate-y-1 hover:border-primary"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {study.track}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
                  {study.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">{study.prompt}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="section-card rounded-[32px] p-6 md:p-8">
          <p className="eyebrow">Interview readiness score</p>
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
            Weighted toward the parts that actually break loops.
          </h2>
          <div className="mt-8 space-y-4">
            {readinessWeights.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-muted">{item.weight}</span>
                </div>
                <div className="line-muted h-3 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight"
                    style={{ width: `${item.weight * 4}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Blog and SEO"
          title="Content hooks that can compound distribution over time"
          description="The blog layer is positioned for long-tail search around roadmaps, system design, RAG, feature stores, and interview questions."
        />
        <div className="grid gap-5 xl:grid-cols-3">
          {editorialPosts.slice(0, 6).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="section-card rounded-[24px] p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {post.readTime}
              </p>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
