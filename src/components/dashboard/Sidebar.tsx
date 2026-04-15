"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { LayoutDashboard, Radio, BookOpen, Puzzle, BarChart3, Settings, LogOut, Zap, ChevronRight } from "lucide-react";
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
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-teal-50 border border-white/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
             <Zap size={40} className="text-purple-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[13px] font-bold text-zinc-800">{user?.plan || "Growth"} Plan</span>
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden mb-2">
              <div className="h-full w-[62%] bg-gradient-to-r from-purple-500 to-teal-400 rounded-full" />
            </div>
            <p className="text-[10px] text-zinc-500 font-medium pb-2">5 / 8 modules active</p>
          </div>
        </div>

        {/* User Account */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/60 cursor-pointer transition-all border border-transparent hover:border-white/40 hover:shadow-sm" onClick={handleLogout}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center shadow-inner">
             <span className="text-white text-[13px] font-bold">{user?.firstName?.[0] || "U"}</span>
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
