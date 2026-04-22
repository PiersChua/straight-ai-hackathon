import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mic2, Sparkles, HelpCircle } from "lucide-react";
import AudioPlayerCard from "@/components/Card/AudioPlayerCard";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getDisplayDate } from "@/utils";

const InterviewPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id } = await params;

  const interview = await prisma.interview.findUnique({
    where: { id, userId: session?.user.id },
    include: {
      score: true,
      posting: true,
    },
  });

  if (!interview) notFound();

  const score = interview.score;
  // Calculate percentage for the donut chart (assuming 100 is max overall)
  const overallPercentage = score?.overall || 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-8">
        {/* 1. HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-blue-50 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                {interview.posting.type}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              {interview.posting.title}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-2">
              {interview.status}
            </div>
            <p className="text-slate-400 text-xs font-medium">
              Attempted {getDisplayDate(interview.createdAt)}
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
            <CardContent className="pt-6">
              <div className="relative flex items-center justify-center mb-6">
                {/* SVG Donut Chart */}
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-blue-100"
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
                  <span className="text-4xl font-black text-blue-900">
                    {overallPercentage}
                  </span>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    Overall
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Technical Depth", val: score?.technicalDepth },
                  { label: "Communication", val: score?.communication },
                  { label: "Problem Solving", val: score?.problemSolving },
                  { label: "Clarity", val: score?.clarity },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="text-center p-2 bg-white rounded-xl border border-blue-100"
                  >
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                      {m.label}
                    </p>
                    <p className="text-sm font-bold text-blue-700">
                      {m.val}/10
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Feedback Summary */}
          <Card className="lg:col-span-8 border-slate-200 bg-white shadow-sm overflow-hidden relative flex flex-col">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-700">
                <Sparkles size={16} className="text-blue-600" />
                Post-interview Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center p-8 relative">
              {/* Subtle Decorative Element */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-blue-600 pointer-events-none">
                <Sparkles size={180} />
              </div>

              <div className="space-y-4 relative z-10">
                <p className="text-xl leading-relaxed font-medium text-slate-700 italic">
                  <span className="text-blue-600 font-serif text-3xl mr-1 opacity-50">
                    “
                  </span>
                  {score?.feedback ||
                    "Our evaluation engine is synthesizing your responses to generate a multi-level breakdown of your technical and professional capabilities."}
                  <span className="text-blue-600 font-serif text-3xl ml-1 opacity-50">
                    ”
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. BOTTOM SECTION: QUESTIONS & TRANSCRIPT (SIDE BY SIDE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Context/Questions (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
              <HelpCircle size={14} className="text-blue-600" />
              Questions
            </h3>
            <div className="space-y-3">
              {interview.posting.questions.map((q, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                >
                  <span className="text-[10px] font-black text-blue-600 block mb-1">
                    Q{i + 1}
                  </span>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    {q}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript (8 cols) */}
          <div className="lg:col-span-8">
            <Card className="border-slate-200 shadow-sm flex flex-col h-[600px]">
              <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-700">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  Interview Dialogue
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-blue-100">
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
                              {isInterviewer ? "Aptly Agent" : "You"}
                            </span>
                            <div
                              className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                                isInterviewer
                                  ? "bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-none shadow-sm shadow-blue-50"
                                  : "bg-white text-slate-700 border border-slate-200 rounded-tr-none shadow-sm"
                              }`}
                            >
                              {text}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Mic2 className="h-10 w-10 text-slate-200 animate-pulse mb-2" />
                      <p className="text-slate-400 text-xs font-medium">
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
};

export default InterviewPage;
