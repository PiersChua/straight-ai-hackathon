import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { getDisplayDate } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface PageProps {
  params: Promise<{ postingId: string }>;
}

const statusConfig = {
  PENDING: {
    icon: Clock,
    className: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  ACCEPTED: {
    icon: CheckCircle2,
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  REJECTED: {
    icon: XCircle,
    className: "text-red-400 bg-red-400/10 border-red-400/20",
  },
};

export default async function PostingInterviewsPage({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { postingId } = await params;

  const posting = await prisma.posting.findUnique({
    where: { id: postingId, userId: session.user.id },
  });

  if (!posting) notFound();

  const interviews = await prisma.interview.findMany({
    where: { postingId },
    include: {
      score: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { score: { overall: "desc" } },
  });

  const sorted = [
    ...interviews.filter((i) => i.score),
    ...interviews.filter((i) => !i.score),
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
          <div className="space-y-2">
            <Badge className="bg-blue-600 text-white rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none">
              {posting.type}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              {posting.title}
            </h1>
            <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 max-w-fit">
              {interviews.length} interviews(s)
            </div>
          </div>
        </header>

        <section className="space-y-4">
          {interviews.length > 0 && (
            <div className="grid grid-cols-12 gap-4 px-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
              <div className="col-span-6">Candidate</div>
              <div className="col-span-2 text-center">Overall Score</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Date</div>
            </div>
          )}
          <section className="space-y-4">
            {interviews.length > 0 ? (
              <>
                <div className="space-y-2">
                  {sorted.map((interview) => {
                    const sc = interview.score;
                    const statusCfg =
                      statusConfig[
                        interview.status as keyof typeof statusConfig
                      ];
                    const StatusIcon = statusCfg.icon;
                    const initials = interview.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <Link
                        key={interview.id}
                        href={`/dashboard/hirer/postings/${postingId}/interviews/${interview.id}`}
                        className="group block"
                      >
                        <Card className="grid grid-cols-12 gap-4 items-center border-slate-100 bg-white group-hover:border-blue-100 group-hover:bg-blue-50/10 rounded-xl px-6 py-5 transition-all duration-200 shadow-sm">
                          {/* Candidate */}
                          <div className="col-span-6 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                              <span className="text-[10px] font-black text-white">
                                {initials}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                {interview.user.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate font-medium">
                                {interview.user.email}
                              </p>
                            </div>
                          </div>

                          {/* Overall Score */}
                          <div className="col-span-2 flex justify-center">
                            {sc ? (
                              <div className="flex items-baseline gap-0.5">
                                <span className="text-2xl font-black font-mono text-blue-600">
                                  {sc.overall}
                                </span>
                                <span className="text-[10px] text-slate-300 font-bold">
                                  /10
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                                Awaiting
                              </span>
                            )}
                          </div>

                          {/* Status Icon Only */}
                          <div className="col-span-2 flex justify-center">
                            <div
                              className={`p-2 rounded-lg border ${statusCfg.className} shadow-sm`}
                            >
                              <StatusIcon size={16} strokeWidth={2.5} />
                            </div>
                          </div>

                          {/* Date & Action */}
                          <div className="col-span-2 text-right flex items-center justify-end gap-4">
                            <span className="text-[10px] text-slate-400 font-bold font-mono">
                              {getDisplayDate(interview.createdAt)}
                            </span>
                            <ArrowRight
                              size={14}
                              className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                            />
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Empty State Placeholder */
              <div className="py-24 text-center flex flex-col items-center">
                <MessageSquare className="h-8 w-8 text-slate-300 mb-4" />
                <h3 className="text-slate-900 font-medium">
                  {" "}
                  No interviews yet
                </h3>
                <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
                  Interviews will appear here once candidates apply
                </p>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
