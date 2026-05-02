# Release Rules

Load this when merging PRs, deploying, changing CI/CD, handling Dependabot, or
updating Vercel configuration.

## Branching

- Create `codex/*` branches for implementation work.
- Keep `main` deployable.
- Do not force-push `main`.
- Delete remote branches after PR merge unless an open PR still depends on them.

## Verification

- Run `npm run lint` and `npm run build` before opening or merging non-trivial PRs.
- For UI changes, smoke-test `/`, `/study-plan`, `/questions`, and `/ai-tutor`.
- For production deploys, verify the Vercel deployment is `READY` and the production alias responds with `200`.

## Dependabot Policy

- Merge patch/minor dependency updates one at a time after green checks.
- Refresh stale Dependabot branches before merging.
- Treat major compiler/runtime/tooling changes as separate PRs.
- Do not merge failing Tailwind or ESLint major bumps without migration work.

## Production Deploy

- Production deploys should come from `main`.
- Prefer the Vercel GitHub App deployment path.
- Manual deploys must use `npx vercel deploy --prod --yes` only from `main`.
