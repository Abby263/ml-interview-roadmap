import Link from "next/link";

import AuthButtons from "@/components/AuthButtons";
import ThemeToggle from "@/components/ThemeToggle";

const NAV = [
  { href: "/", label: "Roadmap" },
  { href: "/questions", label: "Questions" },
  { href: "/case-studies", label: "Cases" },
  { href: "/blog", label: "Blog" },
] as const;

export default function SiteHeader() {
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

        <div className="flex items-center gap-1">
          <nav
            aria-label="Primary navigation"
            className="hidden flex-wrap items-center gap-0.5 md:flex"
          >
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-surface-strong hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <AuthButtons />
        </div>

        <nav
          aria-label="Mobile navigation"
          className="-mx-2 w-full overflow-x-auto md:hidden"
        >
          <div className="flex items-center gap-0.5 whitespace-nowrap px-2">
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-surface-strong hover:text-foreground"
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
