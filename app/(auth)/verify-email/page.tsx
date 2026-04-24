import VerifyEmailOtpForm from "@/components/Form/VerifyEmailOtpForm";
import { Suspense } from "react";

const VerifyEmailPage = () => {
  return (
    <main className="min-h-screen bg-slate-50/50 py-12 flex flex-col items-center justify-center">
      <section className="w-full max-w-md px-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm shadow-slate-200/40 space-y-6">
          <header className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              Check your inbox
            </h1>
            <p className="text-sm text-slate-500">
              We sent a 6-digit code to your email address.
            </p>
          </header>

          <Suspense
            fallback={
              <div className="h-[200px] animate-pulse bg-slate-50 rounded-xl" />
            }
          >
            <VerifyEmailOtpForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default VerifyEmailPage;
