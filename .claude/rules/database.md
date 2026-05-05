# Database Rules

Load this when changing Supabase access, migrations, RLS, progress tracking,
AI Tutor memory, sessions, transcripts, or profile persistence.

## Safety

- Never run destructive production Supabase commands from an assistant workflow.
- Do not expose `SUPABASE_SECRET_KEY` or service-role behavior to client code.
- Client components may only use publishable Supabase keys.
- Server-only writes must stay in server actions or route handlers.
- Schema changes must include rollback notes or a compatible fallback path.

## Data Model Expectations

- Progress writes should preserve manual progress and AI Tutor source attribution.
- AI Tutor sessions, transcripts, memory, strengths, and weaknesses must be scoped by user id.
- Deleting an AI Tutor session must delete the corresponding persisted session records.
- Tracker updates require explicit evidence that the learner is interview-ready for the topic.

## Review Checklist

- RLS assumptions are documented.
- User id is never trusted from the browser when server auth is available.
- Writes are idempotent where retries are possible.
- API routes fail closed when auth or environment variables are missing.
