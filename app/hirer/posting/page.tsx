"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PostingType =
  | "INTERNSHIP"
  | "PROJECTS"
  | "MENTORSHIP"
  | "JOBS"
  | "OTHERS";

type Posting = {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  type: PostingType;
  questions: string[];
  isActive: boolean;
};

export default function HirerPostingPage() {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [type, setType] = useState<PostingType>("INTERNSHIP");
  const [questions, setQuestions] = useState([""]);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPostings = async () => {
    try {
      const res = await fetch("/api/hirer/posting/get");
      const text = await res.text();

      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch postings");
      }

      setPostings(data.postings || []);
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

  useEffect(() => {
    fetchPostings();
  }, []);

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

  const startEdit = (posting: Posting) => {
    setEditingId(posting.id);
    setTitle(posting.title);
    setDescription(posting.description);
    setRequirements(posting.requirements || "");
    setType(posting.type);
    setQuestions(posting.questions.length ? posting.questions : [""]);
    setIsActive(posting.isActive);
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setRequirements("");
    setType("INTERNSHIP");
    setQuestions([""]);
    setIsActive(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/hirer/posting/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
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
        throw new Error(data.message || "Failed to update posting");
      }

      setMessage("Posting updated successfully");
      cancelEdit();
      fetchPostings();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/hirer/posting/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const text = await res.text();

      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete posting");
      }

      setMessage("Posting deleted successfully");
      fetchPostings();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
              Hirer Portal
            </p>
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
              My Postings
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Manage all opportunities you created.
            </p>
          </div>

          <Link
            href="/hirer/posting/create"
            className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-black hover:bg-white"
          >
            + Create Posting
          </Link>
        </div>

        {message && (
          <p className="mb-4 text-sm text-zinc-400">{message}</p>
        )}

        {editingId && (
          <form
            onSubmit={handleEditSubmit}
            className="mb-8 space-y-5 rounded-3xl border border-zinc-900 bg-zinc-950 p-8"
          >
            <h2 className="text-xl font-semibold text-zinc-100">Edit Posting</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Requirements</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none resize-none"
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
                    value={question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none"
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
                id="editIsActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="editIsActive" className="text-sm text-zinc-300">
                Active posting
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-black hover:bg-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : postings.length === 0 ? (
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-8 text-center text-zinc-400">
            No postings yet.
          </div>
        ) : (
          <div className="space-y-4">
            {postings.map((posting) => (
              <div
                key={posting.id}
                className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-100">
                      {posting.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      {posting.type} • {posting.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(posting)}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(posting.id)}
                      className="rounded-2xl border border-red-900 bg-red-950 px-4 py-2 text-sm text-red-200 hover:bg-red-900/40"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-sm text-zinc-300">{posting.description}</p>

                {posting.requirements && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-zinc-200">
                      Requirements
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {posting.requirements}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm font-medium text-zinc-200">
                    Interview Questions
                  </p>
                  {posting.questions.length === 0 ? (
                    <p className="mt-1 text-sm text-zinc-500">
                      No questions added.
                    </p>
                  ) : (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-400">
                      {posting.questions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}