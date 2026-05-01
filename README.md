# ML Interview Roadmap

[![CI](https://github.com/Abby263/ml-interview-roadmap/actions/workflows/ci.yml/badge.svg)](https://github.com/Abby263/ml-interview-roadmap/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Abby263/ml-interview-roadmap)](https://github.com/Abby263/ml-interview-roadmap/releases)
[![License: Non-Commercial](https://img.shields.io/badge/license-non--commercial-blue)](./LICENSE)

Interactive learning platform for machine learning, AI engineering, GenAI,
LLMOps, ML system design, MLOps, coding, and behavioral interview preparation.

Production: [https://ml-interview-roadmap.vercel.app](https://ml-interview-roadmap.vercel.app)

## Highlights

- Dashboard-first landing page with progress, next study action, and quick entry
  into the study plan or question browser.
- 133-day roadmap ordered from statistics through traditional ML, deep learning,
  MLOps, GenAI, LLMOps, ML system design, behavioral prep, and DSA.
- NeetCode 250-aligned DSA coverage grouped by interview pattern.
- Daily pages with item-level interview prompts, checklists, references, topic
  links, and case studies.
- Question browser backed by the same daily-plan content, so learners can study
  by tag without following the full day-by-day plan.
- Public AI Tutor preview with profile, focus areas, coach insights, chat mode,
  and voice mode UI visible before login.
- Signed-in AI Tutor with chat and realtime voice agents, memory-backed
  personalization, session history, readiness-gated tracker updates, and
  strength/weakness insights.

## Curriculum Order

1. Statistics, probability, linear algebra, optimization, and evaluation math.
2. Traditional ML, feature engineering, leakage prevention, SQL, and ML coding.
3. Deep learning, CNNs, sequence models, attention, and transformers.
4. MLOps: validation, orchestration, registry, CI/CD, deployment, monitoring,
   governance, and incident response.
5. Generative AI: LLM fundamentals, prompting, embeddings, vector search, RAG,
   fine-tuning, agents, and guardrails.
6. LLMOps: prompt/model versioning, eval regression gates, tracing, routing,
   cost controls, safety, privacy, and red teaming.
7. ML system design: requirements, metrics, feature stores, serving, monitoring,
   recommendations, search, ads, fraud, and RAG system cases.
8. Behavioral, resume, project storytelling, and company-loop preparation.

## Interview Loop Mapping

The roadmap is structured around real interview loops:

- Big Tech MLE: coding, ML fundamentals, product ML system design,
  experimentation, production follow-ups, and behavioral ownership.
- AI Engineer / LLM Engineer: RAG, agents, eval harnesses, tool use,
  prompt/model release gates, LLM security, latency, and cost.
- Startup MLE: take-homes, messy notebook debugging, rapid RAG/API prototypes,
  build-vs-buy, limited data, and week-one execution plans.
- Applied Scientist: statistics, causal reasoning, modeling depth, deep learning
  fundamentals, and research-style trade-off discussion.
- Senior / Architect: capacity planning, migration strategy, multi-tenant
  isolation, incident response, governance, cost controls, and launch risk.

Daily content uses named tracks such as `ML Coding Lab`, `Company Loop`,
`Production ML`, `Architect Follow-up Ladder`, and `Startup Practical Loop`.

## AI Tutor Architecture

The AI Tutor is implemented as a deepagents-style interview coach. It combines
profile-aware prompts, tool use, subagents, memory, and a visible session plan.

Core pieces:

- `lib/ai-tutor-prompts.ts`: shared persona, phase guidance, rubric,
  scaffolding, and tool policy.
- `lib/ai-tutor-agent.ts`: chat agent loop using OpenAI Responses API tools.
- `lib/ai-tutor-realtime.ts`: realtime voice agent tools and session config.
- `components/AiTutorClient.tsx`: shared coach cockpit, profile, chat/voice
  selector, sessions, and insights UI.
- `components/AiTutorVoicePanel.tsx`: browser WebRTC client for realtime voice.
- `lib/ai-tutor-store.ts`: Supabase-backed profile, memory, transcript, session,
  and lesson-plan persistence.
- `lib/ai-tutor-context.ts`: roadmap/question retrieval context used by both
  chat and voice agents.

Agent behavior:

- Chat and voice use the same roadmap, questions, progress, memory, lesson-plan,
  and `record_practice` semantics.
- The coach chooses the next best question from profile, focus areas, mastery,
  and roadmap context instead of asking users to pick from vague menus.
- Progress is checked only when a roadmap-grounded answer is marked
  `interview_ready`.
- Weak answers update memory and coaching insights, but do not check off the
  study tracker.
- Strength and weakness topics move as mastery scores change over time.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Clerk for authentication
- Supabase for progress sync and AI Tutor memory
- OpenAI Responses API and Realtime API for AI Tutor chat/voice
- MDX via `next-mdx-remote`
- Vercel for hosting

## Local Development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

The public roadmap, question browser, and local progress work without
environment variables. Signed-in sync and AI Tutor usage require the optional
services below.

## Environment Variables

Clerk:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SECRET_KEY=sb_secret_xxx
```

AI Tutor:

```bash
OPENAI_API_KEY=sk-xxx
AI_TUTOR_MODEL=gpt-4.1-mini
AI_TUTOR_REALTIME_MODEL=gpt-realtime-mini
AI_TUTOR_DAILY_LIMIT=80
AI_TUTOR_ENABLED=true
```

See [SETUP.md](./SETUP.md) for Clerk, Google sign-in, Supabase schema, AI Tutor
memory tables, realtime voice setup, and troubleshooting.

Use [.env.example](./.env.example) as the starting point for local secrets.

## Quality Checks

```bash
npm run lint
npm run build
```

CI runs lint and production build on pushes and pull requests.

## Project Structure

```text
app/        Next.js routes, server actions, route handlers, and metadata
components/ Shared UI, dashboard, roadmap, question, and AI Tutor components
content/    Editable daily plan JSON, week labels, and MDX case studies
lib/        Loaders, schemas, AI Tutor agents, Supabase, auth, progress store
.github/    CI, release, dependabot, issue templates, PR template, CODEOWNERS
proxy.ts    Optional Clerk proxy when auth is configured
```

Primary routes:

- `/`: dashboard and progress tracker.
- `/study-plan`: daily/weekly roadmap.
- `/questions`: tag-based browser backed by daily-plan content.
- `/ai-tutor`: public preview plus signed-in chat/voice AI Tutor.
- `/day/[day]`: daily checklist and interview questions.
- `/case-studies`: ML and GenAI system design cases.

## Content Model

- Daily plan: `content/daily-plan/days/day-###.json`
- Week headings: `content/daily-plan/weeks.json`
- Case studies: `content/case-studies/*.mdx`
- Pillars, topics, resources: `lib/site-data.ts`
- Daily-plan question index: `lib/daily-plan-questions.ts`

Daily files mirror the UI: title, pillar, focus, checklist tracks, item-level
interview questions, references, and optional topic/case-study links.

For ML-focused days, keep `tracks[].items[].interviewQuestions` in the 2-5
question range when present and write them as real interview prompts rather
than topic labels. See `content/daily-plan/README.md` for the schema.

## Deployment

Production is hosted on Vercel:

- [https://ml-interview-roadmap.vercel.app](https://ml-interview-roadmap.vercel.app)

The primary deployment path is the Vercel GitHub App connected to `main`.
`.github/workflows/vercel.yml` is available for optional Vercel CLI deployments
when these secrets are configured:

```bash
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Manual production deploy:

```bash
npx vercel deploy --prod --yes
```

## Repository Governance

- [CONTRIBUTING.md](./CONTRIBUTING.md): contribution workflow and content rules.
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md): collaboration standards.
- [SECURITY.md](./SECURITY.md): private vulnerability reporting.
- [SUPPORT.md](./SUPPORT.md): support channels.
- [CHANGELOG.md](./CHANGELOG.md): release notes.
- `.github/ISSUE_TEMPLATE`: bug, feature, and content request templates.
- `.github/PULL_REQUEST_TEMPLATE.md`: PR checklist.
- `.github/CODEOWNERS`: default owner review routing.

## License

This repository is source-available for non-commercial use only. Commercial use
requires prior written permission from the maintainers.

See [LICENSE](./LICENSE).
