# Project AI Operating System

This directory defines the repo-level workflow for AI-assisted development.
It keeps the safety checks, rules, reviewer agents, and slash-command workflows
modular so only relevant context needs to be loaded for a task.

## Structure

- `settings.json`: Wires project hooks and points contributors to shared rules.
- `hooks/`: Hard safety checks that can block dangerous commands before they run.
- `rules/`: Modular project rules for frontend, database, AI Tutor, security, content, and releases.
- `agents/`: Specialist reviewer briefs for bug, security, performance, and frontend design reviews.
- `commands/`: Slash-command workflows such as `/ship` and `/review-all-agents`.
- `../prod.yml`: The project brain: architecture, decisions, release policy, and production rules.

## Operating Model

Hooks are hard safety rules. They should block obvious high-risk actions such as
committing secrets, deleting production resources, force-pushing `main`, or
deploying production from a non-main branch.

Rules are modular context files. Load only the files relevant to the current
task so the assistant does not waste context on unrelated policy.

Agents are specialist reviewer profiles. Use them before merging work that
touches security, database access, AI Tutor behavior, performance-sensitive
code, or visible UI.

Commands are repeatable workflows. They describe the exact steps to ship,
review, triage dependencies, and update curriculum content.
