# /content-update

Use this when adding interview topics, daily-plan questions, references, or case
studies.

## Steps

1. Load context.
   - Read `.claude/rules/content.md`.
   - Read `content/daily-plan/README.md`.
   - Read the relevant `content/daily-plan/days/day-###.json` files.

2. Place content correctly.
   - Add a topic on the day where it is taught or reviewed.
   - Do not create a separate duplicate question bank.
   - Keep questions under `tracks[].items[].interviewQuestions`.

3. Write useful prompts.
   - Make questions interview-shaped.
   - Include debugging, trade-offs, metrics, or production constraints when relevant.
   - Add references that help a learner prepare before answering.

4. Verify.
   - Run `npm run build` to validate JSON/schema through the app build.
   - Spot-check affected day pages and `/questions`.

## Stop Conditions

- New content duplicates an existing day-level question section.
- Questions are only topic labels.
- The content cannot be edited by a non-technical reviewer.
