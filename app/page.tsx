import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Target,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Header from "@/components/Navigation/Header";

const Home = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <Header isLoggedIn={!!session} />

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-32 max-w-5xl mx-auto text-center">
        <Badge
          variant="secondary"
          className="mb-4 rounded-full px-4 py-1 text-indigo-700 bg-indigo-50 border-indigo-100"
        >
          Redesigning Opportunity Discovery
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
          Hire for <span className="text-indigo-600">Capability</span>,<br />{" "}
          Not Pedigree.
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The merit-based matching platform that uses AI-scored assessments to
          find top-tier talent based on what they can actually do—not where they
          went to school.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 text-base shadow-lg shadow-indigo-200"
          >
            Find Opportunities <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base border-slate-200"
          >
            For Employers
          </Button>
        </div>
      </section>

      {/* Process Steps */}
      <section id="how-it-works" className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The Capability Pipeline</h2>
            <p className="text-slate-500">
              A structured bridge between discovery and hire.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Curate",
                desc: "Candidates build portfolios focused on raw technical skillsets.",
              },
              {
                icon: Mic,
                title: "Interview",
                desc: "AI-driven voice interviews evaluate deep domain knowledge.",
              },
              {
                icon: BarChart3,
                title: "Score",
                desc: "Responses are transcribed and ranked against hirer requirements.",
              },
              {
                icon: ShieldCheck,
                title: "Match",
                desc: "Hirers review the top-ranked candidates without bias.",
              },
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="mb-4 bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                  <step.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-Sided Benefits */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6 tracking-tight">
            For the Underdog <br />
            <span className="text-slate-400 font-medium italic">
              With Real Skills
            </span>
          </h2>
          <ul className="space-y-4 mb-8">
            {[
              "Bypass the 'brand-name' filter automatically",
              "Demonstrate capability through AI voice agents",
              "Get scored on technical and soft skill depth",
              "Connect with startups and mentors directly",
            ].map((text, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-700">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <Card className="border-slate-200 shadow-2xl rotate-1">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
              <div>
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
              </div>
              <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-none">
                94% Fit
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-11/12" />
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 w-3/4" />
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-200 w-1/2" />
              </div>
            </div>
            <p className="mt-6 text-xs text-slate-400 text-center uppercase tracking-widest font-semibold">
              AI Assessment Breakdown
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer CTA */}
      <section className="bg-indigo-600 py-20 px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Stop screening resumes. <br />
          Start measuring capability.
        </h2>
        <p className="text-indigo-100 mb-10 max-w-xl mx-auto">
          Join the waitlist to be among the first to access Aptly's talent
          matching engine.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="rounded-md px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
          />
          <Button className="bg-white text-indigo-600 hover:bg-slate-100 px-8 py-3 h-auto font-bold">
            Join Beta
          </Button>
        </div>
      </section>

      <footer className="py-12 text-center text-slate-400 text-sm border-t border-slate-100">
        © 2026 Aptly. Built for the capable.
      </footer>
    </div>
  );
};

export default Home;
