"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import QuestionSaveButton from "@/components/QuestionSaveButton";
import { getTopicById, type Question } from "@/lib/site-data";

interface QuestionBankExplorerProps {
  questions: Question[];
}

export default function QuestionBankExplorer({
  questions,
}: QuestionBankExplorerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [topicTag, setTopicTag] = useState("All");
  const deferredSearch = useDeferredValue(search);

  const categories = ["All", ...new Set(questions.map((item) => item.category))];
  const difficulties = [
    "All",
    ...new Set(questions.map((item) => item.difficulty)),
  ];
  const topicTags = [
    "All",
    ...new Set(questions.flatMap((item) => item.relatedTopics)),
  ];

  const filteredQuestions = questions.filter((item) => {
    const query = deferredSearch.trim().toLowerCase();
    const searchableText = [
      item.question,
      item.category,
      ...item.answerOutline,
      ...item.expectedSignals,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = query.length === 0 || searchableText.includes(query);
    const matchesCategory = category === "All" || item.category === category;
    const matchesDifficulty =
      difficulty === "All" || item.difficulty === difficulty;
    const matchesTopicTag =
      topicTag === "All" || item.relatedTopics.includes(topicTag);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTopicTag;
  });

  return (
    <div className="space-y-8">
      <div className="section-card rounded-[28px] p-6 md:p-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="field-shell"
              placeholder="Search questions, topics, or expected signals"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="field-shell"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">
              Difficulty
            </span>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="field-shell"
            >
              {difficulties.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">
              Topic tag
            </span>
            <select
              value={topicTag}
              onChange={(event) => setTopicTag(event.target.value)}
              className="field-shell"
            >
              {topicTags.map((option) => {
                const topic = option === "All" ? undefined : getTopicById(option);

                return (
                  <option key={option} value={option}>
                    {topic?.title ?? option}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        <p className="mt-4 text-xs font-medium text-muted">
          Showing {filteredQuestions.length} of {questions.length} questions
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {filteredQuestions.map((item) => (
          <article
            key={item.id}
            className="section-card rounded-[26px] p-6 transition hover:-translate-y-1 hover:border-primary"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tone-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  {item.category}
                </span>
                <span className="tone-accent rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  {item.difficulty}
                </span>
              </div>
              <QuestionSaveButton questionId={item.id} />
            </div>

            <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
              {item.question}
            </h3>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Answer outline
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {item.answerOutline.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Expected signals
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {item.expectedSignals.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Common mistakes
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {item.commonMistakes.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.relatedTopics.map((topicId) => {
                const topic = getTopicById(topicId);

                return (
                  <Link
                    key={topicId}
                    href={`/topics/${topicId}`}
                    className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition hover:border-primary hover:text-foreground"
                  >
                    {topic?.title ?? topicId}
                  </Link>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
