"use client";

import { useState, useEffect, useRef } from "react";
import { mockChannels, mockStories, mockWidgets, mockMetrics, mockActivity } from "@/lib/mock-data";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { BookOpen, RefreshCw, Code2, Link2, Plus, LayoutGrid, ArrowRight, Zap } from "lucide-react";
import { Icon } from "@iconify/react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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
  {
    label: "Active Stories",
    value: mockStories.filter((s) => s.status === "active").length,
    icon: "solar:document-text-bold-duotone",
    href: "/dashboard/stories",
    delta: "+12%",
    deltaUp: true,
    prev: `${mockStories.filter((s) => s.status === "active").length - 2}`,
  },
  {
    label: "Active Widgets",
    value: mockWidgets.length,
    icon: "solar:widget-bold-duotone",
    href: "/dashboard/widgets",
    delta: "+8.4%",
    deltaUp: true,
    prev: `${mockWidgets.length - 1}`,
  },
  {
    label: "Connected Channels",
    value: mockChannels.length,
    icon: "solar:antenna-bold-duotone",
    href: "/dashboard/channels",
    delta: "0%",
    deltaUp: true,
    prev: "all syncing",
  },
  {
    label: "Posts Synced",
    value: 1847,
    icon: "solar:graph-up-bold-duotone",
    href: "/dashboard/data",
    delta: "+7.2%",
    deltaUp: true,
    prev: "1,724",
  },
];

// ── Skeleton primitive ─────────────────────────────────────────────────────────
function Skel({ className = "" }: { className?: string }) {
  return <div className={`bg-zinc-200/70 rounded animate-pulse ${className}`} />;
}

// ── Animated count-up ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900, enabled = true) {
  const [val, setVal] = useState(enabled ? 0 : target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setVal(target);
      return;
    }
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      setVal(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, enabled]);

  return val;
}

function CountUp({ value, enabled = true }: { value: number; enabled?: boolean }) {
  const v = useCountUp(value, 900, enabled);
  return <>{v.toLocaleString()}</>;
}

