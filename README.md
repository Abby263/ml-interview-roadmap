# ML Interview Roadmap

[![CI](https://github.com/Abby263/ml-interview-roadmap/actions/workflows/ci.yml/badge.svg)](https://github.com/Abby263/ml-interview-roadmap/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Abby263/ml-interview-roadmap)](https://github.com/Abby263/ml-interview-roadmap/releases)

Interactive public learning platform for machine learning, AI engineering, GenAI, LLMOps, ML system design, MLOps, coding, and behavioral interview preparation.

Live production: [ml-interview-roadmap.vercel.app](https://ml-interview-roadmap.vercel.app)

## What Is Included

- A 132-day interview roadmap with day-by-day study tasks ordered from statistics through ML system design.
- Clickable daily pages with checklists, interview prompts, references, linked topics, and case studies.
- Editable daily-plan content in `content/daily-plan/days`, with one JSON file per day and editable week labels in `content/daily-plan/weeks.json`.
- Topic libraries for math and statistics, traditional ML, deep learning, MLOps, GenAI, LLMOps, ML system design, foundations, and behavioral prep.
- A question bank and expanded ML/GenAI/LLMOps system design case-study library.
- Optional Clerk auth for accounts and optional Supabase sync for cross-device progress.
- Browser-local progress tracking when auth or Supabase are not configured.

## Curriculum Order

The main roadmap now follows the interview-prep order used across the UI:

1. Statistics, probability, linear algebra, optimization, and evaluation math.
2. Traditional machine learning, feature engineering, leakage prevention, SQL, and ML coding.
3. Deep learning, CNNs, sequence models, attention, and transformers.
4. MLOps: data validation, training orchestration, model registry, CI/CD, deployment, monitoring, and governance.
5. Generative AI: LLM fundamentals, prompting, embeddings, vector search, RAG, fine-tuning, agents, and guardrails.
6. LLMOps: prompt/model versioning, eval regression gates, tracing, routing, cost controls, safety, privacy, and red teaming.
7. ML system design: requirements, metrics, feature stores, serving, monitoring, recommendation, search, ads, fraud, and RAG system cases.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Clerk for optional auth
- Supabase for optional per-user progress sync
- MDX content via `next-mdx-remote`
- Vercel for hosting

## Local Development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

The app works without environment variables. In that mode, auth is hidden and progress is stored in `localStorage`.

## Optional Environment Variables

Clerk auth:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

Supabase progress sync:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SECRET_KEY=sb_secret_xxx
```

See [SETUP.md](./SETUP.md) for Clerk, Google sign-in, Supabase schema, and troubleshooting details.

## Quality Checks

```bash
npm run lint
npm run build
```

CI runs the same lint and production build checks on pushes and pull requests.

## Project Structure

```text
app/        Next.js App Router pages, server actions, and route groups
components/ Shared UI and interactive checklist components
content/    Editable daily plan JSON, week labels, and MDX case studies
lib/        Content loaders, schemas, feature flags, Supabase client, progress store
proxy.ts    Optional Clerk proxy when auth is configured
```

## Content Sources

- Daily plan: `content/daily-plan/days/day-###.json`
- Landing-page week headings: `content/daily-plan/weeks.json`
- Case studies: `content/case-studies/*.mdx`
- Pillars, topics, questions, and resources: `lib/site-data.ts`

## Editing Daily Content

Daily plan content lives in `content/daily-plan/days/day-001.json` through `day-132.json`.
Each file mirrors the landing-page/day-page structure: title, pillar, focus, checklist tracks,
interview questions, references, and optional links to topic or case-study pages. The app loads
these files from the folder at build time, so adding or removing a day does not require changing a
TypeScript import manifest as long as day numbers remain consecutive.

For ML-focused days, keep `interviewQuestions` in the 2-5 question range and write them as
real interview prompts rather than topic names. See `content/daily-plan/README.md` for the schema.

Week headings on the landing page are editable in `content/daily-plan/weeks.json`. Runtime validation
for daily content lives in `lib/daily-plan.ts`; client-safe types and helper functions live in
`lib/daily-plan-schema.ts`.

## Deployment

Production is deployed on Vercel:

- [https://ml-interview-roadmap.vercel.app](https://ml-interview-roadmap.vercel.app)

The primary automatic deployment path is the Vercel GitHub App connected to `main`. GitHub also contains `.github/workflows/vercel.yml` for optional Vercel CLI deployments. That workflow now skips successfully when these secrets are not configured, which avoids false-red checks when the Vercel GitHub App is already handling deployment:

```bash
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Manual production deploy:

```bash
npx vercel deploy --prod --yes
```

## Releases

- CI runs on pushes and pull requests.
- Tag pushes matching `v*` create GitHub Releases automatically.
- Dependabot is configured for npm and GitHub Actions updates.

Manual release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Repository Notes

- The repository is public: [github.com/Abby263/ml-interview-roadmap](https://github.com/Abby263/ml-interview-roadmap).
- `.env`, `.env.*`, `.vercel`, `.next`, and `.claude` are ignored so local credentials and generated worktrees do not leak into commits or local lint runs.
- The app intentionally degrades gracefully: no auth means local progress only; no Supabase means signed-in users still get local progress.
