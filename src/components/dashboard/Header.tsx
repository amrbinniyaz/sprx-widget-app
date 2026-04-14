"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Plus } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Welcome back" },
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
    <header className="fixed top-0 right-0 left-[240px] h-16 bg-white/80 backdrop-blur-xl border-b border-zinc-200 z-30 flex items-center px-6 gap-4">
      <div className="flex-1">
        <h1 className="text-base font-semibold text-zinc-900 leading-none">{page.title}</h1>
        {page.subtitle && (
          <p className="text-xs text-zinc-400 mt-0.5">
            {page.subtitle}{user?.firstName ? `, ${user.firstName}` : ""}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 border border-zinc-200 w-56 cursor-text hover:border-zinc-300 transition-colors">
        <Search size={13} className="text-zinc-400" />
        <span className="text-xs text-zinc-400">Search...</span>
        <kbd className="ml-auto text-[9px] text-zinc-400 bg-white border border-zinc-200 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-xl hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-coral" />
        </button>

        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-purple hover:bg-purple-700 text-white text-xs font-medium transition-all hover:shadow-md">
          <Plus size={13} />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>
    </header>
  );
}
