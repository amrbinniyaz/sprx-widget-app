"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid, Heart, MessageCircle, Settings, Paintbrush,
  Copy, CheckCircle2, Share2, Monitor, Smartphone, Link2, AppWindow,
  Image as ImageIcon, X,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

const LayoutIcons = {
  Grid: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" className={className} fill="currentColor">
      <rect x="6" y="6" width="10" height="10" rx="1.5" />
      <rect x="19" y="6" width="10" height="10" rx="1.5" />
      <rect x="32" y="6" width="10" height="10" rx="1.5" />
      <rect x="6" y="19" width="10" height="10" rx="1.5" />
      <rect x="19" y="19" width="10" height="10" rx="1.5" />
      <rect x="32" y="19" width="10" height="10" rx="1.5" />
      <rect x="6" y="32" width="10" height="10" rx="1.5" />
      <rect x="19" y="32" width="10" height="10" rx="1.5" />
      <rect x="32" y="32" width="10" height="10" rx="1.5" />
    </svg>
  ),
  Masonry: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" className={className} fill="currentColor">
      <rect x="6" y="6" width="10" height="14" rx="1.5" />
      <rect x="6" y="23" width="10" height="19" rx="1.5" />
      <rect x="19" y="6" width="10" height="19" rx="1.5" />
      <rect x="19" y="28" width="10" height="14" rx="1.5" />
      <rect x="32" y="12" width="10" height="13" rx="1.5" />
      <rect x="32" y="28" width="10" height="14" rx="1.5" />
      <rect x="32" y="6" width="10" height="3" rx="1.5" />
    </svg>
  ),
  List: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" className={className} fill="currentColor">
      <rect x="8" y="6" width="32" height="10" rx="1.5" />
      <rect x="8" y="19" width="32" height="10" rx="1.5" />
      <rect x="8" y="32" width="32" height="10" rx="1.5" />
    </svg>
  ),
  Carousel: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" className={className} fill="currentColor">
      <path d="M8 20L4 24L8 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 20L44 24L40 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="11" y="14" width="7" height="20" rx="1.5" />
      <rect x="20.5" y="14" width="7" height="20" rx="1.5" />
      <rect x="30" y="14" width="7" height="20" rx="1.5" />
    </svg>
  ),
  Slider: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" className={className} fill="currentColor">
      <path d="M10 20L6 24L10 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M38 20L42 24L38 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="14" y="8" width="20" height="26" rx="1.5" />
      <circle cx="21" cy="40" r="1.5" />
      <circle cx="24" cy="40" r="1.5" />
      <circle cx="27" cy="40" r="1.5" />
    </svg>
  ),
};

const layouts = [
  { id: "grid", label: "Grid", icon: LayoutIcons.Grid },
  { id: "masonry", label: "Masonry", icon: LayoutIcons.Masonry },
  { id: "list", label: "List", icon: LayoutIcons.List },
  { id: "carousel", label: "Carousel", icon: LayoutIcons.Carousel },
  { id: "slider", label: "Slider", icon: LayoutIcons.Slider },
];

