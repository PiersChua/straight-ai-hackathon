import SignUpForm from "@/components/Form/SignUpForm";
import Link from "next/link";

const SignUp = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="mb-8 space-y-1">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
            Get Started
          </p>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-zinc-500 pt-1">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-zinc-200 hover:text-white underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-400 font-medium transition-all"
            >
              Login
            </Link>
          </p>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
};

export default SignUp;
