"use client";
import ForgotPasswordEmailForm from "@/components/Form/ForgotPasswordEmailForm";
import ResetPasswordForm from "@/components/Form/ResetPasswordForm";
import VerifyPasswordOtpForm from "@/components/Form/VerifyPasswordOtpForm";
import { useState } from "react";
import Link from "next/link";

type Step = "email" | "otp" | "password";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const titles = {
    email: "Forgot your password?",
    otp: "Verify your email",
    password: "Reset password",
  };

  const descriptions = {
    email: "Enter your email to receive a reset code.",
    otp: `We've sent a code to ${email}`,
    password: "Choose a new secure password.",
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 flex flex-col items-center justify-center">
      <section className="w-full max-w-md px-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm shadow-slate-200/40">
          <header className="mb-6 space-y-1">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              {titles[step]}
            </h1>
            <p className="text-sm text-slate-500">{descriptions[step]}</p>
          </header>

          {step === "email" && (
            <ForgotPasswordEmailForm
              onSuccess={(submittedEmail) => {
                setEmail(submittedEmail);
                setStep("otp");
              }}
            />
          )}
          {step === "otp" && (
            <VerifyPasswordOtpForm
              email={email}
              onSuccess={(submittedOtp) => {
                setOtp(submittedOtp);
                setStep("password");
              }}
            />
          )}
          {step === "password" && <ResetPasswordForm email={email} otp={otp} />}

          <footer className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline transition-all"
              >
                Sign in
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
