"use client";

import { useSyncExternalStore } from "react";

const storageKey = "ml-roadmap-theme";
type Theme = "light" | "dark";

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ml-roadmap-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ml-roadmap-theme-change", callback);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "light"
  );

  function toggleTheme() {
    const currentTheme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(storageKey, nextTheme);
    window.dispatchEvent(new Event("ml-roadmap-theme-change"));
  }

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-mono text-[0.72rem] font-medium uppercase tracking-[0.18em] text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {nextTheme === "dark" ? "Dark mode" : "Light mode"}
    </button>
  );
}
