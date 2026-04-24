# ML Interview Roadmap

[![CI](https://github.com/Abby263/ml-interview-roadmap/actions/workflows/ci.yml/badge.svg)](https://github.com/Abby263/ml-interview-roadmap/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Abby263/ml-interview-roadmap)](https://github.com/Abby263/ml-interview-roadmap/releases)

Interactive public learning platform for machine learning interview preparation across ML fundamentals, deep learning, generative AI, ML system design, MLOps, and behavioral storytelling.

## What is included

- 30, 60, and 90 day interview roadmaps
- Role-oriented prep paths for ML Engineer, AI Engineer, Data Scientist, and Senior MLE tracks
- MDX-backed blog and case-study content
- Question bank with browser-local saving
- Lightweight dashboard for progress and readiness tracking

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MDX content via `next-mdx-remote`

## Local development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Quality checks

```bash
npm run lint
npm run build
```

## Project structure

```text
app/          Next.js App Router pages
components/   Shared UI building blocks
content/      MDX blog posts, roadmaps, and case studies
lib/          Data models, content loaders, auth/session helpers
```

## Deployment

This app is designed to run on Vercel.

1. Import the GitHub repository into Vercel.
2. Keep the default Next.js build settings.
3. Deploy from `main` for production.

For GitHub Actions based deployment, configure these repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

You can also deploy with the Vercel CLI:

```bash
npx vercel deploy
```

## Releases

- GitHub Actions runs CI on pushes and pull requests.
- Tag pushes matching `v*` create GitHub Releases automatically.

To cut a release manually:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Package maintenance

- `package.json` includes repository metadata for GitHub.
- Dependabot is configured for npm and GitHub Actions updates.

## Repository posture

- Public GitHub repository for transparent product and content iteration
- CI/CD workflow scaffolding for GitHub Actions and Vercel
- Versioned releases via GitHub Releases
