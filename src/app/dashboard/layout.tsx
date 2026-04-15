"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
          <p className="text-sm text-zinc-400">Loading SprX™...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFC] relative overflow-hidden flex">
      {/* Background Blobs (shared from Onboarding vibe) */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob pointer-events-none z-0" />
      <div className="fixed top-[20%] right-[-10%] w-[35%] h-[35%] bg-teal-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000 pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000 pointer-events-none z-0" />

      {/* Main Dashboard UI layer */}
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-[280px]">
          <Header />
          <main className="flex-1 w-full p-8 pt-[120px] min-h-screen">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
