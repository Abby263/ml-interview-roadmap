#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"

command="$(
  PAYLOAD="$payload" node -e '
    try {
      const input = JSON.parse(process.env.PAYLOAD || "{}");
      const command = input.tool_input?.command || input.command || "";
      process.stdout.write(command);
    } catch {
      process.stdout.write("");
    }
  ' 2>/dev/null
)"

if [ -z "$command" ]; then
  exit 0
fi

block() {
  printf "Blocked by ML Interview Roadmap safety hook: %s\n" "$1" >&2
  printf "Command: %s\n" "$command" >&2
  exit 2
}

current_branch="$(git branch --show-current 2>/dev/null || true)"
staged_files="$(git diff --cached --name-only 2>/dev/null || true)"
staged_patch="$(git diff --cached -- . ':(exclude)package-lock.json' 2>/dev/null || true)"

if [[ "$command" =~ rm[[:space:]].*-rf[[:space:]](/|~|\.|\*|/\*)($|[[:space:]]) ]]; then
  block "destructive rm -rf target"
fi

if [[ "$command" =~ git[[:space:]]+reset[[:space:]]+--hard ]]; then
  block "git reset --hard is not allowed by default"
fi

if [[ "$command" =~ git[[:space:]]+push ]] && [[ "$command" =~ --force ]] && [[ "$command" =~ (origin[[:space:]]+main|main) ]]; then
  block "force-pushing main is not allowed"
fi

if [[ "$command" =~ supabase[[:space:]].*(delete|reset|drop) ]] && [[ "$command" =~ (prod|production|--linked|--project-ref|--db-url) ]]; then
  block "destructive Supabase production-style command"
fi

if [[ "$command" =~ (vercel|npx[[:space:]]+vercel).*(deploy[[:space:]].*--prod|--prod) ]] && [ "$current_branch" != "main" ]; then
  block "production deploys must run from main"
fi

if [[ "$command" =~ git[[:space:]]+add ]] && [[ "$command" =~ (\.env|\.env\.local|\.env\.preview\.local|\.env\.production) ]]; then
  block "do not stage environment files"
fi

if [[ "$command" =~ git[[:space:]]+commit ]] && printf "%s\n" "$staged_files" | grep -Eq '(^|/)\.env(\.|$)|\.env\.local$|\.env\.preview\.local$|\.env\.production$'; then
  block "staged environment file detected"
fi

if [[ "$command" =~ git[[:space:]]+commit ]] && printf "%s\n" "$staged_patch" | grep -Eq '(sk-[A-Za-z0-9_-]{20,}|OPENAI_API_KEY=|CLERK_SECRET_KEY=|SUPABASE_SECRET_KEY=|NEXT_PUBLIC_SUPABASE_URL=https://[^[:space:]]+)'; then
  block "staged patch appears to contain secrets"
fi

exit 0
