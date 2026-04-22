"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  BrainCircuit,
  User,
  ChevronLeft,
  AudioWaveform,
} from "lucide-react";
import { useParams } from "next/navigation";

const InterviewPage = () => {
  const params = useParams();
  const interviewId = params?.id as string;
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchRecording = async (conversationId: string) => {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/recordings/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch recording");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setRecordingUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  // Mock data for the UI layout
  const mockAnalysis = {
    score: 88,
    metrics: [
      { label: "Technical Depth", value: 92 },
      { label: "Communication", value: 85 },
      { label: "Problem Solving", value: 87 },
    ],
  };

  return (
    <div className="bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header / Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2 text-slate-500 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
          <div className="flex gap-3">
            <Badge variant="outline" className="bg-white">
              ID: {interviewId}
            </Badge>
            <Badge className="bg-indigo-600">Shortlisted</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Candidate Info & Scoring */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400">
                  <User size={40} />
                </div>
                <CardTitle>Candidate Profile</CardTitle>
                <CardDescription>Software Engineering Intern</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-xl text-center">
                  <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider mb-1">
                    Aptly Score
                  </p>
                  <p className="text-4xl font-bold text-indigo-900">
                    {mockAnalysis.score}
                    <span className="text-lg text-indigo-400">/100</span>
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {mockAnalysis.metrics.map((m) => (
                    <div key={m.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{m.label}</span>
                        <span>{m.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-white text-slate-900 border-slate-200 hover:bg-slate-50 shadow-sm"
              variant="outline"
              onClick={() =>
                fetchRecording("conv_9701kprae0vxe0tb90j6g15zwy14")
              }
              disabled={isFetching}
            >
              {isFetching ? "Processing..." : "Refresh Recording"}
            </Button>
          </div>

          {/* Right Column: Recording & Transcription */}
          <div className="md:col-span-2 space-y-6">
            {/* Audio Player Card */}
            <Card className="overflow-hidden border-none shadow-md">
              <div className="bg-slate-900 p-8 text-white flex flex-col items-center justify-center space-y-6">
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <AudioWaveform className="animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em]">
                    Interview Recording
                  </span>
                </div>

                {recordingUrl ? (
                  <div className="w-full max-w-md bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                    <audio
                      controls
                      src={recordingUrl}
                      className="w-full h-10 accent-indigo-500"
                    />
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-400 text-sm italic">
                      Recording will appear here after the AI session concludes.
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2 bg-white/10 border-none text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4" /> Download
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2 bg-white/10 border-none text-white hover:bg-white/20"
                  >
                    <FileText className="h-4 w-4" /> Export PDF
                  </Button>
                </div>
              </div>
            </Card>

            {/* AI Insights / Transcription Mockup */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-indigo-600" />
                    AI Intelligence Report
                  </CardTitle>
                </div>
                <Badge variant="secondary">GPT-5.4 Analysis</Badge>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold mb-2">Key Takeaways</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The candidate demonstrated exceptional understanding of{" "}
                    <span className="font-semibold text-slate-900">
                      PostgreSQL indexing
                    </span>{" "}
                    and
                    <span className="font-semibold text-slate-900">
                      {" "}
                      React optimization patterns
                    </span>
                    . Response to the "scalability" question showed structured
                    thinking, though there was a slight pause during the
                    concurrency discussion.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Transcript Snippet
                  </h4>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <span className="text-xs font-bold text-indigo-600 shrink-0">
                        Agent:
                      </span>
                      <p className="text-xs text-slate-500">
                        "How would you handle a race condition in a high-traffic
                        Node.js environment?"
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-xs font-bold text-emerald-600 shrink-0">
                        Candidate:
                      </span>
                      <p className="text-xs text-slate-700 font-medium italic">
                        "I'd implement optimistic locking at the DB level using
                        Prisma versions or use Redis as a distributed lock..."
                      </p>
                    </div>
                  </div>
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
