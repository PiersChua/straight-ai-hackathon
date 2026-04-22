import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CreatePostingForm from "@/components/Form/CreatePostingForm";

export default async function CreatePostingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">
            <h1 className="text-base font-semibold text-slate-900">
              Create Posting
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the details below to publish a new opening
            </p>
          </div>
          <div className="px-6 py-5">
            <CreatePostingForm />
          </div>
        </div>
      </div>
    </div>
  );
}
