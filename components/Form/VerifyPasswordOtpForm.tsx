"use client";
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

interface FormProps {
  email: string;
  onSuccess: (otp: string) => void;
}

const VerifyPasswordOtpForm = ({ email, onSuccess }: FormProps) => {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = (data: z.infer<typeof OtpSchema>) => {
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/email-otp/check-verification-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: data.otp }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setError(message ?? "Verification failed");
        return;
      }
      onSuccess(data.otp);
    });
  };

  const resendOtp = () => {
    startTransition(async () => {
      const res = await fetch("/api/email-otp/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) toast.success(`OTP resent to ${email}`);
    });
  };

  const slotStyles =
    "bg-white border-slate-200 text-slate-900 h-12 w-12 text-base font-semibold";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-6">
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-2">
              <FieldLabel className="text-xs font-medium text-slate-600 text-center">
                Verification Code
              </FieldLabel>
              <div className="flex justify-center py-2">
                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                  <InputOTPGroup>
                    {[0, 1, 2].map((i) => (
                      <InputOTPSlot key={i} index={i} className={slotStyles} />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-slate-300" />
                  <InputOTPGroup>
                    {[3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className={slotStyles} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
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
            className="bg-red-50 border-red-100 text-red-700 rounded-lg py-2"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                <AlertDescription className="text-xs font-medium">
                  {error}
                </AlertDescription>
              </div>
              <button type="button" onClick={() => setError("")}>
                <X size={14} className="opacity-50" />
              </button>
            </div>
          </Alert>
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={isPending || form.watch("otp").length !== 6}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all disabled:opacity-70"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Code
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

export default VerifyPasswordOtpForm;
