import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Sparkles,
  MessageCircle,
  HelpCircle,
  Mic2,
} from "lucide-react";
import { getDisplayDate } from "@/utils";
import { InterviewStatusActions } from "@/components/Actions/InterviewStatusActions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AudioPlayerCard from "@/components/Card/AudioPlayerCard";

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ postingId: string; interviewId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { postingId, interviewId } = await params;

  const posting = await prisma.posting.findUnique({
    where: { id: postingId, userId: session.user.id },
  });
  if (!posting) notFound();

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId, postingId },
    include: {
      score: true,
      user: {
        select: {
          name: true,
          email: true,
          bio: true,
          skills: true,
          experiences: {
            orderBy: { startDate: "desc" },
            take: 3,
          },
        },
      },
    },
  });

  if (!interview) notFound();

  const sc = interview.score;
  const overallPercentage = sc?.overall || 0;
  const initials = interview.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 pt-10 space-y-8">
        {/* 1. HEADER (Maintained from InterviewDetailPage) */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-blue-50">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
              <span className="text-xl font-black text-white">{initials}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Candidate Review
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {interview.user.name}
              </h1>
              <p className="text-sm font-medium text-slate-400">
                {interview.user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <InterviewStatusActions
              interviewId={interview.id}
              currentStatus={interview.status}
              postingId={postingId}
            />
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">
              Submitted {getDisplayDate(interview.createdAt)}
            </p>
          </div>
        </header>

        {/* 2. TOP SECTION: SESSION RECORDING (FULL WIDTH) */}
        <section>
          <AudioPlayerCard conversationId={interview.conversationId} />
        </section>

        {/* 3. MIDDLE SECTION: SCORE & SUMMARY (SIDE BY SIDE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Overall Capability (Donut Chart Style) */}
          <Card className="lg:col-span-4 border-blue-100 shadow-sm bg-blue-50/20 flex flex-col justify-center">
            <CardContent className="pt-8">
              <div className="relative flex items-center justify-center mb-8">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-white"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * overallPercentage) / 10}
                    strokeLinecap="round"
                    className="text-blue-600 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900">
                    {overallPercentage || "—"}
                  </span>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    Overall
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Technical", val: sc?.technicalDepth },
                  { label: "Communication", val: sc?.communication },
                  { label: "Problem Solving", val: sc?.problemSolving },
                  { label: "Clarity", val: sc?.clarity },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="text-center p-3 bg-white rounded-xl border border-blue-50 shadow-sm"
                  >
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                      {m.label}
                    </p>
                    <p className="text-sm font-bold text-blue-700">
                      {m.val ?? "—"}/10
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Feedback Summary */}
          <Card className="lg:col-span-8 border-slate-200 bg-white shadow-sm overflow-hidden relative flex flex-col">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-[10px] font-black flex items-center gap-2 uppercase tracking-widest text-slate-500">
                <Sparkles size={16} className="text-blue-600" />
                Executive Synthesis
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center p-8 relative">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-blue-600 pointer-events-none">
                <Sparkles size={180} />
              </div>

              <div className="space-y-4 relative z-10">
                <p className="text-xl leading-relaxed font-medium text-slate-700 italic">
                  <span className="text-blue-600 font-serif text-3xl mr-1 opacity-50">
                    “
                  </span>
                  {sc?.feedback || "Evaluation in progress..."}
                  <span className="text-blue-600 font-serif text-3xl ml-1 opacity-50">
                    ”
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. BOTTOM SECTION: CANDIDATE INFO & TRANSCRIPT (SIDE BY SIDE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-4 space-y-8">
            {/* Questions List */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                <HelpCircle size={14} className="text-blue-600" />
                Interview Questions
              </h3>
              <div className="space-y-3">
                {posting.questions.map((q, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm"
                  >
                    <span className="text-[9px] font-black text-blue-600 block mb-1">
                      Q{i + 1}
                    </span>
                    <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transcript (8 cols) */}
          <div className="lg:col-span-8">
            <Card className="border-slate-200 shadow-sm flex flex-col h-[650px] bg-white">
              <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                <CardTitle className="text-[10px] font-black flex items-center gap-2 uppercase tracking-widest text-slate-500">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  Interview Dialogue
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-blue-50">
                <div className="space-y-8">
                  {interview.fullTranscription ? (
                    interview.fullTranscription
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, idx) => {
                        const isInterviewer = line.startsWith("[INTERVIEWER]");
                        const text = line
                          .replace(/\[INTERVIEWER\]|\[CANDIDATE\]/, "")
                          .trim();

                        return (
                          <div
                            key={idx}
                            className={`flex flex-col ${isInterviewer ? "items-start" : "items-end"}`}
                          >
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isInterviewer ? "text-blue-600" : "text-slate-400"}`}
                            >
                              {isInterviewer
                                ? "Aptly Agent"
                                : interview.user.name}
                            </span>
                            <div
                              className={`p-4 rounded-2xl text-[12px] font-medium leading-relaxed max-w-[85%] ${
                                isInterviewer
                                  ? "bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-none shadow-sm shadow-blue-50/50"
                                  : "bg-white text-slate-700 border border-slate-200 rounded-tr-none shadow-sm"
                              }`}
                            >
                              {text}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                      <Mic2 size={32} className="text-slate-300 mb-2" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Synthesizing audio logs...
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
