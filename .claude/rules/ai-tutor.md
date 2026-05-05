# AI Tutor Rules

Load this when changing `lib/ai-tutor-*`, `components/AiTutor*`,
`app/ai-tutor/**`, or `app/api/ai-tutor/**`.

## Agent Behavior

- Chat and voice agents must use the same roadmap, questions, memory, progress, and lesson-plan semantics.
- The agent should decide the next best topic from profile, mastery, weaknesses, and roadmap context.
- Do not ask users to choose from vague menus when the coach can make a better decision.
- Show reference links with questions when they help the learner prepare a better answer.
- Keep signed-out preview visible, but require login before chat, voice, memory writes, or tracker updates.

## Mastery And Tracker Updates

- A correct answer should update mastery only when it maps to a roadmap topic.
- Mark progress complete only when the evaluation is `interview_ready`.
- Weak answers should update insights, weaknesses, and follow-up planning without checking off the tracker.
- Strengths and weaknesses should evolve over sessions as mastery changes.

## Conversation Management

- Support multiple sessions with shared user memory.
- Deleting a session must remove that session's persisted transcript and session row.
- Long conversations should summarize durable insights into memory instead of relying only on chat history.
- Avoid storing raw secrets, API keys, or unrelated personal data in memory.
