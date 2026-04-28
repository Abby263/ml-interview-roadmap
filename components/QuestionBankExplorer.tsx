"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import QuestionSaveButton from "@/components/QuestionSaveButton";
import type {
  DailyPlanQuestionEntry,
  DailyPlanQuestionTag,
} from "@/lib/daily-plan-questions";

interface QuestionBankExplorerProps {
  entries: DailyPlanQuestionEntry[];
  tags: DailyPlanQuestionTag[];
  interviewQuestionCount: number;
}

export default function QuestionBankExplorer({
  entries,
  tags,
  interviewQuestionCount,
}: QuestionBankExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const deferredSearch = useDeferredValue(search);

  const selectedTagMeta = tags.find((tag) => tag.id === selectedTag);

  const filteredEntries = selectedTag
    ? entries.filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        const searchableText = [
          item.topicLabel,
          item.trackLabel,
          item.dayTitle,
          item.dayFocus,
          item.meta ?? "",
          ...item.interviewQuestions,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          query.length === 0 || searchableText.includes(query);

        return item.tagId === selectedTag && matchesSearch;
      })
    : [];

  const groupedTags = tags.reduce<Record<string, DailyPlanQuestionTag[]>>(
    (acc, tag) => {
      acc[tag.group] = [...(acc[tag.group] ?? []), tag];
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8">
      <div className="section-card rounded-[28px] p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="panel-label">Select a tag to begin</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
              Daily-plan topic browser
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Nothing is shown by default. Pick one roadmap pillar or DSA
              pattern, then narrow the matching daily topics with search.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-[18rem]">
            <div className="rounded-2xl border border-line bg-surface-strong p-3">
              <p className="panel-label">Topics</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
                {entries.length}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-strong p-3">
              <p className="panel-label">Prompts</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-foreground">
                {interviewQuestionCount}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {Object.entries(groupedTags).map(([group, groupTags]) => (
            <div key={group}>
              <p className="text-sm font-semibold text-foreground">{group}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {groupTags.map((tag) => {
                  const active = tag.id === selectedTag;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelectedTag(tag.id);
                        setSearch("");
                      }}
                      className={`rounded-full border px-3 py-2 text-left text-xs font-semibold transition ${
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-line bg-surface-strong text-muted hover:border-primary hover:text-foreground"
                      }`}
                    >
                      <span>{tag.label}</span>
                      <span className="ml-2 opacity-75">
                        {tag.itemCount} topics
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <label className="mt-6 block space-y-2">
          <span className="text-sm font-semibold text-foreground">
            Search selected tag
          </span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="field-shell"
            placeholder={
              selectedTag
                ? `Search ${selectedTagMeta?.label ?? "selected tag"}`
                : "Select a tag first"
            }
            disabled={!selectedTag}
          />
        </label>
      </div>

      {!selectedTag ? (
        <section className="section-card rounded-[28px] p-8 text-center">
          <p className="panel-label">No tag selected</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-foreground">
            Choose a pillar or DSA pattern above.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
            This keeps the page focused for learners who want to study one
            topic area instead of scrolling the full 133-day roadmap.
          </p>
        </section>
      ) : null}

      {selectedTag ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="panel-label">
                {selectedTagMeta?.group ?? "Selected tag"}
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-foreground">
                {selectedTagMeta?.label}
              </h2>
            </div>
            <p className="text-sm font-medium text-muted">
              Showing {filteredEntries.length} of{" "}
              {selectedTagMeta?.itemCount ?? 0} topics
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {filteredEntries.map((item) => (
              <article
                key={item.id}
                className="section-card rounded-[26px] p-6 transition hover:-translate-y-1 hover:border-primary"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tone-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                      Day {item.day}
                    </span>
                    <span className="tone-accent rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                      {item.tagLabel}
                    </span>
                  </div>
                  <QuestionSaveButton questionId={item.id} />
                </div>

                <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                  {item.topicLabel}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {item.trackLabel} · {item.dayTitle}
                </p>

                {item.interviewQuestions.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-foreground">
                      Interview prompts from the daily plan
                    </p>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
                      {item.interviewQuestions.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p className="mt-5 text-sm leading-6 text-muted">
                    No interview prompts are attached yet; use this topic as a
                    study target from the daily plan.
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href={`/day/${item.day}`}
                    className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition hover:border-primary hover:text-foreground"
                  >
                    Open Day {item.day}
                  </Link>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition hover:border-primary hover:text-foreground"
                    >
                      Reference ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
