import Link from "next/link";

import AuthButtons from "@/components/AuthButtons";
import ThemeToggle from "@/components/ThemeToggle";

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
          <ThemeToggle />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
