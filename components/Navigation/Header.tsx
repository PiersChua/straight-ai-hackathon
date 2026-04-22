"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = ({
  isLoggedIn,
  role,
}: {
  isLoggedIn: boolean;
  role: string;
}) => {
  const router = useRouter();

  const handleSignOut = async () => {
    const res = await fetch("/api/sign-out", { method: "POST" });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <nav className="flex items-center justify-between px-6 py-4 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          Aptly.
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-500">
          <a
            href="#how-it-works"
            className="hover:text-slate-900 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#candidates"
            className="hover:text-slate-900 transition-colors"
          >
            For Candidates
          </a>
          <a
            href="#employers"
            className="hover:text-slate-900 transition-colors"
          >
            For Hirers
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            onClick={isLoggedIn ? handleSignOut : () => router.push("/login")}
            variant="ghost"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 h-9 px-4 transition-colors"
          >
            {isLoggedIn ? "Sign out" : "Sign in"}
          </Button>

          {!isLoggedIn ? (
            <Button
              onClick={() => router.push("/sign-up")}
              className="bg-blue-600 hover:bg-blue-600/90 text-white text-sm font-medium h-9 px-4 rounded-lg shadow-sm transition-all"
            >
              Get Started
            </Button>
          ) : (
            <Button
              onClick={() =>
                router.push(
                  `/dashboard${role === "CANDIDATE" ? "/candidate" : "/hirer"}/postings`,
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium h-9 px-4 rounded-lg shadow-sm transition-all"
            >
              Dashboard
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
