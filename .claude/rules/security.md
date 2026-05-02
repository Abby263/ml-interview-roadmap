# Security Rules

Load this for auth, API routes, environment variables, external integrations,
Supabase access, OpenAI usage, file uploads, or deployment changes.

## Secret Handling

- Never commit `.env`, `.env.local`, `.env.preview.local`, `.env.production`, or copied secrets.
- Never paste real OpenAI, Clerk, Supabase, Vercel, or GitHub tokens into docs, tests, logs, or examples.
- Use `.env.example` with placeholder values only.

## Auth And API

- Signed-in features must verify the user on the server.
- Public preview pages may render UI, but write actions must require auth.
- API routes must validate required environment variables and fail safely.
- Do not add open write endpoints.

## LLM Security

- Treat user messages as untrusted input.
- Do not let LLM output directly execute code, database commands, or shell commands.
- RAG and references must avoid exposing private user memory across users.
- Add explicit guardrails for prompt injection, excessive agency, and unbounded consumption.

## Release Gate

- If a change touches auth, secrets, memory, or API writes, run the security reviewer before merge.
