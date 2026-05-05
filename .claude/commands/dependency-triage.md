# /dependency-triage

Use this for Dependabot PR cleanup and dependency merge decisions.

## Steps

1. List open dependency PRs.
   - Check PR number, package, version delta, merge state, and checks.

2. Categorize.
   - Safe: patch or minor updates with green fresh checks.
   - Careful: major compiler/runtime/library updates with green fresh checks.
   - Migration: Tailwind, ESLint, framework, auth, database, or AI SDK changes that fail or alter behavior.

3. Merge policy.
   - Merge safe PRs one at a time.
   - Refresh stale branches before merging.
   - Wait for `main` CI and Vercel Deploy after each merge.
   - Merge major but green updates separately.
   - Leave failing migration PRs open.

4. Cleanup.
   - Prune deleted remote refs.
   - Delete merged branches with no open PR and zero unique commits.
   - Do not delete local branches with unique commits unless explicitly approved.

## Required Verification

- `main` CI passes.
- Vercel production deployment is `READY` after final merge.
- Production `/` and `/ai-tutor` return `200`.
