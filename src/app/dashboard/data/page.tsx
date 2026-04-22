"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { mockStories } from "@/lib/mock-data";
import { Icon } from "@iconify/react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  PieChart, Pie, Label,
  AreaChart, Area,
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

const dualLineConfig: ChartConfig = {
  impressions: { label: "Impressions", color: "#7c3aed" },
  ctr:         { label: "CTR (%)",     color: "#f59e0b" },
};

const kpis = [
  {
    label: "Total Impressions", value: "142,800", delta: "+12.4%", up: true, prev: "127,000",
    icon: "solar:eye-bold-duotone",
    current: 142800, goal: 180000, goalLabel: "of 180K goal",
  },
  {
    label: "Engagement Rate", value: "8.7%", delta: "+2.1 pts", up: true, prev: "6.6%",
    icon: "solar:heart-angle-bold-duotone",
    current: 8.7, goal: 10, goalLabel: "of 10% peer avg",
  },
  {
    label: "Follower Growth", value: "+1,240", delta: "+6.8%", up: true, prev: "+1,161",
    icon: "solar:user-plus-bold-duotone",
    current: 1240, goal: 1500, goalLabel: "of 1,500 goal",
  },
  {
    label: "Posts Published", value: "47", delta: "+6.8%", up: true, prev: "44",
    icon: "solar:calendar-bold-duotone",
    current: 47, goal: 60, goalLabel: "of 60 goal",
  },
];

// ── AI Insight data ───────────────────────────────────────────────────────────

type InsightType = "positive" | "opportunity" | "warning";

interface Insight {
  type: InsightType;
  headline: string;
  bullets: string[];
}

const insights: Record<string, Insight> = {
  kpis: {
    type: "positive",
    headline: "Strong growth across all key metrics",
    bullets: [
      "Engagement is 2.1 pts above your school's average — keep posting at this frequency",
      "Follower growth is accelerating — consider pinning your best-performing story",
      "Posts Published is up 3 — maintain this cadence for sustained reach",
    ],
  },
  impressionsCtr: {
    type: "opportunity",
    headline: "CTR peaks correlate with event-driven content",
    bullets: [
      "Mar W4 spike (+4.2% CTR) coincided with School Events posts — replicate this format",
      "Friday–Saturday posts generate 34% more impressions than weekday posts",
      "A/B test your CTA copy — 'See more' vs 'Watch now' to lift CTR further",
    ],
  },
  platforms: {
    type: "warning",
    headline: "X (Twitter) volume is high but underperforming",
    bullets: [
      "X has 112 posts but the lowest engagement rate per post across all platforms",
      "Shift 30% of X effort to Instagram Reels — 3× higher reach per post",
      "LinkedIn shows strongest professional reach — increase cadence from 29 to 40 posts",
    ],
  },
  hashtags: {
    type: "positive",
    headline: "#SprXInspires is your strongest branded tag",
    bullets: [
      "+20% usage growth — add it to every post as a baseline tag",
      "#MorningMoments is declining — refresh with a new content series",
      "Create a student challenge around #SchoolPride to reverse the −16.7% trend",
    ],
  },
  collections: {
    type: "opportunity",
    headline: "Inspirational content drives 34% more shares",
    bullets: [
      "Feature the Inspirational collection on your homepage widget",
      "Events collection is down 22% — tie upcoming events to story content earlier",
      "Staff Stories is steady — cross-post to LinkedIn for higher professional reach",
    ],
  },
  stories: {
    type: "opportunity",
    headline: "Sports News Feed is your top scorer but underused",
    bullets: [
      "Score of 94 with only 48K impressions — increase post frequency to maximise reach",
      "Admissions Updates has the lowest score (71) — add richer media to lift engagement",
      "Open Day 2026 has strong CTR (4.2%) — create a dedicated widget embed for it",
    ],
  },
};

// ── AI Insight Button + Popover ───────────────────────────────────────────────

const typeConfig = {
  positive:    { label: "Positive trend", icon: "solar:graph-up-bold-duotone",    bg: "bg-emerald-500", dot: "bg-emerald-400" },
  opportunity: { label: "Opportunity",    icon: "solar:magic-stick-bold-duotone", bg: "bg-violet-500",  dot: "bg-violet-400"  },
  warning:     { label: "Needs attention",icon: "solar:danger-bold-duotone",      bg: "bg-amber-500",   dot: "bg-amber-400"   },
};

