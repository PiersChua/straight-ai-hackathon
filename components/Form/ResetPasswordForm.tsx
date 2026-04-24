"use client";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { ForgetPasswordSchema } from "@/schemas";
import { toast } from "sonner";

const PasswordStepSchema = ForgetPasswordSchema.pick({
  password: true,
  confirmPassword: true,
});

interface ResetPasswordFormProps {
  email: string;
  otp: string;
}

const ResetPasswordForm = ({ email, otp }: ResetPasswordFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof PasswordStepSchema>>({
    resolver: zodResolver(PasswordStepSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: z.infer<typeof PasswordStepSchema>) => {
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/email-otp/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setError(message ?? "Failed to reset password");
        return;
      }
      toast.success("Password reset successfully");
      router.push("/login");
    });
  };

  const inputStyles =
    "bg-white border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 rounded-lg h-10 px-3 text-sm transition-all duration-200";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-4">
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                New Password
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={inputStyles}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {fieldState.invalid && (
                <span className="text-[11px] text-red-500">
                  {fieldState.error?.message}
                </span>
              )}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={inputStyles}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
              </div>
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

        <Button
          disabled={isPending}
          type="submit"
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Password
        </Button>
      </FieldGroup>
    </form>
  );
};

export default ResetPasswordForm;
