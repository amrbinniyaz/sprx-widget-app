"use client";

import { useState } from "react";
import { mockStories } from "@/lib/mock-data";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Copy, Archive, MoreHorizontal, Search } from "lucide-react";
import { Icon } from "@iconify/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
              <span className="text-zinc-400 font-normal">
                ({tab === "all" ? stories.length : stories.filter(s => s.status === tab).length})
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-zinc-200 w-48">
            <Search size={13} className="text-zinc-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search stories..."
              className="text-xs text-zinc-600 placeholder:text-zinc-400 bg-transparent outline-none w-full"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple hover:bg-purple-700 text-white text-sm font-medium transition-all shadow-sm">
            <Plus size={14} /> New Story
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 hover:bg-zinc-50 border-zinc-100">
              <TableHead className="pl-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-[40%]">Story</TableHead>
              <TableHead className="py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Channel</TableHead>
              <TableHead className="py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Posts</TableHead>
              <TableHead className="py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Updated</TableHead>
              <TableHead className="py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</TableHead>
              <TableHead className="pr-4 py-3 w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((story) => (
              <TableRow key={story.id} className="border-zinc-100 hover:bg-zinc-50/60 transition-colors">
                {/* Story name + collections */}
                <TableCell className="pl-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Icon icon="solar:document-text-bold-duotone" width={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">{story.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {story.collections.map(c => (
                          <span key={c} className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-md">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Channel */}
                <TableCell className="py-4">
                  <span className="text-sm text-zinc-500">{story.channel}</span>
                </TableCell>

                {/* Posts */}
                <TableCell className="py-4">
                  <span className="text-sm font-semibold text-zinc-800">{story.postCount}</span>
                </TableCell>

                {/* Updated */}
                <TableCell className="py-4">
                  <span className="text-xs text-zinc-400">{story.updatedAt}</span>
                </TableCell>

                {/* Status toggle + badge */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-2.5">
                    <Switch
                      checked={story.status === "active"}
                      onCheckedChange={() => toggleStatus(story.id)}
                      className="data-[state=checked]:bg-teal-500"
                    />
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-semibold rounded-full px-2 pointer-events-none ${
                        story.status === "active"
                          ? "bg-teal-50 text-teal-600 border border-teal-100"
                          : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                      }`}
                    >
                      {story.status}
                    </Badge>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="pr-4 py-4">
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
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-sm text-zinc-400">
                  No stories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
