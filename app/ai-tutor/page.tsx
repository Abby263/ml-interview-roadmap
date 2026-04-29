import type { Metadata } from "next";
import Link from "next/link";

import AiTutorClient from "@/components/AiTutorClient";
import { getSignedInUserId } from "@/lib/auth";
import { getAiTutorTagOptions } from "@/lib/ai-tutor-context";
import { getAiTutorState } from "@/lib/ai-tutor-store";
import {
  aiTutorMemoryEnabled,
  aiTutorOpenAIEnabled,
  clerkClientEnabled,
  clerkEnabled,
} from "@/lib/feature-flags";
import { aiTutorLevels } from "@/lib/ai-tutor-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tutor",
  description:
    "Personalized ML interview tutor with guided questioning, feedback, and memory.",
};

function AuthSetupPanel() {
  return (
    <section className="hero-panel p-6 md:p-8">
      <p className="panel-label">AI Tutor setup</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-5xl">
        Configure Clerk to use the AI Tutor.
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-muted md:text-base md:leading-7">
        The tutor is intentionally signed-in-only because it stores interview
        preparedness, memory, and session history per learner. Add Clerk keys in
        Vercel or local env, then redeploy.
      </p>
      <Link href="/study-plan" className="button-secondary mt-6">
        Continue with study plan
      </Link>
    </section>
  );
}

function SignedOutPanel() {
  return (
    <section className="hero-panel p-6 md:p-8">
      <p className="panel-label">Signed-in mode</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-5xl">
        Sign in to meet your AI interview coach.
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-muted md:text-base md:leading-7">
        Your coach learns your target role, where you&rsquo;re strong, and what
        to grow next — then builds a daily plan from the 133-day roadmap that
        fits your interview date.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/sign-in" className="button-primary-accent">
          Sign in
        </Link>
        <Link href="/study-plan" className="button-secondary">
          Preview study plan
        </Link>
      </div>
    </section>
  );
}

const levelLabels = Object.fromEntries(
  aiTutorLevels.map((level) => [level.value, level.label])
);

export default async function AiTutorPage() {
  if (!clerkClientEnabled || !clerkEnabled) {
    return <AuthSetupPanel />;
  }

  const userId = await getSignedInUserId();
  if (!userId) {
    return <SignedOutPanel />;
  }

  const [state, tags] = await Promise.all([
    getAiTutorState(userId),
    Promise.resolve(getAiTutorTagOptions()),
  ]);

  return (
    <div className="space-y-8">
      <header className="hero-panel relative overflow-hidden p-6 md:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="eyebrow">AI Interview Coach</p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              A personal coach who learns how you learn.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted md:text-lg md:leading-8">
              We&rsquo;ll start with a friendly chat about your target role and
              comfort areas, then ladder up — basics first, harder questions as
              you&rsquo;re ready, with feedback shaped to help you improve, not
              just a score.
            </p>
          </div>
          <div className="rounded-[26px] border border-line bg-surface-strong/85 p-5 shadow-soft">
            <p className="panel-label">Profile</p>
            <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
              {state.profile.targetRole}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-background/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Level
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {levelLabels[state.profile.currentLevel] ?? "Not set"}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-background/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Study time
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {state.profile.dailyHours}h/day
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-background/70 p-3 sm:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Interview date
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {state.profile.interviewDate || "Not set"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted">
              The coach uses this profile plus your evaluated answers to keep
              the plan personalized.
            </p>
          </div>
        </div>
      </header>

      <AiTutorClient
        initialProfile={state.profile}
        initialMemory={state.memory}
        initialMessages={state.recentMessages}
        initialSessions={state.sessions}
        initialSessionId={state.activeSessionId}
        tags={tags}
        openaiConfigured={aiTutorOpenAIEnabled}
        memoryConfigured={aiTutorMemoryEnabled && state.persistenceReady}
        persistenceWarning={state.persistenceWarning}
      />
    </div>
  );
}
