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
  FileText,
  Video,
  EyeOff,
  Star,
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 rounded-full blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                A new standard for talent discovery
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl text-balance leading-[1.05]">
              Get hired for what you can do. <br />
              <span className="text-slate-400">Not where you studied.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed text-balance">
              Aptly anonymises your credentials and surfaces you to employers
              through portfolio quality and structured AI assessments — not your
              school name, not who you know.
            </p>

            {/* Trust strip */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-10 text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <EyeOff className="h-3.5 w-3.5" /> School name hidden from employers
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> AI-scored, not gut-felt
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" /> Portfolio speaks first
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700! text-white h-12 px-8 rounded-md font-medium text-base shadow-lg shadow-blue-600/20 transition-all"
              >
                <Link href="/sign-up">
                  Find opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-12 px-8 rounded-md border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-medium text-base transition-all"
              >
                <Link href="/sign-up">Hire on merit</Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg w-full">
              {[
                ["12,400+", "Candidates placed"],
                ["840+", "Partner companies"],
                ["94%", "Retention rate"],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{n}</div>
                  <div className="text-xs text-slate-400 mt-1">{l}</div>
                </div>
              ))}
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
                    "Resumes screened by university prestige, not actual ability.",
                    "Internship spots filled through connections, not capability.",
                    "Candidates from SIT, SUTD, or SUSS overlooked despite real talent.",
                    "Unstructured interviews prone to gut feel and unconscious bias.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-500">
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
                    "Portfolio and work samples reviewed before any credentials are seen.",
                    "School names anonymised — employers see \"Degree holder\", nothing more.",
                    "Structured AI assessments (MCQ, written, spoken) create a fair baseline.",
                    "Candidates ranked by suitability score tied to the actual job description.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <Check className="h-4 w-4 text-blue-600 shrink-0 mt-1" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. HOW IT WORKS SECTION --- */}
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
                A transparent, multi-stage process designed to surface real
                talent and eliminate pedigree bias at every step.
              </p>
            </div>

            <div className="relative">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-8 left-8 right-8 h-[2px] bg-slate-100 z-0"></div>

              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 relative z-10">
                {[
                  {
                    icon: Target,
                    title: "1. Build your portfolio",
                    desc: "Add projects, work samples, and skills. School name is stripped automatically — only your work is visible.",
                  },
                  {
                    icon: FileText,
                    title: "2. Complete a challenge",
                    desc: "Employers post role-specific tasks. MCQ and written questions tied directly to the job scope.",
                  },
                  {
                    icon: Video,
                    title: "3. Spoken interview",
                    desc: "Record a video response to role-specific prompts. AI transcribes and scores — employers don't see the raw video.",
                  },
                  {
                    icon: BarChart3,
                    title: "4. Suitability score",
                    desc: "Your responses are matched against the job description. You get a score. Employers see rankings, not résumés.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "5. Fair match",
                    desc: "Top-ranked candidates are surfaced to employers — anonymised portfolio first, interview only after.",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col relative group">
                    <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-200 group-hover:shadow-md transition-all">
                      <step.icon className="h-6 w-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-900 mb-2">
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

        {/* --- 4. ASSESSMENT TYPES SECTION (new) --- */}
        <section className="py-12 md:py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                The Assessment
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-balance">
                Three layers. One fair score.
              </h3>
              <p className="text-slate-500 text-lg">
                Each component is scored by AI against the role's requirements — before any employer sees who you are.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  label: "Written",
                  title: "MCQ + Essay",
                  desc: "Role-specific multiple choice and open-ended written questions. Employers configure them. AI scores them against the job description.",
                  detail: "Proctored with screen share",
                  color: "bg-blue-50 border-blue-100",
                  iconColor: "text-blue-600",
                  iconBg: "bg-blue-100",
                },
                {
                  icon: Mic,
                  label: "Spoken",
                  title: "Video interview",
                  desc: "Record a spoken response to role-specific prompts. Your video is transcribed and scored by AI — the raw recording is never shown to employers.",
                  detail: "Anonymised before employer review",
                  color: "bg-slate-50 border-slate-200",
                  iconColor: "text-slate-700",
                  iconBg: "bg-slate-100",
                },
                {
                  icon: Target,
                  label: "Portfolio",
                  title: "Work samples",
                  desc: "Projects, case studies, and writing samples reviewed for quality and relevance. School name and network signals are scrubbed before employer review.",
                  detail: "Credentials anonymised automatically",
                  color: "bg-slate-50 border-slate-200",
                  iconColor: "text-slate-700",
                  iconBg: "bg-slate-100",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-8 flex flex-col gap-5 ${item.color}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                      {item.label}
                    </span>
                    <h4 className="text-xl font-semibold text-slate-900 mt-1 mb-3">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-xs font-medium text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 5. AUDIENCE BENEFITS SECTION --- */}
        <section
          id="benefits"
          className="py-12 md:py-24 border-t border-slate-100"
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
                <p className="text-slate-500 mb-6 leading-relaxed text-lg">
                  Stop being filtered out before anyone sees what you can do.
                  Your portfolio goes first. Your school name doesn't.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "School name anonymised from all employer views",
                    "Assessed on actual work, not résumé keywords",
                    "Suitability score tells you where you stand",
                    "One profile, applied across multiple roles",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
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
                <p className="text-slate-500 mb-6 leading-relaxed text-lg">
                  Post a role, configure your assessment, and receive a ranked
                  shortlist. No résumé sifting. No nepotism. Just capability.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Set your own MCQ, essay, and video prompts per role",
                    "Candidates ranked by AI suitability score",
                    "Review anonymised portfolios before any interview",
                    "Use as a pre-screen or full pipeline — your choice",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-slate-700 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
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

        {/* --- 6. FAIRNESS CALLOUT (new) --- */}
        <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white border border-slate-200 rounded-2xl px-10 py-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
                  <EyeOff className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-lg">Credential anonymisation, always on</div>
                  <div className="text-slate-500 text-sm mt-1">
                    NUS, NTU, SIT, SUTD, SUSS — employers see "Degree holder". Nothing else. The playing field is level by default.
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <Button
                  asChild
                  variant="outline"
                  className="h-10 px-6 rounded-md border-slate-200 text-slate-900 font-medium text-sm"
                >
                  <Link href="/sign-up">See how it works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* --- 7. BOTTOM CTA SECTION --- */}
        <section className="py-12 md:py-32">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-12 md:p-20 text-center flex flex-col items-center relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                  Ready to be seen for what you can do?
                </h2>
                <p className="text-slate-600 mb-10 max-w-xl text-lg md:text-xl">
                  Join the platform built for the capable. Your work speaks first. Your school name doesn't.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-700! text-white h-14 px-10 rounded-md font-semibold shadow-sm shadow-blue-600/20 transition-all text-base"
                  >
                    <Link href="/sign-up">Get Started for Free</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="h-14 px-10 rounded-md border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-medium text-base"
                  >
                    <Link href="/sign-up">Post a role</Link>
                  </Button>
                </div>
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