"use client";

import { useState } from "react";
import { mockStories } from "@/lib/mock-data";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Copy, Archive, MoreHorizontal, Search, BookOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type TabType = "all" | "active" | "paused";

export default function StoriesPage() {
  const [stories, setStories] = useState(mockStories);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const filtered = stories.filter(s => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return s.status === "active";
    return s.status === "paused";
  });

  const toggleStatus = (id: string) => {
    setStories(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" as "active" | "paused" } : s
    ));
    toast.success("Story updated");
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-xl p-1">
          {(["all", "active", "paused"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {tab} {tab === "all" ? `(${stories.length})` : tab === "active" ? `(${stories.filter(s => s.status === "active").length})` : `(${stories.filter(s => s.status === "paused").length})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 border border-zinc-200 w-44">
            <Search size={13} className="text-zinc-400" />
            <span className="text-xs text-zinc-400">Search stories...</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-purple-700 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <Plus size={15} /> New Story
          </button>
        </div>
      </div>

      {/* Stories table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_80px_1fr_80px_40px] gap-4 px-5 py-3 border-b border-zinc-100 text-xs font-medium text-zinc-400 bg-zinc-50">
          <span>Story</span>
          <span>Channel</span>
          <span>Posts</span>
          <span>Updated</span>
          <span>Status</span>
          <span></span>
        </div>

        {/* Rows */}
        {filtered.map((story, i) => (
          <div
            key={story.id}
            className={`grid grid-cols-[2fr_1fr_80px_1fr_80px_40px] gap-4 px-5 py-4 items-center hover:bg-zinc-50 transition-colors ${i < filtered.length - 1 ? "border-b border-zinc-100" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <BookOpen size={13} className="text-brand-purple" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-800">{story.name}</p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {story.collections.map(c => (
                    <span key={c} className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              </div>
            </div>
            <span className="text-sm text-zinc-500">{story.channel}</span>
            <span className="text-sm font-medium text-zinc-800">{story.postCount}</span>
            <span className="text-xs text-zinc-400">{story.updatedAt}</span>
            <div>
              <Switch
                checked={story.status === "active"}
                onCheckedChange={() => toggleStatus(story.id)}
                className="data-[state=checked]:bg-teal-500"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-zinc-200 w-40 shadow-lg" align="end">
                <DropdownMenuItem className="text-zinc-600 hover:text-zinc-900 focus:bg-zinc-50 gap-2 cursor-pointer">
                  <Edit2 size={12} /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-600 hover:text-zinc-900 focus:bg-zinc-50 gap-2 cursor-pointer" onClick={() => toast.success("Story duplicated")}>
                  <Copy size={12} /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-600 hover:text-zinc-900 focus:bg-zinc-50 gap-2 cursor-pointer">
                  <Archive size={12} /> Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-zinc-400 text-sm">No stories found.</div>
        )}
      </div>
    </div>
  );
}
