# ML Interview Roadmap

[![CI](https://github.com/Abby263/ml-interview-roadmap/actions/workflows/ci.yml/badge.svg)](https://github.com/Abby263/ml-interview-roadmap/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Abby263/ml-interview-roadmap)](https://github.com/Abby263/ml-interview-roadmap/releases)

Interactive public learning platform for machine learning, AI engineering, GenAI, ML system design, MLOps, coding, and behavioral interview preparation.

Live production: [ml-interview-roadmap.vercel.app](https://ml-interview-roadmap.vercel.app)

## What Is Included

- A 126-day interview roadmap with day-by-day study tasks.
- Clickable daily pages with checklists, interview prompts, references, linked topics, and case studies.
- A visual roadmap view at `/roadmap` with week-level flow and progress context.
- Topic libraries for foundations, math and statistics, traditional ML, deep learning, GenAI, ML system design, MLOps, and behavioral prep.
- A question bank and expanded ML/GenAI system design case-study library.
- Optional Clerk auth for accounts and optional Supabase sync for cross-device progress.
- Browser-local progress tracking when auth or Supabase are not configured.

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
components/ Shared UI and interactive roadmap/checklist components
content/    MDX blog posts and case studies
lib/        Content data, feature flags, Supabase client, progress store
proxy.ts    Optional Clerk proxy when auth is configured
```

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
