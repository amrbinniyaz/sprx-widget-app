"use client";

import { useState } from "react";
import { mockWidgets } from "@/lib/mock-data";
import { Plus, Copy, Eye, Edit2, Trash2, CheckCircle2, LayoutGrid, Layers, Rows, Columns, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const layoutIcons = { grid: LayoutGrid, masonry: Columns, carousel: Layers, slider: Rows };
const layoutColors = {
  grid: "text-brand-purple bg-purple-50",
  masonry: "text-teal-600 bg-teal-50",
  carousel: "text-amber-600 bg-amber-50",
  slider: "text-rose-600 bg-rose-50",
};

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState(mockWidgets);
  const [copied, setCopied] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{widgets.length} widgets · paste one line of code on any website</p>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-purple-700 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md">
          <Plus size={15} /> Create Widget
        </button>
      </div>

      {/* Widget grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {widgets.map((w) => {
          const LayoutIcon = layoutIcons[w.layout] || LayoutGrid;
          const layoutColor = layoutColors[w.layout] || layoutColors.grid;
          const isCopied = copied === w.id;

          return (
            <div key={w.id} className="bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all overflow-hidden group">
              {/* Preview thumbnail */}
              <div className="h-32 bg-gradient-to-br from-purple-50 via-teal-50/50 to-white border-b border-zinc-100 relative overflow-hidden">
                <div className="absolute inset-3 grid grid-cols-3 gap-1.5">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-lg opacity-50 ${
                        ["bg-pink-300", "bg-emerald-300", "bg-blue-300", "bg-purple-300", "bg-amber-300", "bg-cyan-300"][i]
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                <div className="absolute top-2 right-2">
                  <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${layoutColor}`}>
                    <LayoutIcon size={9} />
                    {w.layout}
                  </span>
                </div>
              </div>

              {/* Card content */}
              <div className="p-5">
                <h3 className="font-semibold text-zinc-900 mb-1">{w.name}</h3>
                <p className="text-xs text-zinc-400 mb-3">Story: {w.story}</p>

                <div className="flex items-center gap-3 text-xs text-zinc-400 mb-4">
                  <span className="flex items-center gap-1">
                    <ExternalLink size={11} />
                    {w.sites} site{w.sites !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1 text-teal-600">
                    <CheckCircle2 size={11} />
                    Embedded
                  </span>
                </div>

                {/* Embed code snippet */}
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 mb-4 font-mono text-[10px] text-zinc-400 overflow-hidden">
                  <span className="text-purple-600">&lt;script</span>
                  <span className="text-zinc-400"> src=</span>
                  <span className="text-teal-600">&quot;cdn.sprx.cloud/widget.js&quot;</span>
                  <span className="text-zinc-400"> data-id=</span>
                  <span className="text-amber-600">&quot;{w.id}&quot;</span>
                  <span className="text-purple-600">&gt;&lt;/script&gt;</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(w.id, w.embedCode)}
                    className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl text-xs font-medium transition-all border ${
                      isCopied
                        ? "bg-teal-50 border-teal-200 text-teal-600"
                        : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                    }`}
                  >
                    {isCopied ? <><CheckCircle2 size={12} /> Copied!</> : <><Copy size={12} /> Copy code</>}
                  </button>
                  <button onClick={() => setPreview(w.id)} className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all">
                    <Eye size={14} />
                  </button>
                  <button className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => { setWidgets(prev => prev.filter(x => x.id !== w.id)); toast.success("Widget deleted"); }}
                    className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Create new */}
        <button className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all flex flex-col items-center justify-center gap-3 min-h-[280px] group">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
            <Plus size={20} className="text-zinc-400 group-hover:text-brand-purple transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-500 group-hover:text-zinc-800 transition-colors">Create widget</p>
            <p className="text-xs text-zinc-400 mt-0.5">Grid, carousel, slider & more</p>
          </div>
        </button>
      </div>
    </div>
  );
}
