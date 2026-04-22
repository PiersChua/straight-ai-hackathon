import { Button } from "@/components/ui/button";
import {
  Mic,
  Target,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Building,
  User,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Navigation/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Home = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col items-center">
      <Header isLoggedIn={!!session} role={session?.user.role as string} />

      {/* Main Container constrained to max-w-7xl */}
      <main className="w-full max-w-7xl mx-auto flex flex-col px-6">
        {/* --- 1. HERO SECTION --- */}
        <section className="py-20 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            <span className="text-xs font-medium text-slate-600">
              A new standard for talent discovery
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 mb-6 max-w-4xl leading-[1.1]">
            Showcase what you can do. <br />
            <span className="text-slate-400">Leave pedigree behind.</span>
          </h1>

          <p className="text-lg text-slate-500 mb-10 max-w-2xl leading-relaxed">
            We connect talented individuals with forward-thinking employers
            using objective, AI-driven capability assessments. Get hired for
            your skills, not your network or school brand.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700! text-white h-11 px-8 rounded-lg font-medium transition-all"
            >
              <Link href="/sign-up">
                Join us now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-11 px-8 rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-all"
            >
              <Link href="/sign-up">Start hiring</Link>
            </Button>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* --- 2. THE PROBLEM & SOLUTION SECTION --- */}
        <section className="py-20 md:py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-blue-600">
                The Old Way is Broken
              </h2>
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                Access shouldn't depend on who you know.
              </h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                Traditional hiring filters out highly capable people simply
                because they lack insider connections or recognized university
                names. Aptly levels the playing field by putting a structured,
                unbiased evaluation step between discovery and the final
                interview.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 space-y-6">
              <h4 className="font-semibold text-slate-900">
                The Aptly Difference
              </h4>
              <ul className="space-y-4">
                {[
                  "Skills are evaluated before resumes are seen.",
                  "Human bias is removed from the initial screening.",
                  "Opportunities are awarded based on demonstrated potential.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* --- 3. HOW IT WORKS SECTION --- */}
        <section className="py-20 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-blue-600">
              How it Works
            </h2>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
              The Capability Pipeline
            </h3>
            <p className="text-slate-500 text-lg">
              A transparent, four-step process designed to highlight real
              talent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
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
                desc: "Employers review top-scoring candidates securely and without bias.",
              },
            ].map((step, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900">
                  {step.title}
                </h4>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* --- 4. AUDIENCE BENEFITS SECTION --- */}
        <section className="py-20 md:py-24">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Candidates */}
            <div className="bg-white border border-slate-200 rounded-3xl p-10 md:p-12 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-8">
                <User className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                For Candidates
              </h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Stop throwing resumes into the void. Prove your worth directly
                through interactive assessments and get matched with startups
                and companies that value what you can actually build.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="text-slate-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{" "}
                  Bypass keyword filters
                </li>
                <li className="text-slate-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{" "}
                  Get detailed feedback scores
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
              >
                Create your profile <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Employers */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 md:p-12 text-white">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-8">
                <Building className="h-5 w-5 text-slate-300" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">For Hirers</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Save countless hours screening identical resumes. Input your
                requirements, and let our AI engine conduct preliminary voice
                interviews to surface the most capable candidates.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{" "}
                  Custom automated interviews
                </li>
                <li className="text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{" "}
                  Granular suitability metrics
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="text-blue-400 font-medium hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
              >
                Start headhunting <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* --- 5. BOTTOM CTA SECTION --- */}
        <section className="py-20 md:py-24 mb-12">
          <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-12 md:p-20 text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-6">
              Ready to change how you connect?
            </h2>
            <p className="text-slate-600 mb-10 max-w-xl text-lg">
              Whether you are an undergraduate looking for your big break or an
              employer searching for hidden talent, Aptly is built for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button className="bg-blue-600 hover:bg-blue-600/90 text-white h-12 px-8 rounded-lg font-medium shadow-sm transition-all">
                Get Started for Free
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-slate-100 bg-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Aptly.
          </span>
          <p className="text-sm text-slate-400">
            © 2026 Aptly. Built for the capable.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
