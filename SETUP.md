# Setup — Auth, Progress, and AI Tutor

The site works without any auth or database — progress is tracked in
`localStorage` per browser. To enable cross-device progress sync with
real user accounts and AI Tutor memory, follow the sections below.
**You can do them in stages, and you can skip Supabase if you only want
auth without cross-device progress or tutor memory.**

Once env vars are set in Vercel, redeploy and the features turn on with
no code changes.

---

## 1) Clerk — sign in with Google + email/password

Clerk handles all the auth UI (sign-in modal, sign-up modal, account
management). It supports Google OAuth, email/password, magic links, and
a dozen other providers — pick what you want in the Clerk dashboard.

### Steps

1. Go to <https://clerk.com>, sign up, **create a new application**.
2. In the Clerk dashboard, under **User & Authentication → Email,
   Phone, Username**:
   - **Enable** *Email address* + *Password* (or just *Email address*
     if you want passwordless / magic-link sign-up).
   - **Disable** *Phone number* — otherwise Clerk requires SMS / OTP
     verification on sign-up. Toggling phone OFF is the single switch
     that makes the flow email-only with no phone prompt.
   - Under **Verification**, leave *Email verification code* on; turn
     *Phone verification code* off.
3. Under **User & Authentication → Social Connections**, enable
   **Google** (Clerk handles the OAuth dance — no Google Cloud
   Console needed for the basic setup).
4. Copy your **Publishable key** and **Secret key** from the Clerk
   dashboard (API Keys page).
5. In Vercel → Project Settings → Environment Variables, add:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_...      # or pk_live_...
   CLERK_SECRET_KEY                  = sk_test_...      # or sk_live_...
   ```

   Optional (these honour the routes we ship):

   ```
   NEXT_PUBLIC_CLERK_SIGN_IN_URL       = /sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL       = /sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /          # (or /dashboard — we redirect it to /)
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /
   ```

   Set them for **Production** (and **Preview** if you want auth on
   preview deploys too).

6. Redeploy:

   ```bash
   vercel deploy --prod --yes
   ```

7. Visit the site — the header now shows **Sign in / Sign up**.
   Clicking opens the Clerk modal.

### What happens locally with no env vars?

`lib/feature-flags.ts` detects missing keys and the app skips
`<ClerkProvider>` entirely. The header shows no auth controls.

---

## 2) Supabase — per-user progress sync (optional)

Without Supabase, progress is per-browser. With Supabase + Clerk, every
checkbox toggle also writes to a `day_progress` table keyed by the
Clerk user id, so progress syncs across devices.

### Steps

1. Go to <https://supabase.com>, sign up, **create a new project**.
   The free tier is enough.
2. Open the **SQL editor** in your Supabase project and run:

   ```sql
   create table if not exists day_progress (
     user_id   text not null,
     day       int  not null,
     item_id   text not null,
     created_at timestamptz default now(),
     primary key (user_id, day, item_id)
   );

   create index if not exists day_progress_user_idx
     on day_progress (user_id);
   ```

   **Already running an older version?** Run this once to add the
   `source` column used to mark items studied via the AI coach:

   ```sql
   alter table day_progress
     add column if not exists source text not null default 'manual';
   ```

   The code falls back gracefully if you skip the `alter` — checks
   still write, they just won't be tagged.

3. From **Project Settings → API** (or **API Keys** in newer dashboards), copy:

   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Public key**
       - newer naming: **publishable** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
       - legacy naming: **anon** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
       - either name works; the code accepts both.
   - **Secret key**
       - newer naming: **secret** → `SUPABASE_SECRET_KEY`
       - legacy naming: **service_role** → `SUPABASE_SERVICE_ROLE_KEY`
       - ⚠ **server-only — never prefix with `NEXT_PUBLIC_`**.
       - **This one is required for sync to work.** Without it the home
         page shows "sign in to track progress" but writes go nowhere.

4. In Vercel → Environment Variables, add:

   ```
   NEXT_PUBLIC_SUPABASE_URL              = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  = sb_publishable_...   # or NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SECRET_KEY                   = sb_secret_...        # or SUPABASE_SERVICE_ROLE_KEY (server-only)
   ```

5. Redeploy:

   ```bash
   vercel deploy --prod --yes
   ```

6. Sign in (Clerk), check off some items on a day, sign in on another
   device — progress is there.

### How writes work

- Every checkbox toggle writes optimistically to `localStorage` for
  instant UI.
- If Clerk is signed in **and** Supabase is configured, it also fires
  a server action (`addServerCheck` / `removeServerCheck` in
  `app/actions/progress.ts`) that upserts/deletes from `day_progress`.
- On the home page, signed-in users hydrate their server state into
  localStorage on first paint — progress merges as a union (so checks
  from a phone show up on the laptop).

### Row-level security

By default the table is open and we always go through the **service
role key** from server actions, so client code never directly touches
the database. If you want defense-in-depth, enable RLS in Supabase and
add this policy:

```sql
alter table day_progress enable row level security;

