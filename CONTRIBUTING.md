# Contributing

Thanks for improving ML Interview Roadmap. The project is source-available for
non-commercial education and interview preparation. Contributions are accepted
under the repository license.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

Optional integrations are documented in [SETUP.md](./SETUP.md). The public
roadmap, question browser, and local progress work without external services.

## Development Workflow

1. Create a branch from `main`.
2. Keep changes focused: UI, content, agent behavior, or infra.
3. Run `npm run lint` and `npm run build`.
4. Open a pull request using the PR template.

## Content Contributions

Daily plan content lives in `content/daily-plan/days/day-###.json`.

When editing daily content:

- Keep topics in the existing interview-prep order.
- Write interview-shaped prompts, not only topic names.
- Put questions under the relevant daily item.
- Avoid duplicating generic daily question sections.
- Include references when adding a new concept.

Case studies live in `content/case-studies/*.mdx`.

## AI Tutor Contributions

The AI Tutor is a deepagents-style coach with:

- profile-aware prompts in `lib/ai-tutor-prompts.ts`;
- chat orchestration in `lib/ai-tutor-agent.ts`;
- realtime voice orchestration in `lib/ai-tutor-realtime.ts`;
- persistent memory/session storage in `lib/ai-tutor-store.ts`.

Agent changes should preserve these rules:

- Ask one question at a time.
- Ground questions in roadmap topics or daily-plan content.
- Update progress only after an answer is interview-ready.
- Keep chat and voice behavior aligned.

## Pull Request Standards

Every PR should include:

- what changed;
- why it changed;
- screenshots or notes for UI changes;
- validation commands run;
- any known limitations.
