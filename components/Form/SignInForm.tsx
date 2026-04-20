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
import { AlertCircle, Eye, EyeOff, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginSchema } from "@/schemas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  return (
    <form id="form-signin" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-signin-email"
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >
                Email
              </FieldLabel>
              <Input
                {...field}
                id="form-signin-email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="john@example.com"
                autoComplete="off"
                className="bg-zinc-900 border border-zinc-700 hover:border-zinc-600 text-white placeholder-zinc-500 focus:border-zinc-400 rounded-xl h-10 px-4 text-sm transition-all duration-200 data-[invalid]:border-red-500 selection:bg-zinc-700 selection:text-white"
              />
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-[10px] font-bold text-red-400 uppercase tracking-wider"
                />
              )}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel
                  htmlFor="form-signin-password"
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                >
                  Password
                </FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  id="form-signin-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  autoComplete="off"
                  className="bg-zinc-900 border border-zinc-700 hover:border-zinc-600 text-white placeholder-zinc-500 focus:border-zinc-400 rounded-xl h-10 px-4 pr-11 text-sm transition-all duration-200 data-[invalid]:border-red-500 selection:bg-zinc-700 selection:text-whitee"
                />
                <button
                  disabled={isPending}
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-[10px] font-bold text-red-400 uppercase tracking-wider"
                />
              )}
            </Field>
          )}
        />

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-500/5 border-red-500/20 text-red-400 rounded-2xl animate-in fade-in slide-in-from-top-2"
          >
            <AlertCircle className="h-4 w-4 !text-red-400" />
            <AlertTitle className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              Error
            </AlertTitle>
            <AlertDescription className="text-[10px] font-bold uppercase tracking-wider opacity-90">
              {error}
            </AlertDescription>
            <button
              onClick={() => setError("")}
              className="absolute right-4 top-4 text-red-400/50 hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </Alert>
        )}

        <Button
          disabled={isPending}
          type="submit"
          className="cursor-pointer w-full h-12 bg-zinc-100 hover:bg-white text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed border border-zinc-200 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all duration-300 shadow-sm group"
        >
          {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
          Sign In
        </Button>
      </FieldGroup>
    </form>
  );
};

export default SignInForm;
