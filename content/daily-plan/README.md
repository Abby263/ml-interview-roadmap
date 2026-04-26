# Daily Plan Content

This folder is the editable source for the landing-page daily plan and `/day/[day]` pages.

## What to edit

- Edit one file per day in `content/daily-plan/days/`.
- File names must stay in this format: `day-001.json`, `day-002.json`, etc.
- Keep `day` aligned with the file name.
- Keep every `id` inside `tracks[].items[]` stable after launch, because progress tracking stores completed items by id.
- Do not edit `content/daily-plan/index.ts` for normal content changes. It only imports the per-day JSON files so the app build can bundle them.

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
          "meta": "Read"
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

Valid pillars are defined in `lib/site-data.ts`.
