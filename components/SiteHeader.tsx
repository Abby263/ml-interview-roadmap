import Link from "next/link";

import ThemeToggle from "@/components/ThemeToggle";
import { navigationLinks } from "@/lib/site-data";

const HEADER_LINKS = navigationLinks.filter(
  (link) => link.href !== "/" && link.href !== "/start-here"
);

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur-xl">
      <div className="page-shell flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" className="group flex items-center gap-4">
          <div className="tone-primary flex h-12 w-12 items-center justify-center rounded-[1.15rem] border border-primary text-lg font-bold transition group-hover:scale-105">
            ML
          </div>
          <div>
            <p className="panel-label">Interview prep platform</p>
            <div className="flex items-center gap-3">
              <p className="font-display text-xl font-extrabold text-foreground">
                ML Interview Roadmap
              </p>
              <span className="data-chip hidden sm:inline-flex">Beta</span>
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <nav
            aria-label="Primary navigation"
            className="hidden flex-wrap items-center justify-end gap-1 lg:flex"
          >
            {HEADER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-strong hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/start-here"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-95 md:inline-flex"
          >
            Start here
          </Link>
          <ThemeToggle />
        </div>

        <nav
          aria-label="Mobile navigation"
          className="w-full overflow-x-auto lg:hidden"
        >
          <div className="flex items-center gap-1 whitespace-nowrap pb-1">
            {HEADER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-strong hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
