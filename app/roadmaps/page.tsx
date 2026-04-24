import Link from "next/link";

import FocusMix from "@/components/FocusMix";
import SectionHeading from "@/components/SectionHeading";
import { getRoadmapHref, roadmaps } from "@/lib/site-data";

export default function RoadmapsPage() {
  const timelineRoadmaps = roadmaps.filter((roadmap) =>
    ["90-day", "60-day", "30-day"].includes(roadmap.slug)
  );
  const roleRoadmaps = roadmaps.filter((roadmap) =>
    [
      "data-scientist",
      "ml-engineer",
      "ai-engineer",
      "senior-mle",
      "ml-architect",
    ].includes(roadmap.slug)
  );

  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <p className="eyebrow">Roadmaps</p>
        <h1 className="hero-title">Compare timeline and role-based prep tracks.</h1>
        <p className="hero-copy">
          The time-based roadmaps help candidates structure the calendar. The
          role-based tracks show where to bias the study mix based on background
          and target role.
        </p>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Timeline modes"
          title="30, 60, and 90-day paths"
          description="Choose the roadmap that matches how much time you have before interviews begin."
        />
        <div className="grid gap-6 xl:grid-cols-3">
          {timelineRoadmaps.map((roadmap) => (
            <Link
              key={roadmap.slug}
              href={getRoadmapHref(roadmap.slug)}
              className="section-card rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {roadmap.dailyCommitment}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
                {roadmap.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {roadmap.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Role tracks"
          title="Paths tailored to how candidates are transitioning"
          description="Each role track changes the emphasis across fundamentals, systems, and GenAI rather than pretending every candidate starts from zero."
        />
        <div className="grid gap-6 xl:grid-cols-2">
          {roleRoadmaps.map((roadmap) => (
            <article
              id={roadmap.slug}
              key={roadmap.slug}
              className="section-card rounded-[28px] p-6 md:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {roadmap.headline}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
                {roadmap.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {roadmap.description}
              </p>
              <div className="mt-6">
                <FocusMix items={roadmap.focusMix} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
