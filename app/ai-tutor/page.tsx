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
        Sign in to start the AI Tutor.
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-muted md:text-base md:leading-7">
        The tutor uses your profile, weak areas, previous answers, and roadmap
        progress to personalize follow-up questions and feedback.
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
            <p className="eyebrow">AI Tutor Deep Agent</p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Practice with a tutor that remembers your weak spots.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted md:text-lg md:leading-8">
              Get assessed, answer one interview question at a time, receive a
              scored critique, and let memory steer the next topic across the
              133-day ML interview roadmap.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="metric-slab">
              <p className="panel-label">Model</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                {aiTutorOpenAIEnabled ? "OpenAI" : "Setup needed"}
              </p>
            </div>
            <div className="metric-slab">
              <p className="panel-label">Memory</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                {aiTutorMemoryEnabled ? "Supabase" : "Optional"}
              </p>
            </div>
            <div className="metric-slab">
              <p className="panel-label">Mode</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-foreground">
                Guided
              </p>
            </div>
          </div>
        </div>
      </header>

      <AiTutorClient
        initialProfile={state.profile}
        initialMemory={state.memory}
        initialMessages={state.recentMessages}
        tags={tags}
        openaiConfigured={aiTutorOpenAIEnabled}
        memoryConfigured={aiTutorMemoryEnabled && state.persistenceReady}
        persistenceWarning={state.persistenceWarning}
      />
    </div>
  );
}
