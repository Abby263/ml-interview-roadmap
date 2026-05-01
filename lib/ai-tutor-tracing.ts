// Lightweight LangSmith run tracker for the AI Tutor agent loop.
//
// No-ops when LANGSMITH_API_KEY is unset, so local dev works without it.
// We POST runs directly to the LangSmith REST API (no SDK dep) so the
// tracer adds zero install footprint.

const LANGSMITH_HOST =
  process.env.LANGSMITH_ENDPOINT?.replace(/\/$/, "") ||
  "https://api.smith.langchain.com";

const LANGSMITH_PROJECT =
  process.env.LANGSMITH_PROJECT || "ml-roadmap-ai-tutor";

const tracingEnabled = Boolean(
  process.env.LANGSMITH_API_KEY &&
    process.env.LANGSMITH_TRACING !== "false"
);

interface RunStartInput {
  name: string;
  runType: "chain" | "llm" | "tool";
  inputs: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  parentRunId?: string;
}

interface RunHandle {
  id: string | null;
  parentRunId?: string;
  startTime: number;
}

function newRunId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `run-${Date.now()}-${Math.random()}`;
}

async function postRun(payload: Record<string, unknown>) {
  if (!tracingEnabled) return;
  try {
    await fetch(`${LANGSMITH_HOST}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.LANGSMITH_API_KEY ?? "",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // tracing must never break the user request
  }
}

async function patchRun(runId: string, payload: Record<string, unknown>) {
  if (!tracingEnabled) return;
  try {
    await fetch(`${LANGSMITH_HOST}/runs/${runId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.LANGSMITH_API_KEY ?? "",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // tracing must never break the user request
  }
}

export function startRun(input: RunStartInput): RunHandle {
  if (!tracingEnabled) {
    return { id: null, startTime: Date.now() };
  }
  const id = newRunId();
  const startTime = Date.now();
  void postRun({
    id,
    name: input.name,
    run_type: input.runType,
    start_time: new Date(startTime).toISOString(),
    inputs: input.inputs,
    extra: { metadata: input.metadata ?? {} },
    session_name: LANGSMITH_PROJECT,
    parent_run_id: input.parentRunId,
  });
  return { id, parentRunId: input.parentRunId, startTime };
}

export async function endRun(
  handle: RunHandle,
  outputs: Record<string, unknown>,
  error?: string
) {
  if (!handle.id) return;
  await patchRun(handle.id, {
    end_time: new Date().toISOString(),
    outputs,
    error,
  });
}

export const langsmithEnabled = tracingEnabled;
