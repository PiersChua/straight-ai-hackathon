import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Timer,
  AlertCircle,
  FileText,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { getDisplayDate } from "@/utils";

const InterviewsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  const interviews = await prisma.interview.findMany({
    where: { userId: session?.user.id },
    include: { posting: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              My Interviews
            </h1>
            <p className="text-slate-500 mt-2">
              Track your assessment progress and review tailored feedback.
            </p>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            {interviews.length} INTERVIEWS(s)
          </div>
        </header>

        {/* Results Grid */}
        {interviews.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center">
            <MessageSquare className="h-8 w-8 text-slate-300 mb-4" />
            <h3 className="text-slate-900 font-medium"> No interviews yet</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
              Find opportunities and start your first capability assessment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <Card
                key={interview.id}
                className="group border-slate-200 hover:border-slate-300 transition-all duration-200 rounded-xl overflow-hidden flex flex-col h-full shadow-sm"
              >
                <CardContent className="p-6 flex flex-col flex-grow">
                  {/* Card Top: Status and Date */}
                  <div className="flex justify-between items-center mb-5">
                    <StatusBadge status={interview.status} />
                    <div className="flex items-center text-slate-400 text-[11px] font-medium uppercase tracking-tighter">
                      <Clock size={12} className="mr-1.5" />
                      {getDisplayDate(interview.createdAt)}
                    </div>
                  </div>

                  {/* Card Middle: Title and Context */}
                  <div className="mb-6 flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="text-[9px] font-black uppercase bg-slate-50 text-slate-400 border-slate-200 px-1.5 py-0"
                      >
                        {interview.posting?.type}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">
                      {interview.posting?.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {interview.posting?.description}
                    </p>
                  </div>

                  {/* Metadata Indicators */}
                  <div className="flex items-center gap-4 mb-6">
                    {interview.fullTranscription && (
                      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <FileText size={12} />
                        <span className="text-[10px] font-bold uppercase">
                          Report Ready
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Action */}
                  <div className="pt-5 border-t border-slate-100 mt-auto">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-white hover:bg-slate-50 border-slate-200 text-slate-900 font-semibold h-10 rounded-lg shadow-sm transition-all text-sm group/btn"
                    >
                      <Link
                        href={`/dashboard/candidate/interviews/${interview.id}`}
                        className="flex items-center justify-center gap-2"
                      >
                        View Details
                        <ArrowRight
                          size={14}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

/* --- Refined Status Badge Component --- */

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<
    string,
    { label: string; className: string; icon: any }
  > = {
    ACCEPTED: {
      label: "Accepted",
      className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      icon: CheckCircle2,
    },
    REJECTED: {
      label: "Rejected",
      className: "text-red-400 bg-red-400/10 border-red-400/20",
      icon: XCircle,
    },
    PENDING: {
      label: "Pending",
      className: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      icon: Timer,
    },
  };

  const current = config[status] || {
    label: status,
    className: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Clock,
  };

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${current.className}`}
    >
      <Icon className="h-3 w-3" />
      {current.label}
    </span>
  );
};

export default InterviewsPage;
