import Link from "next/link";

import SectionHeading from "@/components/SectionHeading";
import { getPillarHref, pillars } from "@/lib/site-data";

export default function LearnPage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <p className="eyebrow">Learn</p>
        <h1 className="hero-title">Eight content pillars that cover the full ML interview loop.</h1>
        <p className="hero-copy">
          Use the learn library when you want to go deep by skill area instead
          of following the calendar. This is where the roadmap becomes a
          reusable knowledge base.
        </p>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Library"
          title="From foundations to project storytelling"
          description="Each pillar includes modules, topic cards, and representative interview prompts."
        />
        <div className="grid gap-5 xl:grid-cols-2">
          {pillars.map((pillar) => (
            <Link
              key={pillar.slug}
              href={getPillarHref(pillar.slug)}
              className="section-card rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {pillar.heroLabel}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {pillar.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {pillar.modules.map((module) => (
                  <span
                    key={module}
                    className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
