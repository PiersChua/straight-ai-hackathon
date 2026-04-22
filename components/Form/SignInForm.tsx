"use client";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginSchema } from "@/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setError(message ?? "Failed to sign in");
      } else {
        router.push("/");
      }
    });
  };

  const inputStyles =
    "bg-white border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 rounded-lg h-10 px-3 text-sm transition-all duration-200";

  return (
    <form
      id="form-signin"
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full"
    >
      <FieldGroup className="space-y-1">
        {/* Email */}
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
                id="form-signin-email"
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

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <div className="flex items-center justify-between">
                <FieldLabel className="text-xs font-medium text-slate-600">
                  Password
                </FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={inputStyles}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
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

        {/* Error Alert */}
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

        <Button
          disabled={isPending}
          type="submit"
          className="w-full h-10 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all active:scale-[0.99] disabled:opacity-70"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </FieldGroup>
    </form>
  );
};

export default SignInForm;
