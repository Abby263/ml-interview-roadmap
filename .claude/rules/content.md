# Content Rules

Load this when changing `content/**`, `lib/site-data.ts`,
`lib/daily-plan-questions.ts`, or topic/question generation scripts.

## Roadmap Principles

- Keep the curriculum ordered from statistics to traditional ML, deep learning,
  MLOps, GenAI, LLMOps, ML system design, behavioral prep, and DSA.
- Daily JSON should mirror how the landing and study-plan UI render the content.
- Keep the source of truth editable by non-technical reviewers.
- Avoid duplicate question banks; browse mode should use daily-plan content.

## Question Quality

- Questions should be interview-shaped prompts, not topic labels.
- Prefer 2-5 item-level questions for ML topics when questions are present.
- Include trade-offs, debugging, production constraints, and follow-ups for advanced topics.
- Add references where a learner can review the concept before answering.

## Review Checklist

- JSON schema still validates through `npm run build`.
- No duplicate daily-level question section is reintroduced.
- New topics are placed on the day where the concept is taught or reviewed.
- DSA references should say NeetCode 250 when naming the source roadmap.
