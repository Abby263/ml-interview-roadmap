"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  AiTutorEvaluation,
  AiTutorMemory,
  AiTutorNextTopic,
  AiTutorPhase,
  AiTutorPlan,
  AiTutorProfile,
  AiTutorSuggestedAction,
  AiTutorToolTrace,
} from "@/lib/ai-tutor-types";

// ──────────────────────────────────────────────────────────────────────────
// Browser-side WebRTC client for the AI Tutor Realtime mode.
//
// Flow:
//   1. POST /api/ai-tutor/realtime/session → ephemeral client_secret + model.
//   2. Mint a peer connection: add local mic, add a data channel for events,
//      negotiate SDP with OpenAI directly using the client_secret.
//   3. As OpenAI streams events on the data channel:
//        - response.audio_transcript.delta  → assistant transcript chunk
//        - conversation.item.input_audio_transcription.completed → final
//          user transcript for the most recent turn
//        - response.function_call_arguments.done → tool call ready to run.
//          We POST {name, args} to /api/ai-tutor/realtime/tool, get the
//          output back, then send a `function_call_output` item on the
//          data channel + `response.create` to let the model continue.
//   4. On end: persist the transcript via /api/ai-tutor/realtime/transcript.
// ──────────────────────────────────────────────────────────────────────────

interface AiTutorVoicePanelProps {
  profile: AiTutorProfile;
  sessionId: string;
  onSessionId: (id: string) => void;
  onMemory: (memory: AiTutorMemory) => void;
  onPlan: (plan: AiTutorPlan | null) => void;
  onPhase: (phase: AiTutorPhase) => void;
  onSuggestedAction: (action: AiTutorSuggestedAction | null) => void;
  onTrackerUpdate: (day: number, itemId: string) => void;
  onSessionRefresh: () => void;
  onClose: () => void;
}

type ConnectionStatus =
  | "idle"
  | "requesting"
  | "connecting"
  | "connected"
  | "ended"
  | "error";

interface VoiceTurn {
  id: string;
  role: "assistant" | "user";
  content: string;
  evaluation?: AiTutorEvaluation;
  topicRef?: AiTutorNextTopic;
  phase?: AiTutorPhase;
  done: boolean;
}

interface VoiceToolEntry extends AiTutorToolTrace {
  ts: number;
}

const phaseLabels: Record<AiTutorPhase, string> = {
  warmup: "Getting to know you",
  calibration: "Finding your level",
  practice: "Interview practice",
  recap: "Wrap-up",
};

