# Daily Plan Content

This folder is the editable source for the landing-page daily plan and `/day/[day]` pages.

## What to edit

- Edit one file per day in `content/daily-plan/days/`.
- File names must stay in this format: `day-001.json`, `day-002.json`, etc.
- Keep `day` aligned with the file name.
- Keep every `id` inside `tracks[].items[]` stable after launch, because progress tracking stores completed items by id.
- Edit `content/daily-plan/weeks.json` when a week heading on the landing page needs to change.
- Adding or removing a `day-###.json` file is picked up automatically at build time, as long as day numbers stay consecutive.
- Broad curriculum changes should be made in `scripts/build-curriculum*.mjs`, then regenerated with `node scripts/build-curriculum.mjs`.

## Day schema

```json
{
  "day": 1,
  "title": "Short title shown on the landing page",
  "pillar": "math-stats",
  "focus": "One-sentence explanation shown on the day page",
  "tracks": [
    {
      "label": "Track label shown as a section",
      "items": [
        {
          "id": "stable-item-id",
          "label": "Task or topic text",
          "href": "https://optional-reference-link.com",
          "meta": "Read",
          "interviewQuestions": [
            "Question specific to this checklist item"
          ]
        }
      ]
    }
  ],
  "interviewQuestions": [
    "Question an interviewer might ask for this day's topic"
  ],
  "references": [
    {
      "label": "Reference title",
      "href": "https://reference-link.com",
      "source": "Source name"
    }
  ],
  "topicId": "optional-linked-topic-id",
  "caseStudySlug": "optional-linked-case-study-slug",
  "questionIds": ["optional-question-bank-id"]
}
```

## Interview question rule

For ML-focused days, keep `interviewQuestions` detailed and interview-shaped:

- Use 2-5 questions per ML day.
- Use 2-5 item-level questions when `tracks[].items[].interviewQuestions` is present.
- Prefer prompts like `How would you evaluate...?`, `When would you choose...?`, `What breaks if...?`, or `Walk me through...`.
- Avoid only listing topic names. A non-technical reviewer should be able to read the questions and understand what the candidate needs to explain.

ML-focused pillars are:

- `math-stats`
- `traditional-ml`
- `deep-learning`
- `mlops`
- `generative-ai`
- `llmops`
- `ml-system-design`

## Week headings

The landing page groups days into weeks. Edit `content/daily-plan/weeks.json` to change those headings:

```json
[
  {
    "week": 1,
    "title": "Statistics, probability, linear algebra, and optimization"
  }
]
```

Keep week numbers consecutive. If you add enough days to create a new week, add a matching entry here.

Valid pillars are defined in `lib/daily-plan-schema.ts`.