function AIInsightButton({ id, insight, openId, setOpenId }: {
  id: string;
  insight: Insight;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  const isOpen = openId === id;
  const cfg = typeConfig[insight.type];

  const [typedHeadline, setTypedHeadline] = useState("");
  const [visibleBullets, setVisibleBullets] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  useEffect(() => {
    if (!isOpen) {
      clearAll();
      setTypedHeadline("");
      setVisibleBullets(0);
      setShowFooter(false);
      return;
    }

    clearAll();
    setTypedHeadline("");
    setVisibleBullets(0);
    setShowFooter(false);

    // Stream headline char by char
    const chars = insight.headline.split("");
    chars.forEach((_, i) => {
      const t = setTimeout(() => {
        setTypedHeadline(insight.headline.slice(0, i + 1));
      }, 120 + i * 22);
      timeouts.current.push(t);
    });

    const headlineDone = 120 + chars.length * 22;

    // Reveal bullets one by one after headline
    insight.bullets.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleBullets(i + 1);
      }, headlineDone + 200 + i * 380);
      timeouts.current.push(t);
    });

    // Footer after last bullet
    const t = setTimeout(() => {
      setShowFooter(true);
    }, headlineDone + 200 + insight.bullets.length * 380 + 200);
    timeouts.current.push(t);

    return clearAll;
  }, [isOpen, insight]);

  return (
    <>
      <button
        onClick={() => setOpenId(id)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all flex-shrink-0"
      >
        <Icon icon="solar:stars-bold-duotone" width={12} />
        AI
      </button>

      <Dialog open={isOpen} onOpenChange={(v) => setOpenId(v ? id : null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden gap-0 rounded-2xl">
          <DialogTitle className="sr-only">{insight.headline}</DialogTitle>

          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
              <Icon icon="solar:stars-bold-duotone" width={16} className="text-zinc-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">AI Insight</p>
              <p className="text-[13px] font-semibold text-zinc-900">{cfg.label}</p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-[16px] font-bold text-zinc-900 leading-snug mb-4 min-h-[3rem]">
              {typedHeadline}
              {typedHeadline.length < insight.headline.length && (
                <span className="inline-block w-0.5 h-4 bg-zinc-400 ml-0.5 animate-pulse align-middle" />
              )}
            </p>
            <ul className="flex flex-col gap-3">
              {insight.bullets.map((b, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 transition-all duration-500 ${
                    i < visibleBullets
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-zinc-500 text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <span className="text-sm text-zinc-600 leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between transition-all duration-500 ${showFooter ? "opacity-100" : "opacity-0"}`}>
            <p className="text-[11px] text-zinc-400">Generated from your last 30 days</p>
            <button
              onClick={() => setOpenId(null)}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Skeleton primitive + relative time helper ────────────────────────────────

function Skel({ className = "" }: { className?: string }) {
  return <div className={`bg-zinc-200/70 rounded animate-pulse ${className}`} />;
}

function formatRelative(ms: number): string {
  const sec = Math.max(0, Math.floor(ms / 1000));
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DataPage() {
  const [openInsight, setOpenInsight] = useState<string | null>(null);
  const [chartMetric, setChartMetric] = useState<"impressions" | "ctr">("impressions");

  // loading + freshness state
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(() => Date.now() - 180_000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750);
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

  const metricConfig = {
    impressions: {
      label: "Impressions",
      value: "47,200",
      delta: "+12.1%",
      up: true,
      color: "#7c3aed",
      dataKey: "impressions" as const,
      fmtAxis: (v: number) => `${(v / 1000).toFixed(0)}k`,
    },
    ctr: {
      label: "Click-Through Rate",
      value: "4.2%",
      delta: "+0.3 pts",
      up: true,
      color: "#f59e0b",
      dataKey: "ctr" as const,
      fmtAxis: (v: number) => `${v}%`,
    },
  };
  const activeMetric = metricConfig[chartMetric];

  return (
    <div className="space-y-6 animate-fade-in-up">

      {/* ── REPORT HEADER ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-0.5">This month</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400">auto-generated</span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] text-zinc-400">every Monday</span>
          </div>
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
              <Icon icon="solar:refresh-linear" width={12} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <Link
            href="/dashboard/data/sources"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 border border-zinc-200 bg-white rounded-lg px-3 py-1.5 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
          >
            <Icon icon="solar:database-bold-duotone" width={13} />
            Manage sources
          </Link>
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
          </div>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgb(0,0,0,0.06)]">
          <div className="px-6 pt-5 pb-0">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em]">Headline</p>
          </div>
          <div className="px-6 pt-3 pb-4">
            <p className="text-[22px] font-bold text-zinc-900 leading-snug tracking-tight">
              Your reach is up{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold">18%</span>
              {" "}— driven by{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold">School Events</span>
              {" "}on Instagram.
            </p>
          </div>
          <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center gap-6">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Story Score <span className="text-zinc-900 font-bold ml-1">7.8</span></span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Engagement <span className="text-zinc-900 font-bold ml-1">4.2%</span></span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Impressions <span className="text-zinc-900 font-bold ml-1">284K</span></span>
          </div>
        </div>
      )}

      {/* ── OVERVIEW SECTION (header + KPI strip) ─────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Overview</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">Last 30 days · compared to prior 30 days</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-xl p-1">
              {["7 days", "30 days", "90 days"].map((r) => (
                <button key={r} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${r === "30 days" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>
                  {r}
                </button>
              ))}
            </div>
            <AIInsightButton id="kpis" insight={insights.kpis} openId={openInsight} setOpenId={setOpenInsight} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-xl rounded-[20px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Skel className="h-3 w-3 rounded-full" />
                      <Skel className="h-2.5 w-28" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <Skel className="h-7 w-20" />
                      <Skel className="h-3 w-12" />
                    </div>
                    <Skel className="h-2.5 w-16 mt-2" />
                  </div>
                  <div className="px-5 pb-5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Skel className="h-2.5 w-8" />
                      <Skel className="h-2.5 w-20" />
                    </div>
                    <Skel className="h-1 w-full rounded-full" />
                  </div>
                </div>
              ))
            : kpis.map((kpi) => {
            const pct = Math.min((kpi.current / kpi.goal) * 100, 100);
            const tier =
              pct >= 80 ? { bar: "bg-emerald-500", text: "text-emerald-600" }
              : pct >= 50 ? { bar: "bg-amber-500",   text: "text-amber-600"   }
              :             { bar: "bg-rose-500",    text: "text-rose-600"    };
            return (
              <div
                key={kpi.label}
                className="group relative bg-white/60 backdrop-blur-xl rounded-[20px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-white hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Icon icon={kpi.icon} width={13} height={13} className="text-zinc-400 flex-shrink-0" />
                    <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">{kpi.label}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[28px] font-bold text-zinc-900 leading-none tracking-tight tabular-nums">{kpi.value}</p>
                    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums ${kpi.up ? "text-emerald-600" : "text-rose-600"}`}>
                      <Icon icon={kpi.up ? "solar:arrow-right-up-linear" : "solar:arrow-right-down-linear"} width={11} />
                      {kpi.delta}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 tabular-nums">from {kpi.prev}</p>
                </div>
                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[11px] font-semibold tabular-nums ${tier.text}`}>
                      {Math.round(pct)}%
                    </span>
                    <span className="text-[11px] text-zinc-400">{kpi.goalLabel}</span>
                  </div>
                  <div className="h-1 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${tier.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CHART ROW 2:1 ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {loading ? (
          <>
            <Card className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <Skel className="h-3.5 w-36" />
                    <Skel className="h-2.5 w-44" />
                  </div>
                  <Skel className="h-6 w-10 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-5">
                  {[0, 1].map((i) => (
                    <div key={i} className="rounded-xl p-3 border border-transparent">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Skel className="h-2 w-2 rounded-full" />
                        <Skel className="h-2 w-28" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <Skel className="h-5 w-16" />
                        <Skel className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Skel className="h-[200px] w-full rounded-lg" />
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
              <CardHeader>
                <div className="space-y-1.5">
                  <Skel className="h-3.5 w-32" />
                  <Skel className="h-2.5 w-40" />
                </div>
              </CardHeader>
              <CardContent className="pb-5 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skel className="w-8 h-8 rounded-lg" />
                    <Skel className="h-3 w-[90px]" />
                    <Skel className="flex-1 h-2.5 rounded-full" />
                    <Skel className="h-3 w-8" />
                    <Skel className="h-3 w-7" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
        <>

        {/* Chart 1 — Performance Trend (toggle between metrics) */}
        <Card className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
          <CardHeader className="pb-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-900">Performance Trend</CardTitle>
                <CardDescription className="text-xs text-zinc-400">Latest week · 12-week history</CardDescription>
              </div>
              <AIInsightButton id="impressionsCtr" insight={insights.impressionsCtr} openId={openInsight} setOpenId={setOpenInsight} />
            </div>

            {/* Metric tabs (stat blocks that drive the chart) */}
            <div className="grid grid-cols-2 gap-2 mt-5">
              {(["impressions", "ctr"] as const).map((m) => {
                const isActive = m === chartMetric;
                const cfg = metricConfig[m];
                return (
                  <button
                    key={m}
                    onClick={() => setChartMetric(m)}
                    className={`text-left rounded-xl p-3 border transition-all ${
                      isActive
                        ? "border-zinc-200 bg-white shadow-[0_1px_2px_rgb(0,0,0,0.04)]"
                        : "border-transparent hover:bg-zinc-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span
                        className={`w-2 h-2 rounded-full ${isActive ? "" : "opacity-30"}`}
                        style={{ backgroundColor: cfg.color }}
                      />
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? "text-zinc-700" : "text-zinc-400"}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-xl font-bold leading-none tabular-nums ${isActive ? "text-zinc-900" : "text-zinc-400"}`}>
                        {cfg.value}
                      </p>
                      <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
                        isActive
                          ? cfg.up ? "text-emerald-600" : "text-rose-600"
                          : "text-zinc-400"
                      }`}>
                        <Icon icon={cfg.up ? "solar:arrow-right-up-linear" : "solar:arrow-right-down-linear"} width={11} />
                        {cfg.delta}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={dualLineConfig} className="h-[200px] w-full">
              <AreaChart data={weeklyTrendData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="chart-grad-impressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="chart-grad-ctr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 10, fill: "#a1a1aa" }} interval={1} />
                <YAxis tickLine={false} axisLine={false} tickMargin={4} tick={{ fontSize: 11, fill: "#a1a1aa" }} tickFormatter={activeMetric.fmtAxis} width={36} />
                <ChartTooltip cursor={{ stroke: activeMetric.color, strokeDasharray: "4 4", strokeOpacity: 0.4 }} content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  type="monotone"
                  dataKey={activeMetric.dataKey}
                  stroke={activeMetric.color}
                  strokeWidth={2.25}
                  fill={`url(#chart-grad-${chartMetric})`}
                  activeDot={{ r: 4, fill: activeMetric.color, stroke: "white", strokeWidth: 2 }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Chart 2 — Posts by platform */}
        <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-900">Posts by Platform</CardTitle>
                <CardDescription className="text-xs text-zinc-400 mt-0.5">Publishing cadence — last 6 months</CardDescription>
              </div>
              <AIInsightButton id="platforms" insight={insights.platforms} openId={openInsight} setOpenId={setOpenInsight} />
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
                        <div className="h-full rounded-full transition-all" style={{ width: `${(p.posts / max) * 100}%`, backgroundColor: p.fill }} />
                      </div>
                      <span className="text-[11px] font-medium text-zinc-400 w-8 text-right flex-shrink-0">{Math.round((p.posts / total) * 100)}%</span>
                      <span className="text-[13px] font-bold text-zinc-900 w-7 text-right flex-shrink-0">{p.posts}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>
        </>
        )}
      </div>

      {/* ── HASHTAGS + COLLECTIONS ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {loading ? (
          <>
            {Array.from({ length: 2 }).map((_, idx) => (
              <Card key={idx} className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
                <CardHeader>
                  <div className="space-y-1.5">
                    <Skel className="h-3.5 w-40" />
                    <Skel className="h-2.5 w-56" />
                  </div>
                </CardHeader>
                <CardContent className="pb-5">
                  {idx === 0 && (
                    <div className="mx-auto aspect-square max-h-[190px] flex items-center justify-center mb-3">
                      <div className="w-36 h-36 rounded-full border-[14px] border-zinc-200/70 animate-pulse" />
                    </div>
                  )}
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skel className="w-2.5 h-2.5 rounded-full" />
                          <Skel className="h-3 w-32" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skel className="h-4 w-12 rounded-full" />
                          <Skel className="h-3 w-6" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
        <>

        {/* Top Hashtags */}
        <Card className="bg-white/60 backdrop-blur-xl rounded-[24px] border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-900">Top Branded Hashtags</CardTitle>
                <CardDescription className="text-xs text-zinc-400">Most used tags across all posts — last 6 months</CardDescription>
              </div>
              <AIInsightButton id="hashtags" insight={insights.hashtags} openId={openInsight} setOpenId={setOpenInsight} />
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <ChartContainer config={hashtagConfig} className="mx-auto aspect-square max-h-[190px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={hashtagChartData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} strokeWidth={3}>
                  <Label content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const total = topHashtags.reduce((s, h) => s + h.usages, 0);
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} style={{ fontSize: 24, fontWeight: 700, fill: "#09090b" }}>{total}</tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} style={{ fontSize: 10, fill: "#a1a1aa" }}>total uses</tspan>
                        </text>
                      );
                    }
                  }} />
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
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${h.delta === 0 ? "bg-zinc-100 text-zinc-400" : h.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
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
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-900">Top Story Collections</CardTitle>
                <CardDescription className="text-xs text-zinc-400">Which themes drive the most content — last 6 months</CardDescription>
              </div>
              <AIInsightButton id="collections" insight={insights.collections} openId={openInsight} setOpenId={setOpenInsight} />
            </div>
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
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${c.delta === 0 ? "bg-zinc-100 text-zinc-400" : c.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                      {c.delta === 0 ? "—" : c.up ? `▲ +${c.delta}%` : `▼ ${c.delta}%`}
                    </span>
                    <span className="text-[13px] font-bold text-zinc-700 w-6 text-right">{c.usages}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </>
        )}
      </div>

      {/* ── STORIES TABLE ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
            <Skel className="h-3.5 w-32" />
            <Skel className="h-3 w-20" />
          </div>
          <div className="grid gap-4 px-5 py-3 border-b border-zinc-100" style={{ gridTemplateColumns: "2fr 100px 90px 80px 90px 60px 80px" }}>
            {Array.from({ length: 7 }).map((_, i) => <Skel key={i} className="h-2.5 w-16" />)}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid gap-4 px-5 py-4 items-center border-b border-zinc-100 last:border-0" style={{ gridTemplateColumns: "2fr 100px 90px 80px 90px 60px 80px" }}>
              <div className="flex items-center gap-3">
                <Skel className="w-8 h-8 rounded-lg" />
                <div className="space-y-1.5 flex-1">
                  <Skel className="h-3 w-3/4" />
                  <Skel className="h-2.5 w-1/3" />
                </div>
              </div>
              {Array.from({ length: 6 }).map((_, j) => <Skel key={j} className="h-3 w-12" />)}
            </div>
          ))}
        </div>
      ) : (
      <div className="bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 text-sm">Story Performance</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">{mockStories.length} stories</span>
            <AIInsightButton id="stories" insight={insights.stories} openId={openInsight} setOpenId={setOpenInsight} />
          </div>
        </div>
        <div className="grid gap-4 px-5 py-3 border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider"
          style={{ gridTemplateColumns: "2fr 100px 90px 80px 90px 60px 80px" }}>
          <span>Story</span><span>Impressions</span><span>Engagement</span><span>CTR</span><span>Reach</span><span>Posts</span><span>Score</span>
        </div>
        {mockStories.map((story, i) => {
          const stats = storyAnalytics[story.id] ?? { impressions: 5000, engagement: 4.0, ctr: 1.5, reach: 3800, score: 65 };
          return (
            <div key={story.id} className={`grid gap-4 px-5 py-4 items-center hover:bg-zinc-50/70 transition-colors ${i < mockStories.length - 1 ? "border-b border-zinc-100" : ""}`}
              style={{ gridTemplateColumns: "2fr 100px 90px 80px 90px 60px 80px" }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:document-text-bold-duotone" width={15} className="text-purple-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-medium text-zinc-800 truncate">{story.name}</p>
                    {story.status === "paused" && (
                      <Badge variant="outline" className="text-zinc-400 border-zinc-200 text-[10px] px-1.5 py-0 h-4 font-medium">paused</Badge>
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
                <span className={`text-sm font-bold ${stats.score >= 90 ? "text-teal-600" : stats.score >= 75 ? "text-amber-600" : "text-zinc-400"}`}>
                  {stats.score}<span className="text-[10px] text-zinc-400 font-normal ml-0.5">/ 100</span>
                </span>
                <div className="w-full h-1 rounded-full bg-zinc-100 mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${stats.score}%`, backgroundColor: stats.score >= 90 ? "#0d9488" : stats.score >= 75 ? "#f59e0b" : "#a1a1aa" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

    </div>
  );
}
