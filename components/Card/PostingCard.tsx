"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Pencil, Trash2, Users, CircleDot } from "lucide-react";
import { getDisplayDate } from "@/utils";
import { Posting } from "@/generated/prisma/client";

type ExtendedPosting = Posting & {
  _count: { interviews: number };
};

interface PostingCardProps {
  posting: ExtendedPosting;
  typeColors: Record<string, string>;
}

export const PostingCard = ({ posting, typeColors }: PostingCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      await fetch(`/api/postings/${posting.id}`, { method: "DELETE" });
      router.refresh();
    });
  };

  const typeLabel =
    posting.type.charAt(0) + posting.type.slice(1).toLowerCase();
  const colorClass = typeColors[posting.type] ?? typeColors["OTHERS"];

  return (
    <>
      <div className="group bg-white rounded-xl border border-slate-200 px-5 py-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
        <div className="flex items-start justify-between gap-4">
          {/* Left content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span
                className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${colorClass}`}
              >
                {typeLabel}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                  posting.isActive ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                <CircleDot size={9} />
                {posting.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <h2 className="text-sm font-semibold text-slate-900 truncate">
              {posting.title}
            </h2>

            <p className="text-xs text-slate-400 mt-0.5 line-clamp-3">
              {posting.description}
            </p>

            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Users size={12} />
                {posting._count.interviews}{" "}
                {posting._count.interviews === 1 ? "interview" : "interviews"}
              </span>
              <span className="text-xs text-slate-300">
                {getDisplayDate(posting.createdAt)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-white border-slate-200 rounded-lg shadow-lg"
            >
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/hirer/postings/${posting.id}/interviews`}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Users size={13} />
                  View Interviews
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/hirer/postings/edit/${posting.id}`}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Pencil size={13} />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                className="flex items-center gap-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <Trash2 size={13} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white rounded-xl border-slate-200 shadow-xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-slate-900">
              Delete posting?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              This will permanently delete{" "}
              <span className="font-medium text-slate-700">
                &ldquo;{posting.title}&rdquo;
              </span>{" "}
              and all associated interviews. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-9 rounded-lg border-slate-200 text-slate-600 text-sm font-medium">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
