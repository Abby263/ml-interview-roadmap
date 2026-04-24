"use client";

const storageKey = "ml-roadmap-theme";

export default function ThemeToggle() {
  function toggleTheme() {
    const currentTheme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(storageKey, nextTheme);
  }

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-mono text-[0.72rem] font-medium uppercase tracking-[0.18em] text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
    >
      Theme
    </button>
  );
}
