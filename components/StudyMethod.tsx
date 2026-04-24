import Link from "next/link";

import { studyMethodSteps } from "@/lib/site-data";

export default function StudyMethod({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "grid gap-5 md:grid-cols-2 xl:grid-cols-4" : "grid gap-6 md:grid-cols-2"}>
      {studyMethodSteps.map((step) => (
        <article
          key={step.step}
          className="section-card relative flex h-full flex-col rounded-[28px] p-6 md:p-7"
        >
          <div className="flex items-center justify-between">
            <span className="step-number">{step.step}</span>
            <span className="kicker">{step.timeHint}</span>
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
            {step.title}
          </h3>
          <p className="mt-3 text-[0.98rem] leading-7 text-muted">
            {step.goal}
          </p>

          {!compact ? (
            <>
              <div className="mt-6 space-y-3">
                <p className="panel-label">How to run this step</p>
                <ul className="space-y-2 text-sm leading-7 text-muted">
                  {step.actions.map((action) => (
                    <li key={action} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface-muted mt-6 rounded-[1.25rem] border border-line p-4">
                <p className="panel-label">What you should have at the end</p>
                <p className="mt-2 text-sm leading-7 text-foreground">{step.output}</p>
              </div>
            </>
          ) : (
            <ul className="mt-5 space-y-2 text-sm leading-6 text-muted">
              {step.actions.slice(0, 2).map((action) => (
                <li key={action} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
      {!compact ? (
        <div className="md:col-span-2">
          <Link href="/start-here" className="button-primary-accent">
            Open the full start-here guide
          </Link>
        </div>
      ) : null}
    </div>
  );
}
