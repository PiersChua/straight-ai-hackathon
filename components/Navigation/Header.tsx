"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Header = ({
  isLoggedIn,
  role,
}: {
  isLoggedIn: boolean;
  role: string;
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const res = await fetch("/api/sign-out", { method: "POST" });
    if (res.ok) {
      router.refresh();
    }
  };

  // Matched exactly to the sections in your landing page
  const navLinks = [
    { name: "Paradigm", href: "#paradigm" },
    { name: "Pipeline", href: "#pipeline" },
    { name: "Benefits", href: "#benefits" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100/80">
      <nav className="flex items-center justify-between px-6 py-3 w-full max-w-7xl mx-auto h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-slate-900 flex items-center gap-1 transition-opacity"
        >
          Aptly.
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500 hover:text-blue-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            {!isLoggedIn ? (
              <Button
                onClick={() => router.push("/sign-up")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold h-9 px-5 rounded-md shadow-lg shadow-blue-600/10 transition-all"
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
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold h-9 px-5 rounded-md transition-all"
              >
                Dashboard
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="flex flex-col space-y-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-[13px] font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="h-px bg-slate-100 w-full" />
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                onClick={
                  isLoggedIn ? handleSignOut : () => router.push("/login")
                }
                className="w-full justify-center h-11 font-semibold text-slate-700"
              >
                {isLoggedIn ? "Sign out" : "Log in"}
              </Button>
              <Button
                onClick={() => {
                  setIsMenuOpen(false);
                  isLoggedIn
                    ? router.push(
                        `/dashboard${role === "CANDIDATE" ? "/candidate" : "/hirer"}/postings`,
                      )
                    : router.push("/sign-up");
                }}
                className="w-full justify-center h-11 bg-blue-600 font-semibold"
              >
                {isLoggedIn ? "Dashboard" : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
