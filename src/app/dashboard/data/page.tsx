"use client";

import { mockMetrics, mockStories } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, BarChart2, Activity, Globe, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, CartesianGrid,
  PieChart, Pie, Label,
  AreaChart, Area,
} from "recharts";

// ── Data ──────────────────────────────────────────────────────────────────────

const weeklyData = [
  { day: "Mon", impressions: 42 },
  { day: "Tue", impressions: 58 },
  { day: "Wed", impressions: 51 },
  { day: "Thu", impressions: 67 },
  { day: "Fri", impressions: 73 },
  { day: "Sat", impressions: 89 },
  { day: "Sun", impressions: 94 },
];

const platformData = [
  { name: "Instagram",   value: 42, fill: "#6366f1" },
  { name: "Facebook",    value: 28, fill: "#3b82f6" },
  { name: "X (Twitter)", value: 18, fill: "#64748b" },
  { name: "LinkedIn",    value: 8,  fill: "#06b6d4" },
  { name: "YouTube",     value: 4,  fill: "#f59e0b" },
];

const trendData = [
  { month: "Sep", impressions: 186, engagement: 5.8 },
  { month: "Oct", impressions: 205, engagement: 6.2 },
  { month: "Nov", impressions: 237, engagement: 7.1 },
  { month: "Dec", impressions: 198, engagement: 6.4 },
  { month: "Jan", impressions: 251, engagement: 7.8 },
  { month: "Feb", impressions: 289, engagement: 9.2 },
];

// ── Chart configs ─────────────────────────────────────────────────────────────

const barConfig: ChartConfig = {
  impressions: { label: "Impressions (k)", color: "#6366f1" },
};

const platformConfig: ChartConfig = Object.fromEntries(
  platformData.map((p) => [p.name, { label: p.name, color: p.fill }])
);

const areaConfig: ChartConfig = {
  impressions: { label: "Impressions (k)", color: "#6366f1" },
  engagement:  { label: "Engagement %",    color: "#06b6d4" },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DataPage() {
  const totalPlatform = platformData.reduce((s, p) => s + p.value, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">

      {/* Date range toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">Showing data for the last 30 days</p>
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

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Impressions", value: mockMetrics.impressions.toLocaleString(), delta: `+${mockMetrics.impressionsDelta}%`, up: true,  icon: Globe,    color: "text-brand-purple", bg: "bg-purple-50" },
          { label: "Engagement Rate",   value: `${mockMetrics.engagement}%`,             delta: `+${mockMetrics.engagementDelta}%`, up: true,  icon: Activity, color: "text-teal-600",     bg: "bg-teal-50"   },
          { label: "Top Platform",      value: mockMetrics.topPlatform,                  delta: "42% of traffic",                   up: true,  icon: BarChart2, color: "text-amber-600",   bg: "bg-amber-50"  },
          { label: "StoryScore™",       value: `${mockMetrics.storyScore}`,              delta: `+${mockMetrics.storyScoreDelta} pts`, up: true, icon: Star,    color: "text-rose-600",     bg: "bg-rose-50"   },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <Icon size={16} className={kpi.color} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-teal-600" : "text-rose-600"}`}>
                  {kpi.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {kpi.delta}
                </span>
              </div>
              <p className="text-2xl font-bold text-zinc-900 mb-0.5">{kpi.value}</p>
              <p className="text-xs text-zinc-500">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Bar + Donut row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart — Weekly Impressions */}
        <Card className="lg:col-span-2 rounded-2xl border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-900">Weekly Impressions</CardTitle>
            <CardDescription className="text-xs text-teal-600 font-medium">+34% vs last week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="h-[180px] w-full">
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f4f4f5" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
                <Bar dataKey="impressions" fill="var(--color-impressions)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="pt-0 text-xs text-zinc-400">
            Daily impressions this week (×1 000)
          </CardFooter>
        </Card>

        {/* Donut Chart — Platform Breakdown */}
        <Card className="rounded-2xl border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-900">Platform Breakdown</CardTitle>
            <CardDescription className="text-xs text-zinc-400">Traffic share by channel</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <ChartContainer config={platformConfig} className="mx-auto aspect-square max-h-[180px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={platformData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} strokeWidth={3}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} style={{ fontSize: 22, fontWeight: 700, fill: "#09090b" }}>
                              {totalPlatform}%
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} style={{ fontSize: 10, fill: "#a1a1aa" }}>
                              total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
              {platformData.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill }} />
                  <span className="text-[11px] text-zinc-500 truncate">{p.name}</span>
                  <span className="text-[11px] font-bold text-zinc-700 ml-auto">{p.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Chart — 6-month trend */}
      <Card className="rounded-2xl border-zinc-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-zinc-900">6-Month Performance Trend</CardTitle>
          <CardDescription className="text-xs text-zinc-400">Impressions (k) and engagement rate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={areaConfig} className="h-[200px] w-full">
            <AreaChart data={trendData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="fillImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f4f4f5" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                type="natural"
                dataKey="impressions"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#fillImpressions)"
              />
              <Area
                type="natural"
                dataKey="engagement"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#fillEngagement)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center gap-6 pt-0 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[#6366f1] inline-block" /> Impressions (k)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[#06b6d4] inline-block" /> Engagement %</span>
        </CardFooter>
      </Card>

      {/* Top performing stories */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50">
          <h3 className="font-semibold text-zinc-900 text-sm">Top performing stories</h3>
        </div>
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-zinc-100 text-xs font-medium text-zinc-400">
          <span>Story</span>
          <span>Impressions</span>
          <span>Engagement</span>
          <span>Posts</span>
          <span>Score</span>
        </div>
        {mockStories.filter((s) => s.status === "active").map((story, i) => {
          const impressions = [48200, 32400, 21800, 18900, 9400][i] || 5000;
          const engagement  = [9.2, 7.8, 6.4, 8.1, 5.2][i] || 4.0;
          const score       = [94, 88, 82, 79, 71][i] || 65;
          return (
            <div
              key={story.id}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-4 items-center hover:bg-zinc-50 transition-colors ${
                i < mockStories.length - 2 ? "border-b border-zinc-100" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-zinc-800">{story.name}</p>
                <p className="text-xs text-zinc-400">{story.channel}</p>
              </div>
              <span className="text-sm text-zinc-600">{impressions.toLocaleString()}</span>
              <span className="text-sm text-teal-600">{engagement}%</span>
              <span className="text-sm text-zinc-600">{story.postCount}</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-bold ${score >= 90 ? "text-teal-600" : score >= 75 ? "text-amber-600" : "text-zinc-400"}`}>
                  {score}
                </span>
                <span className="text-[10px] text-zinc-400">/ 100</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