create policy "user reads own progress" on day_progress
  for select using (true);  -- service role bypasses RLS

create policy "user writes own progress" on day_progress
  for all using (true) with check (true);
```

(Service role bypasses RLS, so the policies only matter if you ever
expose the anon key for direct client writes.)

---

## 3) AI Tutor — OpenAI + Supabase memory

The AI Tutor is a signed-in feature at `/ai-tutor`. It uses Clerk for
identity, OpenAI for the tutor response, and Supabase for optional
persistent memory, session history, and usage counts.

### Environment variables

Add these in Vercel and `.env.local` when testing locally:

```bash
OPENAI_API_KEY=sk-...
AI_TUTOR_MODEL=gpt-4o-mini        # optional; defaults to gpt-4o-mini.
                                  # gpt-4o-mini and gpt-4.1 both reliably
                                  # support the function-calling agent
                                  # loop; older models may not.
AI_TUTOR_DAILY_LIMIT=80           # optional; per-user/day when Supabase is configured
AI_TUTOR_ENABLED=true             # optional; set false to hide/disable server behavior
```

The OpenAI key is server-only. Never prefix it with `NEXT_PUBLIC_`.

### LangSmith tracing

The AI Tutor agent emits structured traces (parent run + every LLM call
+ every tool call + every subagent delegation) to LangSmith. Runs are
fire-and-forget — best-effort, never block or break the user request.

#### Steps

1. Sign up at <https://smith.langchain.com>, create a project (default
   name we look for: `ml-roadmap-ai-tutor`).
2. Open **Settings → API Keys** and create a key.
3. In Vercel → Environment Variables, add:

   ```bash
   LANGSMITH_TRACING=true
   LANGSMITH_ENDPOINT=https://api.smith.langchain.com
   LANGSMITH_API_KEY=lsv2_...
   LANGSMITH_PROJECT="ml-roadmap-ai-tutor"
   ```

4. Redeploy. Hit `/ai-tutor` and confirm a parent run named
   `ai-tutor.turn` appears in the LangSmith project, with child runs for
   each `openai.responses.*` call, each `tool.*` call, and each
   `subagent.*` delegation.

Without these env vars, all tracing calls become no-ops and the agent
runs identically.

#### What you'll see in LangSmith

- `ai-tutor.turn` (chain) — top-level per-message turn
  - `agent.iterN.<model>.attemptM` (llm) — each model call in the
    function-calling loop, tagged with the model that succeeded
  - `tool.<name>` (tool) — each tool invocation with its preview
  - `subagent.concept_teacher` / `subagent.mock_interviewer` (llm) — the
    delegated single-shot subagent calls

This makes it easy to debug "why did the coach skip grading?" or "which
tool blew up the latency?" without trawling through Vercel logs.

### Supabase tables for memory

If you want persistent AI Tutor memory, run this SQL after the
`day_progress` table setup:

```sql
create table if not exists ai_tutor_profiles (
  user_id text primary key,
  target_role text not null default 'ML Engineer',
  current_level text not null default 'intermediate',
  interview_date date,
  daily_hours numeric not null default 2,
  weak_tags text[] not null default '{}',
  preferred_mode text not null default 'guided-interview',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ai_tutor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  status text not null default 'active',
  mode text not null default 'guided-interview',
  current_tag text,
  summary jsonb not null default '{}'::jsonb,
  started_at timestamptz default now(),
  ended_at timestamptz
);

