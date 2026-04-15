"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Lock, Plus, Link as LinkIcon, Radio, AtSign, Rss } from "lucide-react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

const platforms = [
  { id: "instagram", name: "Instagram", iconId: "logos:instagram-icon", available: true },
  { id: "facebook",  name: "Facebook",  iconId: "logos:facebook",        available: true },
  { id: "x",         name: "X (Twitter)", iconId: "logos:x",             available: true },
  { id: "tiktok",    name: "TikTok",    iconId: "logos:tiktok-icon",      available: true },
  { id: "linkedin",  name: "LinkedIn",  iconId: "logos:linkedin-icon",    available: true },
  { id: "youtube",   name: "YouTube",   iconId: "logos:youtube-icon",     available: true },
  { id: "pinterest", name: "Pinterest", iconId: "logos:pinterest",        available: true },
  { id: "rss",       name: "RSS Feed",  iconId: "logos:rss",              available: true },
  { id: "vimeo",     name: "Vimeo",     iconId: "logos:vimeo-icon",       available: false },
  { id: "tumblr",    name: "Tumblr",    iconId: "logos:tumblr",           available: false },
  { id: "flickr",    name: "Flickr",    iconId: "logos:flickr",           available: false },
  { id: "soundcloud",name: "SoundCloud",iconId: "logos:soundcloud",       available: false },
];

// Platforms that use a username/handle input
const usernameInput = new Set(["instagram", "x", "pinterest", "youtube"]);
// Platforms that use a URL input
const urlInput = new Set(["rss"]);
// Everything else gets an OAuth button

