"use client";

import { mockChannels, mockStories, mockWidgets, mockMetrics, mockActivity } from "@/lib/mock-data";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { ArrowUpRight, Radio, BookOpen, Puzzle, TrendingUp, RefreshCw, Code2, Link2, Plus, LayoutGrid, ArrowRight, Zap } from "lucide-react";

const activityIcons: Record<string, React.ElementType> = {
  refresh: RefreshCw,
  code: Code2,
  link: Link2,
  plus: Plus,
  layout: LayoutGrid,
};

const statCards = [
  { label: "Active Stories", value: mockStories.filter(s => s.status === "active").length, suffix: "", icon: BookOpen, color: "text-brand-purple", bg: "bg-purple-50", href: "/dashboard/stories", delta: "+2 this week" },
  { label: "Active Widgets", value: mockWidgets.length, suffix: "", icon: Puzzle, color: "text-teal-600", bg: "bg-teal-50", href: "/dashboard/widgets", delta: "+1 this week" },
  { label: "Connected Channels", value: mockChannels.length, suffix: "", icon: Radio, color: "text-amber-600", bg: "bg-amber-50", href: "/dashboard/channels", delta: "All syncing" },
  { label: "Posts Synced", value: "1,847", suffix: "", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50", href: "/dashboard/data", delta: "+124 today" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-teal-50">
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 mb-1">Good morning</p>
            <h2 className="text-xl font-bold text-zinc-900">{user?.name} 👋</h2>
            <p className="text-sm text-zinc-500 mt-1">{user?.school} · {user?.plan} Plan</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard/widgets" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple hover:bg-purple-700 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md">
              <Plus size={14} /> New Widget
            </Link>
            <Link href="/dashboard/stories" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 text-sm font-medium transition-all border border-zinc-200">
              <BookOpen size={14} /> New Story
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group bg-white rounded-2xl p-5 border border-zinc-200 hover:border-zinc-300 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon size={16} className={card.color} />
                </div>
                <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-zinc-900 mb-0.5">{card.value}</p>
              <p className="text-xs text-zinc-500 mb-1">{card.label}</p>
              <p className="text-[11px] text-teal-600">{card.delta}</p>
            </Link>
          );
        })}
      </div>

      {/* Performance + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story Score */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-zinc-900 text-sm">SprX StoryScore™</h3>
            <span className="text-xs text-teal-600">+{mockMetrics.storyScoreDelta} pts</span>
          </div>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-bold text-gradient">{mockMetrics.storyScore}</span>
            <span className="text-zinc-400 text-sm mb-1">/ 100</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-purple to-teal-500 transition-all duration-1000"
              style={{ width: `${mockMetrics.storyScore}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">Your school ranks in the <span className="text-teal-600 font-medium">top 8%</span> of SprX schools.</p>
        </div>

        {/* Metrics */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-zinc-900 text-sm">This month</h3>
          {[
            { label: "Total Impressions", value: mockMetrics.impressions.toLocaleString(), delta: `+${mockMetrics.impressionsDelta}%`, color: "text-brand-purple" },
            { label: "Avg. Engagement", value: `${mockMetrics.engagement}%`, delta: `+${mockMetrics.engagementDelta}%`, color: "text-teal-600" },
            { label: "Top Platform", value: mockMetrics.topPlatform, delta: "", color: "text-amber-600" },
          ].map((m) => (
            <div key={m.label} className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
              <span className="text-xs text-zinc-500">{m.label}</span>
              <div className="text-right">
                <span className={`text-sm font-semibold ${m.color}`}>{m.value}</span>
                {m.delta && <span className="text-[10px] text-teal-600 ml-2">{m.delta}</span>}
              </div>
            </div>
          ))}
          <Link href="/dashboard/data" className="flex items-center gap-1 text-xs text-brand-purple hover:text-purple-700 transition-colors mt-1">
            View full analytics <ArrowRight size={11} />
          </Link>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
          <h3 className="font-semibold text-zinc-900 text-sm mb-5">Recent activity</h3>
          <div className="space-y-4">
            {mockActivity.map((item) => {
              const Icon = activityIcons[item.icon] || Zap;
              return (
                <div key={item.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={12} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-800">{item.action}</p>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">{item.detail}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-500 mb-3">Quick access</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { href: "/dashboard/channels", icon: Radio, label: "Channels", desc: `${mockChannels.length} connected`, color: "text-amber-600" },
            { href: "/dashboard/stories", icon: BookOpen, label: "Stories", desc: `${mockStories.length} stories`, color: "text-brand-purple" },
            { href: "/dashboard/widgets", icon: Puzzle, label: "Widgets", desc: `${mockWidgets.length} widgets`, color: "text-teal-600" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group bg-white rounded-xl p-4 border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all flex items-center gap-3">
                <Icon size={18} className={item.color} />
                <div>
                  <p className="text-sm font-medium text-zinc-800">{item.label}</p>
                  <p className="text-xs text-zinc-400">{item.desc}</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-zinc-300 group-hover:text-zinc-500 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