create index if not exists ai_tutor_sessions_user_idx
  on ai_tutor_sessions (user_id, started_at desc);

create table if not exists ai_tutor_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references ai_tutor_sessions(id) on delete cascade,
  user_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  topic_ref jsonb not null default '{}'::jsonb,
  evaluation jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists ai_tutor_messages_user_idx
  on ai_tutor_messages (user_id, created_at desc);

create index if not exists ai_tutor_messages_session_idx
  on ai_tutor_messages (session_id, created_at asc);

create table if not exists ai_tutor_memory (
  user_id text primary key,
  mastery jsonb not null default '{}'::jsonb,
  recurring_mistakes text[] not null default '{}',
  strengths text[] not null default '{}',
  next_recommendations text[] not null default '{}',
  updated_at timestamptz default now()
);

create table if not exists ai_tutor_usage (
  user_id text not null,
  usage_date date not null,
  message_count int not null default 0,
  token_estimate int not null default 0,
  updated_at timestamptz default now(),
  primary key (user_id, usage_date)
);
```

The current implementation uses the Supabase service-role key from
server routes only. Client code never writes to these tables directly.

### What works in the MVP

- `/ai-tutor` is gated behind Clerk sign-in.
- The profile captures target role, current level, interview date, daily hours, weak roadmap tags, and tutor mode without taking over the chat layout.
- The tutor supports multiple sessions. Each session has its own transcript and lesson plan, while the memory layer is shared across sessions.
- The tutor asks one roadmap-backed question at a time, evaluates answers, teaches gaps, includes reference links when the learner needs review material, and recommends the next day/topic.
- Memory stores mastery scores, recurring mistakes, strengths, and next recommendations.
- Dashboard progress is updated from AI Tutor only when `record_practice` marks a canonical roadmap item as `interview_ready`; weak or partial answers update memory but do not check off the study tracker.
- The Python coding lab is intentionally not server-side. It is planned as a browser-only Pyodide module so user code does not execute on your infrastructure.

---

## Verifying the integration

After deploying with both sets of env vars:

1. Open the site in an incognito window — header shows **Sign in /
   Sign up**.
2. Sign up with email/password or Google — modal closes, your avatar
   appears in the header.
3. Open `/day/1`, check off 2-3 items.
4. Open <https://supabase.com> → **Table editor → `day_progress`** —
   your rows are there with your Clerk `user_id`.
5. Open the site on another device, sign in — the same items are
   already checked.
6. Open `/ai-tutor`, save a tutor profile, start an assessment, then
   confirm rows appear in `ai_tutor_profiles`, `ai_tutor_sessions`,
   `ai_tutor_messages`, `ai_tutor_memory`, and `ai_tutor_usage`.
7. Answer a roadmap-grounded question strongly enough for the coach to
   mark it interview-ready, then verify `day_progress.source = 'ai_tutor'`
   for the related day/item. Partial answers should only update
   `ai_tutor_memory`.

---

## Local development

For local dev you can either:

- Skip both — site works on localStorage only.
- Add the env vars to a `.env.local` file (already gitignored via
  `.gitignore`'s defaults). Remember to set them in **Vercel** too for
  production.

```
# .env.local (do not commit)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
AI_TUTOR_MODEL=gpt-4.1-mini
```

Then `npm run dev`.

---

## Troubleshooting

- **"Sign in modal opens but closes immediately"** — check the
  authorized redirect URL in Clerk → API Keys → Frontend origins. Add
  your Vercel domain.
- **"Checks don't sync across devices"** — open the browser console
  on the signed-in device. Server-action errors are visible there. Most
  likely cause: `SUPABASE_SERVICE_ROLE_KEY` not set, or the SQL table
  wasn't created.
- **Build fails locally with Clerk errors** — make sure `CLERK_SECRET_KEY`
  is also set when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set; both
  must be present together.
- **AI Tutor says OpenAI is not configured** — add `OPENAI_API_KEY` in
  Vercel for Production and Preview, then redeploy.
- **AI Tutor works but does not remember answers** — create the
  `ai_tutor_*` tables and verify `SUPABASE_SECRET_KEY` or
  `SUPABASE_SERVICE_ROLE_KEY` is set.
