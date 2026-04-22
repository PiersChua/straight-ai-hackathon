"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();
  const handleSignOut = async () => {
    const res = await fetch("/api/sign-out", { method: "POST" });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-slate-100">
      <div className="text-2xl font-bold tracking-tighter text-indigo-600">
        Aptly
      </div>
      <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
        <a href="#how-it-works" className="hover:text-indigo-600 transition">
          How it Works
        </a>
        <a href="#candidates" className="hover:text-indigo-600 transition">
          For Candidates
        </a>
        <a href="#employers" className="hover:text-indigo-600 transition">
          For Hirers
        </a>
      </div>
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" className="text-sm">
          {isLoggedIn ? (
            <span onClick={handleSignOut}>Sign out</span>
          ) : (
            <Link href="/login">Log in</Link>
          )}
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-sm">
          Join Waitlist
        </Button>
      </div>
    </nav>
  );
};

export default Header;
