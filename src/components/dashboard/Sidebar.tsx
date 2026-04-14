"use client";

import Link from "next/link";
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
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] flex flex-col bg-sidebar border-r border-sidebar-border z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            Spr<span className="text-gradient">X</span>
            <sup className="text-[10px] text-zinc-400 ml-0.5">TM</sup>
          </span>
        </Link>
        {user && (
          <div className="mt-3 px-3 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200">
            <p className="text-xs font-semibold text-zinc-800 truncate">{user.school}</p>
            <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? "bg-purple-50 text-purple-700 border border-purple-100"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <Icon size={16} className={active ? "text-brand-purple" : "text-zinc-400 group-hover:text-zinc-600"} />
              {item.label}
              {active && <ChevronRight size={12} className="ml-auto text-purple-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2">
        {/* Plan badge */}
        <div className="mx-1 p-3 rounded-xl bg-purple-50 border border-purple-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={12} className="text-brand-purple" />
            <span className="text-xs font-semibold text-purple-700">{user?.plan || "Growth"} Plan</span>
          </div>
          <p className="text-[10px] text-zinc-400 mb-2">5 / 8 modules active</p>
          <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full w-[62%] bg-gradient-to-r from-brand-purple to-brand-teal rounded-full" />
          </div>
          <button className="mt-2 text-[10px] text-brand-purple hover:text-purple-700 transition-colors font-medium">Upgrade plan →</button>
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-zinc-100 transition-colors group cursor-pointer" onClick={handleLogout}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.firstName?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-700 truncate">{user?.name || "User"}</p>
            <p className="text-[10px] text-zinc-400 truncate">{user?.role}</p>
          </div>
          <LogOut size={13} className="text-zinc-400 group-hover:text-zinc-600 flex-shrink-0 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
