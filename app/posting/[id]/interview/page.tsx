"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { PhoneOff, User, Bot } from "lucide-react";
import { useConversation, ConversationProvider } from "@elevenlabs/react";
import { useParams, useRouter } from "next/navigation";
import { Posting } from "@/generated/prisma/client";

type SessionState = "idle" | "connecting" | "active" | "ended";

function InterviewSession({ postingId }: { postingId: string }) {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Caption state
  const [caption, setCaption] = useState<string>("");
  const [captionVisible, setCaptionVisible] = useState(false);
  const [captionFading, setCaptionFading] = useState(false);
  const captionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // User speaking state (driven by Web Audio API)
  const [userSpeaking, setUserSpeaking] = useState(false);
  const userSpeakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumePollRef = useRef<number | null>(null);

  const interviewIdRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const transcriptRef = useRef<string>("");
  const endCalledRef = useRef(false);

  const startVolumePolling = useCallback((stream: MediaStream) => {
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);

    micStreamRef.current = stream;
    audioContextRef.current = ctx;
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const poll = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;

      if (avg > 20) {
        setUserSpeaking(true);
        if (userSpeakingTimerRef.current)
          clearTimeout(userSpeakingTimerRef.current);
        userSpeakingTimerRef.current = setTimeout(
          () => setUserSpeaking(false),
          600,
        );
      }

      volumePollRef.current = requestAnimationFrame(poll);
    };
    volumePollRef.current = requestAnimationFrame(poll);
  }, []);

  const stopVolumePolling = useCallback(() => {
    if (volumePollRef.current) cancelAnimationFrame(volumePollRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    volumePollRef.current = null;
    audioContextRef.current = null;
    micStreamRef.current = null;
  }, []);

  const onConnect = useCallback(() => setSessionState("active"), []);

  const onDisconnect = useCallback(() => {
    if (!endCalledRef.current) {
      endCalledRef.current = true;
      setSessionState("ended");
      sendEndToServer();
    }
  }, []);

  const onMessage = useCallback(
    ({ message, source }: { message: string; source: string }) => {
      transcriptRef.current += `[${source === "ai" ? "INTERVIEWER" : "CANDIDATE"}] ${message}\n`;

      if (source === "ai") {
        if (captionTimerRef.current) clearTimeout(captionTimerRef.current);

        setCaption(message);
        setCaptionVisible(true);
        setCaptionFading(false);

        const displayMs = Math.max(3000, message.length * 40);

        captionTimerRef.current = setTimeout(() => {
          setCaptionFading(true);
          setCaptionVisible(false);
        }, displayMs);
      }
    },
    [],
  );

  const onError = useCallback((err: unknown) => {
    console.error("[ElevenLabs]", err);
    setError("Connection failed. Please try again.");
    setSessionState("idle");
  }, []);

  const conversation = useConversation({
    onConnect,
    onDisconnect,
    onMessage,
    onError,
  });

  const sendEndToServer = useCallback(async () => {
    stopVolumePolling();
    if (!interviewIdRef.current || !conversationIdRef.current) return;
    await fetch("/api/interview/end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewId: interviewIdRef.current,
        conversationId: conversationIdRef.current,
        fullTranscription: transcriptRef.current,
      }),
    });
    router.push("/interviews");
  }, [router, stopVolumePolling]);

  useEffect(() => {
    return () => {
      if (captionTimerRef.current) clearTimeout(captionTimerRef.current);
      if (userSpeakingTimerRef.current)
        clearTimeout(userSpeakingTimerRef.current);
      stopVolumePolling();
    };
  }, [stopVolumePolling]);

  const handleStart = async () => {
    setError(null);
    endCalledRef.current = false;
    setSessionState("connecting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startVolumePolling(stream);

      const [res, postingRes] = await Promise.all([
        fetch("/api/interview/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postingId }),
        }),
        fetch(`/api/postings/${postingId}`),
      ]);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Failed to start interview");
      }
      if (!postingRes.ok) {
        const data = await postingRes.json();
        throw new Error(data.message ?? "Failed to fetch posting details");
      }

      const { interviewId, signedUrl } = await res.json();
      const { posting }: { posting: Posting } = await postingRes.json();
      const promptContext = posting.questions
        .map((q, i) => `${i + 1}. ${q}`)
        .join("\n");

      interviewIdRef.current = interviewId;
      conversationIdRef.current = conversation.getId();
      conversation.startSession({
        signedUrl,
        dynamicVariables: { questions: promptContext },
      });
    } catch (err: any) {
      stopVolumePolling();
      setError(err.message ?? "Something went wrong.");
      setSessionState("idle");
    }
  };

  const handleEnd = async () => {
    if (endCalledRef.current) return;
    endCalledRef.current = true;
    setSessionState("ended");

    try {
      conversation.endSession();
    } catch (_) {}

    await sendEndToServer();
  };

  const isAgentSpeaking = conversation.isSpeaking;
  return (
    <div className="flex h-screen w-full bg-black text-zinc-100 overflow-hidden relative">
      {/* Idle / connecting overlay */}
      {(sessionState === "idle" || sessionState === "connecting") && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/90">
          <div className="w-20 h-20 rounded-full border border-zinc-800 flex items-center justify-center">
            <Bot size={36} strokeWidth={1} className="text-zinc-400" />
          </div>
          <div className="text-center max-w-xs">
            <p className="text-base font-medium mb-1">Ready to begin?</p>
            <p className="text-sm text-zinc-500">
              The AI interviewer will ask you a series of questions. Make sure
              your microphone is connected.
            </p>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            onClick={handleStart}
            disabled={sessionState === "connecting"}
            className="px-8 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sessionState === "connecting"
              ? "Connecting..."
              : "Start interview"}
          </button>
        </div>
      )}

      <main className="flex flex-1 items-center justify-center gap-6 p-12 h-[calc(100vh-160px)]">
        {/* AI card */}
        <div
          className={`flex-1 max-w-2xl h-full rounded-3xl bg-zinc-900/50 border flex flex-col items-center justify-center transition-all duration-300 ${
            isAgentSpeaking
              ? "border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
              : "border-zinc-800"
          }`}
        >
          <div className="flex flex-col items-center gap-10">
            <div
              className={`w-40 h-40 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                isAgentSpeaking ? "border-emerald-500" : "border-zinc-700"
              }`}
            >
              <Bot
                size={72}
                strokeWidth={1}
                className={
                  isAgentSpeaking ? "text-emerald-500" : "text-zinc-600"
                }
              />
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isAgentSpeaking
                      ? "bg-emerald-500 animate-waveform"
                      : "bg-zinc-700"
                  }`}
                  style={{
                    height: isAgentSpeaking
                      ? `${20 + ((i * 37 + 13) % 80)}%`
                      : "15%",
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
            <p
              className={`text-sm tracking-widest uppercase font-medium ${
                isAgentSpeaking ? "text-emerald-500" : "text-zinc-500"
              }`}
            >
              AI Interviewer
            </p>
          </div>
        </div>

        {/* User card */}
        <div
          className={`flex-1 max-w-2xl h-full rounded-3xl bg-zinc-900/50 border flex flex-col items-center justify-center transition-all duration-300 ${
            userSpeaking
              ? "border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)]"
              : "border-zinc-800"
          }`}
        >
          <div className="flex flex-col items-center gap-10">
            {/* Avatar */}
            <div
              className={`w-40 h-40 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                userSpeaking ? "border-blue-500" : "border-zinc-700"
              }`}
            >
              <User
                size={72}
                strokeWidth={1}
                className={userSpeaking ? "text-blue-500" : "text-zinc-600"}
              />
            </div>

            {/* Voice bars (same style as AI) */}
            <div className="flex items-end gap-1.5 h-16">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    userSpeaking
                      ? "bg-blue-500 animate-waveform"
                      : "bg-zinc-700"
                  }`}
                  style={{
                    height: userSpeaking
                      ? `${20 + ((i * 41 + 17) % 80)}%`
                      : "15%",
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>

            {/* Label */}
            <p
              className={`text-sm tracking-widest uppercase font-medium ${
                userSpeaking ? "text-blue-500" : "text-zinc-500"
              }`}
            >
              You
            </p>
          </div>
        </div>
      </main>
      {/* Captions */}
      {captionVisible && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 px-6 py-3 max-w-2xl text-center text-sm text-zinc-300 bg-zinc-900/60 border border-zinc-800 rounded-xl transition-opacity duration-300">
          <span
            className={
              captionFading
                ? "opacity-0 transition-opacity duration-300"
                : "opacity-100"
            }
          >
            {caption}
          </span>
        </div>
      )}
      {/* End button */}
      {sessionState === "active" && (
        <footer className="absolute bottom-0 left-0 right-0 flex justify-center p-8">
          <button
            onClick={handleEnd}
            className="flex items-center gap-3 px-10 py-5 rounded-full bg-red-600 hover:bg-red-700 transition"
          >
            <PhoneOff size={20} className="text-white" />
            <span className="text-white font-semibold">End Interview</span>
          </button>
        </footer>
      )}

      <style jsx global>{`
        @keyframes waveform {
          0%,
          100% {
            height: 15%;
          }
          50% {
            height: 100%;
          }
        }
        .animate-waveform {
          animation: waveform 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function InterviewPage() {
  const params = useParams();
  const postingId = params?.id as string;

  return (
    <ConversationProvider>
      <InterviewSession postingId={postingId} />
    </ConversationProvider>
  );
}
