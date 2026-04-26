"use client";

import { useState, useSyncExternalStore } from "react";

import {
  computeStreaks,
  readActivity,
  subscribeProgress,
} from "@/lib/progress-store";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const emptyMap: Record<string, number> = {};

function monthKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export default function Calendar() {
  const activity = useSyncExternalStore(
    subscribeProgress,
    readActivity,
    () => emptyMap
  );

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: ({ day: number; key: string; active: boolean; isToday: boolean } | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = monthKey(viewYear, viewMonth, d);
    cells.push({
      day: d,
      key,
      active: (activity[key] ?? 0) > 0,
      isToday:
        viewYear === today.getFullYear() &&
        viewMonth === today.getMonth() &&
        d === today.getDate(),
    });
  }
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const streaks = computeStreaks(activity);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  return (
    <div className="section-card rounded-[28px] p-5 md:p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="rounded-full px-2 py-1 text-muted hover:text-foreground"
        >
          ‹
        </button>
        <p className="font-display text-base font-bold text-foreground">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </p>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="rounded-full px-2 py-1 text-muted hover:text-foreground"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[0.7rem] font-mono uppercase tracking-[0.18em] text-muted">
        {WEEKDAYS.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) {
            return <span key={i} className="aspect-square" />;
          }
          return (
            <span
              key={cell.key}
              title={
                cell.active
                  ? `${cell.key} · ${activity[cell.key]} item${
                      activity[cell.key] === 1 ? "" : "s"
                    }`
                  : cell.key
              }
              className={`flex aspect-square items-center justify-center rounded-md text-xs font-mono transition ${
                cell.isToday
                  ? "border-2 border-primary text-foreground"
                  : ""
              } ${
                cell.active
                  ? "bg-primary text-white font-semibold"
                  : "text-muted"
              }`}
            >
              {cell.day}
            </span>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="surface-muted rounded-xl border border-line p-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
            Active days
          </p>
          <p className="mt-1 font-display text-lg font-extrabold text-foreground">
            {streaks.total}
          </p>
        </div>
        <div className="surface-muted rounded-xl border border-line p-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
            Current
          </p>
          <p className="mt-1 font-display text-lg font-extrabold text-foreground">
            🔥 {streaks.current}
          </p>
        </div>
        <div className="surface-muted rounded-xl border border-line p-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
            Best
          </p>
          <p className="mt-1 font-display text-lg font-extrabold text-foreground">
            🏆 {streaks.best}
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-[0.7rem] text-muted">
        Solve at least one item per day to keep the streak alive.
      </p>
    </div>
  );
}
