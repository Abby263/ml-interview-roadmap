import Link from "next/link";

import ArchitectCompetencies from "@/components/ArchitectCompetencies";
import HowToUseFlow from "@/components/HowToUseFlow";
import PlanBuilder from "@/components/PlanBuilder";
import RoadmapOrbit from "@/components/RoadmapOrbit";
import SectionHeading from "@/components/SectionHeading";
import TradeoffFrameworks from "@/components/TradeoffFrameworks";
import { listBlogPosts, listCaseStudyEntries } from "@/lib/content";
import {
  getPillarHref,
  getRoadmapHref,
  homeHeroStats,
  pillars,
  readinessWeights,
  roadmaps,
} from "@/lib/site-data";

export default async function Home() {
  const editorialPosts = await listBlogPosts();
  const featuredCaseStudies = await listCaseStudyEntries();
  const timelineRoadmaps = roadmaps.filter((roadmap) =>
    ["30-day", "60-day", "90-day"].includes(roadmap.slug)
  );
  const roleRoadmaps = roadmaps.filter(
    (roadmap) => !["30-day", "60-day", "90-day"].includes(roadmap.slug)
  );

  return (
    <div className="space-y-24">
      <section className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="data-chip">Built for ML &amp; AI interview loops</span>
            <span className="data-chip">Architect-level depth</span>
          </div>
          <p className="eyebrow">A structured prep operating system</p>
          <h1 className="hero-title">
            Clear your ML Architect interview with a plan, not a pile of tabs.
          </h1>
          <p className="lede">
            ML Interview Roadmap walks you from <strong>plan</strong> to{" "}
            <strong>learn</strong>, then <strong>practice</strong>, then{" "}
            <strong>mock</strong> — the same loop strong candidates follow when
            they actually get the offer.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/start-here" className="button-primary-accent">
              Start here — build your plan
            </Link>
            <Link href="/90-day-roadmap" className="button-secondary">
              Jump to the 90-day roadmap
            </Link>
          </div>

          <dl className="grid gap-3 pt-2 sm:grid-cols-4">
            {homeHeroStats.map((stat) => (
              <div key={stat.label} className="metric-slab">
                <dt className="panel-label">{stat.label}</dt>
                <dd className="mt-2 font-display text-3xl font-extrabold text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="hero-panel overflow-hidden p-6 md:p-8">
          <p className="eyebrow">Who this is for</p>
          <h2 className="mt-4 font-display text-2xl font-extrabold text-foreground md:text-[1.75rem]">
            Built for candidates who want to interview like an architect, not cram like a student.
          </h2>
          <p className="mt-4 text-[0.98rem] leading-7 text-muted">
            If you are preparing for an ML Architect, Principal, Senior MLE, or
            AI Engineer loop, you already know breadth is not the problem —
            judgment under ambiguity is. This site is organized around that
            reality.
          </p>

          <div className="mt-7 space-y-3 text-sm leading-7 text-foreground">
            <div className="flex items-start gap-3">
              <span className="step-number">1</span>
              <div>
                <p className="font-semibold">Pick a timeline and a role track</p>
                <p className="text-muted">30 / 60 / 90-day plans, plus role-based paths.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="step-number">2</span>
              <div>
                <p className="font-semibold">Learn by pillar, not by topic dump</p>
                <p className="text-muted">Eight pillars, each with signals interviewers score.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="step-number">3</span>
              <div>
                <p className="font-semibold">Practice with questions and case studies</p>
                <p className="text-muted">Answer out loud, compare against expected signals.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="step-number">4</span>
              <div>
                <p className="font-semibold">Mock, score, and repair the gap</p>
                <p className="text-muted">Rebalance study time toward whatever is lagging.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="How to use this site"
          title="A four-stage study loop, not a linear reading list"
          description="Each stage has a clear output. Finish one before the next so your prep produces evidence of readiness, not just hours logged."
        />
        <HowToUseFlow />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Step 1 · Plan"
          title="Pick a timeline, then layer a role track"
          description="Start with the calendar pressure, then bend the mix toward the role loop you are actually interviewing for."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {timelineRoadmaps.map((roadmap) => (
            <Link
              key={roadmap.slug}
              href={getRoadmapHref(roadmap.slug)}
              className="section-card rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="kicker">{roadmap.durationLabel}</p>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                {roadmap.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-7 text-muted">
                {roadmap.headline}
              </p>
              <p className="panel-label mt-6">Daily commitment</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {roadmap.dailyCommitment}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {roleRoadmaps.map((roadmap) => (
            <Link
              key={roadmap.slug}
              href={getRoadmapHref(roadmap.slug)}
              className="section-card rounded-[24px] p-5 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="kicker">{roadmap.durationLabel}</p>
              <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                {roadmap.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {roadmap.headline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Step 2 · Learn"
          title="Eight pillars mapped to the signals interviewers score"
          description="Each pillar opens topic cards with objectives, interview prompts, and a recommended roadmap day so you never guess what to study next."
        />
        <RoadmapOrbit />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <Link
              key={pillar.slug}
              href={getPillarHref(pillar.slug)}
              className="section-card rounded-[24px] p-5 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="kicker">{pillar.heroLabel}</p>
              <h3 className="mt-3 font-display text-xl font-bold text-foreground">
                {pillar.navTitle}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{pillar.summary}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Interview signal
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {pillar.interviewSignal}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Built for ML Architect loops"
          title="Six competencies the architect loop actually tests"
          description="Architect-level interviews are graded on judgment under ambiguity. These six competencies show up across every strong loop — use them as your self-scoring rubric."
        />
        <ArchitectCompetencies />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Architect trade-off playbook"
          title="Six trade-offs you will be asked to defend"
          description="Memorize the axes, not the answers. Every strong design answer names the trade-off, compares real options, and commits with a reason."
        />
        <TradeoffFrameworks />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Step 3 · Practice"
          title="Turn topic knowledge into interview signals"
          description="These prompts reveal product judgment and operational maturity. Work them on paper first, then out loud against the expected signals."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {featuredCaseStudies.slice(0, 4).map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="section-card rounded-[24px] p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="kicker">{study.track}</p>
              <h3 className="mt-3 font-display text-xl font-bold text-foreground md:text-2xl">
                {study.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">{study.prompt}</p>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/questions" className="button-primary">
            Open the full question bank
          </Link>
          <Link href="/case-studies" className="button-secondary">
            Browse all case studies
          </Link>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Step 4 · Mock & Review"
            title="Rebalance toward gaps, not comforts"
            description="The readiness model weights the pillars the way real loops do. Use it to stop over-studying what you already know."
          />
          <div className="section-card rounded-[28px] p-6 md:p-8">
            <p className="panel-label">Readiness weights</p>
            <div className="mt-6 space-y-4">
              {readinessWeights.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="font-mono text-muted">{item.weight}%</span>
                  </div>
                  <div className="line-muted h-2.5 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight"
                      style={{ width: `${item.weight * 4}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeading
            eyebrow="Personalized planner"
            title="Generate a prep mix, not a flat topic list"
            description="Tell the planner your role, level, and weak areas. It rebalances the pillar mix so your study hours land where the interview risk is."
          />
          <PlanBuilder />
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Deeper reading"
          title="Long-form articles on the highest-signal topics"
          description="Use the blog for deeper context on roadmaps, system design, RAG, and evaluation — all written for interview-ready answers."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {editorialPosts.slice(0, 6).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="section-card rounded-[24px] p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="kicker">{post.readTime}</p>
              <h3 className="mt-3 font-display text-xl font-bold text-foreground md:text-2xl">
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
