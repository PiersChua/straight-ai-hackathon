"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Role } from "@/generated/prisma/enums";

import {
  LayoutDashboard,
  User,
  Mic,
  BarChart3,
  Users,
  PlusCircle,
  Sparkles,
  LogOut,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppSidebar({ role }: { role: string | undefined }) {
  const router = useRouter();
  const handleSignOut = async () => {
    const res = await fetch("/api/sign-out", { method: "POST" });
    if (res.ok) {
      router.push("/");
    }
  };
  return (
    <Sidebar className="bg-white border-r border-slate-200">
      {/* Header */}
      <SidebarHeader>
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-slate-900">Aptly</p>
          <p className="text-xs text-slate-500">Merit-based talent platform</p>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <p className="px-2 mb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Workspace
          </p>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href={
                    role === "CANDIDATE"
                      ? "/dashboard/candidate/postings"
                      : "/dashboard/hirer/postings"
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Postings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {role === "CANDIDATE" && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/candidate/interviews">
                      <Mic className="w-4 h-4" />
                      Interviews
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>
        {role == "CANDIDATE" && (
          <SidebarGroup>
            <p className="px-2 mt-4 mb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              BETA
            </p>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/analytics">
                    <BarChart3 className="w-4 h-4" />
                    Post-Analysis
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-2 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/profile">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Log out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
