"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Timer } from "lucide-react";
import { InterviewStatus } from "@/generated/prisma/enums";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  interviewId: string;
  currentStatus: InterviewStatus;
  postingId: string;
}

const statusDisplay = {
  PENDING: {
    label: "Pending Review",
    icon: Timer,
    className: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "text-red-400 bg-red-400/10 border-red-400/20",
  },
};

export const InterviewStatusActions = ({
  interviewId,
  currentStatus,
}: Props) => {
  const [status, setStatus] = useState<InterviewStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<
    "ACCEPTED" | "REJECTED" | null
  >(null);
  const router = useRouter();

  const isLocked = status === "ACCEPTED" || status === "REJECTED";
  const cfg = statusDisplay[status];
  const Icon = cfg.icon;

  const confirmUpdate = () => {
    if (!pendingAction) return;
    startTransition(async () => {
      const res = await fetch(`/api/interviews/${interviewId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: pendingAction }),
      });
      if (res.ok) {
        setStatus(pendingAction);
        router.refresh();
      }
      setPendingAction(null);
    });
  };

  if (isLocked) {
    return (
      <div
        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${cfg.className}`}
      >
        <Icon size={11} />
        {cfg.label}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setPendingAction("ACCEPTED")}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 hover:border-emerald-400/40 text-emerald-400 transition-all duration-150 disabled:opacity-50"
        >
          <CheckCircle2 size={12} />
          ACCEPT
        </button>

        <button
          onClick={() => setPendingAction("REJECTED")}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 hover:border-red-400/40 text-red-400 transition-all duration-150 disabled:opacity-50"
        >
          <XCircle size={12} />
          REJECT
        </button>
      </div>

      <AlertDialog
        open={!!pendingAction}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
      >
        <AlertDialogContent className="bg-white rounded-xl border-slate-200 shadow-xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-slate-900">
              {pendingAction === "ACCEPTED" && "Accept this candidate?"}
              {pendingAction === "REJECTED" && "Reject this candidate?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              This action cannot be undone
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              disabled={isPending}
              className="h-9 rounded-lg border-slate-200 text-slate-600 text-sm font-medium"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUpdate}
              disabled={isPending}
              className={`h-9 rounded-lg text-sm font-medium text-white inline-flex items-center gap-2 ${
                pendingAction === "ACCEPTED"
                  ? "bg-emerald-600! hover:bg-emerald-700!"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isPending && <Loader2 size={13} className="animate-spin" />}
              {pendingAction === "ACCEPTED" && "Accept"}
              {pendingAction === "REJECTED" && "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
