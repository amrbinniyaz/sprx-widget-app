"use client";

import { mockStories } from "@/lib/mock-data";
import { Icon } from "@iconify/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import {
  LineChart, Line,
  PieChart, Pie, Label,
  XAxis, YAxis,
  CartesianGrid,
} from "recharts";

// ── Mock data ─────────────────────────────────────────────────────────────────

const weeklyTrendData = [
  { week: "Jan W1", impressions: 28400, ctr: 2.8 },
  { week: "Jan W2", impressions: 31200, ctr: 3.1 },
  { week: "Jan W3", impressions: 29800, ctr: 2.9 },
  { week: "Jan W4", impressions: 34100, ctr: 3.4 },
  { week: "Feb W1", impressions: 36800, ctr: 3.2 },
  { week: "Feb W2", impressions: 38200, ctr: 3.6 },
  { week: "Feb W3", impressions: 35600, ctr: 3.3 },
  { week: "Feb W4", impressions: 41000, ctr: 3.8 },
  { week: "Mar W1", impressions: 39400, ctr: 3.5 },
  { week: "Mar W2", impressions: 43800, ctr: 4.0 },
  { week: "Mar W3", impressions: 42100, ctr: 3.9 },
  { week: "Mar W4", impressions: 47200, ctr: 4.2 },
];

const platformFrequencyData = [
  { platform: "Instagram",   posts: 67,  fill: "#e1306c" },
  { platform: "Facebook",    posts: 48,  fill: "#1877f2" },
  { platform: "X (Twitter)", posts: 112, fill: "#14171a" },
  { platform: "LinkedIn",    posts: 29,  fill: "#0a66c2" },
  { platform: "YouTube",     posts: 11,  fill: "#ff0000" },
  { platform: "TikTok",      posts: 8,   fill: "#fe2c55" },
];

const storyAnalytics: Record<string, { impressions: number; engagement: number; ctr: number; reach: number; score: number }> = {
  st_1: { impressions: 48200, engagement: 9.2, ctr: 3.8, reach: 34100, score: 94 },
  st_2: { impressions: 32400, engagement: 7.8, ctr: 3.1, reach: 24800, score: 88 },
  st_3: { impressions: 21800, engagement: 6.4, ctr: 2.6, reach: 17200, score: 82 },
  st_4: { impressions: 18900, engagement: 8.1, ctr: 4.2, reach: 14300, score: 79 },
  st_5: { impressions:  9400, engagement: 5.2, ctr: 1.9, reach:  7800, score: 71 },
};

const topHashtags = [
  { tag: "#SprXInspires",    usages: 47, delta: +20,   up: true,  fill: "#7c3aed" },
  { tag: "#CampusLife",      usages: 38, delta: +12,   up: true,  fill: "#9333ea" },
  { tag: "#MorningMoments",  usages: 29, delta: -8,    up: false, fill: "#a855f7" },
  { tag: "#SprXCommunity",   usages: 21, delta: 0,     up: true,  fill: "#c084fc" },
  { tag: "#SchoolPride",     usages: 14, delta: -16.7, up: false, fill: "#ddd6fe" },
];

const hashtagChartData = topHashtags.map(h => ({ name: h.tag, value: h.usages, fill: h.fill }));
const hashtagConfig: ChartConfig = Object.fromEntries(
  topHashtags.map(h => [h.tag, { label: h.tag, color: h.fill }])
);

const topCollections = [
  { name: "Inspirational",  usages: 34, delta: +18,   up: true,  color: "#7c3aed" },
  { name: "Community",      usages: 28, delta: +5,    up: true,  color: "#0d9488" },
  { name: "Academic",       usages: 19, delta: -12,   up: false, color: "#6366f1" },
  { name: "Staff Stories",  usages: 15, delta: 0,     up: true,  color: "#f59e0b" },
  { name: "Events",         usages: 11, delta: -22,   up: false, color: "#e11d48" },
];

const channelIconMap: Record<string, string> = {
  "Instagram":   "logos:instagram-icon",
  "LinkedIn":    "logos:linkedin-icon",
  "YouTube":     "logos:youtube-icon",
  "X (Twitter)": "logos:x",
  "Facebook":    "logos:facebook",
  "TikTok":      "logos:tiktok-icon",
};

// ── Chart configs ─────────────────────────────────────────────────────────────

const dualLineConfig: ChartConfig = {
  impressions: { label: "Impressions", color: "#7c3aed" },
  ctr:         { label: "CTR (%)",     color: "#f59e0b" },
};


// ── KPI data ──────────────────────────────────────────────────────────────────

