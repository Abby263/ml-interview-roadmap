import type { Metadata } from "next";
import Link from "next/link";

import AiTutorClient from "@/components/AiTutorClient";
import { getSignedInUserId } from "@/lib/auth";
import { getAiTutorTagOptions } from "@/lib/ai-tutor-context";
import { getAiTutorState } from "@/lib/ai-tutor-store";
import {
  defaultAiTutorMemory,
  defaultAiTutorProfile,
  type AiTutorSessionSummary,
  type AiTutorMessage,
} from "@/lib/ai-tutor-types";
import {
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
    <section className="section-card rounded-[28px] p-5 md:p-6">
      <p className="panel-label">AI Tutor setup</p>
      <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
        Auth is not configured yet.
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
        You can still preview the AI Tutor interface below. Configure Clerk to
        let learners start chat or voice sessions and persist their coach
        memory.
      </p>
      <Link href="/study-plan" className="button-secondary mt-6">
        Continue with study plan
      </Link>
    </section>
  );
}

function SignedOutPreviewPanel() {
  return (
    <section className="section-card rounded-[28px] p-5 md:p-6">
      <p className="panel-label">Preview mode</p>
      <h2 className="mt-2 font-display text-2xl font-extrabold text-foreground">
        Explore the AI Tutor before signing in.
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
        The profile, focus areas, session list, insights, chat surface, and
        voice mode selector are visible publicly. Starting chat or voice
        requires an account because the coach stores transcripts, mastery,
        strengths, weaknesses, and roadmap progress per learner.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/sign-in" className="button-primary-accent">
          Sign in
        </Link>
        <Link href="/sign-up" className="button-secondary">
          Create account
        </Link>
        <Link href="/study-plan" className="button-secondary">
          Preview study plan
        </Link>
      </div>
    </section>
  );
}

export default async function AiTutorPage() {
  const authReady = clerkClientEnabled && clerkEnabled;
  const userId = authReady ? await getSignedInUserId() : null;
  const tags = getAiTutorTagOptions();
  const state = userId
    ? await getAiTutorState(userId)
    : {
        profile: defaultAiTutorProfile,
        memory: defaultAiTutorMemory,
        recentMessages: [] as AiTutorMessage[],
        sessions: [] as AiTutorSessionSummary[],
        activeSessionId: undefined,
        persistenceReady: false,
        persistenceWarning: undefined,
      };

  return (
    <div className="space-y-8">
      <header className="hero-panel relative overflow-hidden p-6 md:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <div className="relative max-w-4xl">
          <p className="eyebrow">AI Interview Coach</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            A personal coach who learns how you learn.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted md:text-lg md:leading-8">
            We&rsquo;ll start with a friendly chat about your target role and
            comfort areas, then ladder up — basics first, harder questions as
            you&rsquo;re ready, with feedback shaped to help you improve, not
            just a score.
          </p>
        </div>
      </header>

      {!authReady ? (
        <AuthSetupPanel />
      ) : !userId ? (
        <SignedOutPreviewPanel />
      ) : null}

      <AiTutorClient
        initialProfile={state.profile}
        initialMemory={state.memory}
        initialMessages={state.recentMessages}
        initialSessions={state.sessions}
        initialSessionId={state.activeSessionId}
        tags={tags}
        openaiConfigured={aiTutorOpenAIEnabled}
        signedIn={Boolean(userId)}
        persistenceWarning={state.persistenceWarning}
      />
    </div>
  );
}
