"use client";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { SignupSchema } from "@/schemas";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof SignupSchema>) => {
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setError(message ?? "Failed to sign up");
      } else {
        router.push("/");
      }
    });
  };

  return (
    <form id="form-signup" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-4">
        {/* Name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-signup-name"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
              >
                Name
              </FieldLabel>
              <Input
                {...field}
                id="form-signup-name"
                aria-invalid={fieldState.invalid}
                placeholder="John Doe"
                autoComplete="off"
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-zinc-400 rounded-xl h-10 px-4 text-sm transition-all duration-200 data-[invalid]:border-zinc-500 selection:bg-zinc-700 selection:text-white"
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

        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-signup-email"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
              >
                Email Address
              </FieldLabel>
              <Input
                {...field}
                id="form-signup-email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="john@example.com"
                autoComplete="off"
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-zinc-400 rounded-xl h-10 px-4 text-sm transition-all duration-200 data-[invalid]:border-zinc-500 selection:bg-zinc-700 selection:text-white"
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
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-signup-role"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
              >
                I am a
              </FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id="form-signup-role"
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 data-[invalid]:border-red-500/50 text-zinc-100 focus:border-zinc-400 px-4 rounded-xl h-10 text-sm transition-all duration-200"
                  data-invalid={fieldState.invalid || undefined}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue
                    placeholder={
                      <span className="text-zinc-600">Select a role...</span>
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 px-4">
                  <SelectItem
                    value="CANDIDATE"
                    className="text-sm focus:bg-zinc-800 focus:text-zinc-100 rounded-lg cursor-pointer"
                  >
                    Candidate
                  </SelectItem>
                  <SelectItem
                    value="HIRER"
                    className="text-sm focus:bg-zinc-800 focus:text-zinc-100 rounded-lg cursor-pointer"
                  >
                    Hirer
                  </SelectItem>
                </SelectContent>
              </Select>
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
              <FieldLabel
                htmlFor="form-signup-password"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
              >
                Password
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  id="form-signup-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  autoComplete="off"
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-zinc-400 rounded-xl h-10 px-4 text-sm transition-all duration-200 data-[invalid]:border-zinc-500 selection:bg-zinc-700 selection:text-white"
                />
                <button
                  disabled={isPending}
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              {fieldState.invalid ? (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-[10px] font-bold text-red-400 uppercase tracking-wider"
                />
              ) : (
                <FieldDescription className="text-[10px] text-zinc-600 font-medium">
                  Min. 8 characters
                </FieldDescription>
              )}
            </Field>
          )}
        />

        {/* Confirm Password */}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-signup-confirm-password"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
              >
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  id="form-signup-confirm-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  autoComplete="off"
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-zinc-400 rounded-xl h-10 px-4 text-sm transition-all duration-200 data-[invalid]:border-zinc-500 selection:bg-zinc-700 selection:text-white"
                />
                <button
                  disabled={isPending}
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showConfirmPassword ? (
                    <Eye size={14} />
                  ) : (
                    <EyeOff size={14} />
                  )}
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

        {/* Error Alert */}
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
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </FieldGroup>
    </form>
  );
};

export default SignUpForm;
