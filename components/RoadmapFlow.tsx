"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  readAllProgress,
  subscribeProgress,
} from "@/lib/progress-store";
import { dailyPlan, dayItemCount } from "@/lib/site-data";

interface FlowNode {
  id: string;
  title: string;
  dayStart: number;
  dayEnd: number;
  /** Visual color group */
  tone?: "primary" | "accent" | "highlight" | "muted";
}

interface FlowRow {
  /** 1-3 nodes laid out horizontally; 1 = no branching */
  nodes: FlowNode[];
  /** label shown to the left of the row */
  rowLabel?: string;
}

const FLOW_GROUPS: { label: string; rows: FlowRow[] }[] = [
  {
    label: "Foundations",
    rows: [
      { nodes: [
        { id: "math", title: "Math foundations · Stats / Linalg", dayStart: 1, dayEnd: 7, tone: "accent" },
      ]},
      { nodes: [
        { id: "trad-basics", title: "Traditional ML basics", dayStart: 8, dayEnd: 14, tone: "primary" },
      ]},
      { nodes: [
        { id: "trad-practical", title: "Traditional ML practical", dayStart: 15, dayEnd: 21, tone: "primary" },
      ]},
      { nodes: [
        { id: "ml-coding", title: "ML coding from scratch", dayStart: 18, dayEnd: 21, tone: "primary" },
      ]},
    ],
  },
  {
    label: "Deep learning + Transformers",
    rows: [
      { nodes: [
        { id: "nn-basics", title: "Neural networks · backprop · optimizers", dayStart: 24, dayEnd: 27, tone: "accent" },
      ]},
      { nodes: [
        { id: "cnn", title: "CNNs · CIFAR project", dayStart: 28, dayEnd: 28, tone: "accent" },
        { id: "rnn", title: "RNN / LSTM · Sentiment project", dayStart: 29, dayEnd: 29, tone: "accent" },
      ]},
      { nodes: [
        { id: "transformers", title: "Transformers from first principles", dayStart: 30, dayEnd: 30, tone: "highlight" },
      ]},
    ],
  },
  {
    label: "Generative AI",
    rows: [
      { nodes: [
        { id: "llm-basics", title: "LLM basics · Tokenization", dayStart: 31, dayEnd: 32, tone: "highlight" },
      ]},
      { nodes: [
        { id: "prompting", title: "Prompt engineering", dayStart: 33, dayEnd: 33, tone: "highlight" },
        { id: "rag", title: "RAG architecture · chatbot project", dayStart: 34, dayEnd: 36, tone: "highlight" },
      ]},
      { nodes: [
        { id: "llm-eval", title: "LLM evaluation", dayStart: 37, dayEnd: 37, tone: "highlight" },
        { id: "fine-tune", title: "Fine-tuning · resume-analyzer project", dayStart: 38, dayEnd: 38, tone: "highlight" },
      ]},
      { nodes: [
        { id: "agents", title: "Agents · guardrails", dayStart: 39, dayEnd: 40, tone: "highlight" },
      ]},
    ],
  },
  {
    label: "ML system design",
    rows: [
      { nodes: [
        { id: "sd-framework", title: "System design framework", dayStart: 41, dayEnd: 45, tone: "primary" },
      ]},
      { nodes: [
        { id: "case-recsys", title: "Recsys cases (video, ads)", dayStart: 46, dayEnd: 49, tone: "primary" },
        { id: "case-search", title: "Search & fraud cases", dayStart: 51, dayEnd: 54, tone: "primary" },
      ]},
      { nodes: [
        { id: "case-genai", title: "GenAI cases (RAG, agent, eval)", dayStart: 55, dayEnd: 58, tone: "highlight" },
        { id: "case-tradeoff", title: "Architect trade-off playbook", dayStart: 59, dayEnd: 60, tone: "primary" },
      ]},
    ],
  },
  {
    label: "ML infrastructure & production",
    rows: [
      { nodes: [
        { id: "infra-train", title: "Training pipelines · registry · CI/CD", dayStart: 61, dayEnd: 62, tone: "accent" },
      ]},
      { nodes: [
        { id: "infra-deploy", title: "Deployment · observability · incidents", dayStart: 63, dayEnd: 65, tone: "accent" },
      ]},
      { nodes: [
        { id: "infra-cost", title: "Cost · LLMOps · multi-tenant", dayStart: 66, dayEnd: 68, tone: "accent" },
        { id: "infra-gov", title: "Privacy · build-vs-buy · migration", dayStart: 69, dayEnd: 70, tone: "accent" },
      ]},
      { nodes: [
        { id: "infra-mock", title: "Infra design mock", dayStart: 71, dayEnd: 71, tone: "primary" },
      ]},
    ],
  },
  {
    label: "Coding round + behavioral",
    rows: [
      { nodes: [
        { id: "oop", title: "OOP fundamentals · concurrency · OOP design", dayStart: 72, dayEnd: 74, tone: "muted" },
      ]},
      { nodes: [
        { id: "ai-coding", title: "AI-assisted coding round", dayStart: 75, dayEnd: 75, tone: "muted" },
        { id: "company-tags", title: "Company tags + DSA hard", dayStart: 76, dayEnd: 79, tone: "muted" },
      ]},
      { nodes: [
        { id: "behavioral", title: "Behavioral arc — resume → stories → company prep", dayStart: 80, dayEnd: 86, tone: "muted" },
      ]},
    ],
  },
  {
    label: "Mocks · Final taper",
    rows: [
      { nodes: [
        { id: "mock-coding", title: "Coding mocks (Meta / Google / OpenAI styles)", dayStart: 87, dayEnd: 89, tone: "primary" },
      ]},
      { nodes: [
        { id: "mock-design", title: "ML design + GenAI design mocks", dayStart: 90, dayEnd: 92, tone: "primary" },
        { id: "mock-cross", title: "Cross-loop sims + repair", dayStart: 100, dayEnd: 110, tone: "primary" },
      ]},
      { nodes: [
        { id: "taper", title: "Final taper · light review · walk in", dayStart: 111, dayEnd: 120, tone: "accent" },
      ]},
    ],
  },
  {
    label: "Optional · Specialization deep dives",
    rows: [
      { nodes: [
        { id: "spec-cv", title: "Computer Vision", dayStart: 121, dayEnd: 121, tone: "accent" },
        { id: "spec-nlp", title: "NLP / NLU", dayStart: 122, dayEnd: 122, tone: "accent" },
        { id: "spec-speech", title: "Speech & Audio", dayStart: 123, dayEnd: 123, tone: "accent" },
      ]},
      { nodes: [
        { id: "spec-rl", title: "Reinforcement Learning", dayStart: 124, dayEnd: 124, tone: "highlight" },
        { id: "spec-recsys", title: "RecSys deep dive", dayStart: 125, dayEnd: 125, tone: "highlight" },
        { id: "spec-distrib", title: "Distributed ML / Infra", dayStart: 126, dayEnd: 126, tone: "highlight" },
      ]},
    ],
  },
];

