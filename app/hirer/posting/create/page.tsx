"use client";

import { useState } from "react";
import Link from "next/link";

type PostingType =
  | "INTERNSHIP"
  | "PROJECTS"
  | "MENTORSHIP"
  | "JOBS"
  | "OTHERS";

export default function CreatePostingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [type, setType] = useState<PostingType>("INTERNSHIP");
  const [questions, setQuestions] = useState([""]);
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated.length > 0 ? updated : [""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/hirer/posting/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          requirements,
          type,
          questions,
          isActive,
        }),
      });

      const text = await res.text();

      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to create posting");
      }

      setMessage("Posting created successfully");
      setTitle("");
      setDescription("");
      setRequirements("");
      setType("INTERNSHIP");
      setQuestions([""]);
      setIsActive(true);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-black">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="mb-8 space-y-3">
          <Link
            href="/hirer/posting"
            className="inline-flex rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
          >
            ← Back to Postings
          </Link>

          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
              Hirer Portal
            </p>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
              Create Posting
            </h1>
            <p className="text-sm text-zinc-400 pt-1">
              Set up a role and add interview questions.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">Title</label>
            <input
              type="text"
              placeholder="Frontend Intern"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">Description</label>
            <textarea
              placeholder="Describe the role"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">Requirements</label>
            <textarea
              placeholder="React, teamwork, communication"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PostingType)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none"
            >
              <option value="INTERNSHIP">Internship</option>
              <option value="PROJECTS">Projects</option>
              <option value="MENTORSHIP">Mentorship</option>
              <option value="JOBS">Jobs</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-200">
              Interview Questions
            </label>

            {questions.map((question, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Question ${index + 1}`}
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full rounded-2xl border border-dashed border-zinc-700 bg-transparent px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              + Add Question
            </button>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="isActive" className="text-sm text-zinc-300">
              Active posting
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-black hover:bg-white disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Posting"}
          </button>

          {message && (
            <p className="text-sm text-zinc-400 text-center">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}