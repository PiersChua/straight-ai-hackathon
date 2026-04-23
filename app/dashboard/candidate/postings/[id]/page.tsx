import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Building2,
  CheckCircle2,
  ArrowRight,
  User,
  Mail,
} from "lucide-react";
import { getDisplayDate } from "@/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

const PostingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const posting = await prisma.posting.findUnique({
    where: { id },
    include: { user: true },
  });
  const session = await auth.api.getSession({ headers: await headers() });

  if (!posting) notFound();
  const interview = await prisma.interview.findFirst({
    where: { postingId: posting.id, userId: session?.user.id },
  });
  const hasInterviewed = !!interview;

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* 1. HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600 text-white rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none">
                {posting.type}
              </Badge>
              {!posting.isActive && (
                <Badge
                  variant="outline"
                  className="text-slate-400 border-slate-200 text-[10px] uppercase tracking-widest"
                >
                  Closed
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              {posting.title}
            </h1>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-blue-600" />
                {posting.user.companyName || "Independent Hirer"}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                Posted {getDisplayDate(posting.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            {hasInterviewed ? (
              <Button
                disabled={hasInterviewed}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-blue-100 transition-all"
              >
                Interview completed
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700! text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-blue-100 transition-all"
              >
                <Link
                  className="flex items-center"
                  href={`/dashboard/candidate/postings/${posting.id}/interview`}
                >
                  Apply for this {posting.type.toLowerCase()}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </header>

        {/* 2. CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-8 space-y-10">
            <section className="space-y-4">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">
                Description
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {posting.description}
                </p>
              </div>
            </section>

            {posting.requirements && (
              <section className="space-y-4">
                <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">
                  Requirements
                </h2>
                <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-4 whitespace-pre-line">
                  {posting.requirements}
                </div>
              </section>
            )}
          </div>
        </div>
        <footer className="border-slate-100">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Posted By
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-none">
                      {posting.user.name}
                    </p>
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Email
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      {posting.user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-medium">
                Ref ID: {posting.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default PostingPage;
