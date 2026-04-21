"use client";

import { useState, useEffect } from "react";
import { mockChannels } from "@/lib/mock-data";
import { Plus, RefreshCw, Settings2, Unlink, AlertCircle, Loader2, Wifi, Lock, CheckCircle2, AtSign, Rss, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";

// ── platform catalog ─────────────────────────────────────────────────────────
const allPlatforms = [
  { id: "instagram", name: "Instagram",   iconId: "logos:instagram-icon", available: true  },
  { id: "facebook",  name: "Facebook",    iconId: "logos:facebook",       available: true  },
  { id: "x",         name: "X (Twitter)", iconId: "logos:x",              available: true  },
  { id: "tiktok",    name: "TikTok",      iconId: "logos:tiktok-icon",    available: true  },
  { id: "linkedin",  name: "LinkedIn",    iconId: "logos:linkedin-icon",  available: true  },
  { id: "youtube",   name: "YouTube",     iconId: "logos:youtube-icon",   available: true  },
  { id: "pinterest", name: "Pinterest",   iconId: "logos:pinterest",      available: true  },
  { id: "rss",       name: "RSS Feed",    iconId: "logos:rss",            available: true  },
  { id: "threads",   name: "Threads",     iconId: "simple-icons:threads", available: true  },
  { id: "vimeo",     name: "Vimeo",       iconId: "logos:vimeo-icon",     available: false },
  { id: "tumblr",    name: "Tumblr",      iconId: "logos:tumblr",         available: false },
  { id: "flickr",    name: "Flickr",      iconId: "logos:flickr",         available: false },
  { id: "soundcloud",name: "SoundCloud",  iconId: "logos:soundcloud",     available: false },
  { id: "mastodon",  name: "Mastodon",    iconId: "logos:mastodon-icon",  available: false },
];

type Platform = typeof allPlatforms[number];

const usernameInput = new Set(["instagram", "x", "pinterest", "youtube", "tiktok", "threads"]);
const urlInput      = new Set(["rss"]);

// ── primitives ───────────────────────────────────────────────────────────────
function Skel({ className = "" }: { className?: string }) {
  return <div className={`bg-zinc-200/70 rounded animate-pulse ${className}`} />;
}

function formatRelative(ms: number): string {
  const sec = Math.max(0, Math.floor(ms / 1000));
  if (sec < 10) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

function formatFollowers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

const platformIconMap: Record<string, string> = {
  instagram: "logos:instagram-icon",
  facebook:  "logos:facebook",
  x:         "logos:x",
  linkedin:  "logos:linkedin-icon",
  youtube:   "logos:youtube-icon",
};

// ── augmented channel metadata (mock) ────────────────────────────────────────
type ChannelStatus = "active" | "syncing" | "error";

interface ChannelMeta {
  followers: number;
  followersDelta: string;
  followersUp: boolean;
  postsThisMonth: number;
  engagement: string;
  nextSyncIn?: string;
  syncProgress?: { current: number; total: number };
  errorMessage?: string;
  statusOverride?: ChannelStatus;
}

const channelMeta: Record<string, ChannelMeta> = {
  ch_1: { followers: 12400, followersDelta: "+5.2%",  followersUp: true,  postsThisMonth: 34, engagement: "8.7%", nextSyncIn: "2h" },
  ch_2: { followers: 3200,  followersDelta: "+1.1%",  followersUp: true,  postsThisMonth: 12, engagement: "5.4%", nextSyncIn: "4h" },
  ch_3: { followers: 9800,  followersDelta: "-0.8%",  followersUp: false, postsThisMonth: 48, engagement: "3.2%", nextSyncIn: "1h" },
  ch_4: { followers: 4100,  followersDelta: "+12.4%", followersUp: true,  postsThisMonth: 6,  engagement: "6.1%", syncProgress: { current: 230, total: 312 }, statusOverride: "syncing" },
  ch_5: { followers: 2100,  followersDelta: "+8.3%",  followersUp: true,  postsThisMonth: 8,  engagement: "4.9%", errorMessage: "Token expired — please reconnect your LinkedIn account.", statusOverride: "error" },
};

// ── status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, meta }: { status: ChannelStatus; meta?: ChannelMeta }) {
  if (status === "syncing" && meta?.syncProgress) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
        <Loader2 size={10} className="animate-spin" />
        Syncing · <span className="tabular-nums">{meta.syncProgress.current}/{meta.syncProgress.total}</span>
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        <AlertCircle size={10} />
        Sync failed
      </span>
    );
  }
  // active
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      Auto-syncs in {meta?.nextSyncIn ?? "2h"}
    </span>
  );
}

// ── skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[24px] p-5 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-start justify-between mb-4">
        <Skel className="w-12 h-12 rounded-xl" />
        <Skel className="h-6 w-28 rounded-full" />
      </div>
      <Skel className="h-4 w-28 mb-1.5" />
      <Skel className="h-3 w-36 mb-4" />
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skel className="h-2 w-full" />
            <Skel className="h-4 w-3/4" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
        <Skel className="h-3 w-20" />
        <Skel className="h-3 w-24" />
      </div>
      <div className="flex items-center gap-2">
        <Skel className="flex-1 h-8 rounded-lg" />
        <Skel className="h-8 w-8 rounded-lg" />
        <Skel className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

// ── platform picker ──────────────────────────────────────────────────────────
function PlatformPicker({
  connectedPlatforms,
  onPick,
}: {
  connectedPlatforms: Set<string>;
  onPick: (p: Platform) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = allPlatforms.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
  const availableCount = allPlatforms.filter((p) => p.available).length;

  return (
    <DialogContent className="sm:max-w-xl rounded-2xl p-0 overflow-hidden border border-zinc-100 shadow-xl">
      <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-semibold text-zinc-900">Connect a channel</DialogTitle>
          <DialogDescription className="text-[13px] text-zinc-400 leading-relaxed">
            Pick a platform to start syncing posts and analytics. {availableCount}+ platforms available.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mt-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search platforms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl border-zinc-200 text-[13px] placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-purple-400/40 focus-visible:border-purple-400"
            autoFocus
          />
        </div>
      </div>

      <div className="px-6 py-5 max-h-[420px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-[13px] text-zinc-400 py-8">No platforms match &ldquo;{query}&rdquo;</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((p) => {
              const alreadyConnected = connectedPlatforms.has(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => p.available && onPick(p)}
                  disabled={!p.available}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all group ${
                    p.available
                      ? "border-zinc-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 hover:shadow-sm cursor-pointer"
                      : "border-zinc-100 bg-zinc-50/40 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <Icon
                    icon={p.iconId}
                    className={`w-6 h-6 shrink-0 transition-transform ${p.available ? "group-hover:scale-110" : "grayscale"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-800 leading-none">{p.name}</p>
                    <p className={`text-[11px] mt-1 ${alreadyConnected ? "text-emerald-600 font-medium" : p.available ? "text-zinc-400" : "text-zinc-400"}`}>
                      {alreadyConnected ? "Already connected" : p.available ? "Click to connect" : "Coming 2026"}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {!p.available ? (
                      <Lock size={13} className="text-zinc-300" />
                    ) : alreadyConnected ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : (
                      <Plus size={14} className="text-zinc-300 group-hover:text-purple-500 transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50/50">
        <p className="text-[11px] text-zinc-400 text-center">
          SprX only reads your public content. We never post on your behalf.
        </p>
      </div>
    </DialogContent>
  );
}

// ── connect modal ────────────────────────────────────────────────────────────
function ConnectModal({
  platform,
  onClose,
  onConnected,
}: {
  platform: Platform;
  onClose: () => void;
  onConnected: (platformId: string, handle: string) => void;
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

    const handle = isUsername
      ? value.trim().startsWith("@") ? value.trim() : `@${value.trim()}`
      : isUrl ? value.trim()
      : platform.name;

    onConnected(platform.id, handle);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-zinc-100 shadow-xl">
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
              onKeyDown={(e) => { if (e.key === "Enter") handleConnect(); }}
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
              onKeyDown={(e) => { if (e.key === "Enter") handleConnect(); }}
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

// ── page ─────────────────────────────────────────────────────────────────────
export default function ChannelsPage() {
  const [channels, setChannels] = useState(mockChannels);
  const [syncing, setSyncing] = useState<string | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
  const [extraMeta, setExtraMeta] = useState<Record<string, ChannelMeta>>({});

  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(() => Date.now() - 120_000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(tick);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastSynced(Date.now());
      setNow(Date.now());
      setLoading(false);
    }, 600);
  };

  const handleSync = async (id: string) => {
    setSyncing(id);
    await new Promise((r) => setTimeout(r, 1500));
    setSyncing(null);
    toast.success("Channel synced successfully!");
  };

  const connectedPlatforms = new Set(channels.map((c) => c.platform.toLowerCase()));

  const handlePick = (p: Platform) => {
    setPickerOpen(false);
    setTimeout(() => setActivePlatform(p), 120);
  };

  const handleConnected = (platformId: string, handle: string) => {
    const platform = allPlatforms.find((p) => p.id === platformId)!;
    const newId = `ch_${Date.now()}`;
    const newChannel = {
      id: newId,
      platform: platformId,
      name: platform.name,
      handle,
      color: "from-zinc-400 to-zinc-600",
      postCount: 0,
      lastSynced: "just now",
      status: "syncing" as const,
    };
    setChannels((prev) => [...prev, newChannel]);
    setExtraMeta((prev) => ({
      ...prev,
      [newId]: {
        followers: 0,
        followersDelta: "new",
        followersUp: true,
        postsThisMonth: 0,
        engagement: "—",
        syncProgress: { current: 0, total: 100 },
        statusOverride: "syncing",
      },
    }));
    toast.success(`${platform.name} connected — initial sync starting`);

    // Simulate initial sync progress then flip to active
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + 12, 100);
      setExtraMeta((prev) => ({
        ...prev,
        [newId]: {
          ...prev[newId],
          syncProgress: { current, total: 100 },
        },
      }));
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setChannels((prev) => prev.map((c) => c.id === newId ? { ...c, status: "active" as const, lastSynced: "just now" } : c));
          setExtraMeta((prev) => ({
            ...prev,
            [newId]: { ...prev[newId], statusOverride: "active", nextSyncIn: "2h", syncProgress: undefined },
          }));
        }, 400);
      }
    }, 240);
  };

  const metaFor = (id: string): ChannelMeta | undefined => extraMeta[id] ?? channelMeta[id];
  const activeCount = channels.filter((c) => (metaFor(c.id)?.statusOverride ?? c.status) === "active").length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-zinc-500">
            {channels.length} channels connected
            <span className="text-zinc-300 mx-1.5">·</span>
            <span className="text-emerald-600 font-medium">{activeCount} active</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sync pill */}
          <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur border border-zinc-200 rounded-full pl-2.5 pr-1 h-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-medium text-zinc-600">Live</span>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] text-zinc-500 tabular-nums">synced {formatRelative(now - lastSynced)}</span>
            <button
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh"
              className="ml-0.5 w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors disabled:opacity-50"
            >
              <Icon icon="solar:refresh-linear" width={12} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <Button onClick={() => setPickerOpen(true)}>
            <Plus size={15} /> Connect Channel
          </Button>
        </div>
      </div>

      {/* ── Channel grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : channels.map((ch) => {
              const meta = metaFor(ch.id);
              const status: ChannelStatus = (meta?.statusOverride ?? ch.status) as ChannelStatus;
              const isError = status === "error";
              const isSyncingNow = syncing === ch.id;

              return (
                <div
                  key={ch.id}
                  className={`rounded-[24px] p-5 border transition-all group ${
                    isError
                      ? "bg-rose-50/60 border-rose-200 shadow-[0_8px_30px_rgb(244,63,94,0.08)]"
                      : "bg-white/60 backdrop-blur-xl border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                  }`}
                >
                  {/* Platform icon + status */}
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100/80 flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0">
                      {platformIconMap[ch.platform.toLowerCase()] ? (
                        <Icon icon={platformIconMap[ch.platform.toLowerCase()]} width={28} height={28} />
                      ) : (
                        <Wifi size={20} className="text-zinc-400" />
                      )}
                    </div>
                    <StatusBadge status={status} meta={meta} />
                  </div>

                  <h3 className="font-semibold text-zinc-900 mb-0.5">{ch.name}</h3>
                  <p className="text-sm text-zinc-400">{ch.handle}</p>

                  {/* Error banner */}
                  {isError && meta?.errorMessage && (
                    <div className="mt-3 p-2.5 rounded-lg bg-white border border-rose-200 flex items-start gap-2">
                      <AlertCircle size={13} className="text-rose-600 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-rose-700 leading-snug">{meta.errorMessage}</p>
                    </div>
                  )}

                  {/* Syncing progress bar */}
                  {status === "syncing" && meta?.syncProgress && (
                    <div className="mt-3 h-1 rounded-full bg-amber-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${(meta.syncProgress.current / meta.syncProgress.total) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* Mini metrics */}
                  {meta && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Followers</p>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <p className="text-[14px] font-bold text-zinc-900 leading-none tabular-nums">{formatFollowers(meta.followers)}</p>
                          <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold tabular-nums ${meta.followersUp ? "text-emerald-600" : "text-rose-600"}`}>
                            <Icon icon={meta.followersUp ? "solar:arrow-right-up-linear" : "solar:arrow-right-down-linear"} width={9} />
                            {meta.followersDelta}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Posts/mo</p>
                        <p className="text-[14px] font-bold text-zinc-900 leading-none tabular-nums mt-0.5">{meta.postsThisMonth}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Engagement</p>
                        <p className="text-[14px] font-bold text-zinc-900 leading-none tabular-nums mt-0.5">{meta.engagement}</p>
                      </div>
                    </div>
                  )}

                  {/* Footer meta */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-4 pb-4 mb-4 border-b border-zinc-100">
                    <span>
                      <span className="text-zinc-700 font-medium tabular-nums">{ch.postCount.toLocaleString()}</span> total posts
                    </span>
                    <span>Last sync: {ch.lastSynced}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isError ? (
                      <Button
                        size="sm"
                        onClick={() => toast.success("Redirecting to reconnect...")}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        <RefreshCw size={12} />
                        Reconnect
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(ch.id)}
                        disabled={!!syncing || status === "syncing"}
                        className="flex-1"
                      >
                        <RefreshCw size={12} className={isSyncingNow || status === "syncing" ? "animate-spin text-teal-600" : ""} />
                        {isSyncingNow ? "Syncing..." : status === "syncing" ? "Syncing..." : "Sync now"}
                      </Button>
                    )}
                    <Button variant="outline" size="icon-sm" aria-label="Settings">
                      <Settings2 size={12} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Disconnect"
                      onClick={() => {
                        setChannels((c) => c.filter((x) => x.id !== ch.id));
                        toast.success("Channel disconnected");
                      }}
                      className="hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                    >
                      <Unlink size={12} />
                    </Button>
                  </div>
                </div>
              );
            })}

        {/* Add new channel card */}
        {!loading && (
          <button
            onClick={() => setPickerOpen(true)}
            className="bg-white/40 backdrop-blur-sm rounded-[24px] p-5 border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/50 transition-all group flex flex-col items-center justify-center gap-3 min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center transition-colors">
              <Plus size={20} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-500 group-hover:text-zinc-800 transition-colors">Connect channel</p>
              <p className="text-xs text-zinc-400 mt-0.5">22+ platforms available</p>
            </div>
          </button>
        )}
      </div>

      {/* ── Platform picker dialog ─────────────────────────────────────── */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        {pickerOpen && (
          <PlatformPicker
            connectedPlatforms={connectedPlatforms}
            onPick={handlePick}
          />
        )}
      </Dialog>

      {/* ── Connect modal (per platform) ───────────────────────────────── */}
      <Dialog open={!!activePlatform} onOpenChange={(open) => { if (!open) setActivePlatform(null); }}>
        {activePlatform && (
          <ConnectModal
            platform={activePlatform}
            onClose={() => setActivePlatform(null)}
            onConnected={handleConnected}
          />
        )}
      </Dialog>
    </div>
  );
}
