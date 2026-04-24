"use client";

import Link from "next/link";
import { startTransition, useState } from "react";

import { getRoadmapHref, readinessWeights } from "@/lib/site-data";

const roleMixes: Record<string, Record<string, number>> = {
  "Beginner ML Candidate": {
    "Traditional ML": 20,
    "Math & Statistics": 16,
    "Coding + SQL": 18,
    "Deep Learning": 10,
    "Generative AI": 12,
    "ML System Design": 14,
    MLOps: 5,
    Behavioral: 5,
  },
  "Data Scientist": {
    "Traditional ML": 20,
    "Math & Statistics": 15,
    "Coding + SQL": 12,
    "Deep Learning": 10,
    "Generative AI": 10,
    "ML System Design": 18,
    MLOps: 10,
    Behavioral: 5,
  },
  "ML Engineer": {
    "Traditional ML": 16,
    "Math & Statistics": 10,
    "Coding + SQL": 18,
    "Deep Learning": 10,
    "Generative AI": 12,
    "ML System Design": 19,
    MLOps: 10,
    Behavioral: 5,
  },
  "AI Engineer": {
    "Traditional ML": 10,
    "Math & Statistics": 8,
    "Coding + SQL": 12,
    "Deep Learning": 15,
    "Generative AI": 24,
    "ML System Design": 18,
    MLOps: 8,
    Behavioral: 5,
  },
  "Senior MLE": {
    "Traditional ML": 12,
    "Math & Statistics": 8,
    "Coding + SQL": 12,
    "Deep Learning": 8,
    "Generative AI": 15,
    "ML System Design": 25,
    MLOps: 15,
    Behavioral: 5,
  },
};

const weakAreaOptions = readinessWeights.map((item) => item.label);

export default function PlanBuilder() {
  const [role, setRole] = useState("AI Engineer");
  const [level, setLevel] = useState("Intermediate");
  const [timeline, setTimeline] = useState<"30" | "60" | "90">("60");
  const [dailyHours, setDailyHours] = useState("2");
  const [preference, setPreference] = useState("System Design");
  const [weakAreas, setWeakAreas] = useState<string[]>([
    "ML System Design",
    "Generative AI",
  ]);

  function toggleWeakArea(label: string) {
    startTransition(() => {
      setWeakAreas((current) =>
        current.includes(label)
          ? current.filter((item) => item !== label)
          : [...current, label]
      );
    });
  }

  const weights = { ...roleMixes[role] };

  weakAreas.forEach((area) => {
    weights[area] = (weights[area] ?? 0) + 8;
  });

  if (preference === "Coding") {
    weights["Coding + SQL"] += 6;
  }

  if (preference === "Theory") {
    weights["Math & Statistics"] += 6;
    weights["Traditional ML"] += 4;
  }

  if (preference === "System Design") {
    weights["ML System Design"] += 8;
    weights.MLOps += 4;
  }

  if (preference === "Projects") {
    weights.Behavioral += 4;
    weights["Generative AI"] += 4;
  }

  if (timeline === "30") {
    weights["Coding + SQL"] += 3;
    weights["ML System Design"] += 3;
  }

  if (dailyHours === "1") {
    weights["Traditional ML"] += 2;
    weights["Coding + SQL"] += 2;
  }

  if (level === "Beginner") {
    weights["Math & Statistics"] += 4;
    weights["Traditional ML"] += 4;
  }

  if (level === "Advanced") {
    weights["ML System Design"] += 3;
    weights["Generative AI"] += 3;
  }

  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  const normalized = Object.entries(weights)
    .map(([label, value]) => ({
      label,
      weight: Math.round((value / total) * 100),
    }))
    .sort((left, right) => right.weight - left.weight);

  const recommendedRoadmap =
    timeline === "30" ? "30-day" : timeline === "60" ? "60-day" : "90-day";

  return (
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="section-card rounded-[28px] p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Target role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="field-shell"
            >
              {Object.keys(roleMixes).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Current level</span>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="field-shell"
            >
              {["Beginner", "Intermediate", "Advanced"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Timeline</span>
            <select
              value={timeline}
              onChange={(event) =>
                setTimeline(event.target.value as "30" | "60" | "90")
              }
              className="field-shell"
            >
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">
              Daily study time
            </span>
            <select
              value={dailyHours}
              onChange={(event) => setDailyHours(event.target.value)}
              className="field-shell"
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4+ hours</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <label className="space-y-3">
            <span className="text-sm font-semibold text-foreground">
              Prep preference
            </span>
            <select
              value={preference}
              onChange={(event) => setPreference(event.target.value)}
              className="field-shell"
            >
              {["Theory", "Coding", "System Design", "Projects"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-3">
            <span className="text-sm font-semibold text-foreground">
              Weak areas
            </span>
            <div className="flex flex-wrap gap-2">
              {weakAreaOptions.map((option) => {
                const selected = weakAreas.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleWeakArea(option)}
                    className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                      selected
                        ? "tone-primary border-primary"
                        : "border-line bg-surface text-muted hover:border-primary hover:text-foreground"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="section-card rounded-[28px] p-6 md:p-8">
        <p className="eyebrow">Your plan</p>
        <h3 className="font-display text-3xl font-bold text-foreground">
          {role} · {timeline} days
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          Daily time: {dailyHours} hour{dailyHours === "1" ? "" : "s"} · Level:{" "}
          {level}
        </p>

        <div className="mt-6 space-y-4">
          {normalized.slice(0, 5).map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-muted">{item.weight}%</span>
              </div>
              <div className="line-muted h-3 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${item.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="surface-muted mt-8 rounded-[22px] border border-line p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Recommended path
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
            {normalized.slice(0, 4).map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                <span>
                  Spend <span className="font-semibold text-foreground">{item.weight}%</span>{" "}
                  of your prep cycle on {item.label.toLowerCase()}.
                </span>
              </li>
            ))}
          </ul>

          <Link
            href={getRoadmapHref(recommendedRoadmap)}
            className="mt-5 inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:-translate-y-0.5"
          >
            Open recommended roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
