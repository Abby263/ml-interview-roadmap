import type { Metadata } from "next";

import SectionHeading from "@/components/SectionHeading";
import { roadmaps } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Roadmap Tracks",
  description:
    "Compare 30, 60, and 90-day ML interview roadmaps plus role-based tracks for DS, MLE, AI Engineer, Senior MLE, and ML Architect prep.",
};

export default function RoadmapsPage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <p className="eyebrow">Roadmap tracks</p>
        <h1 className="hero-title">
          Choose the timeline and role mix that matches your interview loop.
        </h1>
        <p className="hero-copy">
          The public roadmap starts with statistics, then moves through
          traditional ML, deep learning, MLOps, GenAI, LLMOps, and ML system
          design. These tracks compress or rebalance that same sequence for
          different timelines and roles.
        </p>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Timeline tracks"
          title="30, 60, and 90-day preparation windows"
          description="Use these when your interview date is fixed and you need a concrete study cadence."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {roadmaps.slice(0, 3).map((roadmap) => (
            <RoadmapCard key={roadmap.slug} roadmap={roadmap} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Role-based tracks"
          title="Rebalance the roadmap for your target role"
          description="Use these tracks after picking a timeline, especially if your role overweights systems, GenAI, experimentation, or leadership."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {roadmaps.slice(3).map((roadmap) => (
            <RoadmapCard key={roadmap.slug} roadmap={roadmap} />
          ))}
        </div>
      </section>
    </div>
  );
}

function RoadmapCard({ roadmap }: { roadmap: (typeof roadmaps)[number] }) {
  return (
    <article
      id={roadmap.slug}
      className="section-card scroll-mt-24 rounded-[28px] p-6 md:p-7"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="tone-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
          {roadmap.durationLabel}
        </span>
        <span className="tone-accent rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
          {roadmap.dailyCommitment}
        </span>
      </div>

      <h2 className="mt-5 font-display text-2xl font-bold text-foreground">
        {roadmap.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted">{roadmap.headline}</p>
      <p className="mt-3 text-sm leading-7 text-muted">
        {roadmap.description}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {roadmap.focusMix.map((item) => (
          <div key={item.label} className="rounded-2xl border border-line p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-foreground">
                {item.label}
              </span>
              <span className="font-mono text-xs text-muted">
                {item.weight}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight"
                style={{ width: `${item.weight}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {roadmap.phases.map((phase) => (
          <div key={`${phase.title}-${phase.label ?? phase.startDay}`} className="rounded-2xl border border-line p-4">
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
              {phase.label ??
                (phase.startDay && phase.endDay
                  ? `Days ${phase.startDay}-${phase.endDay}`
                  : "Track block")}
            </p>
            <h3 className="mt-2 font-display text-lg font-bold text-foreground">
              {phase.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted">{phase.focus}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {phase.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
