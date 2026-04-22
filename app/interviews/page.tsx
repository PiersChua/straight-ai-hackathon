import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Timer,
  AlertCircle,
} from "lucide-react";

const InterviewsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  const interviews = await prisma.interview.findMany({
    where: { userId: session?.user.id },
    include: { posting: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-12">
      <div className="container max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Interviews
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Track your interview progress and outcomes.
            </p>
          </div>

          <Badge className="bg-zinc-100 text-zinc-700 border border-zinc-200">
            {interviews.length} total
          </Badge>
        </div>

        {/* Empty State */}
        {interviews.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed rounded-xl text-center">
            <p className="text-zinc-500 mb-3">No interviews yet</p>
            <Button variant="outline" size="sm">
              Start your first interview
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <Card
                key={interview.id}
                className="border border-zinc-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="space-y-3">
                  <div className="flex justify-between items-center">
                    <StatusBadge status={interview.status} />

                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <CardTitle className="text-base font-medium text-zinc-900 line-clamp-1">
                    {interview.posting?.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-zinc-500 line-clamp-3">
                    {interview.posting?.description}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between items-center border-t pt-4">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs">
                    <Clock className="h-4 w-4" />
                    45 min
                  </div>

                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={`/interviews/${interview.id}`}
                      className="flex items-center gap-1"
                    >
                      View
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Status Badge --- */

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<
    string,
    { label: string; className: string; icon: any }
  > = {
    ACCEPTED: {
      label: "Accepted",
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-rose-50 text-rose-700",
      icon: XCircle,
    },
    PENDING: {
      label: "Pending",
      className: "bg-amber-50 text-amber-700",
      icon: Timer,
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-blue-50 text-blue-700",
      icon: CheckCircle2,
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-50 text-red-700",
      icon: AlertCircle,
    },
  };

  const current = config[status] || {
    label: status,
    className: "bg-zinc-100 text-zinc-600",
    icon: Clock,
  };

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md ${current.className}`}
    >
      <Icon className="h-3 w-3" />
      {current.label}
    </span>
  );
};

export default InterviewsPage;
