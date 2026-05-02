# /review-all-agents

Use this before merging medium or high-risk work.

## Inputs

- Current branch.
- Diff against `main`.
- Files changed.
- Relevant rules from `.claude/rules/`.
- `prod.yml` for architecture and release policy.

## Agent Order

1. Bug reviewer.
   - Load `.claude/agents/bug-reviewer.md`.
   - Focus on crashes, state, async behavior, and missing fallbacks.

2. Security reviewer.
   - Load `.claude/agents/security-reviewer.md`.
   - Required for auth, Supabase, OpenAI, API routes, hooks, or deployment changes.

3. Performance reviewer.
   - Load `.claude/agents/performance-reviewer.md`.
   - Required for data loading, large lists, AI Tutor context, or expensive loops.

4. Frontend design reviewer.
   - Load `.claude/agents/frontend-design-reviewer.md`.
   - Required for visible UI changes.

## Decision Rules

- If any reviewer returns `reject`, do not merge.
- If any reviewer returns `merge with fixes`, fix blockers and rerun the relevant reviewer.
- If all reviewers return `merge`, proceed to CI and PR checks.

## Final Output

- `Decision`: merge, merge with fixes, or reject.
- `Blocking findings`: short list with file references.
- `Checks run`: commands and smoke tests.
- `Residual risk`: anything left to manually verify.
