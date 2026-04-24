"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { OtpSchema } from "@/schemas";

const VerifyEmailOtpForm = () => {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const form = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = (data: z.infer<typeof OtpSchema>) => {
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/email-otp/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: data.otp }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setError(message ?? "Verification failed");
        return;
      }
      toast.success("Email verified successfully");
      router.push("/");
    });
  };

  const resendOtp = () => {
    startTransition(async () => {
      const res = await fetch("/api/email-otp/send-verification-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setError(message ?? "Failed to resend OTP");
        return;
      }
      toast.success(`OTP resent to ${email}`);
    });
  };

  const slotStyles =
    "bg-white border-slate-200 text-slate-900 h-10 w-10 text-sm font-semibold shadow-sm transition-all focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 rounded-lg";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <FieldGroup className="space-y-4">
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1.5">
              <FieldLabel className="text-xs font-medium text-slate-600">
                Verification Code
              </FieldLabel>
              <div className="flex justify-center py-2">
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={slotStyles}
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-slate-300" />
                  <InputOTPGroup className="gap-2">
                    {[3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={slotStyles}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                Code expires in 5 minutes
              </p>
              {fieldState.invalid && (
                <span className="text-[11px] text-red-500 text-center">
                  {fieldState.error?.message}
                </span>
              )}
            </Field>
          )}
        />

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-50 border-red-100 text-red-700 rounded-lg py-2 mt-2"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                <AlertDescription className="text-xs font-medium">
                  {error}
                </AlertDescription>
              </div>
              <button type="button" onClick={() => setError("")}>
                <X size={14} className="opacity-50 hover:opacity-100" />
              </button>
            </div>
          </Alert>
        )}

        <div className="space-y-3 pt-2">
          <Button
            type="submit"
            disabled={isPending || form.watch("otp").length !== 6}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Verify Email
          </Button>

          <button
            type="button"
            onClick={resendOtp}
            disabled={isPending}
            className="w-full text-xs font-medium text-slate-500 hover:text-blue-600 underline underline-offset-2 transition-colors disabled:opacity-50"
          >
            Resend Code
          </button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default VerifyEmailOtpForm;
