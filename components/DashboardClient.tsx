"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import type { DashboardProfile } from "@/lib/auth";
import type { CaseStudySummary } from "@/lib/content";
import {
  getRoadmapHref,
  readinessPillarMap,
  readinessWeights,
  type Question,
  type Topic,
} from "@/lib/site-data";
import {
  emptyWorkspaceSnapshot,
  readWorkspaceSnapshot,
  subscribeWorkspace,
} from "@/lib/workspace-store";

interface DashboardClientProps {
  caseStudies: CaseStudySummary[];
  profile: DashboardProfile;
  questions: Question[];
  topics: Topic[];
}

export default function DashboardClient({
  caseStudies,
  profile,
  questions,
  topics,
}: DashboardClientProps) {
  const snapshot = useSyncExternalStore(
    subscribeWorkspace,
    readWorkspaceSnapshot,
    () => emptyWorkspaceSnapshot
  );

  const completedTopics = topics.filter((topic) =>
    snapshot.completedTopics.includes(topic.id)
  );
  const savedTopics = topics.filter((topic) =>
    snapshot.savedTopics.includes(topic.id)
  );
  const savedQuestions = questions.filter((question) =>
    snapshot.savedQuestions.includes(question.id)
  );
  const savedCaseStudies = caseStudies.filter((study) =>
    snapshot.savedCaseStudies.includes(study.slug)
  );

  const readinessBreakdown = readinessWeights.map((item) => {
    const pillar = readinessPillarMap[item.label];
    const pillarTopics = topics.filter((topic) => topic.pillar === pillar);
    const completedCount = pillarTopics.filter((topic) =>
      snapshot.completedTopics.includes(topic.id)
    ).length;
    const completionRatio =
      pillarTopics.length === 0 ? 0 : completedCount / pillarTopics.length;

    return {
      label: item.label,
      percentage: Math.round(completionRatio * 100),
      score: completionRatio * item.weight,
      weight: item.weight,
    };
  });

  const readinessScore = Math.round(
    readinessBreakdown.reduce((sum, item) => sum + item.score, 0)
  );
  const weakAreas = [...readinessBreakdown]
    .sort((left, right) => left.percentage - right.percentage)
    .slice(0, 3);

  const recommendedTopics = topics
    .filter(
      (topic) =>
        !snapshot.completedTopics.includes(topic.id) &&
        topic.roleTags.some((tag) =>
          tag.toLowerCase().includes(profile.role.toLowerCase())
        )
    )
    .slice(0, 4);

  return (
    <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <section className="section-card rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">Profile</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-foreground">
            {profile.name}
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="data-chip">{profile.role}</span>
            <span className="data-chip">{profile.timeline}-day track</span>
            <span className="data-chip">{profile.dailyHours}h daily</span>
            <span className="data-chip">{profile.focus}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            Interview date: {profile.interviewDate || "Not set yet"}
          </p>
          <Link
            href={getRoadmapHref(
              profile.timeline === "30"
                ? "30-day"
                : profile.timeline === "60"
                  ? "60-day"
                  : "90-day"
            )}
            className="button-secondary mt-6"
          >
            Open active roadmap
          </Link>
        </section>

        <section className="section-card rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">Saved stack</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="surface-muted rounded-[1.4rem] border border-line p-4">
              <p className="panel-label">Topics</p>
              <p className="mt-2 text-3xl font-extrabold text-foreground">
                {savedTopics.length}
              </p>
            </div>
            <div className="surface-muted rounded-[1.4rem] border border-line p-4">
              <p className="panel-label">Questions</p>
              <p className="mt-2 text-3xl font-extrabold text-foreground">
                {savedQuestions.length}
              </p>
            </div>
            <div className="surface-muted rounded-[1.4rem] border border-line p-4">
              <p className="panel-label">Cases</p>
              <p className="mt-2 text-3xl font-extrabold text-foreground">
                {savedCaseStudies.length}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="section-card rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">Readiness</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-5xl font-black text-foreground">
                {readinessScore}
                <span className="text-2xl text-muted"> / 100</span>
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">
                Based on completed topic cards in your current browser workspace.
              </p>
            </div>
            <div className="data-chip">{completedTopics.length} completed topics</div>
          </div>

          <div className="mt-6 space-y-4">
            {readinessBreakdown.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-muted">{item.percentage}%</span>
                </div>
                <div className="line-muted h-3 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-highlight"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="section-card rounded-[2rem] p-6">
            <p className="eyebrow">Needs work</p>
            <div className="mt-4 space-y-3">
              {weakAreas.map((item) => (
                <div
                  key={item.label}
                  className="surface-muted rounded-[1.2rem] border border-line p-4"
                >
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {item.percentage}% complete
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="section-card rounded-[2rem] p-6">
            <p className="eyebrow">Recommended next</p>
            <div className="mt-4 space-y-3">
              {recommendedTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className="surface-muted block rounded-[1.2rem] border border-line p-4 transition hover:border-primary"
                >
                  <p className="font-semibold text-foreground">{topic.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {topic.summary}
                  </p>
                </Link>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
