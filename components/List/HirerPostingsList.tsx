"use client";

import { useState } from "react";
import {
  Search,
  X,
  Layers,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Users,
  Clock,
  MoreHorizontal,
  Edit3,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostingType } from "@/generated/prisma/enums";
import { Posting } from "@/generated/prisma/client";

const CATEGORIES: { label: string; value: PostingType | "ALL"; icon: any }[] = [
  { label: "All", value: "ALL", icon: Layers },
  { label: "Internships", value: "INTERNSHIP", icon: GraduationCap },
  { label: "Jobs", value: "JOBS", icon: Briefcase },
  { label: "Projects", value: "PROJECTS", icon: Lightbulb },
  { label: "Mentorship", value: "MENTORSHIP", icon: Users },
];

type ExtendedPosting = Posting & {
  _count: { interviews: number };
};

interface Props {
  postings: ExtendedPosting[];
  onEdit: (p: ExtendedPosting) => void;
  onDelete: (id: string) => void;
}

export default function HirerPostingsList({
  postings,
  onEdit,
  onDelete,
}: Props) {
  const [filter, setFilter] = useState<PostingType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = postings.filter((p) => {
    const matchesCategory = filter === "ALL" ? true : p.type === filter;
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* FILTER BAR */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = filter === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  isActive
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Filter by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-slate-200 focus:ring-blue-600/5 focus:border-blue-600"
          />
        </div>
      </div>

      {/* GRID */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((posting) => (
            <Card
              key={posting.id}
              className="group border-slate-200 hover:border-blue-200 transition-all rounded-2xl overflow-hidden shadow-sm hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border-none"
                    >
                      {posting.type}
                    </Badge>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {posting.title}
                    </h3>
                  </div>
                  <Badge
                    className={`${posting.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"} border-none text-[10px] font-bold`}
                  >
                    {posting.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                  {posting.description}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-tighter">
                      <Users size={14} className="text-blue-500" />
                      {posting._count?.interviews || 0} Candidates
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(posting)}
                      className="rounded-lg border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                    >
                      <Edit3 size={14} className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(posting.id)}
                      className="rounded-lg border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-100"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">
            No postings match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}
