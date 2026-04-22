import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import EditPostingForm from "@/components/Form/EditPostingForm";

export default async function EditPostingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  const { id } = await params;
  const posting = await prisma.posting.findUnique({
    where: { id },
  });

  if (!posting) notFound();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">
            <h1 className="text-base font-semibold text-slate-900">
              Edit Posting
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Update the details for &ldquo;{posting.title}&rdquo;
            </p>
          </div>
          <div className="px-6 py-5">
            <EditPostingForm
              postingId={posting.id}
              defaultValues={{
                title: posting.title,
                description: posting.description,
                requirements: posting.requirements ?? "",
                type: posting.type,
                questions:
                  posting.questions.length > 0 ? posting.questions : [""],
                isActive: posting.isActive,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
