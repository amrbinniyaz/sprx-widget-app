"use client";

import { mockMetrics, mockStories } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, BarChart2, Activity, Globe, Star } from "lucide-react";

const platformData = [
  { name: "Instagram", value: 42, color: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600" },
  { name: "Facebook", value: 28, color: "bg-blue-500" },
  { name: "X (Twitter)", value: 18, color: "bg-gray-500" },
  { name: "LinkedIn", value: 8, color: "bg-blue-600" },
  { name: "YouTube", value: 4, color: "bg-red-500" },
];

const weeklyData = [42, 58, 51, 67, 73, 89, 94];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxVal = Math.max(...weeklyData);

export default function DataPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Date range */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">Showing data for the last 30 days</p>
        <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-xl p-1">
          {["7 days", "30 days", "90 days"].map((r) => (
            <button key={r} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${r === "30 days" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>{r}</button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Impressions", value: mockMetrics.impressions.toLocaleString(), delta: `+${mockMetrics.impressionsDelta}%`, up: true, icon: Globe, color: "text-brand-purple", bg: "bg-purple-50" },
          { label: "Engagement Rate", value: `${mockMetrics.engagement}%`, delta: `+${mockMetrics.engagementDelta}%`, up: true, icon: Activity, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Top Platform", value: mockMetrics.topPlatform, delta: "42% of traffic", up: true, icon: BarChart2, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "StoryScore™", value: `${mockMetrics.storyScore}`, delta: `+${mockMetrics.storyScoreDelta} pts`, up: true, icon: Star, color: "text-rose-600", bg: "bg-rose-50" },
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

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-zinc-900 text-sm">Weekly Impressions</h3>
            <span className="text-xs text-teal-600">+34% vs last week</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand-purple to-purple-400 transition-all duration-500 hover:opacity-80 cursor-pointer"
                  style={{ height: `${(val / maxVal) * 100}%` }}
                />
                <span className="text-[10px] text-zinc-400">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
          <h3 className="font-semibold text-zinc-900 text-sm mb-6">Platform breakdown</h3>
          <div className="space-y-4">
            {platformData.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-500">{p.name}</span>
                  <span className="text-xs font-medium text-zinc-800">{p.value}%</span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.color} transition-all duration-700`}
                    style={{ width: `${p.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
        {mockStories.filter(s => s.status === "active").map((story, i) => {
          const impressions = [48200, 32400, 21800, 18900, 9400][i] || 5000;
          const engagement = [9.2, 7.8, 6.4, 8.1, 5.2][i] || 4.0;
          const score = [94, 88, 82, 79, 71][i] || 65;
          return (
            <div key={story.id} className={`grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-4 items-center hover:bg-zinc-50 transition-colors ${i < mockStories.length - 2 ? "border-b border-zinc-100" : ""}`}>
              <div>
                <p className="text-sm font-medium text-zinc-800">{story.name}</p>
                <p className="text-xs text-zinc-400">{story.channel}</p>
              </div>
              <span className="text-sm text-zinc-600">{impressions.toLocaleString()}</span>
              <span className="text-sm text-teal-600">{engagement}%</span>
              <span className="text-sm text-zinc-600">{story.postCount}</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-bold ${score >= 90 ? "text-teal-600" : score >= 75 ? "text-amber-600" : "text-zinc-400"}`}>{score}</span>
                <span className="text-[10px] text-zinc-400">/ 100</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
