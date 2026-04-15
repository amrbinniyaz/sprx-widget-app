"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "" },
  "/dashboard/channels": { title: "Channels", subtitle: "Manage your connected social accounts" },
  "/dashboard/stories": { title: "Stories", subtitle: "Curate and manage your content stories" },
  "/dashboard/widgets": { title: "Widgets", subtitle: "Build and embed widgets on any website" },
  "/dashboard/data": { title: "Analytics", subtitle: "Track your performance with SprXdata™" },
  "/dashboard/settings": { title: "Settings", subtitle: "Manage your account and preferences" },
};

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const page = pageTitles[pathname] || { title: "SprX™", subtitle: "" };

  return (
    <header className="fixed top-6 right-6 left-[295px] h-[72px] bg-white/60 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-[24px] z-30 flex items-center px-8 gap-4 transition-all">
      <div className="flex-1">
        <h1 className="text-[17px] font-bold text-zinc-900 leading-tight tracking-tight">{page.title}</h1>
        {page.subtitle && (
          <p className="text-[12px] text-zinc-500 mt-0.5 font-medium">
            {page.subtitle}{user?.firstName ? `, ${user.firstName}` : ""}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-row items-center gap-2.5 px-4 py-2.5 rounded-[14px] bg-white/50 border border-white hover:bg-white transition-colors w-64 shadow-sm cursor-text group">
        <Search size={14} className="text-zinc-400 group-hover:text-purple-500 transition-colors" />
        <span className="text-[13px] text-zinc-400 font-medium">Search anything...</span>
        <kbd className="ml-auto text-[10px] text-zinc-400 bg-white shadow-sm border border-zinc-100 px-1.5 py-0.5 rounded-md font-mono font-bold">⌘K</kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pl-2 border-l border-zinc-200/50">
        <button className="relative w-10 h-10 flex items-center justify-center rounded-[14px] bg-white/50 border border-white hover:bg-white hover:shadow-sm transition-all text-zinc-400 hover:text-zinc-600 group">
          <Bell size={16} className="group-hover:text-purple-600 transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>

      </div>
    </header>
  );
}