// ── Relative time helper ───────────────────────────────────────────────────────
function formatRelative(ms: number): string {
  const sec = Math.max(0, Math.floor(ms / 1000));
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // loading + freshness state
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(() => Date.now() - 120_000); // "2m ago" initial
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(tick);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastSynced(Date.now());
      setNow(Date.now());
      setLoading(false);
    }, 600);
  };

  const score = mockMetrics.storyScore;
  const scoreDelta = mockMetrics.storyScoreDelta;

  // Monochrome purple-family palette, dark → light matches rank order
  const scoreData = [
    { name: "Values Rate",     value: 35, fill: "#5b21b6" },
    { name: "Hashtag Rate",    value: 26, fill: "#7c3aed" },
    { name: "Story Rate",      value: 20, fill: "#a78bfa" },
    { name: "Engagement Rate", value: 16, fill: "#c4b5fd" },
    { name: "Hashtag in Bio",  value: 3,  fill: "#ddd6fe" },
  ];
  const scoreConfig: ChartConfig = Object.fromEntries(
    scoreData.map((d) => [d.name, { label: d.name, color: d.fill }])
  );

  return (
    <div className="space-y-6 animate-fade-in-up">

      {/* ── 1. GREETING BAR + SYNC PILL ─────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-zinc-900">
            {greeting}, {firstName}
          </h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            {user?.school} <span className="text-zinc-300 mx-1">·</span>
            <span className="text-purple-600 font-medium">{user?.plan} Plan</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sync pill */}
          <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur border border-zinc-200 rounded-full pl-2.5 pr-1 h-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-medium text-zinc-600">Live</span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] text-zinc-500 tabular-nums">synced {formatRelative(now - lastSynced)}</span>
            <button
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh"
              className="ml-0.5 w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/dashboard/stories" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <BookOpen size={14} /> New Story
            </Link>
            <Link href="/dashboard/widgets" className={buttonVariants({ size: "sm" })}>
              <Plus size={14} /> New Widget
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. HEADLINE INSIGHT ─────────────────────────────────────────── */}
      {loading ? (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgb(0,0,0,0.06)]">
          <div className="px-6 pt-5 pb-0"><Skel className="h-2.5 w-16" /></div>
          <div className="px-6 pt-4 pb-5 space-y-2.5">
            <Skel className="h-5 w-5/6" />
            <Skel className="h-5 w-3/4" />
          </div>
          <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50 flex gap-6">
            <Skel className="h-2.5 w-20" />
            <Skel className="h-2.5 w-24" />
            <Skel className="h-2.5 w-20" />
            <Skel className="h-2.5 w-24" />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgb(0,0,0,0.06)]">
          <div className="px-6 pt-5 pb-0">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em]">Headline</p>
          </div>
          <div className="px-6 pt-3 pb-4">
            <p className="text-[22px] font-bold text-zinc-900 leading-snug tracking-tight">
              Your StoryScore jumped{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold">+{scoreDelta} pts</span>
              {" "}this week — you&apos;re in the{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold">top 8%</span>
              {" "}of SprX schools.
            </p>
          </div>
          <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center flex-wrap gap-x-6 gap-y-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Score <span className="text-zinc-900 font-bold ml-1">{score}</span>
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Impressions <span className="text-zinc-900 font-bold ml-1">142.8K</span>
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Engagement <span className="text-zinc-900 font-bold ml-1">8.7%</span>
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Top platform <span className="text-zinc-900 font-bold ml-1">{mockMetrics.topPlatform}</span>
            </span>
          </div>
        </div>
      )}

      {/* ── 3. KPI STRIP ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) =>
          loading ? (
            <Card key={card.label} className="h-full bg-white/60 backdrop-blur-xl rounded-[20px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0 px-5 py-5">
              <div className="flex items-center gap-1.5 mb-3">
                <Skel className="h-3 w-3 rounded-full" />
                <Skel className="h-2.5 w-24" />
              </div>
              <div className="flex items-baseline gap-2">
                <Skel className="h-7 w-20" />
                <Skel className="h-3 w-12" />
              </div>
              <Skel className="h-2.5 w-16 mt-2" />
            </Card>
          ) : (
            <Link key={card.label} href={card.href} className="group">
              <Card className="h-full bg-white/60 backdrop-blur-xl rounded-[20px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-white hover:-translate-y-0.5 transition-all duration-200 ring-0 px-5 py-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <Icon icon={card.icon} width={13} height={13} className="text-zinc-400 flex-shrink-0" />
                  <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">{card.label}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-[28px] font-bold text-zinc-900 leading-none tracking-tight tabular-nums">
                    <CountUp value={card.value} />
                  </p>
                  <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums ${card.deltaUp ? "text-emerald-600" : "text-rose-600"}`}>
                    <Icon icon={card.deltaUp ? "solar:arrow-right-up-linear" : "solar:arrow-right-down-linear"} width={11} />
                    {card.delta}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 tabular-nums">from {card.prev}</p>
              </Card>
            </Link>
          )
        )}
      </div>

      {/* ── 4. MAIN INSIGHT ROW ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* StoryScore */}
        {loading ? (
          <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <Skel className="h-3.5 w-28" />
                  <Skel className="h-2.5 w-32" />
                </div>
                <Skel className="h-3 w-10" />
              </div>
            </CardHeader>
            <CardContent className="pb-5">
              <div className="mx-auto aspect-square max-h-[200px] flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-[14px] border-zinc-200/70 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                {Array.from({ length: 5 }).map((_, i) => <Skel key={i} className="h-2.5" />)}
                <Skel className="h-2.5" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-semibold text-zinc-900">SprX StoryScore™</CardTitle>
                  <CardDescription className="text-[11px] text-zinc-500 mt-0.5">Top 8% of SprX schools</CardDescription>
                </div>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
                  <Icon icon="solar:arrow-right-up-linear" width={11} />
                  +{scoreDelta} pts
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-5">
              <ChartContainer config={scoreConfig} className="mx-auto aspect-square max-h-[200px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={scoreData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={85} strokeWidth={3}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} style={{ fontSize: 28, fontWeight: 700, fill: "#09090b" }}>
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

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                {scoreData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
                    <span className="text-[11px] text-zinc-500 truncate">{d.name}</span>
                    <span className="text-[11px] font-bold text-zinc-700 ml-auto tabular-nums">{d.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Breakdown */}
        {loading ? (
          <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
            <CardHeader className="pb-2">
              <Skel className="h-3.5 w-32" />
              <Skel className="h-2.5 w-40 mt-1.5" />
            </CardHeader>
            <CardContent className="pb-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <Skel className="h-5 w-5 rounded-md" />
                    <Skel className="h-3 w-20" />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Skel className="h-3 w-14" />
                    <Skel className="h-4 w-8 rounded-md" />
                  </div>
                </div>
              ))}
              <Skel className="h-3 w-28 mt-4" />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-900">Platform Breakdown</CardTitle>
              <CardDescription className="text-[11px] text-zinc-500 mt-0.5">Impressions by source · last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="pb-5">
              <div className="space-y-0">
                {[
                  { name: "Instagram",   value: "227,459", percentage: "43%", iconId: "logos:instagram-icon" },
                  { name: "LinkedIn",    value: "142,823", percentage: "27%", iconId: "logos:linkedin-icon" },
                  { name: "YouTube",     value: "89,935",  percentage: "17%", iconId: "logos:youtube-icon" },
                  { name: "X (Twitter)", value: "37,028",  percentage: "7%",  iconId: "logos:x" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between py-3 rounded-xl hover:bg-zinc-50/80 transition-colors cursor-pointer group border-b border-zinc-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <Icon icon={p.iconId} width={20} height={20} className="flex-shrink-0" />
                      <span className="text-[13px] font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] font-bold text-zinc-900 tabular-nums">{p.value}</span>
                      <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded-md min-w-[32px] text-center tabular-nums">{p.percentage}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/dashboard/data" className="inline-flex items-center gap-1 font-semibold text-purple-600 hover:text-purple-800 transition-colors text-[12px]">
                  View deep analytics <ArrowRight size={12} strokeWidth={2.5} />
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Feed */}
        {loading ? (
          <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
            <CardHeader className="pb-2">
              <Skel className="h-3.5 w-24" />
              <Skel className="h-2.5 w-36 mt-1.5" />
            </CardHeader>
            <CardContent className="pb-5 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skel className="w-8 h-8 rounded-[10px]" />
                  <div className="flex-1 space-y-1.5">
                    <Skel className="h-3 w-3/4" />
                    <Skel className="h-2.5 w-5/6" />
                    <Skel className="h-2 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-900">Activity Feed</CardTitle>
              <CardDescription className="text-[11px] text-zinc-500 mt-0.5">Recent workspace events</CardDescription>
            </CardHeader>
            <CardContent className="pb-5 space-y-4">
              {mockActivity.slice(0, 5).map((item) => {
                const IconComp = activityIcons[item.icon] || Zap;
                return (
                  <div key={item.id} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-[10px] bg-white border border-zinc-100 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-purple-200 transition-colors">
                      <IconComp size={13} className="text-zinc-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-zinc-800 tracking-tight">{item.action}</p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">{item.detail}</p>
                      <p className="text-[10px] font-semibold text-zinc-400 mt-1 uppercase tracking-wider">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
