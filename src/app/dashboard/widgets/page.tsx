"use client";

import { useState } from "react";
import { mockWidgets } from "@/lib/mock-data";
import { Plus, Copy, Eye, Edit2, Trash2, CheckCircle2, LayoutGrid, Layers, Rows, Columns, ExternalLink, List } from "lucide-react";
import { toast } from "sonner";
import { WidgetEditor, type WidgetConfig } from "@/components/widget-editor/WidgetEditor";
import { Button } from "@/components/ui/button";

const layoutIcons = { grid: LayoutGrid, masonry: Columns, carousel: Layers, slider: Rows };
const layoutColors = {
  grid:     "text-violet-600 bg-violet-50",
  masonry:  "text-teal-600 bg-teal-50",
  carousel: "text-amber-600 bg-amber-50",
  slider:   "text-rose-600 bg-rose-50",
};
const layoutBg = {
  grid:     "bg-violet-50/60",
  masonry:  "bg-teal-50/60",
  carousel: "bg-amber-50/60",
  slider:   "bg-rose-50/60",
};

// ── Shared wireframe preview ──────────────────────────────────────────────────

function WireframePreview({ layout, size = "lg" }: { layout: string; size?: "lg" | "sm" }) {
  const isSmall = size === "sm";
  const gap = isSmall ? "gap-1" : "gap-1.5";

  if (layout === "grid") return (
    <div className={`grid grid-cols-3 ${gap} w-full`}>
      {[...Array(isSmall ? 3 : 6)].map((_, i) => (
        <div key={i} className={`bg-white rounded shadow-[0_1px_3px_rgb(0,0,0,0.08)] flex flex-col ${gap} p-1 ${!isSmall && i >= 3 ? "opacity-60" : ""}`}
          style={{ padding: isSmall ? 3 : 6 }}>
          <div className="w-full rounded-sm bg-zinc-200/80" style={{ height: isSmall ? 10 : 20 }} />
          <div className="w-3/4 h-1 rounded-full bg-zinc-200/60" />
        </div>
      ))}
    </div>
  );

  if (layout === "carousel") return (
    <div className={`flex ${gap} w-full`}>
      {[...Array(isSmall ? 2 : 3)].map((_, i) => (
        <div key={i} className={`flex-shrink-0 bg-white rounded shadow-[0_1px_3px_rgb(0,0,0,0.08)] flex flex-col ${gap} ${isSmall ? "w-[48%]" : "w-[38%]"} ${!isSmall && i === 2 ? "opacity-40" : ""}`}
          style={{ padding: isSmall ? 3 : 6 }}>
          <div className="w-full rounded-sm bg-zinc-200/80" style={{ height: isSmall ? 14 : 40 }} />
          <div className="w-4/5 h-1 rounded-full bg-zinc-200/60" />
        </div>
      ))}
    </div>
  );

  if (layout === "slider") return (
    <div className={`flex flex-col ${gap} w-full`}>
      <div className="w-full bg-white rounded shadow-[0_1px_3px_rgb(0,0,0,0.08)] flex gap-1.5 items-center" style={{ padding: isSmall ? 3 : 8 }}>
        <div className="rounded-sm bg-zinc-200/80 flex-shrink-0" style={{ width: isSmall ? 20 : 64, height: isSmall ? 16 : 48 }} />
        <div className="flex flex-col gap-1 flex-1">
          <div className="w-full h-1.5 rounded-full bg-zinc-200/80" />
          <div className="w-4/5 h-1 rounded-full bg-zinc-200/60" />
          {!isSmall && <div className="w-2/5 h-3 rounded bg-zinc-200/70 mt-0.5" />}
        </div>
      </div>
      <div className="flex justify-center gap-1">
        <div className="w-3 h-1 rounded-full bg-zinc-400" />
        <div className="w-1 h-1 rounded-full bg-zinc-300" />
        <div className="w-1 h-1 rounded-full bg-zinc-300" />
      </div>
    </div>
  );

  // masonry
  return (
    <div className={`flex ${gap} items-start w-full`}>
      {([[isSmall?18:52, isSmall?12:32], [isSmall?12:32, isSmall?18:48], [isSmall?16:44, isSmall?10:28]] as [number,number][]).map(([h1, h2], col) => (
        <div key={col} className={`flex flex-col ${gap} flex-1`}>
          <div className="bg-white rounded shadow-[0_1px_3px_rgb(0,0,0,0.08)] flex flex-col gap-0.5" style={{ height: h1, padding: isSmall ? 2 : 6 }}>
            <div className="flex-1 rounded-sm bg-zinc-200/80" />
          </div>
          <div className="bg-white rounded shadow-[0_1px_3px_rgb(0,0,0,0.08)] flex flex-col gap-0.5" style={{ height: h2, padding: isSmall ? 2 : 6 }}>
            <div className="flex-1 rounded-sm bg-zinc-200/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState(mockWidgets);
  const [copied, setCopied] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const handleSaveWidget = (config: WidgetConfig) => {
    const id = `wq_${Date.now()}`;
    setWidgets((prev) => [...prev, {
      id,
      name: config.name,
      layout: config.layout as "grid",
      storyId: "",
      story: "New Story",
      theme: config.theme,
      columns: parseInt(config.columns),
      sites: 0,
      embedCode: `<script src="https://cdn.sprx.cloud/widget.js" data-id="${id}" data-layout="${config.layout}" async></script>`,
    }]);
    setShowEditor(false);
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    toast.success("Embed code copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = (id: string) => {
    setWidgets(prev => prev.filter(x => x.id !== id));
    toast.success("Widget deleted");
  };

  return (
    <>
      {showEditor && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <WidgetEditor onSave={handleSaveWidget} onCancel={() => setShowEditor(false)} />
        </div>
      )}

      <div className="space-y-5 animate-fade-in-up">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">{widgets.length} widgets · paste one line of code on any website</p>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center gap-0.5 bg-zinc-100 border border-zinc-200 rounded-xl p-1">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                <List size={15} />
              </button>
            </div>
            <Button onClick={() => setShowEditor(true)}>
              <Plus size={15} /> Create Widget
            </Button>
          </div>
        </div>

        {/* ── GRID VIEW ────────────────────────────────────────────────── */}
        {view === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {widgets.map((w) => {
              const LayoutIcon = layoutIcons[w.layout] || LayoutGrid;
              const layoutColor = layoutColors[w.layout] || layoutColors.grid;
              const previewBg = layoutBg[w.layout] || layoutBg.grid;
              const isCopied = copied === w.id;

              return (
                <div key={w.id} className="bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
                  {/* Wireframe preview */}
                  <div className={`h-36 ${previewBg} relative overflow-hidden px-4 pt-4 pb-3 flex flex-col justify-center`}>
                    <WireframePreview layout={w.layout} size="lg" />
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${layoutColor} uppercase tracking-wider`}>
                        <LayoutIcon size={10} strokeWidth={2.5} />
                        {w.layout}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-[18px] font-bold text-zinc-900 mb-1 leading-tight tracking-tight">{w.name}</h3>
                    <p className="text-[12px] font-medium text-zinc-400 mb-4 flex items-center gap-1.5">
                      <Layers size={13} /> {w.story}
                    </p>

                    <div className="flex items-center gap-4 text-[12px] font-semibold text-zinc-500 mb-5 pb-5 border-b border-zinc-100">
                      <span className="flex items-center gap-1.5">
                        <ExternalLink size={13} className="text-zinc-400" />
                        {w.sites} site{w.sites !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1.5 text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 size={11} className="stroke-[3]" />
                        Active
                      </span>
                    </div>

                    {/* Embed snippet */}
                    <div
                      onClick={() => handleCopy(w.id, w.embedCode)}
                      className="flex items-center justify-between gap-3 bg-zinc-50 border border-zinc-100 rounded-xl px-3.5 py-2.5 mb-5 cursor-pointer hover:border-zinc-300 hover:bg-zinc-100/80 transition-all group/code"
                    >
                      <code className="font-mono text-[11px] text-zinc-500 truncate">
                        <span className="text-violet-600 font-semibold">&lt;script</span>
                        {" "}<span className="text-zinc-400">data-id=</span>
                        <span className="text-amber-600">&quot;{w.id}&quot;</span>
                        <span className="text-violet-600 font-semibold"> /&gt;</span>
                      </code>
                      <span className="flex-shrink-0">
                        {isCopied
                          ? <CheckCircle2 size={14} className="text-teal-500" />
                          : <Copy size={13} className="text-zinc-300 group-hover/code:text-zinc-500 transition-colors" />}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400">
                        {isCopied ? <span className="text-teal-500 font-medium">Copied to clipboard</span> : "Click snippet to copy"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setPreview(w.id)} className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"><Eye size={15} /></button>
                        <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(w.id)} className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-all"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Create card */}
            <button onClick={() => setShowEditor(true)} className="bg-white/40 backdrop-blur-sm rounded-[24px] border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-white/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-200 flex flex-col items-center justify-center gap-4 min-h-[360px] group">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-zinc-100 group-hover:border-zinc-300 group-hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200">
                <Plus size={20} className="text-zinc-400 group-hover:text-zinc-700 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-[15px] font-semibold text-zinc-500 group-hover:text-zinc-800 transition-colors">Create Widget</p>
                <p className="text-[12px] text-zinc-400 mt-1">Grid, carousel & masonry</p>
              </div>
            </button>
          </div>
        )}

        {/* ── LIST VIEW ────────────────────────────────────────────────── */}
        {view === "list" && (
          <div className="bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {/* Column headers */}
            <div className="grid items-center px-5 py-3 border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider"
              style={{ gridTemplateColumns: "80px 1fr 110px 80px 100px 180px 88px" }}>
              <span>Preview</span>
              <span>Widget</span>
              <span>Layout</span>
              <span>Sites</span>
              <span>Status</span>
              <span>Embed</span>
              <span />
            </div>

            {widgets.map((w, i) => {
              const LayoutIcon = layoutIcons[w.layout] || LayoutGrid;
              const layoutColor = layoutColors[w.layout] || layoutColors.grid;
              const previewBg = layoutBg[w.layout] || layoutBg.grid;
              const isCopied = copied === w.id;

              return (
                <div
                  key={w.id}
                  className={`grid items-center px-5 py-3.5 hover:bg-zinc-50/60 transition-colors ${i < widgets.length - 1 ? "border-b border-zinc-100" : ""}`}
                  style={{ gridTemplateColumns: "80px 1fr 110px 80px 100px 180px 88px" }}
                >
                  {/* Mini preview */}
                  <div className={`w-16 h-10 rounded-lg ${previewBg} flex items-center justify-center p-1.5 flex-shrink-0`}>
                    <WireframePreview layout={w.layout} size="sm" />
                  </div>

                  {/* Name + story */}
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{w.name}</p>
                    <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Layers size={11} /> {w.story}
                    </p>
                  </div>

                  {/* Layout badge */}
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${layoutColor} uppercase tracking-wide`}>
                    <LayoutIcon size={10} strokeWidth={2.5} />
                    {w.layout}
                  </span>

                  {/* Sites */}
                  <span className="text-sm text-zinc-500 flex items-center gap-1.5">
                    <ExternalLink size={13} className="text-zinc-300" />
                    {w.sites}
                  </span>

                  {/* Status */}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full w-fit">
                    <CheckCircle2 size={11} className="stroke-[3]" />
                    Active
                  </span>

                  {/* Embed snippet */}
                  <div
                    onClick={() => handleCopy(w.id, w.embedCode)}
                    className="flex items-center justify-between gap-2 bg-zinc-50 border border-zinc-100 rounded-lg px-2.5 py-1.5 cursor-pointer hover:border-zinc-300 hover:bg-zinc-100 transition-all group/code"
                  >
                    <code className="font-mono text-[10px] text-zinc-500 truncate">
                      <span className="text-violet-600 font-semibold">&lt;script</span>
                      <span className="text-amber-600"> &quot;{w.id}&quot;</span>
                      <span className="text-violet-600 font-semibold"> /&gt;</span>
                    </code>
                    <span className="flex-shrink-0">
                      {isCopied
                        ? <CheckCircle2 size={12} className="text-teal-500" />
                        : <Copy size={11} className="text-zinc-300 group-hover/code:text-zinc-500 transition-colors" />}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 justify-end">
                    <button onClick={() => setPreview(w.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"><Eye size={14} /></button>
                    <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(w.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
}
