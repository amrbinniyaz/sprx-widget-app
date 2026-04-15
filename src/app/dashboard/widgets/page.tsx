"use client";

import { useState } from "react";
import { mockWidgets } from "@/lib/mock-data";
import { Plus, Copy, Eye, Edit2, Trash2, CheckCircle2, LayoutGrid, Layers, Rows, Columns, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { WidgetEditor, type WidgetConfig } from "@/components/widget-editor/WidgetEditor";

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
  const [showEditor, setShowEditor] = useState(false);

  const handleSaveWidget = (config: WidgetConfig) => {
    const id = `wq_${Date.now()}`;
    const newWidget = {
      id,
      name: config.name,
      layout: config.layout as "grid" | "masonry" | "carousel" | "slider",
      storyId: "",
      story: "New Story",
      theme: config.theme,
      columns: parseInt(config.columns),
      sites: 0,
      embedCode: `<script src="https://cdn.sprx.cloud/widget.js" data-id="${id}" data-layout="${config.layout}" async></script>`,
    };
    setWidgets((prev) => [...prev, newWidget]);
    setShowEditor(false);
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {/* Full-screen widget editor modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <WidgetEditor
            onSave={handleSaveWidget}
            onCancel={() => setShowEditor(false)}
          />
        </div>
      )}

    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{widgets.length} widgets · paste one line of code on any website</p>
        <button onClick={() => setShowEditor(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-purple-700 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md">
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
            <div key={w.id} className="bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/60 hover:border-purple-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(147,51,234,0.1)] transition-all overflow-hidden group">
              {/* Preview thumbnail */}
              <div className="h-32 bg-gradient-to-br from-purple-100/50 via-teal-100/30 to-white/80 border-b border-white relative overflow-hidden">
                <div className="absolute inset-4 grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-[8px] opacity-40 shadow-sm ${
                        ["bg-pink-400", "bg-emerald-400", "bg-blue-400", "bg-purple-400", "bg-amber-400", "bg-cyan-400"][i]
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${layoutColor} bg-white/50 backdrop-blur-md border border-white shadow-sm uppercase tracking-wider`}>
                    <LayoutIcon size={12} strokeWidth={2.5} />
                    {w.layout}
                  </span>
                </div>
              </div>

              {/* Card content */}
              <div className="p-6">
                <h3 className="text-[17px] font-bold text-zinc-900 mb-1 leading-tight">{w.name}</h3>
                <p className="text-[12px] font-medium text-zinc-400 mb-4 flex items-center gap-1.5">
                  <Layers size={13} /> {w.story}
                </p>

                <div className="flex items-center gap-4 text-[12px] font-semibold text-zinc-500 mb-5 pb-5 border-b border-zinc-200/60">
                  <span className="flex items-center gap-1.5 hover:text-zinc-800 transition-colors cursor-pointer">
                    <ExternalLink size={14} className="text-zinc-400" />
                    {w.sites} site{w.sites !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1.5 text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100/50">
                    <CheckCircle2 size={12} className="stroke-[3]" />
                    Active
                  </span>
                </div>

                {/* Embed code snippet */}
                <div className="bg-white/50 border border-white rounded-[14px] p-3 mb-5 font-mono text-[10px] text-zinc-500 overflow-hidden shadow-inner group-hover:bg-white transition-colors relative">
                  <span className="text-purple-600 font-bold">&lt;script</span>
                  <span className="text-zinc-400"> src=</span>
                  <span className="text-teal-600">&quot;cdn.sprx.cloud/widget.js&quot;</span>
                  <span className="text-zinc-400"> data-id=</span>
                  <span className="text-amber-600">&quot;{w.id}&quot;</span>
                  <span className="text-purple-600 font-bold">&gt;&lt;/script&gt;</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleCopy(w.id, w.embedCode)}
                    className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-[12px] text-[12px] font-bold transition-all border ${
                      isCopied
                        ? "bg-teal-500 border-teal-500 text-white shadow-sm"
                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-sm"
                    }`}
                  >
                    {isCopied ? <><CheckCircle2 size={14} className="stroke-[2.5]" /> Copied!</> : <><Copy size={13} className="stroke-[2.5]" /> Embed</>}
                  </button>
                  <button onClick={() => setPreview(w.id)} className="p-2.5 rounded-[12px] bg-white border border-zinc-200 text-zinc-500 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all shadow-sm">
                    <Eye size={16} />
                  </button>
                  <button className="p-2.5 rounded-[12px] bg-white border border-zinc-200 text-zinc-500 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all shadow-sm">
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => { setWidgets(prev => prev.filter(x => x.id !== w.id)); toast.success("Widget deleted"); }}
                    className="p-2.5 rounded-[12px] bg-white border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Create new */}
        <button onClick={() => setShowEditor(true)} className="bg-white/40 backdrop-blur-sm rounded-[24px] border-[3px] border-dashed border-zinc-300/60 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[340px] group shadow-sm hover:shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-zinc-100 group-hover:border-purple-200 group-hover:bg-purple-100 flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-1">
            <Plus size={24} className="text-zinc-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-[17px] font-bold text-zinc-600 group-hover:text-purple-900 transition-colors">Create Widget</p>
            <p className="text-[13px] font-medium text-zinc-400 mt-1">Grid, carousel & masonry</p>
          </div>
        </button>
      </div>
    </div>
    </>
  );
}
