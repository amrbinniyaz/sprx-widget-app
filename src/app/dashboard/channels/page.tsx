"use client";

import { useState } from "react";
import { mockChannels } from "@/lib/mock-data";
import { Plus, RefreshCw, Settings2, Unlink, CheckCircle2, AlertCircle, Loader2, Wifi } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const statusConfig = {
  active: { label: "Active", color: "text-teal-600", bg: "bg-teal-50 border-teal-200", icon: CheckCircle2 },
  syncing: { label: "Syncing", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Loader2 },
  error: { label: "Error", color: "text-rose-600", bg: "bg-rose-50 border-rose-200", icon: AlertCircle },
};

const platformIconMap: Record<string, string> = {
  instagram: "logos:instagram-icon",
  facebook: "logos:facebook",
  x: "logos:x",
  linkedin: "logos:linkedin-icon",
  youtube: "logos:youtube-icon",
};

export default function ChannelsPage() {
  const [channels, setChannels] = useState(mockChannels);
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleSync = async (id: string) => {
    setSyncing(id);
    await new Promise(r => setTimeout(r, 1500));
    setSyncing(null);
    toast.success("Channel synced successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{channels.length} channels connected across {channels.filter(c => c.status === "active").length} platforms active</p>
        </div>
        <Button><Plus size={15} /> Connect Channel</Button>
      </div>

      {/* Channel grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {channels.map((ch) => {
          const status = statusConfig[ch.status];
          const StatusIcon = status.icon;
          const isSyncing = syncing === ch.id;

          return (
            <div key={ch.id} className="bg-white rounded-2xl p-5 border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all group">
              {/* Platform icon + status */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center transition-transform group-hover:scale-110">
                  {platformIconMap[ch.platform.toLowerCase()]
                    ? <Icon icon={platformIconMap[ch.platform.toLowerCase()]} width={28} height={28} />
                    : <Wifi size={20} className="text-zinc-400" />
                  }
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.bg} ${status.color}`}>
                  <StatusIcon size={11} className={isSyncing || ch.status === "syncing" ? "animate-spin" : ""} />
                  {status.label}
                </span>
              </div>

              <h3 className="font-semibold text-zinc-900 mb-0.5">{ch.name}</h3>
              <p className="text-sm text-zinc-400 mb-4">{ch.handle}</p>

              <div className="flex items-center justify-between text-xs text-zinc-400 mb-5 pb-5 border-b border-zinc-100">
                <span><span className="text-zinc-800 font-medium">{ch.postCount.toLocaleString()}</span> posts synced</span>
                <span>Last sync: {ch.lastSynced}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSync(ch.id)}
                  disabled={!!syncing}
                  className="flex-1"
                >
                  <RefreshCw size={12} className={isSyncing ? "animate-spin text-teal-600" : ""} />
                  {isSyncing ? "Syncing..." : "Sync now"}
                </Button>
                <Button variant="outline" size="icon-sm">
                  <Settings2 size={12} />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => { setChannels(c => c.filter(x => x.id !== ch.id)); toast.success("Channel disconnected"); }}
                  className="hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                >
                  <Unlink size={12} />
                </Button>
              </div>
            </div>
          );
        })}

        {/* Add new channel card */}
        <button className="bg-white rounded-2xl p-5 border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all group flex flex-col items-center justify-center gap-3 min-h-[200px]">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center transition-colors">
            <Plus size={20} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-500 group-hover:text-zinc-800 transition-colors">Connect channel</p>
            <p className="text-xs text-zinc-400 mt-0.5">22+ platforms available</p>
          </div>
        </button>
      </div>
    </div>
  );
}
