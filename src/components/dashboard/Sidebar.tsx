"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { LayoutDashboard, Radio, BookOpen, Puzzle, BarChart3, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Channels", href: "/dashboard/channels", icon: Radio },
  { label: "Stories", href: "/dashboard/stories", icon: BookOpen },
  { label: "Widgets", href: "/dashboard/widgets", icon: Puzzle },
  { label: "Data", href: "/dashboard/data", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-[250px] flex flex-col bg-white/60 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 z-40 rounded-[24px] overflow-hidden">
      {/* Logo */}
      <div className="px-6 py-8">
        <Link href="/dashboard">
          <Image src="/SprXstories-Logo.png" alt="SprX Stories" width={150} height={50} className="h-9 w-auto" priority />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-[14px] text-[13px] font-semibold transition-all duration-300 group relative overflow-hidden ${
                active
                  ? "bg-purple-600/10 text-purple-700 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-white/60"
              }`}
            >
              {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r-md" />}
              <Icon size={16} className={active ? "text-purple-600" : "text-zinc-400 group-hover:text-zinc-600 transition-colors"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Header */}
      <div className="p-4 space-y-3">
        {/* Plan badge */}
        <div className="px-3 py-3 rounded-2xl bg-white/60 border border-white/60 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[12px] font-semibold text-zinc-800">{user?.plan || "Growth"} Plan</span>
            <span className="text-[10px] font-medium text-zinc-400">5 / 8</span>
          </div>
          <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full w-[62%] bg-zinc-900 rounded-full" />
          </div>
          <p className="text-[10px] text-zinc-400 font-medium mt-2">modules active</p>
        </div>

        {/* User Account */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/60 cursor-pointer transition-all border border-transparent hover:border-white/40 hover:shadow-sm" onClick={handleLogout}>
          <div className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(user?.name ?? "User")}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
              alt={user?.name ?? "Avatar"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-zinc-800 truncate">{user?.name || "User"}</p>
            <p className="text-[10px] text-zinc-500 truncate">{user?.school}</p>
          </div>
          <LogOut size={14} className="text-zinc-400" />
        </div>
      </div>
    </aside>
  );
}
