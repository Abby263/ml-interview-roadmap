import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import DayChecklist from "@/components/DayChecklist";
import { listCaseStudyEntries } from "@/lib/content";
import { dailyPlan, getDayPlan } from "@/lib/daily-plan";
import {
  getPillarBySlug,
  getPillarHref,
  getTopicById,
  questions,
} from "@/lib/site-data";

export function generateStaticParams() {
  return dailyPlan.map((entry) => ({ day: String(entry.day) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ day: string }>;
}): Promise<Metadata> {
  const { day } = await params;
  const plan = getDayPlan(Number(day));
  if (!plan) return {};
  return {
    title: `Day ${plan.day} · ${plan.title}`,
    description: plan.focus,
  };
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  const plan = getDayPlan(Number(day));
  if (!plan) notFound();

  const pillar = getPillarBySlug(plan.pillar);
  const topic = plan.topicId ? getTopicById(plan.topicId) : undefined;
  const caseStudy = plan.caseStudySlug
    ? (await listCaseStudyEntries()).find(
        (study) => study.slug === plan.caseStudySlug
      )
    : undefined;
  const linkedQuestions = (plan.questionIds ?? [])
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is (typeof questions)[number] => Boolean(q));

  const prev = plan.day > 1 ? plan.day - 1 : null;
  const next = plan.day < dailyPlan.length ? plan.day + 1 : null;

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link href="/" className="text-muted hover:text-foreground">
          ← All days
        </Link>
        <span className="text-muted">·</span>
        {pillar ? (
          <Link
            href={getPillarHref(pillar.slug)}
            className="text-muted hover:text-foreground"
          >
            {pillar.navTitle}
          </Link>
        ) : null}
      </div>

      <header className="space-y-4">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          Day {plan.day} of {dailyPlan.length}
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
          {plan.title}
        </h1>
        <p className="text-lg leading-[1.7] text-muted md:text-xl">
          {plan.focus}
        </p>
      </header>

      <DayChecklist plan={plan} />

      {plan.interviewQuestions.length > 0 ? (
        <section className="section-card rounded-[28px] p-6 md:p-8">
          <p className="panel-label">Daily interview questions</p>
          <ul className="mt-5 space-y-3">
            {plan.interviewQuestions.map((question) => (
              <li
                key={question}
                className="flex gap-3 text-[0.98rem] leading-7 text-foreground"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {linkedQuestions.length > 0 ? (
        <section className="section-card rounded-[28px] p-6 md:p-8">
          <p className="panel-label">Related question-bank prompts</p>
          <ul className="mt-4 space-y-4">
            {linkedQuestions.map((q) => (
              <li key={q.id}>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  {q.category}
                </span>
                <p className="mt-1 text-[0.98rem] leading-7 text-foreground">
                  {q.question}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/questions"
            className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            Open the full question bank →
          </Link>
        </section>
      ) : null}

      {plan.references.length > 0 ? (
        <section className="section-card rounded-[28px] p-6 md:p-8">
          <p className="panel-label">References &amp; further reading</p>
          <ul className="mt-4 space-y-3">
            {plan.references.map((r) => (
              <li
                key={r.href}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
              >
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.98rem] font-semibold text-primary hover:underline"
                >
                  {r.label} ↗
                </a>
                {r.source ? (
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                    {r.source}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {topic ? (
        <section className="section-card rounded-[28px] p-6 md:p-8">
          <p className="panel-label">Linked topic</p>
          <Link href={`/topics/${topic.id}`} className="group mt-3 block">
            <h2 className="font-display text-2xl font-bold text-foreground group-hover:text-primary">
              {topic.title} →
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">{topic.summary}</p>
          </Link>
        </section>
      ) : null}

      {caseStudy ? (
        <section className="section-card rounded-[28px] p-6 md:p-8">
          <p className="panel-label">Linked case study</p>
          <Link
            href={`/case-studies/${caseStudy.slug}`}
            className="group mt-3 block"
          >
            <h2 className="font-display text-2xl font-bold text-foreground group-hover:text-primary">
              {caseStudy.title} →
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">{caseStudy.prompt}</p>
          </Link>
        </section>
      ) : null}

      <nav className="flex items-center justify-between border-t border-line pt-6">
        {prev ? (
          <Link
            href={`/day/${prev}`}
            className="text-sm font-semibold text-muted hover:text-foreground"
          >
            ← Day {prev}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/day/${next}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Day {next} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
