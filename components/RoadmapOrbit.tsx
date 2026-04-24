import Link from "next/link";

import { getPillarHref, pillars } from "@/lib/site-data";

const orbitNodes = [
  { slug: "foundations", x: 120, y: 92 },
  { slug: "math-stats", x: 355, y: 55 },
  { slug: "traditional-ml", x: 640, y: 120 },
  { slug: "deep-learning", x: 820, y: 236 },
  { slug: "generative-ai", x: 735, y: 442 },
  { slug: "ml-system-design", x: 445, y: 500 },
  { slug: "mlops", x: 180, y: 420 },
  { slug: "behavioral-storytelling", x: 58, y: 250 },
] as const;

export default function RoadmapOrbit() {
  return (
    <>
      <div className="grid gap-4 lg:hidden">
        {pillars.map((pillar) => (
          <Link
            key={pillar.slug}
            href={getPillarHref(pillar.slug)}
            className="section-card block rounded-[22px] p-5 transition hover:-translate-y-1 hover:border-primary"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {pillar.heroLabel}
            </p>
            <h3 className="mt-3 font-display text-xl font-bold text-foreground">
              {pillar.navTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">{pillar.summary}</p>
          </Link>
        ))}
      </div>

      <div className="relative hidden h-[620px] overflow-hidden rounded-[36px] border border-line bg-surface shadow-roadmap lg:block">
        <div className="absolute inset-0 bg-mesh opacity-90" />
        <svg
          viewBox="0 0 1000 620"
          className="absolute inset-0 h-full w-full opacity-70"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="orbit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--highlight)" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <path
            d="M120 100C220 40 330 20 430 70C530 120 650 140 780 140C890 140 920 250 860 340C800 430 700 520 520 530C340 540 150 510 95 390C40 270 40 150 120 100Z"
            fill="none"
            stroke="url(#orbit)"
            strokeWidth="3"
            strokeDasharray="10 12"
          />
          <path
            d="M150 420C240 340 350 300 450 300C570 300 680 350 760 430"
            fill="none"
            stroke="url(#orbit)"
            strokeWidth="2"
          />
        </svg>

        {orbitNodes.map((node, index) => {
          const pillar = pillars.find((entry) => entry.slug === node.slug);

          if (!pillar) {
            return null;
          }

          return (
            <Link
              key={pillar.slug}
              href={getPillarHref(pillar.slug)}
              className="group absolute block w-[220px] animate-rise rounded-[24px] border border-line bg-surface-strong p-5 shadow-roadmap backdrop-blur transition hover:-translate-y-2 hover:border-primary"
              style={{
                left: node.x,
                top: node.y,
                animationDelay: `${index * 70}ms`,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                {pillar.heroLabel}
              </p>
              <h3 className="mt-3 font-display text-xl font-bold text-foreground">
                {pillar.navTitle}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{pillar.summary}</p>
              <p className="mt-4 text-sm font-semibold text-foreground transition group-hover:text-primary">
                Open track
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
