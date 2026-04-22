"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const postingTypes = [
  "INTERNSHIP",
  "PROJECTS",
  "MENTORSHIP",
  "JOBS",
  "OTHERS",
] as const;

const postingTypeLabels: Record<(typeof postingTypes)[number], string> = {
  INTERNSHIP: "Internship",
  PROJECTS: "Projects",
  MENTORSHIP: "Mentorship",
  JOBS: "Jobs",
  OTHERS: "Others",
};

const CreatePostingSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  requirements: z.string(),
  type: z.enum(postingTypes),
  questions: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .min(1)
    .superRefine((questions, ctx) => {
      if (!questions.some((question) => question.value.trim().length > 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Add at least one interview question",
          path: [0, "value"],
        });
      }
    }),
  isActive: z.boolean(),
});

type CreatePostingValues = z.infer<typeof CreatePostingSchema>;

const defaultValues: CreatePostingValues = {
  title: "",
  description: "",
  requirements: "",
  type: "INTERNSHIP",
  questions: [{ value: "" }],
  isActive: true,
};

export default function CreatePostingPage() {
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreatePostingValues>({
    resolver: zodResolver(CreatePostingSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = (values: CreatePostingValues) => {
    setFeedback(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/hirer/posting/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            requirements: values.requirements,
            type: values.type,
            questions: values.questions.map((question) => question.value),
            isActive: values.isActive,
          }),
        });

        const text = await res.text();

        let data: { message?: string } = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(`Server returned non-JSON response (${res.status})`);
        }

        if (!res.ok) {
          throw new Error(data.message || "Failed to create posting");
        }

        setFeedback({
          type: "success",
          message: data.message || "Posting created successfully",
        });
        form.reset(defaultValues);
      } catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error ? error.message : "Something went wrong",
        });
      }
    });
  };

  return (
    <main className="min-h-screen bg-black px-6 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="mb-8 space-y-3">
            <Button
              asChild
              variant="outline"
              className="rounded-2xl border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <Link href="/hirer/posting">Back to Postings</Link>
            </Button>

            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Hirer Portal
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                Create Posting
              </h1>
              <p className="pt-1 text-sm text-zinc-400">
                Set up a role and add interview questions.
              </p>
            </div>
          </div>

          <form id="form-create-posting" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-5">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-create-posting-title"
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >
                      Title
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-create-posting-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Frontend Intern"
                      autoComplete="off"
                      className="h-10 rounded-xl border-zinc-700 bg-zinc-900 px-4 text-sm text-white placeholder:text-zinc-500 hover:border-zinc-600 focus-visible:border-zinc-400 focus-visible:ring-zinc-700/50"
                    />
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-[10px] font-bold uppercase tracking-wider text-red-400"
                      />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-create-posting-description"
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >
                      Description
                    </FieldLabel>
                    <textarea
                      {...field}
                      id="form-create-posting-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Describe the role, scope, and ideal candidate."
                      rows={5}
                      className={cn(
                        "min-h-32 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition-all",
                        "placeholder:text-zinc-500 hover:border-zinc-600 focus-visible:border-zinc-400 focus-visible:ring-3 focus-visible:ring-zinc-700/50",
                        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20",
                      )}
                    />
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-[10px] font-bold uppercase tracking-wider text-red-400"
                      />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="requirements"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-create-posting-requirements"
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >
                      Requirements
                    </FieldLabel>
                    <textarea
                      {...field}
                      id="form-create-posting-requirements"
                      aria-invalid={fieldState.invalid}
                      placeholder="React, teamwork, communication"
                      rows={4}
                      className={cn(
                        "min-h-28 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition-all",
                        "placeholder:text-zinc-500 hover:border-zinc-600 focus-visible:border-zinc-400 focus-visible:ring-3 focus-visible:ring-zinc-700/50",
                        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20",
                      )}
                    />
                    <FieldDescription className="text-[10px] font-medium text-zinc-500">
                      Optional. Add preferred skills or expectations.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-[10px] font-bold uppercase tracking-wider text-red-400"
                      />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-create-posting-type"
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >
                      Type
                    </FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="form-create-posting-type"
                        aria-invalid={fieldState.invalid}
                        data-invalid={fieldState.invalid || undefined}
                        className="h-10 w-full rounded-xl border-zinc-700 bg-zinc-900 px-4 text-sm text-zinc-100 hover:border-zinc-600 focus-visible:border-zinc-400 focus-visible:ring-zinc-700/50"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100">
                        {postingTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="cursor-pointer rounded-lg text-sm focus:bg-zinc-800 focus:text-zinc-100"
                          >
                            {postingTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-[10px] font-bold uppercase tracking-wider text-red-400"
                      />
                    )}
                  </Field>
                )}
              />

              <Field>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Interview Questions
                    </FieldLabel>
                    <FieldDescription className="mt-1 text-[10px] font-medium text-zinc-500">
                      Add at least one question for the interview flow.
                    </FieldDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ value: "" })}
                    className="cursor-pointer rounded-xl border-zinc-800 bg-zinc-900 px-3 text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100"
                  >
                    <Plus className="size-3.5" />
                    Add Question
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((question, index) => (
                    <Controller
                      key={question.id}
                      name={`questions.${index}.value`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              aria-invalid={fieldState.invalid}
                              placeholder={`Question ${index + 1}`}
                              autoComplete="off"
                              className="h-10 rounded-xl border-zinc-700 bg-zinc-900 px-4 text-sm text-white placeholder:text-zinc-500 hover:border-zinc-600 focus-visible:border-zinc-400 focus-visible:ring-zinc-700/50"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              disabled={fields.length === 1}
                              onClick={() => remove(index)}
                              className="cursor-pointer rounded-xl border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          {fieldState.invalid && (
                            <FieldError
                              errors={[fieldState.error]}
                              className="text-[10px] font-bold uppercase tracking-wider text-red-400"
                            />
                          )}
                        </Field>
                      )}
                    />
                  ))}
                </div>
              </Field>

              <Controller
                name="isActive"
                control={form.control}
                render={({ field }) => (
                  <Field
                    orientation="horizontal"
                    className="items-center gap-3"
                  >
                    <input
                      id="form-create-posting-is-active"
                      type="checkbox"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-white accent-white"
                    />
                    <div className="space-y-1">
                      <FieldLabel
                        htmlFor="form-create-posting-is-active"
                        className="text-sm text-zinc-300"
                      >
                        Active posting
                      </FieldLabel>
                      <FieldDescription className="text-[10px] font-medium text-zinc-500">
                        Candidates can only see and apply to active postings.
                      </FieldDescription>
                    </div>
                  </Field>
                )}
              />

              {feedback && (
                <Alert
                  variant={
                    feedback.type === "error" ? "destructive" : "default"
                  }
                  className={cn(
                    "rounded-2xl border animate-in fade-in slide-in-from-top-2",
                    feedback.type === "error"
                      ? "border-red-500/20 bg-red-500/5 text-red-400"
                      : "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
                  )}
                >
                  {feedback.type === "error" ? (
                    <AlertCircle className="h-4 w-4 !text-red-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 !text-emerald-300" />
                  )}
                  <AlertTitle className="mb-1 text-[10px] font-black uppercase tracking-[0.2em]">
                    {feedback.type === "error" ? "Error" : "Success"}
                  </AlertTitle>
                  <AlertDescription className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                    {feedback.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                disabled={isPending}
                type="submit"
                className="h-12 w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-100 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-950 transition-all duration-300 hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Posting
              </Button>
            </FieldGroup>
          </form>
        </div>
      </div>
    </main>
  );
}
