"use client";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SignupSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

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
      phoneNumber: "",
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

  const inputStyles =
    "bg-white border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 rounded-lg h-10 px-3 text-sm transition-all duration-200";

  return (
    <form
      id="form-signup"
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full"
    >
      <FieldGroup className="space-y-1">
        {/* Name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                Full Name
              </FieldLabel>
              <Input
                {...field}
                placeholder="Jane Doe"
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
        <Controller
          name="phoneNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                Phone Number
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  placeholder="98765432"
                  maxLength={8}
                  aria-invalid={fieldState.invalid ? "true" : "false"}
                />
                <InputGroupAddon>+65</InputGroupAddon>{" "}
              </InputGroup>
              {fieldState.invalid && (
                <span className="text-[11px] text-red-500">
                  {fieldState.error?.message}
                </span>
              )}
            </Field>
          )}
        />
        {/* Role Select */}
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                I am a
              </FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={inputStyles}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-lg shadow-lg">
                  <SelectItem
                    value="CANDIDATE"
                    className="text-sm cursor-pointer"
                  >
                    Candidate
                  </SelectItem>
                  <SelectItem value="HIRER" className="text-sm cursor-pointer">
                    Hirer
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Password (Separate Row) */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                Password
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

        {/* Confirm Password (Separate Row) */}
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
              <button onClick={() => setError("")}>
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
          Create Account
        </Button>
      </FieldGroup>
    </form>
  );
};

export default SignUpForm;
