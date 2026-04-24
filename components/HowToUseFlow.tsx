import Link from "next/link";

import { howToUseSteps } from "@/lib/site-data";

export default function HowToUseFlow() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {howToUseSteps.map((step, index) => (
        <article
          key={step.phase}
          className="section-card relative flex h-full flex-col rounded-[28px] p-6"
        >
          <div className="flex items-center justify-between">
            <span className="kicker">{step.phase}</span>
            <span className="step-number">{index + 1}</span>
          </div>
          <h3 className="mt-5 font-display text-xl font-bold text-foreground md:text-[1.35rem]">
            {step.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
          <div className="mt-auto pt-6">
            <Link
              href={step.cta.href}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {step.cta.label} →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
