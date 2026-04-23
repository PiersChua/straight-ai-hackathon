import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostingCard } from "@/components/Card/PostingCard";

export default async function PostingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const postings = await prisma.posting.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { interviews: true } } },
    orderBy: { createdAt: "desc" },
  });

  const typeColors: Record<string, string> = {
    INTERNSHIP: "bg-violet-50 text-violet-700 border-violet-100",
    PROJECTS: "bg-blue-50 text-blue-700 border-blue-100",
    MENTORSHIP: "bg-emerald-50 text-emerald-700 border-emerald-100",
    JOBS: "bg-amber-50 text-amber-700 border-amber-100",
    OTHERS: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              My postings
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your postings and interviews
            </p>
            <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 max-w-fit">
              {postings.length} posting(s)
            </div>
          </div>
          <Button
            asChild
            className="h-9 bg-blue-600 hover:bg-blue-700! text-white text-sm font-medium rounded-lg shadow-sm"
          >
            <Link
              href="/dashboard/hirer/postings/create"
              className="flex items-center gap-1.5"
            >
              <Plus size={15} />
              New Posting
            </Link>
          </Button>
        </header>

        {/* Empty state */}
        {postings.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center">
            <Briefcase className="h-8 w-8 text-slate-300 mb-4" />
            <h3 className="text-slate-900 font-medium"> No postings yet</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
              Create your first posting to start receiving applications
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {postings.map((posting) => (
              <PostingCard
                key={posting.id}
                posting={posting}
                typeColors={typeColors}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
