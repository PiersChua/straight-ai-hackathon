import { Button } from "@/components/ui/button";
import {
  Mic,
  Target,
  ShieldCheck,
  ArrowRight,
  BarChart3,
  Building,
  User,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Navigation/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Home = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <Header isLoggedIn={!!session} role={session?.user.role as string} />

      <main className="flex-1 w-full flex flex-col">
        {/* --- 1. HERO SECTION --- */}
        <section className="py-12 md:py-32 w-full relative overflow-hidden flex items-center justify-center">
          {/* Subtle background glow for premium feel */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 rounded-full blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                A new standard for talent discovery
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl text-balance leading-[1.05]">
              Showcase capability. <br />
              <span className="text-slate-400">Leave pedigree behind.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed text-balance">
              Access to opportunity shouldn't depend on your network or school
              brand. We use structured, AI-scored assessments to ensure
              candidates are discovered strictly by what they can do.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700! text-white h-12 px-8 rounded-md font-medium text-base shadow-lg shadow-blue-600/20 transition-all"
              >
                <Link href="/sign-up">
                  Start Interviewing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-12 px-8 rounded-md border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-medium text-base transition-all"
              >
                <Link href="/sign-up">Hire Top Talent</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- 2. THE PROBLEM & SOLUTION SECTION --- */}
        <section
          id="paradigm"
          className="py-12 md:py-24 bg-slate-50 border-y border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                The Paradigm Shift
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-balance">
                Bias filters out the best. We filter out the bias.
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* The Old Way */}
              <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <X className="h-5 w-5 text-slate-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900">
                    Traditional Hiring
                  </h4>
                </div>
                <ul className="space-y-4 mt-auto">
                  {[
                    "Resumes screened based on university prestige.",
                    "Opportunities gated by insider network access.",
                    "Unstructured interviews prone to human bias.",
                    "Capable candidates from under-resourced backgrounds ignored.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-500"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-2"></span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The Aptly Way */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-10 flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-blue-950">
                    The Aptly Model
                  </h4>
                </div>
                <ul className="space-y-4 mt-auto">
                  {[
                    "Skills evaluated rigorously before resumes are seen.",
                    "AI agent standardizes interviews for an objective baseline.",
                    "Opportunities awarded solely on demonstrated capability.",
                    "A level playing field for hidden talent to shine.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-700"
                    >
                      <Check className="h-4 w-4 text-blue-600 shrink-0 mt-1" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. HOW IT WORKS SECTION (The Pipeline) --- */}
        <section id="pipeline" className="py-12 md:py-32">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl mb-16 space-y-4">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                The Infrastructure
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                The Capability Pipeline
              </h3>
              <p className="text-slate-500 text-lg">
                A transparent, four-step process designed to highlight real
                talent and eliminate bias.
              </p>
            </div>

            <div className="relative">
              {/* Connecting Line (Desktop Only) */}
              <div className="hidden md:block absolute top-8 left-8 right-8 h-[2px] bg-slate-100 z-0"></div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
                {[
                  {
                    icon: Target,
                    title: "1. Build Profile",
                    desc: "Highlight your technical abilities, soft skills, and past projects.",
                  },
                  {
                    icon: Mic,
                    title: "2. Voice Interview",
                    desc: "Complete a dynamic, AI-guided audio interview tailored to the role.",
                  },
                  {
                    icon: BarChart3,
                    title: "3. Objective Scoring",
                    desc: "Our engine analyzes the transcript to score your fit for the specific job.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "4. Direct Match",
                    desc: "Hirers review top-scoring candidates securely and without bias.",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col relative group">
                    <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-200 group-hover:shadow-md transition-all">
                      <step.icon className="h-6 w-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. AUDIENCE BENEFITS SECTION --- */}
        <section
          id="benefits"
          className="py-12 md:py-24 bg-slate-50 border-t border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Candidates */}
              <div className="bg-white border border-slate-200 rounded-3xl p-10 md:p-12 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-8 border border-blue-100">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  For Candidates
                </h3>
                <p className="text-slate-500 mb-8 leading-relaxed text-lg">
                  Stop throwing resumes into the void. Prove your worth directly
                  through interactive assessments and get matched with startups
                  that value what you can actually build.
                </p>
                <Link
                  href="/sign-up"
                  className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                >
                  Create your profile <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Employers */}
              <div className="bg-white border border-slate-200 rounded-3xl p-10 md:p-12 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-8 border border-slate-200">
                  <Building className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  For Hirers
                </h3>
                <p className="text-slate-500 mb-8 leading-relaxed text-lg">
                  Save countless hours screening identical resumes. Input your
                  requirements, and let our AI engine conduct preliminary voice
                  interviews to surface truly capable candidates.
                </p>
                <Link
                  href="/sign-up"
                  className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                >
                  Start headhunting <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. BOTTOM CTA SECTION --- */}
        <section className="py-12 md:py-32">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-12 md:p-20 text-center flex flex-col items-center relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                  Ready to redesign discovery?
                </h2>
                <p className="text-slate-600 mb-10 max-w-xl text-lg md:text-xl">
                  Join the platform built for the capable. Start matching based
                  on merit today.
                </p>
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700! text-white h-14 px-10 rounded-md font-semibold shadow-sm shadow-blue-600/20 transition-all text-base"
                >
                  <Link href="/sign-up">Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-slate-100 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Aptly.
          </span>
          <p className="text-sm text-slate-400 font-medium">
            © 2026 Aptly. Built For The Capable.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
