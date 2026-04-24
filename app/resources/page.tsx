import SectionHeading from "@/components/SectionHeading";
import { resources } from "@/lib/site-data";

export default function ResourcesPage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <p className="eyebrow">Resources</p>
        <h1 className="hero-title">Curated study material to support the roadmap.</h1>
        <p className="hero-copy">
          The goal is not to collect endless links. It is to point candidates
          toward a small set of trustworthy materials that pair well with the
          roadmap and question bank.
        </p>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Curated links"
          title="Courses, docs, and guides that match the prep surface"
          description="Resources are grouped around applied usefulness for interviews, not around maximal breadth."
        />

        <div className="grid gap-5 xl:grid-cols-2">
          {resources.map((resource) => (
            <a
              key={resource.href}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="section-card rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {resource.type}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
                {resource.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {resource.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
