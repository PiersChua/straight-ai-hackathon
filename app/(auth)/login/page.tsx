import SignInForm from "@/components/Form/SignInForm";
import Link from "next/link";

const Login = () => {
  return (
    // Outer div with py-12
    <main className="min-h-screen bg-slate-50/50 py-12 flex flex-col items-center justify-center">
      {/* Inner element container with px-6 */}
      <section className="w-full max-w-md px-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm shadow-slate-200/40">
          <header className="mb-6 space-y-1">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              Sign in to account
            </h1>
            <p className="text-sm text-slate-500">Welcome back!</p>
          </header>

          <SignInForm />

          <footer className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don’t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline transition-all"
              >
                Create one
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default Login;
