"use client";

import { mockChannels, mockStories, mockWidgets, mockMetrics, mockActivity } from "@/lib/mock-data";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Radio, BookOpen, Puzzle, TrendingUp, RefreshCw, Code2, Link2, Plus, LayoutGrid, ArrowRight, Zap } from "lucide-react";
import { Icon } from "@iconify/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Label } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const activityIcons: Record<string, React.ElementType> = {
  refresh: RefreshCw,
  code: Code2,
  link: Link2,
  plus: Plus,
  layout: LayoutGrid,
};

const statCards = [
  { label: "Active Stories",     value: mockStories.filter(s => s.status === "active").length, iconId: "solar:document-text-bold-duotone", color: "text-purple-600", bg: "bg-purple-50",  href: "/dashboard/stories",  delta: "+12%",  deltaUp: true,  comparison: `vs. ${mockStories.filter(s => s.status === "active").length - 2} last month` },
  { label: "Active Widgets",     value: mockWidgets.length,  iconId: "solar:widget-bold-duotone",         color: "text-teal-600",   bg: "bg-teal-50",    href: "/dashboard/widgets",  delta: "+8.4%", deltaUp: true,  comparison: `vs. ${mockWidgets.length - 1} last month` },
  { label: "Connected Channels", value: mockChannels.length, iconId: "solar:antenna-bold-duotone",        color: "text-amber-600",  bg: "bg-amber-50",   href: "/dashboard/channels", delta: "0%",    deltaUp: true,  comparison: "all syncing now" },
  { label: "Posts Synced",       value: "1,847",             iconId: "solar:graph-up-bold-duotone",       color: "text-rose-600",   bg: "bg-rose-50",    href: "/dashboard/data",     delta: "+7.2%", deltaUp: true,  comparison: "vs. 1,724 last period" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome banner */}
      <Card className="relative rounded-[24px] overflow-hidden p-8 border-white/80 bg-gradient-to-r from-purple-100/60 via-white/80 to-teal-100/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
        <div className="relative flex items-center justify-between z-10 w-full">
          <div>
            <p className="text-[13px] font-bold tracking-wider text-purple-600/80 mb-2 uppercase">Welcome Back</p>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">{user?.name} 👋</h2>
            <p className="text-[14px] font-medium text-zinc-500 mt-2">{user?.school} · <span className="text-purple-600">{user?.plan} Plan</span></p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard/stories" className={buttonVariants({ variant: "outline" })}>
              <BookOpen size={16} /> New Story
            </Link>
            <Link href="/dashboard/widgets" className={buttonVariants()}>
              <Plus size={16} /> New Widget
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Zap size={120} className="text-purple-600" />
        </div>
      </Card>

      {/* Performance + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story Score */}
        {(() => {
          const score = mockMetrics.storyScore;
          const delta = mockMetrics.storyScoreDelta;

          const chartData = [
            { name: "Story Rate",      value: 20, fill: "#7c3aed" },
            { name: "Hashtag in Bio",  value: 3,  fill: "#e11d48" },
            { name: "Engagement Rate", value: 16, fill: "#f97316" },
            { name: "Hashtag Rate",    value: 26, fill: "#d97706" },
            { name: "Values Rate",     value: 35, fill: "#a78bfa" },
          ];

          const chartConfig: ChartConfig = {
            "Story Rate":      { label: "Story Rate",      color: "#7c3aed" },
            "Hashtag in Bio":  { label: "Hashtag in Bio",  color: "#e11d48" },
            "Engagement Rate": { label: "Engagement Rate", color: "#f97316" },
            "Hashtag Rate":    { label: "Hashtag Rate",    color: "#d97706" },
            "Values Rate":     { label: "Values Rate",     color: "#a78bfa" },
          };

          return (
            <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[14px] font-bold text-zinc-900">SprX StoryScore™</CardTitle>
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                    ▲ +{delta} pts
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px]">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={85} strokeWidth={3}>
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold" style={{ fontSize: 28, fontWeight: 700 }}>
                                  {score}
                                </tspan>
                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 22} style={{ fontSize: 11, fill: "#a1a1aa" }}>
                                  out of 100
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                  {chartData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
                      <span className="text-[11px] text-zinc-500 truncate">{d.name}</span>
                      <span className="text-[11px] font-bold text-zinc-700 ml-auto">{d.value}%</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100">
                  <span className="text-[11px] font-bold text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-3 py-1">
                    Top 8% of all SprX schools
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Platform Breakdown */}
        <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] p-8 border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0 border">
          <CardHeader className="p-0 mb-6 border-0">
            <CardTitle className="font-bold text-zinc-900 text-[14px]">Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {[
                { name: "Instagram",  value: "227,459", percentage: "43%", iconId: "logos:instagram-icon" },
                { name: "LinkedIn",   value: "142,823", percentage: "27%", iconId: "logos:linkedin-icon" },
                { name: "YouTube",    value: "89,935",  percentage: "11%", iconId: "logos:youtube-icon" },
                { name: "X (Twitter)",value: "37,028",  percentage: "7%",  iconId: "logos:x" },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between py-3.5 px-2 -mx-2 rounded-xl hover:bg-zinc-50/80 transition-colors cursor-pointer group border-b border-zinc-100 last:border-0">
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                      <Icon icon={p.iconId} width={24} height={24} />
                    </div>
                    <span className="text-[14px] font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-bold text-zinc-900">{p.value}</span>
                    <span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-lg min-w-[36px] text-center">{p.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Link href="/dashboard/data" className="inline-flex items-center gap-1.5 font-bold text-purple-600 hover:text-purple-800 transition-colors text-[12px] hover:underline underline-offset-4">
                View deep analytics <ArrowRight size={12} strokeWidth={3} />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] p-8 border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0 border">
          <CardHeader className="p-0 mb-6 border-0 text-left">
             <CardTitle className="font-bold text-zinc-900 text-[14px]">Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-5">
            {mockActivity.map((item) => {
              const Icon = activityIcons[item.icon] || Zap;
              return (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-9 h-9 rounded-[10px] bg-white border border-zinc-100 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-purple-200 group-hover:text-purple-600 transition-colors">
                    <Icon size={14} className="text-zinc-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-zinc-800 tracking-tight">{item.action}</p>
                    <p className="text-[11px] font-medium text-zinc-500 leading-relaxed mt-0.5">{item.detail}</p>
                    <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
            <Link key={card.label} href={card.href} className="group">
              <Card className="h-full bg-white rounded-2xl p-5 border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all ring-0 flex flex-col gap-3">
                {/* Top row: label + icon */}
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-zinc-500">{card.label}</p>
                  <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <Icon icon={card.iconId} width={18} height={18} className={card.color} />
                  </div>
                </div>
                {/* Value + delta inline */}
                <div className="flex items-center gap-2.5">
                  <p className="text-[28px] font-bold text-zinc-900 leading-none">{card.value}</p>
                  <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${card.deltaUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                    {card.deltaUp ? "▲" : "▼"} {card.delta}
                  </span>
                </div>
                {/* Comparison */}
                <p className="text-[12px] text-zinc-400">{card.comparison}</p>
              </Card>
            </Link>
        ))}
      </div>

      {/* Quick access */}
      <div>
        <h3 className="text-[13px] font-bold text-zinc-500 mb-4 ml-1 uppercase tracking-wider">Workspace Quick Jump</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { href: "/dashboard/channels", icon: Radio, label: "Channels", desc: `${mockChannels.length} connected sources`, color: "text-amber-600", bg: "bg-amber-50" },
            { href: "/dashboard/stories", icon: BookOpen, label: "Stories", desc: `${mockStories.length} curated flows`, color: "text-purple-600", bg: "bg-purple-50" },
            { href: "/dashboard/widgets", icon: Puzzle, label: "Widgets", desc: `${mockWidgets.length} active embeds`, color: "text-teal-600", bg: "bg-teal-50" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group">
                <Card className="bg-white/60 backdrop-blur-xl rounded-[20px] p-5 border-white/60 hover:border-purple-200 hover:shadow-[0_8px_30px_rgb(147,51,234,0.08)] transition-all flex items-center gap-4 ring-0 flex-row">
                  <div className={`w-12 h-12 rounded-[14px] ${item.bg} flex items-center justify-center border border-white shadow-sm`}>
                    <Icon size={20} className={item.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-zinc-900">{item.label}</p>
                    <p className="text-[12px] font-medium text-zinc-500">{item.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-600 group-hover:text-white transition-all">
                    <ArrowRight size={14} className="text-zinc-300 group-hover:text-white transition-colors" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