const kpis = [
  {
    label: "Total Impressions",
    value: "142,800",
    delta: "+12.4%",
    up: true,
    comparison: "vs. 127,000 last period",
    iconId: "solar:eye-bold-duotone",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Engagement Rate",
    value: "8.7%",
    delta: "+2.1 pts",
    up: true,
    comparison: "vs. 6.6% last period",
    iconId: "solar:heart-angle-bold-duotone",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    label: "Follower Growth",
    value: "+1,240",
    delta: "+6.8%",
    up: true,
    comparison: "net new followers",
    iconId: "solar:user-plus-bold-duotone",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    label: "Posts Published",
    value: "47",
    delta: "+3",
    up: true,
    comparison: "vs. 44 last period",
    iconId: "solar:calendar-bold-duotone",
    color: "text-zinc-600",
    bg: "bg-zinc-100",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DataPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">

      {/* ── REPORT HEADER ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-0.5">This month</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400">auto-generated</span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] text-zinc-400">every Monday</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
            <Icon icon="solar:chart-bold-duotone" width={13} className="opacity-70" />
            <span>10M</span>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 border border-zinc-200 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-50 transition-colors">
            <Icon icon="solar:share-bold-duotone" width={13} />
            Share report
          </button>
        </div>
      </div>

      {/* ── AI HEADLINE CARD ──────────────────────────────────────────────── */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgb(0,0,0,0.06)]">
        {/* label row */}
        <div className="px-6 pt-5 pb-0">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em]">Headline</p>
        </div>
        {/* headline text */}
        <div className="px-6 pt-3 pb-4">
          <p className="text-[22px] font-bold text-zinc-900 leading-snug tracking-tight">
            Your reach is up{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold" style={{ fontFamily: "inherit" }}>
              18%
            </span>
            {" "}— driven by{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold" style={{ fontFamily: "inherit" }}>
              School Events
            </span>
            {" "}on Instagram.
          </p>
        </div>
        {/* stats strip */}
        <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center gap-6">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Story Score <span className="text-zinc-900 font-bold ml-1">7.8</span>
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Engagement <span className="text-zinc-900 font-bold ml-1">4.2%</span>
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Impressions <span className="text-zinc-900 font-bold ml-1">284K</span>
          </span>
        </div>
      </div>

      {/* ── DATE RANGE + KPI STRIP ────────────────────────────────────────── */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-xl p-1">
          {["7 days", "30 days", "90 days"].map((r) => (
            <button
              key={r}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                r === "30 days" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="relative bg-white/60 backdrop-blur-xl rounded-[20px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5">
            <span
              className={`absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                kpi.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              }`}
            >
              {kpi.up ? "▲" : "▼"} {kpi.delta}
            </span>
            <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
              <Icon icon={kpi.iconId} width={16} height={16} className={kpi.color} />
            </div>
            <p className="text-3xl font-bold text-zinc-900 mt-3 leading-none">{kpi.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{kpi.label}</p>
            <p className="text-[11px] text-zinc-400 mt-1">{kpi.comparison}</p>
          </div>
        ))}
      </div>

      {/* ── CHART ROW 2:1 ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart 1 — Dual-axis line: Impressions + CTR */}
        <Card className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-900">Impressions &amp; Click-Through Rate</CardTitle>
            <CardDescription className="text-xs text-zinc-400">12-week trend — volume vs. conversion efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={dualLineConfig} className="h-[240px] w-full">
              <LineChart data={weeklyTrendData} margin={{ top: 4, right: 40, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f4f4f5" />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10, fill: "#a1a1aa" }}
                  interval={2}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={36}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  tickFormatter={(v) => `${v}%`}
                  width={36}
                  domain={[2, 5]}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="impressions"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: "#7c3aed" }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ctr"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={false}
                  activeDot={{ r: 4, fill: "#f59e0b" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="pt-0 flex items-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 rounded bg-[#7c3aed] inline-block" /> Impressions (k)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 rounded bg-[#f59e0b] inline-block" style={{ backgroundImage: "repeating-linear-gradient(90deg, #f59e0b 0 5px, transparent 5px 8px)" }} /> CTR %
            </span>
          </CardFooter>
        </Card>

        {/* Chart 2 — Posts by platform */}
        <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-900">Posts by Platform</CardTitle>
                <CardDescription className="text-xs text-zinc-400 mt-0.5">Publishing cadence — last 6 months</CardDescription>
              </div>
              <span className="text-2xl font-bold text-zinc-900 leading-none">
                {platformFrequencyData.reduce((s, p) => s + p.posts, 0)}
                <span className="text-xs font-normal text-zinc-400 ml-1">posts</span>
              </span>
            </div>
          </CardHeader>
          <CardContent className="pb-5">
            {(() => {
              const max = Math.max(...platformFrequencyData.map(p => p.posts));
              const total = platformFrequencyData.reduce((s, p) => s + p.posts, 0);
              return (
                <div className="space-y-3">
                  {platformFrequencyData.map((p) => (
                    <div key={p.platform} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: p.fill + "18" }}>
                        <Icon icon={channelIconMap[p.platform] ?? "solar:antenna-bold-duotone"} width={18} height={18} />
                      </div>
                      <span className="text-[13px] font-medium text-zinc-700 w-[90px] flex-shrink-0">{p.platform}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${(p.posts / max) * 100}%`, backgroundColor: p.fill }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-zinc-400 w-8 text-right flex-shrink-0">
                        {Math.round((p.posts / total) * 100)}%
                      </span>
                      <span className="text-[13px] font-bold text-zinc-900 w-7 text-right flex-shrink-0">{p.posts}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* ── HASHTAGS + COLLECTIONS ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Hashtags */}
        <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-900">Top Branded Hashtags</CardTitle>
            <CardDescription className="text-xs text-zinc-400">Most used tags across all posts — last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ChartContainer config={hashtagConfig} className="mx-auto aspect-square max-h-[190px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={hashtagChartData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} strokeWidth={3}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const total = topHashtags.reduce((s, h) => s + h.usages, 0);
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} style={{ fontSize: 24, fontWeight: 700, fill: "#09090b" }}>
                              {total}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} style={{ fontSize: 10, fill: "#a1a1aa" }}>
                              total uses
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="space-y-0 mt-1">
              {topHashtags.map((h) => (
                <div key={h.tag} className="flex items-center justify-between px-2 py-2 rounded-xl hover:bg-zinc-50/70 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: h.fill }} />
                    <span className="text-[12px] font-medium text-zinc-700">{h.tag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      h.delta === 0 ? "bg-zinc-100 text-zinc-400" : h.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {h.delta === 0 ? "—" : h.up ? `▲ +${h.delta}%` : `▼ ${h.delta}%`}
                    </span>
                    <span className="text-[12px] font-bold text-zinc-700 w-6 text-right">{h.usages}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Collections */}
        <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-900">Top Story Collections</CardTitle>
            <CardDescription className="text-xs text-zinc-400">Which themes drive the most content — last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-0 mt-1">
              {topCollections.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3 px-2 py-3.5 rounded-xl hover:bg-zinc-50/70 transition-colors border-b border-zinc-100/80 last:border-0">
                  <span className="text-[12px] font-bold text-zinc-300 w-4 text-center flex-shrink-0">{i + 1}</span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.color + "18" }}>
                    <Icon icon="solar:bookmark-bold-duotone" width={15} style={{ color: c.color }} />
                  </div>
                  <span className="text-[13px] font-semibold text-zinc-800 flex-1">{c.name}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      c.delta === 0 ? "bg-zinc-100 text-zinc-400" : c.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {c.delta === 0 ? "—" : c.up ? `▲ +${c.delta}%` : `▼ ${c.delta}%`}
                    </span>
                    <span className="text-[13px] font-bold text-zinc-700 w-6 text-right">{c.usages}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── STORIES TABLE ─────────────────────────────────────────────────── */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 text-sm">Story Performance</h3>
          <span className="text-xs text-zinc-400">{mockStories.length} stories</span>
        </div>
        <div className="grid gap-4 px-5 py-3 border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider"
          style={{ gridTemplateColumns: "2fr 100px 90px 80px 90px 60px 80px" }}>
          <span>Story</span>
          <span>Impressions</span>
          <span>Engagement</span>
          <span>CTR</span>
          <span>Reach</span>
          <span>Posts</span>
          <span>Score</span>
        </div>
        {mockStories.map((story, i) => {
          const stats = storyAnalytics[story.id] ?? { impressions: 5000, engagement: 4.0, ctr: 1.5, reach: 3800, score: 65 };
          return (
            <div
              key={story.id}
              className={`grid gap-4 px-5 py-4 items-center hover:bg-zinc-50/70 transition-colors ${
                i < mockStories.length - 1 ? "border-b border-zinc-100" : ""
              }`}
              style={{ gridTemplateColumns: "2fr 100px 90px 80px 90px 60px 80px" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:document-text-bold-duotone" width={15} className="text-purple-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-medium text-zinc-800 truncate">{story.name}</p>
                    {story.status === "paused" && (
                      <Badge variant="outline" className="text-zinc-400 border-zinc-200 text-[10px] px-1.5 py-0 h-4 font-medium">
                        paused
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Icon icon={channelIconMap[story.channel] ?? "solar:antenna-bold-duotone"} width={12} height={12} />
                    <span className="text-[11px] text-zinc-400">{story.channel}</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-zinc-700">{stats.impressions.toLocaleString()}</span>
              <span className="text-sm font-medium text-teal-600">{stats.engagement}%</span>
              <span className="text-sm font-medium text-amber-600">{stats.ctr}%</span>
              <span className="text-sm text-zinc-600">{stats.reach.toLocaleString()}</span>
              <span className="text-sm text-zinc-600">{story.postCount}</span>
              <div>
                <span className={`text-sm font-bold ${
                  stats.score >= 90 ? "text-teal-600" : stats.score >= 75 ? "text-amber-600" : "text-zinc-400"
                }`}>
                  {stats.score}
                  <span className="text-[10px] text-zinc-400 font-normal ml-0.5">/ 100</span>
                </span>
                <div className="w-full h-1 rounded-full bg-zinc-100 mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${stats.score}%`,
                      backgroundColor: stats.score >= 90 ? "#0d9488" : stats.score >= 75 ? "#f59e0b" : "#a1a1aa",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
