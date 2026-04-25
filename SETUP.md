# Setup — Auth (Clerk) + Per-user progress (Supabase)

The site works without any auth or database — progress is tracked in
`localStorage` per browser. To enable cross-device progress sync with
real user accounts, follow the two sections below. **You can do them in
either order, and you can skip Supabase if you only want auth.**

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
   Phone, Username**, enable **Email address + Password** and any other
   methods you want.
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
