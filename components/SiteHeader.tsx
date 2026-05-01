import Link from "next/link";

import AuthButtons from "@/components/AuthButtons";
import ThemeToggle from "@/components/ThemeToggle";
import { navigationLinks } from "@/lib/site-data";

export default function SiteHeader() {
  const primaryLinks = navigationLinks.slice(0, 4);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur-xl">
      <div className="page-shell flex flex-wrap items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="tone-primary flex h-9 w-9 items-center justify-center rounded-lg border border-primary text-sm font-bold">
            ML
          </div>
          <span className="font-display text-base font-extrabold text-foreground sm:text-lg">
            ML Interview Roadmap
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 md:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-xs font-semibold text-muted transition hover:bg-surface-strong hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  );
}
