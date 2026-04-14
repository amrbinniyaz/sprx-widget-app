"use client";

import { useState } from "react";
import { mockChannels } from "@/lib/mock-data";
import { Plus, RefreshCw, Settings2, Unlink, CheckCircle2, AlertCircle, Loader2, Wifi } from "lucide-react";
import { toast } from "sonner";

const statusConfig = {
  active: { label: "Active", color: "text-teal-600", bg: "bg-teal-50 border-teal-200", icon: CheckCircle2 },
  syncing: { label: "Syncing", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Loader2 },
  error: { label: "Error", color: "text-rose-600", bg: "bg-rose-50 border-rose-200", icon: AlertCircle },
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
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-purple-700 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md">
          <Plus size={15} /> Connect Channel
        </button>
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
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center`}>
                  <Wifi size={20} className="text-white" />
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
                <button
                  onClick={() => handleSync(ch.id)}
                  disabled={!!syncing}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-all flex-1 justify-center border border-zinc-200"
                >
                  <RefreshCw size={12} className={isSyncing ? "animate-spin text-teal-600" : ""} />
                  {isSyncing ? "Syncing..." : "Sync now"}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-all border border-zinc-200">
                  <Settings2 size={12} />
                </button>
                <button
                  onClick={() => { setChannels(c => c.filter(x => x.id !== ch.id)); toast.success("Channel disconnected"); }}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-all border border-zinc-200"
                >
                  <Unlink size={12} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add new channel card */}
        <button className="bg-white rounded-2xl p-5 border-2 border-dashed border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all group flex flex-col items-center justify-center gap-3 min-h-[200px]">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
            <Plus size={20} className="text-zinc-400 group-hover:text-brand-purple transition-colors" />
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