export default function AiTutorVoicePanel({
  profile,
  sessionId,
  onSessionId,
  onMemory,
  onPlan,
  onPhase,
  onSuggestedAction,
  onTrackerUpdate,
  onSessionRefresh,
  onClose,
}: AiTutorVoicePanelProps) {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [phase, setPhase] = useState<AiTutorPhase>("warmup");
  const [muted, setMuted] = useState(false);
  const [turns, setTurns] = useState<VoiceTurn[]>([]);
  const [tools, setTools] = useState<VoiceToolEntry[]>([]);
  const [activeEvaluation, setActiveEvaluation] = useState<
    AiTutorEvaluation | null
  >(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const sessionIdRef = useRef<string>(sessionId);
  // Buffer for partial assistant transcript chunks while a response is in
  // flight, keyed by response_id so concurrent responses don't collide.
  const partialTranscriptsRef = useRef<Map<string, string>>(new Map());
  const turnsRef = useRef<VoiceTurn[]>([]);
  const pendingEvaluationRef = useRef<AiTutorEvaluation | null>(null);
  const pendingTopicRef = useRef<AiTutorNextTopic | null>(null);

  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  const appendTool = useCallback(
    (entry: Omit<VoiceToolEntry, "ts">) => {
      setTools((current) => [...current, { ...entry, ts: Date.now() }].slice(-12));
    },
    []
  );

  const upsertTurn = useCallback((turn: VoiceTurn) => {
    setTurns((current) => {
      const idx = current.findIndex((t) => t.id === turn.id);
      if (idx === -1) return [...current, turn];
      const next = current.slice();
      next[idx] = { ...next[idx], ...turn };
      return next;
    });
  }, []);

  const sendOnDataChannel = useCallback((event: object) => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open") return;
    try {
      dc.send(JSON.stringify(event));
    } catch {
      // ignore — connection cleanup will fire shortly.
    }
  }, []);

  const handleToolCall = useCallback(
    async (call: { name: string; arguments: string; call_id: string }) => {
      let parsedArgs: Record<string, unknown> = {};
      try {
        parsedArgs = call.arguments ? JSON.parse(call.arguments) : {};
      } catch {
        parsedArgs = {};
      }

      try {
        const resp = await fetch("/api/ai-tutor/realtime/tool", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            profile: profileRef.current,
            name: call.name,
            args: parsedArgs,
          }),
        });
        const data = (await resp.json()) as {
          name?: string;
          output?: unknown;
          preview?: string;
          state?: {
            phase?: AiTutorPhase;
            plan?: AiTutorPlan | null;
            memory?: AiTutorMemory;
          };
          changes?: {
            evaluation?: AiTutorEvaluation;
            phase?: AiTutorPhase;
            plan?: AiTutorPlan;
            nextTopic?: AiTutorNextTopic;
            suggestedAction?: AiTutorSuggestedAction;
            trackerWrote?: boolean;
          };
          error?: string;
        };

        if (!resp.ok || data.error) {
          appendTool({
            name: call.name,
            args: parsedArgs,
            ok: false,
            preview: data.error ?? "tool failed",
          });
          sendOnDataChannel({
            type: "conversation.item.create",
            item: {
              type: "function_call_output",
              call_id: call.call_id,
              output: JSON.stringify({
                error: data.error ?? "Tool execution failed.",
              }),
            },
          });
          sendOnDataChannel({ type: "response.create" });
          return;
        }

        appendTool({
          name: call.name,
          args: parsedArgs,
          ok: true,
          preview: data.preview ?? "",
        });

        if (data.state?.phase) {
          setPhase(data.state.phase);
          onPhase(data.state.phase);
        }
        if (data.state?.plan !== undefined) onPlan(data.state.plan ?? null);
        if (data.state?.memory) onMemory(data.state.memory);
        if (data.changes?.evaluation) {
          pendingEvaluationRef.current = data.changes.evaluation;
          setActiveEvaluation(data.changes.evaluation);
        }
        if (data.changes?.nextTopic) {
          pendingTopicRef.current = data.changes.nextTopic;
        }
        if (data.changes?.suggestedAction) {
          onSuggestedAction(data.changes.suggestedAction);
        }
        if (
          data.changes?.trackerWrote &&
          data.changes.nextTopic?.day &&
          data.changes.nextTopic.itemId
        ) {
          onTrackerUpdate(data.changes.nextTopic.day, data.changes.nextTopic.itemId);
        }

        sendOnDataChannel({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: call.call_id,
            output: JSON.stringify(data.output ?? {}),
          },
        });
        sendOnDataChannel({ type: "response.create" });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        appendTool({
          name: call.name,
          args: parsedArgs,
          ok: false,
          preview: msg,
        });
        sendOnDataChannel({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: call.call_id,
            output: JSON.stringify({ error: msg }),
          },
        });
        sendOnDataChannel({ type: "response.create" });
      }
    },
    [
      appendTool,
      onMemory,
      onPhase,
      onPlan,
      onSuggestedAction,
      onTrackerUpdate,
      sendOnDataChannel,
    ]
  );

  const handleEvent = useCallback(
    (event: { type?: string } & Record<string, unknown>) => {
      switch (event.type) {
        case "session.created":
        case "session.updated":
          // Already configured by /session route — nothing to do.
          break;

        case "response.audio_transcript.delta": {
          const responseId = String(
            (event.response_id as string | undefined) ?? "default"
          );
          const delta = String(event.delta ?? "");
          const current =
            partialTranscriptsRef.current.get(responseId) ?? "";
          const next = current + delta;
          partialTranscriptsRef.current.set(responseId, next);
          upsertTurn({
            id: `assistant-${responseId}`,
            role: "assistant",
            content: next,
            phase,
            done: false,
          });
          break;
        }

        case "response.audio_transcript.done": {
          const responseId = String(
            (event.response_id as string | undefined) ?? "default"
          );
          const transcript =
            (event.transcript as string | undefined) ??
            partialTranscriptsRef.current.get(responseId) ??
            "";
          if (transcript.trim()) {
            const evaluation = pendingEvaluationRef.current ?? undefined;
            const topicRef = pendingTopicRef.current ?? undefined;
            upsertTurn({
              id: `assistant-${responseId}`,
              role: "assistant",
              content: transcript,
              phase,
              evaluation,
              topicRef,
              done: true,
            });
            pendingEvaluationRef.current = null;
            pendingTopicRef.current = null;
          }
          partialTranscriptsRef.current.delete(responseId);
          break;
        }

        case "conversation.item.input_audio_transcription.completed": {
          const transcript = String(event.transcript ?? "").trim();
          const itemId =
            String((event.item_id as string | undefined) ?? "") ||
            `user-${Date.now()}`;
          if (transcript) {
            upsertTurn({
              id: `user-${itemId}`,
              role: "user",
              content: transcript,
              done: true,
            });
          }
          break;
        }

        case "response.function_call_arguments.done": {
          const callId = String(event.call_id ?? "");
          const name = String(event.name ?? "");
          const args = String(event.arguments ?? "");
          if (callId && name) {
            void handleToolCall({ call_id: callId, name, arguments: args });
          }
          break;
        }

        case "error": {
          const e = event.error as { message?: string } | undefined;
          setStatusMsg(e?.message ?? "Realtime error");
          break;
        }

        default:
          // Many events flow through (response.created, response.done,
          // input_audio_buffer.speech_*, etc.). We don't surface them in
          // v1 — the live transcript is enough.
          break;
      }
    },
    [handleToolCall, phase, upsertTurn]
  );

  const stop = useCallback(
    async (persist: boolean) => {
      const dc = dcRef.current;
      if (dc) {
        try {
          dc.close();
        } catch {
          /* ignore */
        }
      }
      const pc = pcRef.current;
      if (pc) {
        try {
          pc.close();
        } catch {
          /* ignore */
        }
      }
      const stream = localStreamRef.current;
      if (stream) {
        for (const track of stream.getTracks()) track.stop();
      }
      pcRef.current = null;
      dcRef.current = null;
      localStreamRef.current = null;
      setStatus((prev) => (prev === "error" ? prev : "ended"));

      if (persist && sessionIdRef.current && turnsRef.current.length > 0) {
        try {
          await fetch("/api/ai-tutor/realtime/transcript", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: sessionIdRef.current,
              turns: turnsRef.current
                .filter((t) => t.done && t.content.trim())
                .map((t) => ({
                  role: t.role,
                  content: t.content,
                  evaluation: t.evaluation,
                  topicRef: t.topicRef,
                  phase: t.phase,
                })),
            }),
          });
          onSessionRefresh();
        } catch {
          /* persistence best-effort */
        }
      }
    },
    [onSessionRefresh]
  );

  const start = useCallback(async () => {
    setStatus("requesting");
    setStatusMsg("");
    setTurns([]);
    setTools([]);
    setActiveEvaluation(null);
    partialTranscriptsRef.current = new Map();
    pendingEvaluationRef.current = null;
    pendingTopicRef.current = null;

    let mintData: {
      sessionId?: string;
      clientSecret?: string;
      model?: string;
      phase?: AiTutorPhase;
      plan?: AiTutorPlan | null;
      error?: string;
    };
    try {
      const mintResp = await fetch("/api/ai-tutor/realtime/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          profile: profileRef.current,
        }),
      });
      mintData = await mintResp.json();
      if (!mintResp.ok || !mintData.clientSecret) {
        setStatus("error");
        setStatusMsg(mintData.error ?? "Could not mint a voice session.");
        return;
      }
    } catch (error) {
      setStatus("error");
      setStatusMsg(
        error instanceof Error ? error.message : "Could not reach the coach."
      );
      return;
    }

    if (mintData.sessionId && mintData.sessionId !== sessionIdRef.current) {
      sessionIdRef.current = mintData.sessionId;
      onSessionId(mintData.sessionId);
      onSessionRefresh();
    }
    if (mintData.phase) {
      setPhase(mintData.phase);
      onPhase(mintData.phase);
    }
    if (mintData.plan !== undefined) onPlan(mintData.plan ?? null);

    setStatus("connecting");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000,
        },
      });
    } catch (error) {
      setStatus("error");
      setStatusMsg(
        error instanceof Error
          ? `Microphone blocked: ${error.message}`
          : "Microphone permission was denied."
      );
      return;
    }
    localStreamRef.current = stream;

    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (audioElRef.current && remoteStream) {
        audioElRef.current.srcObject = remoteStream;
        // Autoplay — user-initiated by the start button, so allowed.
        void audioElRef.current.play().catch(() => undefined);
      }
    };

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed" ||
        pc.connectionState === "closed"
      ) {
        setStatus((prev) => (prev === "ended" ? prev : "ended"));
      } else if (pc.connectionState === "connected") {
        setStatus("connected");
      }
    };

    for (const track of stream.getTracks()) {
      pc.addTrack(track, stream);
    }

    const dc = pc.createDataChannel("oai-events");
    dcRef.current = dc;
    dc.onopen = () => {
      // No session.update needed — /session route already configured the
      // model with our tools/instructions/voice. We do create the first
      // response so the voice coach proactively chooses the next question
      // instead of waiting for the user to say "hi".
      sendOnDataChannel({ type: "response.create" });
    };
    dc.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        handleEvent(parsed);
      } catch {
        /* ignore non-JSON frames */
      }
    };
    dc.onclose = () => setStatus((prev) => (prev === "ended" ? prev : "ended"));

    let offer: RTCSessionDescriptionInit;
    try {
      offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
    } catch (error) {
      setStatus("error");
      setStatusMsg(
        error instanceof Error
          ? `WebRTC offer failed: ${error.message}`
          : "WebRTC offer failed."
      );
      return;
    }

    let sdpAnswer: string;
    try {
      const model = mintData.model ?? "gpt-realtime-mini";
      const sdpResp = await fetch(
        `https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`,
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${mintData.clientSecret}`,
            "Content-Type": "application/sdp",
            "OpenAI-Beta": "realtime=v1",
          },
        }
      );
      if (!sdpResp.ok) {
        const detail = await sdpResp.text().catch(() => "");
        throw new Error(`SDP exchange failed (${sdpResp.status}): ${detail}`);
      }
      sdpAnswer = await sdpResp.text();
    } catch (error) {
      setStatus("error");
      setStatusMsg(
        error instanceof Error ? error.message : "SDP exchange failed."
      );
      return;
    }

    try {
      await pc.setRemoteDescription({ type: "answer", sdp: sdpAnswer });
    } catch (error) {
      setStatus("error");
      setStatusMsg(
        error instanceof Error
          ? `WebRTC answer failed: ${error.message}`
          : "WebRTC answer failed."
      );
    }
  }, [handleEvent, onPhase, onPlan, onSessionId, onSessionRefresh, sendOnDataChannel]);

  // Cleanup on unmount — never leave a peer connection or mic open.
  useEffect(() => {
    return () => {
      void stop(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleMute() {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !muted;
    for (const track of stream.getAudioTracks()) {
      track.enabled = !next;
    }
    setMuted(next);
  }

  const isLive = status === "connecting" || status === "connected";

  return (
    <section className="rounded-3xl border border-line bg-surface-strong p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Voice mode · {phaseLabels[phase]}
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold text-foreground">
            Voice agent
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
            Same roadmap, questions, lesson plan, tracker, and coach insights
            as chat — delivered as a live spoken session.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isLive ? (
            <button
              type="button"
              onClick={() => void start()}
              disabled={status === "requesting"}
              className="button-primary-accent !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "ended"
                ? "Start voice agent again"
                : status === "requesting"
                  ? "Connecting…"
                  : "Start voice agent"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleMute}
                className="rounded-full border border-line bg-background px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground"
              >
                {muted ? "Unmute" : "Mute"}
              </button>
              <button
                type="button"
                onClick={() => void stop(true)}
                className="rounded-full border border-rose-400/60 bg-rose-50/40 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100/60 dark:bg-rose-500/10 dark:text-rose-300"
              >
                End call
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              void stop(true);
              onClose();
            }}
            className="rounded-full border border-line bg-background px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-primary hover:text-foreground"
          >
            Switch to chat
          </button>
        </div>
      </div>

      {statusMsg ? (
        <div className="mt-3 rounded-2xl border border-amber-300/50 bg-amber-50/50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          {statusMsg}
        </div>
      ) : null}

      {status === "idle" ? (
        <div className="mt-4 rounded-2xl border border-line bg-background/60 p-4 text-sm leading-6 text-muted">
          Click <strong>Start voice agent</strong>. Maya will use your profile,
          coach insights, roadmap topics, and progress to choose the next best
          question. You should not need to pick from a menu unless you want to
          redirect the session.
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-line bg-background/60 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Transcript
        </p>
        <div className="mt-2 max-h-[28rem] space-y-3 overflow-y-auto pr-1 text-sm leading-6">
          {turns.length === 0 && status !== "idle" ? (
            <p className="text-muted">
              {status === "connected"
                ? "Maya is choosing the first question. You can interrupt or redirect any time."
                : "Connecting to the coach…"}
            </p>
          ) : null}
          {turns.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl border p-3 ${
                t.role === "assistant"
                  ? "border-line bg-surface-strong"
                  : "ml-auto max-w-[88%] border-primary bg-primary text-white"
              }`}
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  t.role === "assistant" ? "text-primary" : "text-white/80"
                }`}
              >
                {t.role === "assistant" ? "Coach · Maya" : "You"}
              </p>
              <p className="mt-1 whitespace-pre-wrap">
                {t.content}
                {!t.done && t.role === "assistant" ? (
                  <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-primary opacity-70" />
                ) : null}
              </p>
            </div>
          ))}
        </div>
      </div>

      {activeEvaluation ? (
        <div className="mt-3 rounded-2xl border border-line bg-background/60 p-3 text-xs leading-5 text-muted">
          <p className="font-semibold text-foreground">
            Latest score:{" "}
            <span className="font-mono text-primary">
              {Math.round(activeEvaluation.score)}/100
            </span>
            {activeEvaluation.trackerUpdated ? (
              <span className="ml-2 rounded-full border border-emerald-400/40 bg-emerald-50/60 px-2 py-0.5 text-[10px] text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                Tracker updated
              </span>
            ) : null}
          </p>
          {activeEvaluation.summary ? (
            <p className="mt-1">{activeEvaluation.summary}</p>
          ) : null}
          {activeEvaluation.trackerReason ? (
            <p className="mt-1 text-[11px] font-semibold text-foreground">
              {activeEvaluation.trackerUpdated
                ? "Tracker updated: "
                : "Not marked complete yet: "}
              <span className="font-normal text-muted">
                {activeEvaluation.trackerReason}
              </span>
            </p>
          ) : null}
          {activeEvaluation.referenceLinks?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {activeEvaluation.referenceLinks.slice(0, 3).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-muted transition hover:border-primary hover:text-foreground"
                >
                  {link.label || link.source || "Reference"} ↗
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {tools.length > 0 ? (
        <details className="mt-3 rounded-xl border border-line bg-background/60 p-2 text-xs">
          <summary className="cursor-pointer text-muted">
            Coach used {tools.length} tool{tools.length === 1 ? "" : "s"}
          </summary>
          <ul className="mt-2 space-y-1">
            {tools.map((t, idx) => (
              <li
                key={`${t.ts}-${idx}`}
                className={`flex items-baseline gap-2 ${
                  t.ok ? "text-muted" : "text-rose-500"
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground">
                  {t.name}
                </span>
                <span className="truncate">{t.preview ?? ""}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <audio ref={audioElRef} className="hidden" autoPlay />
    </section>
  );
}
