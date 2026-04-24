import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SaveCaseStudyButton from "@/components/SaveCaseStudyButton";
import {
  getCaseStudyEntry,
  getCaseStudyStaticParams,
  listCaseStudyEntries,
} from "@/lib/content";

export async function generateStaticParams() {
  return getCaseStudyStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cases = await listCaseStudyEntries();
  const entry = cases.find((item) => item.slug === slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
    description: entry.description,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudyEntry(slug).catch(() => null);

  if (!study) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <section className="mx-auto max-w-4xl space-y-6">
        <p className="eyebrow">{study.frontmatter.track}</p>
        <h1 className="hero-title text-[3.2rem] md:text-[4rem]">
          {study.frontmatter.title}
        </h1>
        <p className="hero-copy">{study.frontmatter.description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="data-chip">{study.frontmatter.difficulty}</span>
          {study.frontmatter.concepts.map((concept) => (
            <span key={concept} className="data-chip">
              {concept}
            </span>
          ))}
          <SaveCaseStudyButton slug={slug} />
        </div>
      </section>

      <section className="section-card mx-auto grid max-w-4xl gap-6 rounded-[2rem] p-6 md:grid-cols-2 md:p-8">
        <div>
          <p className="panel-label">Prompt</p>
          <p className="mt-3 text-sm leading-7 text-muted">
            {study.frontmatter.prompt}
          </p>
        </div>
        <div>
          <p className="panel-label">Evaluation lens</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {study.frontmatter.evaluationLens.map((item) => (
              <span key={item} className="data-chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <article className="section-card article-prose mx-auto max-w-4xl rounded-[2rem] p-6 md:p-10">
        {study.content}
      </article>
    </div>
  );
}