const TONE_STYLES: Record<NonNullable<FlowNode["tone"]>, string> = {
  primary: "border-primary",
  accent: "border-accent",
  highlight: "border-highlight",
  muted: "border-line",
};

const emptyProgress: Record<number, number> = {};

export default function RoadmapFlow({ canTrack }: { canTrack: boolean }) {
  const progress = useSyncExternalStore(
    subscribeProgress,
    readAllProgress,
    () => emptyProgress
  );

  function nodeProgress(node: FlowNode): { done: number; total: number; pct: number } {
    const days = dailyPlan.filter(
      (d) => d.day >= node.dayStart && d.day <= node.dayEnd
    );
    const total = days.reduce((s, d) => s + dayItemCount(d), 0);
    const done = canTrack
      ? days.reduce((s, d) => s + (progress[d.day] ?? 0), 0)
      : 0;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { done, total, pct };
  }

  return (
    <div className="space-y-12">
      {FLOW_GROUPS.map((group, gi) => (
        <section key={group.label} className="space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary">
              {String(gi + 1).padStart(2, "0")}
            </span>
            <h2 className="font-display text-lg font-bold text-foreground md:text-xl">
              {group.label}
            </h2>
          </div>

          <div className="relative space-y-3">
            {/* vertical connector spine */}
            <div
              aria-hidden="true"
              className="absolute left-[0.45rem] top-0 bottom-0 w-px bg-line md:left-1/2 md:-translate-x-1/2"
            />

            {group.rows.map((row, ri) => {
              const isMulti = row.nodes.length > 1;
              return (
                <div
                  key={ri}
                  className={`relative flex flex-col gap-3 md:flex-row ${
                    isMulti ? "md:gap-3" : "md:justify-center"
                  }`}
                >
                  {row.nodes.map((node) => {
                    const { done, total, pct } = nodeProgress(node);
                    const isDone = canTrack && total > 0 && done >= total;
                    const tone = node.tone ?? "primary";
                    return (
                      <Link
                        key={node.id}
                        href={`/day/${node.dayStart}`}
                        className={`group relative flex-1 overflow-hidden rounded-2xl border-2 bg-surface px-4 py-3 transition hover:bg-surface-strong md:max-w-md ${TONE_STYLES[tone]}`}
                      >
                        {canTrack && pct > 0 ? (
                          <div
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 transition-all"
                            style={{
                              width: `${pct}%`,
                              background:
                                "color-mix(in srgb, var(--primary) 10%, transparent)",
                            }}
                          />
                        ) : null}
                        <div className="relative flex items-baseline justify-between gap-2">
                          <span
                            className={`text-[0.95rem] font-semibold leading-snug group-hover:text-primary ${
                              isDone
                                ? "text-muted line-through"
                                : "text-foreground"
                            }`}
                          >
                            {node.title}
                          </span>
                          <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                            {node.dayStart === node.dayEnd
                              ? `Day ${node.dayStart}`
                              : `Days ${node.dayStart}–${node.dayEnd}`}
                          </span>
                        </div>
                        {canTrack ? (
                          <div className="relative mt-2 flex items-center justify-between">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="ml-3 font-mono text-[0.62rem] font-semibold text-primary">
                              {done}/{total}
                            </span>
                          </div>
                        ) : (
                          <p className="relative mt-1 font-mono text-[0.62rem] text-muted">
                            {total} items
                          </p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
