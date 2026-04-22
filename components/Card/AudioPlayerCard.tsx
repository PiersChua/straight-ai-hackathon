"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Mic, PlayCircle, Mic2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CardProps {
  conversationId: string | null;
}

const AudioPlayerCard = ({ conversationId }: CardProps) => {
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecording = async () => {
      if (!conversationId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/recordings/${conversationId}`);
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setRecordingUrl(url);
        }
      } catch (err) {
        console.error("Failed to fetch recording", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecording();
  }, [conversationId]);

  return (
    <Card className="border-slate-200 shadow-sm flex flex-col overflow-hidden">
      {/* Matching Header Style from Transcript Card */}
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 flex-shrink-0">
        <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-700">
          <Mic className="h-4 w-4 text-blue-600" />
          Session Recording
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <div className="relative group">
          {recordingUrl ? (
            <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-6 transition-all shadow-sm shadow-blue-50/50">
              <audio
                controls
                src={recordingUrl}
                className="w-full h-10 accent-blue-600"
              />
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl py-12 flex flex-col items-center justify-center space-y-3">
              <Mic2
                className={`h-10 w-10 text-slate-200 ${loading ? "animate-pulse" : ""}`}
              />
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                {loading ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin" /> Fetching
                    audio...
                  </span>
                ) : (
                  "No recording available"
                )}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayerCard;
