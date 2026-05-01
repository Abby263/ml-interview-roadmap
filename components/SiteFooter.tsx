import Link from "next/link";

import { navigationLinks } from "@/lib/site-data";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="eyebrow">Project direction</p>
          <h3 className="font-display text-2xl font-extrabold text-foreground">
            Content-first now. Progress tracking and mock interviews next.
          </h3>
          <p className="max-w-xl text-sm leading-7 text-muted">
            The platform is intentionally public and content-heavy: the daily plan,
            topic cards, questions, case studies, and curated resources. The
            logged-in dashboard layer can sit on top of this foundation later.
          </p>
        </div>

        <div className="space-y-3">
          <p className="panel-label">
            Explore
          </p>
          <div className="flex flex-col gap-2">
            {navigationLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="panel-label">Project</p>
          <div className="space-y-2 text-sm text-muted">
            <a
              href="https://github.com/Abby263/ml-interview-roadmap"
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:text-foreground"
            >
              Source repository
            </a>
            <a
              href="https://github.com/Abby263/ml-interview-roadmap/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:text-foreground"
            >
              Contribution guide
            </a>
            <a
              href="https://github.com/Abby263/ml-interview-roadmap/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:text-foreground"
            >
              Non-commercial license
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
