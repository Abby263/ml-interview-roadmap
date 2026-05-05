# /ship

Use this workflow to take a completed change from local branch to verified
production.

## Steps

1. Confirm branch and scope.
   - Run `git status --short --branch`.
   - Confirm the branch is not `main`.
   - Review `git diff --stat` and relevant file diffs.

2. Load relevant context.
   - Always read `prod.yml` and `.claude/rules/release.md`.
   - Add `.claude/rules/frontend.md` for UI work.
   - Add `.claude/rules/database.md` for Supabase or memory changes.
   - Add `.claude/rules/ai-tutor.md` for AI Tutor changes.
   - Add `.claude/rules/security.md` for auth, API, secrets, or AI tools.

3. Verify locally.
   - Run `npm run lint`.
   - Run `npm run build`.
   - For UI changes, smoke-test `/`, `/study-plan`, `/questions`, and `/ai-tutor`.

4. Review.
   - Run `/review-all-agents` for non-trivial changes.
   - Fix all blocker findings before merge.

5. Publish.
   - Stage intentional files only.
   - Commit with a clear message.
   - Push the `codex/*` branch.
   - Open a PR with summary and verification.

6. Merge and deploy.
   - Merge only after checks pass.
   - Sync `main`.
   - Verify Vercel production is `READY`.
   - Smoke-test the production alias.

## Stop Conditions

- Secrets are staged.
- CI or Vercel preview fails.
- A reviewer agent returns `reject`.
- Production deploy is attempted from a non-main branch.
