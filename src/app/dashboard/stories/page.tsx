"use client";

import { useState } from "react";
import { mockStories } from "@/lib/mock-data";
import { Plus, Edit2, Copy, Archive, MoreHorizontal, Search } from "lucide-react";
import { Icon } from "@iconify/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const channelIconMap: Record<string, string> = {
  "Instagram":   "logos:instagram-icon",
  "LinkedIn":    "logos:linkedin-icon",
  "YouTube":     "logos:youtube-icon",
  "X (Twitter)": "logos:x",
  "Facebook":    "logos:facebook",
  "TikTok":      "logos:tiktok-icon",
};

// Unique accent colors per story for visual identity
const storyColors = [
  { bg: "bg-violet-100", text: "text-violet-600" },
  { bg: "bg-sky-100",    text: "text-sky-600" },
  { bg: "bg-teal-100",   text: "text-teal-600" },
  { bg: "bg-amber-100",  text: "text-amber-600" },
  { bg: "bg-rose-100",   text: "text-rose-600" },
];

type TabType = "all" | "active" | "paused";

export default function StoriesPage() {
  const [stories, setStories] = useState(mockStories);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");

  const filtered = stories.filter(s => {
    const matchesTab = activeTab === "all" || s.status === activeTab;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleStatus = (id: string) => {
    setStories(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" as "active" | "paused" } : s
    ));
    toast.success("Story updated");
  };

  return (
    <div className="space-y-5 animate-fade-in-up">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-xl p-1">
          {(["all", "active", "paused"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {tab}{" "}
              <span className={`text-xs font-normal ${activeTab === tab ? "text-zinc-400" : "text-zinc-400"}`}>
                ({tab === "all" ? stories.length : stories.filter(s => s.status === tab).length})
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 shadow-[0_2px_8px_rgb(0,0,0,0.04)] w-48">
            <Search size={13} className="text-zinc-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search stories..."
              className="text-xs text-zinc-600 placeholder:text-zinc-400 bg-transparent outline-none w-full"
            />
          </div>
          <Button><Plus size={14} /> New Story</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

        {/* Column headers */}
        <div className="grid px-5 py-3 border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider"
          style={{ gridTemplateColumns: "1fr 160px 80px 110px 120px 40px" }}>
          <span>Story</span>
          <span>Channel</span>
          <span>Posts</span>
          <span>Updated</span>
          <span>Status</span>
          <span />
        </div>

        {/* Rows */}
        {filtered.map((story, i) => {
          const color = storyColors[i % storyColors.length];
          const isActive = story.status === "active";

          return (
            <div
              key={story.id}
              className="grid px-5 py-4 items-center hover:bg-zinc-50/60 transition-colors border-b border-zinc-100/80 last:border-0"
              style={{ gridTemplateColumns: "1fr 160px 80px 110px 120px 40px" }}
            >
              {/* Story */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl ${color.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon icon="solar:document-text-bold-duotone" width={17} className={color.text} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-800 truncate">{story.name}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {story.collections.map(c => (
                      <span key={c} className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-md">{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Channel */}
              <div className="flex items-center gap-2">
                <Icon icon={channelIconMap[story.channel] ?? "solar:antenna-bold-duotone"} width={16} height={16} />
                <span className="text-sm text-zinc-500 truncate">{story.channel}</span>
              </div>

              {/* Posts */}
              <span className="text-sm font-semibold text-zinc-800">{story.postCount}</span>

              {/* Updated */}
              <span className="text-xs text-zinc-400">{story.updatedAt}</span>

              {/* Status */}
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={isActive}
                  onCheckedChange={() => toggleStatus(story.id)}
                  className="data-[state=checked]:bg-teal-500"
                />
                <span className={`text-[11px] font-semibold ${isActive ? "text-teal-600" : "text-zinc-400"}`}>
                  {story.status}
                </span>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors outline-none cursor-pointer flex items-center justify-center">
                  <MoreHorizontal size={15} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-zinc-200 w-40 shadow-lg" align="end">
                  <DropdownMenuItem className="text-zinc-600 hover:text-zinc-900 focus:bg-zinc-50 gap-2 cursor-pointer text-sm">
                    <Edit2 size={12} /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-zinc-600 hover:text-zinc-900 focus:bg-zinc-50 gap-2 cursor-pointer text-sm" onClick={() => toast.success("Story duplicated")}>
                    <Copy size={12} /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-zinc-600 hover:text-zinc-900 focus:bg-zinc-50 gap-2 cursor-pointer text-sm">
                    <Archive size={12} /> Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-zinc-400">
            No stories found.
          </div>
        )}
      </div>
    </div>
  );
}
