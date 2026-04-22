"use client";

import { useState, useTransition } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { PostingSchema } from "@/schemas";

const POSTING_TYPES = [
  { value: "INTERNSHIP", label: "Internship" },
  { value: "PROJECTS", label: "Projects" },
  { value: "MENTORSHIP", label: "Mentorship" },
  { value: "JOBS", label: "Jobs" },
  { value: "OTHERS", label: "Others" },
];

const inputStyles =
  "bg-white border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 rounded-lg h-10 px-3 text-sm transition-all duration-200";

const textareaStyles =
  "bg-white border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 rounded-lg px-3 py-2 text-sm transition-all duration-200 resize-none";

const CreatePostingForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof PostingSchema>>({
    resolver: zodResolver(PostingSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      type: undefined,
      questions: [" "],
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    // @ts-ignore – useFieldArray expects object arrays; we handle string[] manually
    name: "questions",
  });

  const onSubmit = (data: z.infer<typeof PostingSchema>) => {
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/postings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { message } = await res.json();
        setError(message ?? "Failed to create posting");
      } else {
        router.push("/dashboard/hirer/postings");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
      <FieldGroup className="space-y-4">
        {/* Title */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                Posting Title
              </FieldLabel>
              <Input
                {...field}
                placeholder="e.g. Frontend Engineer Intern"
                className={inputStyles}
              />
              {fieldState.error && (
                <span className="text-[11px] text-red-500">
                  {fieldState.error.message}
                </span>
              )}
            </Field>
          )}
        />

        {/* Type */}
        <Controller
          name="type"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                Posting Type
              </FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={inputStyles}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-lg shadow-lg">
                  {POSTING_TYPES.map((t) => (
                    <SelectItem
                      key={t.value}
                      value={t.value}
                      className="text-sm cursor-pointer"
                    >
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <span className="text-[11px] text-red-500">
                  {fieldState.error.message}
                </span>
              )}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                Description
              </FieldLabel>
              <Textarea
                {...field}
                rows={4}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                className={textareaStyles}
              />
              {fieldState.error && (
                <span className="text-[11px] text-red-500">
                  {fieldState.error.message}
                </span>
              )}
            </Field>
          )}
        />

        {/* Requirements */}
        <Controller
          name="requirements"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-1">
              <FieldLabel className="text-xs font-medium text-slate-600">
                Requirements{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </FieldLabel>
              <Textarea
                {...field}
                rows={3}
                placeholder="e.g. Proficient in React, 1+ year experience..."
                className={textareaStyles}
              />
              {fieldState.error && (
                <span className="text-[11px] text-red-500">
                  {fieldState.error.message}
                </span>
              )}
            </Field>
          )}
        />

        {/* Interview Questions */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <FieldLabel className="text-xs font-medium text-slate-600">
              Interview Questions
            </FieldLabel>
            <button
              type="button"
              onClick={() => append("")}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Plus size={13} />
              Add Question
            </button>
          </div>

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1 grid gap-1">
                  <Controller
                    name={`questions.${index}`}
                    control={form.control}
                    render={({ field: f, fieldState }) => (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-medium w-5 text-right shrink-0">
                            {index + 1}.
                          </span>
                          <Input
                            {...f}
                            placeholder={`Question ${index + 1}`}
                            className={inputStyles}
                          />
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-slate-300 hover:text-red-400 transition-colors shrink-0"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                        {fieldState.error && (
                          <span className="text-[11px] text-red-500 ml-7">
                            {fieldState.error.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          {form.formState.errors.questions?.root && (
            <span className="text-[11px] text-red-500">
              {form.formState.errors.questions.root.message}
            </span>
          )}
          {typeof form.formState.errors.questions?.message === "string" && (
            <span className="text-[11px] text-red-500">
              {form.formState.errors.questions.message}
            </span>
          )}
        </div>

        {/* Error Alert */}
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

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1 h-10 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all active:scale-[0.99] disabled:opacity-70"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Posting
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default CreatePostingForm;
