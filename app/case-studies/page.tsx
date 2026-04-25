import Link from "next/link";

import SaveCaseStudyButton from "@/components/SaveCaseStudyButton";
import { listCaseStudyEntries } from "@/lib/content";

export default async function CaseStudiesPage() {
  const caseStudies = await listCaseStudyEntries();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Case studies · {caseStudies.length}
        </p>
        <h1 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
          ML &amp; GenAI system design prompts
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          Each case has a prompt, concepts it tests, and the evaluation lens
          interviewers use. Click to open the full walkthrough.
        </p>
      </header>

      <section className="space-y-6">
        <div className="grid gap-5 xl:grid-cols-2">
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              className="section-card rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-primary"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <span className="tone-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    {study.track}
                  </span>
                  <span className="tone-accent rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    {study.difficulty}
                  </span>
                </div>
                <SaveCaseStudyButton slug={study.slug} />
              </div>
              <Link href={`/case-studies/${study.slug}`} className="block">
                <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
                  {study.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted">{study.prompt}</p>
              </Link>

              <div className="mt-6">
                <p className="text-sm font-semibold text-foreground">
                  Concepts tested
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {study.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-foreground">
                  Evaluation lens
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {study.evaluationLens.map((item) => (
                    <span
                      key={item}
                      className="surface-muted rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