function ConnectModal({
  platform,
  onClose,
  onConnected,
}: {
  platform: typeof platforms[number];
  onClose: () => void;
  onConnected: (id: string) => void;
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const isUsername = usernameInput.has(platform.id);
  const isUrl      = urlInput.has(platform.id);
  const isOAuth    = !isUsername && !isUrl;

  const handleConnect = async () => {
    if ((isUsername || isUrl) && !value.trim()) {
      toast.error(isUrl ? "Please enter a valid URL" : "Please enter your username");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onConnected(platform.id);
    onClose();
    toast.success(`${platform.name} connected successfully!`);
  };

  return (
    <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-zinc-100 shadow-xl">
      {/* Header band */}
      <div className="px-6 pt-6 pb-5 border-b border-zinc-100">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <Icon icon={platform.iconId} className="w-7 h-7" />
            <DialogTitle className="text-[17px] font-semibold text-zinc-900">
              Connect {platform.name}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[13px] text-zinc-400 leading-relaxed">
            {isUsername && `Enter your ${platform.name} username so SprX can sync your posts and analytics.`}
            {isUrl      && "Paste your RSS feed URL. SprX will automatically sync new entries."}
            {isOAuth    && `Authorise SprX to read your ${platform.name} content. You can revoke access at any time.`}
          </DialogDescription>
        </DialogHeader>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        {isUsername && (
          <div className="relative">
            <AtSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder={`your${platform.id === "x" ? "_handle" : platform.id === "youtube" ? "channel" : "schoolname"}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pl-9 h-[46px] rounded-xl border-zinc-200 text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-purple-400/40 focus-visible:border-purple-400"
              autoFocus
            />
          </div>
        )}

        {isUrl && (
          <div className="relative">
            <Rss size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="https://yourschool.com/feed.xml"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pl-9 h-[46px] rounded-xl border-zinc-200 text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-purple-400/40 focus-visible:border-purple-400"
              autoFocus
            />
          </div>
        )}

        {isOAuth && (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-[46px] rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors font-semibold text-[14px] text-zinc-800 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin text-zinc-400" />
            ) : (
              <Icon icon={platform.iconId} className="w-5 h-5" />
            )}
            {loading ? "Connecting…" : `Continue with ${platform.name}`}
          </button>
        )}

        {(isUsername || isUrl) && (
          <Button
            onClick={handleConnect}
            disabled={loading}
            className="w-full h-[46px] rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[14px]"
          >
            {loading ? <><Loader2 size={15} className="animate-spin mr-2" /> Connecting…</> : "Connect account"}
          </Button>
        )}

        <p className="text-center text-[11px] text-zinc-300">
          SprX only reads your public content. We never post on your behalf.
        </p>
      </div>
    </DialogContent>
  );
}

export default function ChannelPage() {
  const router = useRouter();
  const [connected, setConnected] = useState<string[]>([]);
  const [activePlatform, setActivePlatform] = useState<typeof platforms[number] | null>(null);

  const handleRowClick = (p: typeof platforms[number]) => {
    if (!p.available) { toast.info("This integration is coming soon!"); return; }
    if (connected.includes(p.id)) return;
    setActivePlatform(p);
  };

  const handleConnected = (id: string) => {
    setConnected((prev) => [...prev, id]);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col justify-center min-h-[calc(100vh-10rem)]">
      <Dialog open={!!activePlatform} onOpenChange={(open) => { if (!open) setActivePlatform(null); }}>
        {activePlatform && (
          <ConnectModal
            platform={activePlatform}
            onClose={() => setActivePlatform(null)}
            onConnected={handleConnected}
          />
        )}
      </Dialog>
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-4">
          <LinkIcon size={12} className="text-purple-500" /> Step 2: Connect profiles
        </div>
        <h1 className="text-3xl sm:text-4xl font-light text-zinc-900 mb-3 tracking-tight">
          Unify your digital <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600">footprint.</span>
        </h1>
        <p className="text-zinc-500 text-sm sm:text-[15px] font-medium max-w-2xl mx-auto leading-relaxed">
          SprX automatically ingests and curates your content. Securely connect at least one channel to power your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
        {platforms.map((p, i) => {
          const isConnected = connected.includes(p.id);

          return (
            <div
              key={p.id}
              onClick={() => handleRowClick(p)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 animate-fade-in-up group ${
                isConnected
                  ? "border-green-200 bg-green-50/60 cursor-default"
                  : p.available
                    ? "border-white/70 bg-white/50 backdrop-blur-xl hover:bg-white hover:border-zinc-200 hover:shadow-sm cursor-pointer"
                    : "border-white/30 bg-white/20 opacity-50 cursor-not-allowed"
              }`}
              style={{ animationDelay: `${i * 25}ms` }}
            >
              <Icon
                icon={p.iconId}
                className={`w-6 h-6 shrink-0 transition-transform duration-200 ${p.available && !isConnected ? "group-hover:scale-110" : ""} ${!p.available ? "grayscale" : ""}`}
              />

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-zinc-800 leading-none">{p.name}</p>
                <p className={`text-[11px] mt-0.5 transition-colors ${isConnected ? "text-green-600 font-medium" : p.available ? "text-zinc-400 group-hover:text-purple-500" : "text-zinc-400"}`}>
                  {isConnected ? "Connected & syncing" : p.available ? "Click to connect" : "Coming 2026"}
                </p>
              </div>

              <div className="shrink-0">
                {!p.available && <Lock size={13} className="text-zinc-300" />}
                {isConnected && <CheckCircle2 size={18} className="text-green-500" />}
                {p.available && !isConnected && (
                  <div className="w-6 h-6 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-300 group-hover:border-purple-300 group-hover:text-purple-500 group-hover:bg-purple-50 transition-all">
                    <Plus size={13} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`transition-all duration-500 overflow-hidden ${connected.length > 0 ? "opacity-100 max-h-[150px] mb-6" : "opacity-0 max-h-0"}`}>
        <div className="bg-white/60 backdrop-blur-xl border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_8px_30px_rgba(74,222,128,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shadow-inner relative">
               <Radio size={16} className="text-green-600 absolute" />
               <div className="w-full h-full rounded-full border-2 border-green-400 animate-ping opacity-20" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-zinc-900 leading-tight">Sync engine initiated</h4>
              <p className="text-[12px] text-zinc-500 font-medium">Successfully connecting {connected.length} channels to your dashboard.</p>
            </div>
          </div>
          <div className="flex -space-x-3">
             {connected.map((id, i) => {
               const platform = platforms.find(p => p.id === id);
               return platform ? (
                 <div key={id} className={`w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm z-[${20-i}]`}>
                   <Icon icon={platform.iconId} className="w-4 h-4" />
                 </div>
               ) : null;
             })}
          </div>
        </div>
      </div>

      <div className="flex justify-end bg-white/40 backdrop-blur-md border border-white rounded-2xl p-4 shadow-sm">
        <Button onClick={() => {
          if (connected.length === 0) { toast.error("Please connect at least one channel to continue"); return; }
          router.push("/onboarding/widget");
        }} className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[14px] px-6 h-[46px] rounded-lg transition-all duration-300 group">
          <span className="flex items-center justify-center gap-2">
            Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </div>
    </div>
  );
}
