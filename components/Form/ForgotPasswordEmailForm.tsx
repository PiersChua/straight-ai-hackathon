"use client";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ForgetPasswordSchema } from "@/schemas";

const EmailStepSchema = ForgetPasswordSchema.pick({ email: true });

interface ForgotPasswordEmailFormProps {
  onSuccess: (email: string) => void;
}

const ForgotPasswordEmailForm = ({
  onSuccess,
}: ForgotPasswordEmailFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof EmailStepSchema>>({
    resolver: zodResolver(EmailStepSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: z.infer<typeof EmailStepSchema>) => {
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/email-otp/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setError(message ?? "Failed to send reset code");
        return;
      }
      onSuccess(data.email);
    });
  };

  const inputStyles =
    "bg-white border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 rounded-lg h-10 px-3 text-sm transition-all duration-200";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                Email Address
              </FieldLabel>
              <Input
                {...field}
                id="forgot-password-email"
                type="email"
                placeholder="name@company.com"
                className={inputStyles}
              />
              {fieldState.invalid && (
                <span className="text-[11px] text-red-500">
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
                <X size={14} className="opacity-50 hover:opacity-100" />
              </button>
            </div>
          </Alert>
        )}

        <Button
          disabled={isPending}
          type="submit"
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all active:scale-[0.99] disabled:opacity-70"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Reset Code
        </Button>
      </FieldGroup>
    </form>
  );
};

export default ForgotPasswordEmailForm;