const mockPosts = [
  { id: 1, author: "eat_for_pleasure", time: "March 30, 2026", text: "Love is like the wind, you can't see it but you can feel it.", likes: 204, comments: 12, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80", aspect: "aspect-[4/5]" },
  { id: 2, author: "baking_magic", time: "April 2, 2026", text: "The perfect chocolate swirl cake is all about the right icing technique.", likes: 856, comments: 42, image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=80", aspect: "aspect-square" },
  { id: 3, author: "travel_diaries", time: "April 5, 2026", text: "Barcelona skyline hits different from up here. Architectural masterpiece.", likes: 1240, comments: 89, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80", aspect: "aspect-[3/4]" },
  { id: 4, author: "arch_digest", time: "April 8, 2026", text: "Look closely at the incredibly detailed ceiling of the Pantheon.", likes: 3120, comments: 156, image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80", aspect: "aspect-[4/5]" },
  { id: 5, author: "event_planner", time: "April 10, 2026", text: "Sparklers make every celebration grand!", likes: 890, comments: 24, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80", aspect: "aspect-[16/9]" },
  { id: 6, author: "design_inspo", time: "April 12, 2026", text: "Sleek workspace minimal setup. What do you think?", likes: 450, comments: 18, image: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&q=80", aspect: "aspect-[4/3]" },
];

export interface WidgetConfig {
  name: string;
  layout: string;
  columns: string;
  spacing: string;
  theme: string;
  showAuthor: boolean;
  showCaption: boolean;
}

interface WidgetEditorProps {
  onSave: (config: WidgetConfig) => void;
  onCancel: () => void;
  initialConfig?: Partial<WidgetConfig>;
}

export function WidgetEditor({ onSave, onCancel, initialConfig }: WidgetEditorProps) {
  const [activeTab, setActiveTab] = useState("sources");
  const [device, setDevice] = useState("desktop");
  const [copied, setCopied] = useState(false);
  const [enabledSources, setEnabledSources] = useState<Record<string, boolean>>({
    ig: true, fb: true, tt: true, x: true, li: true, yt: false, pi: false, gg: false,
  });

  const toggleSource = (id: string) =>
    setEnabledSources((prev) => ({ ...prev, [id]: !prev[id] }));

  const [config, setConfig] = useState<WidgetConfig>({
    name: initialConfig?.name ?? "New Widget",
    layout: initialConfig?.layout ?? "grid",
    columns: initialConfig?.columns ?? "3",
    spacing: initialConfig?.spacing ?? "20px",
    theme: initialConfig?.theme ?? "light",
    showAuthor: initialConfig?.showAuthor ?? true,
    showCaption: initialConfig?.showCaption ?? true,
  });

  const embedCode = `<script src="https://cdn.sprx.cloud/widget.js" data-id="wq_1" data-layout="${config.layout}" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied successfully!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getContainerClass = () => {
    if (config.layout === "carousel" || config.layout === "slider") return "flex overflow-x-auto gap-5 snap-x snap-mandatory pb-6";
    if (config.layout === "list") return "flex flex-col gap-6 w-full max-w-2xl mx-auto";
    if (device === "mobile") return config.layout === "masonry" ? "columns-1 gap-5 space-y-5" : "grid grid-cols-1 gap-5";
    if (config.layout === "masonry") {
      if (config.columns === "2") return "columns-2 gap-5";
      if (config.columns === "4") return "columns-4 gap-5";
      return "columns-3 gap-5";
    }
    if (config.columns === "2") return "grid grid-cols-2 gap-5";
    if (config.columns === "4") return "grid grid-cols-4 gap-5";
    return "grid grid-cols-3 gap-5";
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Modal header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <X size={18} />
          </button>
          <div>
            <input
              value={config.name}
              onChange={(e) => setConfig((c) => ({ ...c, name: e.target.value }))}
              className="text-lg font-bold text-zinc-900 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-purple-400 focus:outline-none transition-colors px-1 py-0.5"
              placeholder="Widget name..."
            />
            <p className="text-xs text-zinc-400 px-1 mt-0.5">Configure your widget below</p>
          </div>
        </div>
        <Button
          onClick={() => {
            onSave(config);
            toast.success("Widget saved successfully!");
          }}
          className=""
        >
          Save Widget
        </Button>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Far-left slim sidebar */}
        <div className="w-[72px] bg-zinc-950 flex flex-col items-center py-6 gap-6 border-r border-zinc-800 shrink-0">
          {[
            { id: "sources", icon: Link2, label: "Sources" },
            { id: "header", icon: AppWindow, label: "Header" },
            { id: "layout", icon: LayoutGrid, label: "Layout" },
            { id: "post", icon: ImageIcon, label: "Post" },
            { id: "style", icon: Paintbrush, label: "Style" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 p-2 transition-all w-full ${
                activeTab === tab.id ? "text-blue-500 opacity-100" : "text-zinc-500 opacity-70 hover:opacity-100 hover:text-zinc-300"
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? "text-blue-500" : ""} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Configuration Panel */}
        <div className="w-[320px] bg-[#2A2B2D] text-zinc-100 flex flex-col overflow-y-auto border-r border-zinc-800 shrink-0">
          <div className="py-5 px-6 border-b border-zinc-800/50">
            <h2 className="text-sm font-semibold capitalize tracking-wide">{activeTab}</h2>
          </div>

          <div className="p-6">
            {activeTab === "sources" && (
              <div className="space-y-6 animate-fade-in-up">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-4">Connected Sources</p>
                <div className="space-y-3">
                  {[
                    { id: "ig", name: "Instagram",  user: "@eat_for_pleasure", iconId: "mdi:instagram",       bg: "linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)", color: "white"   },
                    { id: "fb", name: "Facebook",   user: "@sprx_school",      iconId: "logos:facebook",      bg: "#fff",                                               color: undefined },
                    { id: "tt", name: "TikTok",     user: "@travel_diaries",   iconId: "logos:tiktok",        bg: "#fff",                                               color: undefined },
                    { id: "x",  name: "X (Twitter)",user: "@arch_digest",      iconId: "logos:x",             bg: "#fff",                                               color: undefined },
                    { id: "li", name: "LinkedIn",   user: "@sprx_official",    iconId: "logos:linkedin-icon", bg: "#fff",                                               color: undefined },
                    { id: "yt", name: "YouTube",    user: "@sprxchannel",      iconId: "logos:youtube-icon",  bg: "#fff",                                               color: undefined },
                    { id: "pi", name: "Pinterest",  user: "@sprx_pins",        iconId: "logos:pinterest",     bg: "#fff",                                               color: undefined },
                    { id: "gg", name: "Google",     user: "@sprx_school",      iconId: "logos:google-icon",   bg: "#fff",                                               color: undefined },
                  ].map((source) => (
                    <div key={source.id} className="bg-[#1C1C1D] border border-zinc-800 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-zinc-700 hover:bg-[#202123] transition-colors shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: source.bg }}>
                          <Icon icon={source.iconId} width={22} height={22} color={source.color} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-zinc-200">{source.name}</p>
                          <p className="text-[11px] text-zinc-500 font-medium">{source.user}</p>
                        </div>
                      </div>
                      <Switch
                        checked={!!enabledSources[source.id]}
                        onCheckedChange={() => toggleSource(source.id)}
                        className="data-[checked]:bg-emerald-500 scale-[0.8]"
                      />
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-[12px] border border-zinc-700 h-10 rounded-xl mt-2 transition-all">
                  + Add Source
                </Button>
              </div>
            )}

            {activeTab === "header" && (
              <div className="space-y-6 animate-fade-in-up">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-4">Header Configuration</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-[13px] text-zinc-300 font-medium">Show Title Header</span>
                    <Switch checked={true} className="data-[state=checked]:bg-blue-500 scale-[0.8]" />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800 opacity-50 pointer-events-none">
                    <span className="text-[13px] text-zinc-300 font-medium">Show Follow Button</span>
                    <Switch checked={false} className="scale-[0.8]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "layout" && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                  {layouts.map((l) => {
                    const isActive = config.layout === l.id;
                    return (
                      <button
                        key={l.id}
                        onClick={() => setConfig((c) => ({ ...c, layout: l.id }))}
                        className={`flex flex-col items-center justify-center relative p-3 rounded-[4px] border-2 transition-all gap-1.5 ${
                          isActive ? "border-blue-500 bg-transparent" : "border-transparent hover:border-zinc-700"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute -top-2.5 -right-2.5 w-[20px] h-[20px] bg-blue-500 rounded-full border-[3px] border-[#2A2B2D] flex items-center justify-center z-10">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-[10px] h-[10px] text-white stroke-white">
                              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                        <l.icon className={`w-[52px] h-[52px] ${isActive ? "text-blue-500" : "text-zinc-500"}`} />
                        <span className={`text-[12px] font-medium ${isActive ? "text-blue-500" : "text-zinc-500"}`}>{l.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-4">Customize Layout</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                      <span className="text-[13px] text-zinc-300 font-medium">Columns</span>
                      <select
                        value={config.columns}
                        onChange={(e) => setConfig((c) => ({ ...c, columns: e.target.value }))}
                        className="bg-transparent text-blue-400 text-[13px] font-medium outline-none text-right cursor-pointer"
                      >
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                      <span className="text-[13px] text-zinc-300 font-medium">Item Spacing</span>
                      <span className="text-blue-400 text-[13px] font-medium">{config.spacing}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                      <span className="text-[13px] text-zinc-300 font-medium">Load More Button</span>
                      <Switch checked={true} className="data-[state=checked]:bg-blue-500 scale-[0.8]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "post" && (
              <div className="space-y-6 animate-fade-in-up">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-4">Post Elements</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-[13px] text-zinc-300 font-medium">Show Author Profile</span>
                    <Switch checked={config.showAuthor} onCheckedChange={(v) => setConfig((c) => ({ ...c, showAuthor: v }))} className="data-[state=checked]:bg-blue-500 scale-[0.8]" />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-[13px] text-zinc-300 font-medium">Show Native Captions</span>
                    <Switch checked={config.showCaption} onCheckedChange={(v) => setConfig((c) => ({ ...c, showCaption: v }))} className="data-[state=checked]:bg-blue-500 scale-[0.8]" />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-[13px] text-zinc-300 font-medium">Enable Hover Effects</span>
                    <Switch checked={true} className="data-[state=checked]:bg-blue-500 scale-[0.8]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "style" && (
              <div className="space-y-6 animate-fade-in-up">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-4">Theme & Colors</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-[13px] text-zinc-300 font-medium">Embed Theme</span>
                    <select className="bg-transparent text-blue-400 text-[13px] font-medium outline-none text-right cursor-pointer">
                      <option>Light Theme</option>
                      <option>Dark Theme</option>
                      <option>Auto (System)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-[13px] text-zinc-300 font-medium">Accent Color</span>
                    <div className="w-5 h-5 rounded-full bg-blue-500 border border-zinc-600 cursor-pointer" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6 animate-fade-in-up">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-4">Installation</p>
                <div className="bg-[#1C1C1D] border border-zinc-800 rounded-xl p-4">
                  <p className="text-[12px] font-medium text-zinc-400 mb-3 leading-relaxed">Copy this code and paste it exactly where you want the widget to appear.</p>
                  <div className="bg-black/50 overflow-x-auto rounded-md p-3 mb-3 border border-zinc-800/50">
                    <pre className="text-[10px] text-zinc-500 font-mono">
                      <code dangerouslySetInnerHTML={{ __html: embedCode.replace(/</g, "&lt;").replace(/"([^"]*)"/g, '<span class="text-blue-400">"$1"</span>') }} />
                    </pre>
                  </div>
                  <Button onClick={handleCopy} className="w-full h-8 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-bold rounded-lg transition-colors">
                    {copied ? <><CheckCircle2 size={13} className="mr-1.5" /> Copied!</> : <><Copy size={13} className="mr-1.5" /> Copy Code</>}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="flex-1 bg-[#F5F7FA] relative flex flex-col items-center overflow-hidden">
          {/* Top bar for preview controls */}
          <div className="absolute top-0 right-0 left-0 bg-white/60 backdrop-blur-md border-b border-zinc-200 h-14 flex items-center justify-center gap-2 z-10">
            <div className="bg-white border text-zinc-500 rounded-md p-1 shadow-sm flex items-center">
              <button onClick={() => setDevice("desktop")} className={`p-1.5 rounded transition-all ${device === "desktop" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "hover:text-zinc-900"}`}>
                <Monitor size={16} />
              </button>
              <button onClick={() => setDevice("mobile")} className={`p-1.5 rounded transition-all ${device === "mobile" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "hover:text-zinc-900"}`}>
                <Smartphone size={16} />
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="w-full h-full overflow-y-auto px-4 pt-20 pb-8 custom-scrollbar">
            <div className={`mx-auto transition-all duration-500 ease-out ${device === "mobile" ? "max-w-[400px]" : "max-w-[1000px] w-full"}`}>
              <div className={`${getContainerClass()} transition-all duration-500`}>
                {mockPosts.slice(0, config.layout === "slider" ? 1 : 12).map((post, i) => (
                  <div
                    key={post.id}
                    className={`bg-white rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-shadow group flex flex-col ${
                      config.layout === "masonry" ? "break-inside-avoid mb-5 inline-block w-full" : ""
                    } ${
                      config.layout === "carousel" || config.layout === "slider"
                        ? `min-w-[85%] ${config.layout === "carousel" ? "md:min-w-[45%]" : "md:min-w-[100%]"} flex-shrink-0 snap-center`
                        : ""
                    }`}
                    style={{ animation: `fade-in-up 0.5s ${i * 0.1}s both` }}
                  >
                    <div className={`relative ${config.layout === "slider" ? "aspect-[2/1]" : post.aspect} overflow-hidden w-full bg-zinc-100`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.image} alt="post media" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 right-4 flex flex-col justify-end text-white z-10 pointer-events-none">
                        {config.showCaption && (
                          <p className="text-[13px] font-medium leading-relaxed line-clamp-2 mb-3 text-white/95">{post.text}</p>
                        )}
                        {config.showAuthor && (
                          <div className="flex items-center gap-2 mb-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.image} className="w-6 h-6 rounded-full border border-white/20 object-cover" alt="" />
                            <div>
                              <p className="text-[11px] font-bold text-white">@{post.author}</p>
                              <p className="text-[9px] text-white/70">{post.time}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white border-t border-zinc-100">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1.5 text-[12px] font-bold text-zinc-700 cursor-pointer hover:text-rose-500 transition-colors">
                          <Heart size={14} className="stroke-2" /> {post.likes}
                        </span>
                        <span className="flex items-center gap-1.5 text-[12px] font-bold text-zinc-700 cursor-pointer hover:text-blue-500 transition-colors">
                          <MessageCircle size={14} className="stroke-2" /> {post.comments}
                        </span>
                      </div>
                      <span className="flex items-center gap-1.5 text-[12px] font-bold text-zinc-500 hover:text-zinc-900 cursor-pointer transition-colors">
                        <Share2 size={13} className="stroke-2" /> Share
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center pb-8 border-b border-zinc-200/50">
                <button className="bg-white border border-zinc-200 text-zinc-700 font-bold text-[13px] px-8 py-3 rounded-xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all">
                  Load More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
