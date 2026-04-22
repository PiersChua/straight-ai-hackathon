"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  GraduationCap,
  Lightbulb,
  Users,
  Layers,
  ArrowRight,
  Clock,
  Search,
  X,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Posting, PostingType } from "@/generated/prisma/client";
import { getDisplayDate } from "@/utils";

type ExtendedPosting = Posting & {
  _count: { interviews: number };
};

const CATEGORIES: { label: string; value: PostingType | "ALL"; icon: any }[] = [
  { label: "All", value: "ALL", icon: Layers },
  { label: "Internships", value: "INTERNSHIP", icon: GraduationCap },
  { label: "Jobs", value: "JOBS", icon: Briefcase },
  { label: "Projects", value: "PROJECTS", icon: Lightbulb },
  { label: "Mentorship", value: "MENTORSHIP", icon: Users },
  { label: "Others", value: "OTHERS", icon: Layers },
];

export default function CandidatePostingList({
  initialPostings,
}: {
  initialPostings: ExtendedPosting[];
}) {
  const [filter, setFilter] = useState<PostingType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPostings = initialPostings.filter((posting) => {
    const matchesCategory = filter === "ALL" ? true : posting.type === filter;
    const matchesSearch =
      posting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      posting.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full flex">
          <Search className="absolute left-3 top-1/3 -translate-y-1-2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-white border-slate-200 focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 rounded-lg transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = filter === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>
      {/* Grid */}
      {filteredPostings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPostings.map((posting) => (
            <Card
              key={posting.id}
              className="group border-slate-200 hover:border-slate-300 transition-all duration-200 rounded-xl overflow-hidden flex flex-col h-full shadow-sm"
            >
              <CardContent className="p-6 flex flex-col flex-grow">
                {/* Meta Header */}
                <div className="flex justify-between items-center mb-5">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold uppercase tracking-widest text-blue-600 border-blue-100 bg-blue-50/50 px-2 py-0.5 rounded-md"
                  >
                    {posting.type}
                  </Badge>
                  <div className="flex items-center text-slate-400 text-[11px] font-medium uppercase tracking-tighter">
                    <Clock size={12} className="mr-1.5" />
                    {getDisplayDate(posting.createdAt)}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6 flex-grow">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {posting.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {posting.description}
                  </p>
                </div>

                {/* Small Activity Indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center justify-center w-5 h-5 bg-emerald-50 rounded-full">
                    <TrendingUp size={10} className="text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
                    {posting._count.interviews} Candidate(s) applied
                  </span>
                </div>

                {/* Structured Action Footer */}
                <div className="pt-5 border-t border-slate-100 mt-auto">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-white hover:bg-slate-50 border-slate-200 text-slate-900 font-semibold h-10 rounded-lg shadow-sm transition-all text-sm group/btn"
                  >
                    <Link href={`/dashboard/candidate/postings/${posting.id}`}>
                      View Details
                      <ArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center rounded-3xl flex flex-col items-center">
          <Search className="h-8 w-8 text-slate-300 mb-4" />
          <h3 className="text-slate-900 font-medium">No matches found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
            Try adjusting your search terms or category filters to find more
            opportunities.
          </p>
        </div>
      )}
    </div>
  );
}
