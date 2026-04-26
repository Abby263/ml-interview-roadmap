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
    label: "Statistics and math",
    rows: [
      { nodes: [
        { id: "stats-math", title: "Probability · inference · linalg · optimization", dayStart: 1, dayEnd: 7, tone: "accent" },
      ]},
    ],
  },
  {
    label: "Traditional machine learning",
    rows: [
      { nodes: [
        { id: "trad-basics", title: "Bias-variance · losses · regression · calibration", dayStart: 8, dayEnd: 14, tone: "primary" },
      ]},
      { nodes: [
        { id: "trad-models", title: "Trees · boosting · imbalance · SVM / KNN", dayStart: 15, dayEnd: 18, tone: "primary" },
      ]},
      { nodes: [
        { id: "features-ml-coding", title: "Feature engineering · leakage · ML from scratch", dayStart: 19, dayEnd: 21, tone: "primary" },
      ]},
      { nodes: [
        { id: "sql-support", title: "SQL analytics support", dayStart: 22, dayEnd: 23, tone: "muted" },
      ]},
    ],
  },
  {
    label: "Deep learning",
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
    label: "MLOps and production ML",
    rows: [
      { nodes: [
        { id: "mlops-train", title: "Training pipelines · registry · CI/CD", dayStart: 31, dayEnd: 32, tone: "accent" },
      ]},
      { nodes: [
        { id: "mlops-serving", title: "Deployment · observability · incidents", dayStart: 33, dayEnd: 35, tone: "accent" },
      ]},
      { nodes: [
        { id: "mlops-cost", title: "Cost · capacity · multi-tenant systems", dayStart: 36, dayEnd: 37, tone: "accent" },
        { id: "mlops-gov", title: "Privacy · governance · build-vs-buy", dayStart: 38, dayEnd: 39, tone: "accent" },
      ]},
      { nodes: [
        { id: "mlops-mock", title: "ML infra design mock", dayStart: 40, dayEnd: 40, tone: "primary" },
      ]},
    ],
  },
  {
    label: "Generative AI",
    rows: [
      { nodes: [
        { id: "llm-basics", title: "LLM basics · tokenization · embeddings", dayStart: 41, dayEnd: 42, tone: "highlight" },
      ]},
      { nodes: [
        { id: "prompting", title: "Prompt engineering", dayStart: 43, dayEnd: 43, tone: "highlight" },
        { id: "rag", title: "RAG architecture · vector stores · reranking", dayStart: 44, dayEnd: 46, tone: "highlight" },
      ]},
      { nodes: [
        { id: "llm-eval", title: "LLM evaluation", dayStart: 47, dayEnd: 47, tone: "highlight" },
        { id: "fine-tune", title: "Fine-tuning · resume-analyzer project", dayStart: 48, dayEnd: 48, tone: "highlight" },
      ]},
      { nodes: [
        { id: "agents", title: "Agents · guardrails", dayStart: 49, dayEnd: 50, tone: "highlight" },
      ]},
    ],
  },
  {
    label: "LLMOps",
    rows: [
      { nodes: [
        { id: "llmops-versioning", title: "Prompt/model release discipline", dayStart: 51, dayEnd: 52, tone: "accent" },
      ]},
      { nodes: [
        { id: "llmops-evals", title: "Evaluation datasets · regression gates", dayStart: 53, dayEnd: 53, tone: "accent" },
        { id: "llmops-tracing", title: "Tracing · incident response", dayStart: 54, dayEnd: 54, tone: "accent" },
      ]},
      { nodes: [
        { id: "llmops-routing", title: "Cost · latency · caching · routing", dayStart: 55, dayEnd: 55, tone: "highlight" },
        { id: "llmops-safety", title: "Safety · privacy · red teaming · adapters", dayStart: 56, dayEnd: 57, tone: "highlight" },
      ]},
    ],
  },
  {
    label: "ML system design",
    rows: [
      { nodes: [
        { id: "sd-framework", title: "Framework · data · features · serving · monitoring", dayStart: 58, dayEnd: 62, tone: "primary" },
      ]},
      { nodes: [
        { id: "case-recsys", title: "Recommendation + ads cases", dayStart: 63, dayEnd: 66, tone: "primary" },
        { id: "case-search-fraud", title: "Search + fraud cases", dayStart: 68, dayEnd: 71, tone: "primary" },
      ]},
      { nodes: [
        { id: "case-genai", title: "RAG, agent, eval, document cases", dayStart: 72, dayEnd: 75, tone: "highlight" },
        { id: "case-tradeoff", title: "Cross-case design + trade-off playbook", dayStart: 76, dayEnd: 77, tone: "primary" },
      ]},
    ],
  },
  {
    label: "Coding round + behavioral",
    rows: [
      { nodes: [
        { id: "oop", title: "OOP fundamentals · concurrency · OOP design", dayStart: 78, dayEnd: 80, tone: "muted" },
      ]},
      { nodes: [
        { id: "ai-coding", title: "AI-assisted coding round", dayStart: 81, dayEnd: 81, tone: "muted" },
        { id: "company-tags", title: "Company tags + DSA hard", dayStart: 82, dayEnd: 85, tone: "muted" },
      ]},
      { nodes: [
        { id: "behavioral", title: "Behavioral arc — resume → stories → company prep", dayStart: 86, dayEnd: 92, tone: "muted" },
      ]},
    ],
  },
  {
    label: "Mocks · Final taper",
    rows: [
      { nodes: [
        { id: "mock-coding", title: "Coding mocks (Meta / Google / OpenAI styles)", dayStart: 93, dayEnd: 95, tone: "primary" },
      ]},
      { nodes: [
        { id: "mock-design", title: "ML design + GenAI design mocks", dayStart: 96, dayEnd: 98, tone: "primary" },
        { id: "mock-cross", title: "Cross-loop sims + repair", dayStart: 100, dayEnd: 110, tone: "primary" },
      ]},
      { nodes: [
        { id: "taper", title: "Final taper · light review · walk in", dayStart: 111, dayEnd: 126, tone: "accent" },
      ]},
    ],
  },
  {
    label: "Optional · Specialization deep dives",
    rows: [
      { nodes: [
        { id: "spec-cv", title: "Computer Vision", dayStart: 127, dayEnd: 127, tone: "accent" },
        { id: "spec-nlp", title: "NLP / NLU", dayStart: 128, dayEnd: 128, tone: "accent" },
        { id: "spec-speech", title: "Speech & Audio", dayStart: 129, dayEnd: 129, tone: "accent" },
      ]},
      { nodes: [
        { id: "spec-rl", title: "Reinforcement Learning", dayStart: 130, dayEnd: 130, tone: "highlight" },
        { id: "spec-recsys", title: "RecSys deep dive", dayStart: 131, dayEnd: 131, tone: "highlight" },
        { id: "spec-distrib", title: "Distributed ML / Infra", dayStart: 132, dayEnd: 132, tone: "highlight" },
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
