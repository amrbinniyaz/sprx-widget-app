"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus, RefreshCw, Settings2, Unlink, AlertCircle, Loader2, Lock, CheckCircle2,
  Search, KeyRound, Link2, ArrowLeft, ShieldCheck, Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";

// ── Catalog ──────────────────────────────────────────────────────────────────
type AuthMethod = "oauth" | "apikey" | "url" | "upload";
type Category = "marketing" | "sis";

interface Source {
  id: string;
  name: string;
  category: Category;
  auth: AuthMethod;
  iconId?: string;             // iconify icon, optional
  initials?: string;           // fallback letter badge
  brandColor?: string;         // hex — used for fallback badge bg
  available: boolean;
  beta?: boolean;              // "*" from screenshot
  blurb: string;               // one-liner shown in picker
  scopes?: string[];           // what we'll read
}

const catalog: Source[] = [
  // Marketing & Analytics
  {
    id: "google-analytics",
    name: "Google Analytics",
    category: "marketing",
    auth: "oauth",
    iconId: "logos:google-analytics",
    available: true,
    blurb: "Website sessions, events, conversions.",
    scopes: ["analytics.readonly"],
  },
  {
    id: "google-search-console",
    name: "Google Search Console",
    category: "marketing",
    auth: "oauth",
    iconId: "logos:google-icon",
    available: true,
    blurb: "Search queries, impressions, CTR.",
    scopes: ["webmasters.readonly"],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    category: "marketing",
    auth: "oauth",
    iconId: "logos:google-ads",
    available: true,
    blurb: "Campaign spend and conversions.",
    scopes: ["adwords.readonly"],
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    category: "marketing",
    auth: "oauth",
    iconId: "logos:meta-icon",
    available: true,
    blurb: "Facebook & Instagram ad performance.",
    scopes: ["ads_read", "ads_management"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "marketing",
    auth: "oauth",
    iconId: "logos:hubspot",
    available: true,
    blurb: "Contacts, forms, marketing funnels.",
    scopes: ["contacts", "forms", "reports"],
  },
  {
    id: "seo",
    name: "SEO",
    category: "marketing",
    auth: "apikey",
    iconId: "solar:magnifer-bold-duotone",
    available: true,
    blurb: "Backlinks & keyword rankings.",
  },
  {
    id: "website",
    name: "Website",
    category: "marketing",
    auth: "url",
    iconId: "solar:global-bold-duotone",
    available: true,
    blurb: "Install our pixel to track page views.",
  },

  // School Information Systems
  {
    id: "veracross",
    name: "Veracross",
    category: "sis",
    auth: "apikey",
    initials: "VC",
    brandColor: "#1b5e9c",
    available: true,
    blurb: "Enrollment, families, admissions stages.",
  },
  {
    id: "blackbaud",
    name: "Blackbaud",
    category: "sis",
    auth: "oauth",
    initials: "BB",
    brandColor: "#5c2e91",
    available: true,
    beta: true,
    blurb: "Student records & fundraising CRM.",
  },
  {
    id: "openapply",
    name: "OpenApply",
    category: "sis",
    auth: "apikey",
    initials: "OA",
    brandColor: "#0d9488",
    available: true,
    blurb: "Inquiry → application → enrollment pipeline.",
  },
  {
    id: "ravenna",
    name: "Ravenna",
    category: "sis",
    auth: "apikey",
    initials: "R",
    brandColor: "#e11d48",
    available: true,
    blurb: "Private school admissions platform.",
  },
  {
    id: "isams",
    name: "iSAMS",
    category: "sis",
    auth: "apikey",
    initials: "iS",
    brandColor: "#0ea5e9",
    available: true,
    blurb: "UK independent school MIS.",
  },
  {
    id: "custom-csv",
    name: "Custom Admissions Import",
    category: "sis",
    auth: "upload",
    iconId: "solar:upload-square-bold-duotone",
    available: true,
    blurb: "Upload a CSV — we'll map the columns.",
  },
];

const categoryLabel: Record<Category, string> = {
  marketing: "Marketing & Analytics",
  sis: "School Information Systems",
};

// ── Connected sources (mock) ─────────────────────────────────────────────────
type ConnStatus = "active" | "syncing" | "error";

interface Connection {
  id: string;                 // source.id
  account: string;            // e.g. "oaklandsprep.co.uk", "Property 245098761"
  status: ConnStatus;
  records: number;            // total records synced
  delta: string;              // "+4.2%" since last week
  deltaUp: boolean;
  freshness: string;          // "3m ago" / "1h ago"
  nextSyncIn?: string;        // "15m"
  syncProgress?: { current: number; total: number };
  errorMessage?: string;
  connectedOn: string;        // "Mar 4, 2026"
  dataPoints: string;         // "Sessions, Events"
}

const initialConnections: Connection[] = [
  {
    id: "google-analytics",
    account: "oaklandsprep.co.uk · GA4",
    status: "active",
    records: 142800,
    delta: "+12.4%",
    deltaUp: true,
    freshness: "3m ago",
    nextSyncIn: "57m",
    connectedOn: "Feb 18, 2026",
    dataPoints: "Sessions · Events · Conversions",
  },
  {
    id: "meta-ads",
    account: "act_847392011 · Oaklands Ads",
    status: "syncing",
    records: 38400,
    delta: "+8.1%",
    deltaUp: true,
    freshness: "now",
    syncProgress: { current: 184, total: 312 },
    connectedOn: "Mar 22, 2026",
    dataPoints: "Campaigns · Ad sets · Creatives",
  },
  {
    id: "hubspot",
    account: "hub-12847291 · Oaklands Prep",
    status: "error",
    records: 4210,
    delta: "—",
    deltaUp: true,
    freshness: "2d ago",
    errorMessage: "API key expired — please reconnect to resume syncing contacts.",
    connectedOn: "Jan 9, 2026",
    dataPoints: "Contacts · Forms · Deals",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
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

function formatRecords(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function sourceById(id: string): Source | undefined {
  return catalog.find((s) => s.id === id);
}

// ── Visual: Source icon badge (handles iconify + initials fallback) ─────────
function SourceGlyph({ source, size = 28 }: { source: Source; size?: number }) {
  if (source.iconId) {
    return <Icon icon={source.iconId} width={size} height={size} />;
  }
  const px = size + 4;
  return (
    <div
      className="rounded-lg flex items-center justify-center font-bold text-white tracking-tight"
      style={{
        width: px, height: px,
        backgroundColor: source.brandColor ?? "#71717a",
        fontSize: size * 0.42,
      }}
    >
      {source.initials ?? source.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ conn }: { conn: Connection }) {
  if (conn.status === "syncing" && conn.syncProgress) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
        <Loader2 size={10} className="animate-spin" />
        Syncing · <span className="tabular-nums">{conn.syncProgress.current}/{conn.syncProgress.total}</span>
      </span>
    );
  }
  if (conn.status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        <AlertCircle size={10} />
        Sync failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      Auto-syncs in {conn.nextSyncIn ?? "1h"}
    </span>
  );
}

// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[24px] p-5 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-start justify-between mb-4">
        <Skel className="w-12 h-12 rounded-xl" />
        <Skel className="h-6 w-28 rounded-full" />
      </div>
      <Skel className="h-4 w-32 mb-1.5" />
      <Skel className="h-3 w-40 mb-4" />
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

// ── Source picker (categorized) ──────────────────────────────────────────────
function SourcePicker({
  connectedIds,
  onPick,
}: {
  connectedIds: Set<string>;
  onPick: (s: Source) => void;
}) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Category | "all">("all");

  const filtered = catalog.filter((s) => {
    const matchQ = s.name.toLowerCase().includes(query.toLowerCase());
    const matchCat = tab === "all" || s.category === tab;
    return matchQ && matchCat;
  });

  const counts = {
    all: catalog.length,
    marketing: catalog.filter((s) => s.category === "marketing").length,
    sis: catalog.filter((s) => s.category === "sis").length,
  };

  // Group by category within current filter
  const grouped = (["marketing", "sis"] as Category[])
    .map((cat) => ({ cat, items: filtered.filter((s) => s.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <DialogContent className="sm:max-w-2xl rounded-2xl p-0 overflow-hidden border border-zinc-100 shadow-xl">
      <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-semibold text-zinc-900">Connect a data source</DialogTitle>
          <DialogDescription className="text-[13px] text-zinc-400 leading-relaxed">
            Pull enrollment, ads, and analytics data into SprX. {catalog.filter((c) => c.available).length} integrations available.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mt-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search data sources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl border-zinc-200 text-[13px] placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-purple-400/40 focus-visible:border-purple-400"
            autoFocus
          />
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 mt-4 bg-zinc-100 border border-zinc-200 rounded-xl p-1 w-fit">
          {([
            { key: "all", label: "All" },
            { key: "marketing", label: "Marketing & Analytics" },
            { key: "sis", label: "School Systems" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                tab === t.key
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {t.label}
              <span className={`tabular-nums text-[10px] px-1.5 rounded-full ${tab === t.key ? "bg-zinc-100 text-zinc-500" : "bg-zinc-200/60 text-zinc-500"}`}>
                {counts[t.key as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 max-h-[440px] overflow-y-auto">
        {grouped.length === 0 ? (
          <p className="text-center text-[13px] text-zinc-400 py-8">No sources match &ldquo;{query}&rdquo;</p>
        ) : (
          grouped.map((g, gi) => (
            <div key={g.cat} className={gi > 0 ? "mt-6" : ""}>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5 px-1">
                {categoryLabel[g.cat]}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {g.items.map((s) => {
                  const alreadyConnected = connectedIds.has(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => s.available && onPick(s)}
                      disabled={!s.available}
                      className={`flex items-start gap-3 px-3 py-3 rounded-xl border text-left transition-all group ${
                        s.available
                          ? "border-zinc-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 hover:shadow-sm cursor-pointer"
                          : "border-zinc-100 bg-zinc-50/40 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className={`transition-transform ${s.available ? "group-hover:scale-110" : "grayscale"} flex-shrink-0 mt-0.5`}>
                        <SourceGlyph source={s} size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-semibold text-zinc-800 leading-none">{s.name}</p>
                          {s.beta && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 uppercase tracking-wider">Beta</span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-snug line-clamp-1">{s.blurb}</p>
                        <p className={`text-[11px] mt-1 font-medium ${alreadyConnected ? "text-emerald-600" : "text-zinc-400"}`}>
                          {alreadyConnected ? "Already connected" : s.available ? `Connect with ${authLabel(s.auth)}` : "Coming soon"}
                        </p>
                      </div>
                      <div className="shrink-0 mt-0.5">
                        {!s.available ? (
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
            </div>
          ))
        )}
      </div>

      <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center gap-2 justify-center">
        <ShieldCheck size={12} className="text-zinc-400" />
        <p className="text-[11px] text-zinc-400">
          Read-only access. Credentials are encrypted at rest.
        </p>
      </div>
    </DialogContent>
  );
}

function authLabel(a: AuthMethod): string {
  return a === "oauth" ? "OAuth" : a === "apikey" ? "API key" : a === "url" ? "Website URL" : "CSV upload";
}

// ── Connect modal (per source — varies by auth method) ───────────────────────
function ConnectModal({
  source,
  onClose,
  onConnected,
}: {
  source: Source;
  onClose: () => void;
  onConnected: (sourceId: string, account: string) => void;
}) {
  // step state — some flows have a second step (e.g. pick property after OAuth)
  const [step, setStep] = useState<1 | 2>(1);
  const [value1, setValue1] = useState("");   // API key / URL / file name
  const [value2, setValue2] = useState("");   // secondary (endpoint)
  const [selectedProperty, setSelectedProperty] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const mockProperties: Record<string, { id: string; label: string; meta: string }[]> = {
    "google-analytics": [
      { id: "GA4-245098761", label: "oaklandsprep.co.uk", meta: "GA4 · 142K sessions / mo" },
      { id: "GA4-883201194", label: "blog.oaklandsprep.co.uk", meta: "GA4 · 38K sessions / mo" },
      { id: "UA-84723001",   label: "oaklands-old-site",      meta: "UA · archived" },
    ],
    "google-search-console": [
      { id: "sc-1", label: "sc-domain:oaklandsprep.co.uk", meta: "Domain property · verified" },
      { id: "sc-2", label: "https://www.oaklandsprep.co.uk/", meta: "URL-prefix · verified" },
    ],
    "google-ads": [
      { id: "ads-1", label: "847-392-0101 · Oaklands Prep", meta: "Manager · 12 child accounts" },
      { id: "ads-2", label: "219-887-4432 · Admissions 2026", meta: "Active · £4.2K / mo" },
    ],
    "meta-ads": [
      { id: "act_1", label: "Oaklands Prep Business",  meta: "4 ad accounts · 3 pages" },
    ],
    hubspot: [
      { id: "hub-1", label: "Oaklands Prep — Marketing Hub", meta: "Pro tier · 4.2K contacts" },
    ],
    blackbaud: [
      { id: "bb-1", label: "Oaklands Prep School", meta: "Education Edge · Raiser's Edge NXT" },
    ],
  };

  const hasProperties = !!mockProperties[source.id];

  const handleOAuth = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    if (hasProperties) {
      setStep(2);
      // pre-select first
      setSelectedProperty(mockProperties[source.id][0].id);
    } else {
      onConnected(source.id, source.name);
      onClose();
    }
  };

  const handleApiKey = async () => {
    if (!value1.trim()) {
      toast.error("Please enter your API key");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    const tail = value1.trim().slice(-4);
    const acc = value2.trim() ? `${value2.trim()} · ****${tail}` : `API key ****${tail}`;
    onConnected(source.id, acc);
    onClose();
  };

  const handleUrl = async () => {
    if (!value1.trim()) {
      toast.error("Please enter your website URL");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    const acc = value1.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    onConnected(source.id, acc);
    onClose();
  };

  const handleUpload = async () => {
    if (!value1) {
      toast.error("Please select a CSV file");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onConnected(source.id, `${value1} · imported`);
    onClose();
  };

  const handleConfirmProperty = async () => {
    const prop = mockProperties[source.id].find((p) => p.id === selectedProperty);
    if (!prop) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onConnected(source.id, prop.label);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-zinc-100 shadow-xl">
      <div className="px-6 pt-6 pb-5 border-b border-zinc-100">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <SourceGlyph source={source} size={26} />
            <DialogTitle className="text-[17px] font-semibold text-zinc-900 flex items-center gap-2">
              {step === 2 ? `Choose ${source.name.includes("Ads") ? "ad account" : "property"}` : `Connect ${source.name}`}
              {source.beta && step === 1 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 uppercase tracking-wider">Beta</span>
              )}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[13px] text-zinc-400 leading-relaxed">
            {step === 2
              ? `Pick the ${source.id === "meta-ads" || source.id === "google-ads" ? "ad account" : "property"} you want SprX to sync.`
              : source.auth === "oauth" && `Authorise SprX to read your ${source.name} data. You can revoke access at any time.`
            }
            {step === 1 && source.auth === "apikey" && `Paste your ${source.name} API key — find it in your ${source.name} settings.`}
            {step === 1 && source.auth === "url"    && `Enter your school's website. We'll generate a pixel snippet to install.`}
            {step === 1 && source.auth === "upload" && `Export admissions records as CSV. We'll auto-map columns to the right fields.`}
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* ─── STEP 2: property picker ────────────────────────────────────── */}
        {step === 2 && (
          <>
            <div className="space-y-2">
              {mockProperties[source.id].map((p) => {
                const active = selectedProperty === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProperty(p.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      active
                        ? "border-purple-400 bg-purple-50/60 ring-1 ring-purple-400/30"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-zinc-900 truncate">{p.label}</p>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">{p.meta}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        active ? "border-purple-600 bg-purple-600" : "border-zinc-300"
                      }`}>
                        {active && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <Button
              onClick={handleConfirmProperty}
              disabled={loading || !selectedProperty}
              className="w-full h-[46px] rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[14px]"
            >
              {loading ? <><Loader2 size={15} className="animate-spin mr-2" /> Connecting…</> : "Finish connecting"}
            </Button>
          </>
        )}

        {/* ─── STEP 1: OAuth ──────────────────────────────────────────────── */}
        {step === 1 && source.auth === "oauth" && (
          <>
            <button
              onClick={handleOAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-[46px] rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors font-semibold text-[14px] text-zinc-800 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin text-zinc-400" />
              ) : (
                <SourceGlyph source={source} size={18} />
              )}
              {loading ? "Authorising…" : `Continue with ${source.name}`}
            </button>

            {/* Scopes */}
            {source.scopes && source.scopes.length > 0 && (
              <div className="rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3">
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">We&apos;ll request</p>
                <ul className="space-y-1.5">
                  {source.scopes.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-[12px] text-zinc-600">
                      <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                      <span className="font-mono text-[11px] text-zinc-700">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* ─── STEP 1: API key ────────────────────────────────────────────── */}
        {step === 1 && source.auth === "apikey" && (
          <>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">API Key</label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="password"
                    placeholder="sk_live_..."
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    className="pl-9 h-[46px] rounded-xl border-zinc-200 text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-purple-400/40 focus-visible:border-purple-400 font-mono text-[12px]"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") handleApiKey(); }}
                  />
                </div>
              </div>
              {source.id === "isams" || source.id === "veracross" ? (
                <div>
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">API Endpoint (optional)</label>
                  <div className="relative">
                    <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <Input
                      placeholder={`https://api.${source.id}.com/v1`}
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                      className="pl-9 h-[46px] rounded-xl border-zinc-200 text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-purple-400/40 focus-visible:border-purple-400 text-[13px]"
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <Button
              onClick={handleApiKey}
              disabled={loading}
              className="w-full h-[46px] rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[14px]"
            >
              {loading ? <><Loader2 size={15} className="animate-spin mr-2" /> Verifying…</> : "Connect account"}
            </Button>
          </>
        )}

        {/* ─── STEP 1: Website URL ────────────────────────────────────────── */}
        {step === 1 && source.auth === "url" && (
          <>
            <div className="relative">
              <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="https://yourschool.com"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="pl-9 h-[46px] rounded-xl border-zinc-200 text-zinc-900 placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-purple-400/40 focus-visible:border-purple-400"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleUrl(); }}
              />
            </div>
            <div className="rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Next step</p>
              <p className="text-[12px] text-zinc-600 leading-relaxed">
                We&apos;ll show you a one-line pixel snippet to paste into your site&apos;s <code className="px-1 py-0.5 rounded bg-white border border-zinc-200 font-mono text-[11px]">&lt;head&gt;</code>. No code changes required beyond that.
              </p>
            </div>
            <Button
              onClick={handleUrl}
              disabled={loading}
              className="w-full h-[46px] rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[14px]"
            >
              {loading ? <><Loader2 size={15} className="animate-spin mr-2" /> Preparing…</> : "Generate pixel snippet"}
            </Button>
          </>
        )}

        {/* ─── STEP 1: CSV upload ─────────────────────────────────────────── */}
        {step === 1 && source.auth === "upload" && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setValue1(f.name);
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className={`w-full rounded-xl border-2 border-dashed px-4 py-8 transition-all flex flex-col items-center gap-2 ${
                value1
                  ? "border-emerald-300 bg-emerald-50/40"
                  : "border-zinc-200 bg-zinc-50/40 hover:border-purple-300 hover:bg-purple-50/40"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${value1 ? "bg-emerald-100" : "bg-white border border-zinc-200"}`}>
                {value1 ? (
                  <CheckCircle2 size={20} className="text-emerald-600" />
                ) : (
                  <Upload size={18} className="text-zinc-400" />
                )}
              </div>
              {value1 ? (
                <>
                  <p className="text-[13px] font-semibold text-zinc-800">{value1}</p>
                  <p className="text-[11px] text-zinc-500">Click to change</p>
                </>
              ) : (
                <>
                  <p className="text-[13px] font-semibold text-zinc-800">Click to upload CSV</p>
                  <p className="text-[11px] text-zinc-400">First row should be column headers · up to 50MB</p>
                </>
              )}
            </button>
            <Button
              onClick={handleUpload}
              disabled={loading || !value1}
              className="w-full h-[46px] rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[14px]"
            >
              {loading ? <><Loader2 size={15} className="animate-spin mr-2" /> Importing…</> : "Import & auto-map columns"}
            </Button>
          </>
        )}

        <div className="flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck size={11} className="text-zinc-300" />
          <p className="text-center text-[11px] text-zinc-300">
            Read-only · credentials encrypted at rest
          </p>
        </div>
      </div>
    </DialogContent>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DataSourcesPage() {
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [syncing, setSyncing] = useState<string | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeSource, setActiveSource] = useState<Source | null>(null);

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
    setConnections((prev) => prev.map((c) => c.id === id ? { ...c, freshness: "just now" } : c));
    toast.success("Source synced successfully!");
  };

  const connectedIds = new Set(connections.map((c) => c.id));

  const handlePick = (s: Source) => {
    setPickerOpen(false);
    setTimeout(() => setActiveSource(s), 120);
  };

  const handleConnected = (sourceId: string, account: string) => {
    const source = sourceById(sourceId);
    if (!source) return;
    const newConn: Connection = {
      id: sourceId,
      account,
      status: "syncing",
      records: 0,
      delta: "new",
      deltaUp: true,
      freshness: "now",
      syncProgress: { current: 0, total: 100 },
      connectedOn: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      dataPoints: defaultDataPoints(sourceId),
    };
    setConnections((prev) => {
      const exists = prev.some((c) => c.id === sourceId);
      return exists
        ? prev.map((c) => (c.id === sourceId ? newConn : c))
        : [...prev, newConn];
    });
    toast.success(`${source.name} connected — initial sync starting`);

    // Simulate initial sync progress
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + 10, 100);
      setConnections((prev) => prev.map((c) =>
        c.id === sourceId
          ? { ...c, syncProgress: { current, total: 100 } }
          : c
      ));
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setConnections((prev) => prev.map((c) =>
            c.id === sourceId
              ? {
                  ...c,
                  status: "active",
                  freshness: "just now",
                  nextSyncIn: "1h",
                  syncProgress: undefined,
                  records: initialRecordCount(sourceId),
                  delta: "+2.1%",
                }
              : c
          ));
        }, 400);
      }
    }, 220);
  };

  const handleDisconnect = (id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
    toast.success("Data source disconnected");
  };

  const activeCount = connections.filter((c) => c.status === "active").length;
  const errorCount = connections.filter((c) => c.status === "error").length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ── Breadcrumb / back ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 -mt-2">
        <Link
          href="/dashboard/data"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft size={13} />
          Back to report
        </Link>
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-zinc-900 tracking-tight">Data Sources</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {connections.length} connected
            <span className="text-zinc-300 mx-1.5">·</span>
            <span className="text-emerald-600 font-medium">{activeCount} active</span>
            {errorCount > 0 && (
              <>
                <span className="text-zinc-300 mx-1.5">·</span>
                <span className="text-rose-600 font-medium">{errorCount} needs attention</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            <Plus size={15} /> Connect Source
          </Button>
        </div>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : connections.map((conn) => {
              const source = sourceById(conn.id);
              if (!source) return null;
              const isError = conn.status === "error";
              const isSyncingNow = syncing === conn.id;

              return (
                <div
                  key={conn.id}
                  className={`rounded-[24px] p-5 border transition-all group ${
                    isError
                      ? "bg-rose-50/60 border-rose-200 shadow-[0_8px_30px_rgb(244,63,94,0.08)]"
                      : "bg-white/60 backdrop-blur-xl border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100/80 flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0">
                      <SourceGlyph source={source} size={26} />
                    </div>
                    <StatusBadge conn={conn} />
                  </div>

                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-semibold text-zinc-900">{source.name}</h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 uppercase tracking-wider">
                      {source.category === "sis" ? "SIS" : authLabel(source.auth)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 truncate">{conn.account}</p>

                  {/* Error banner */}
                  {isError && conn.errorMessage && (
                    <div className="mt-3 p-2.5 rounded-lg bg-white border border-rose-200 flex items-start gap-2">
                      <AlertCircle size={13} className="text-rose-600 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-rose-700 leading-snug">{conn.errorMessage}</p>
                    </div>
                  )}

                  {/* Sync progress */}
                  {conn.status === "syncing" && conn.syncProgress && (
                    <div className="mt-3 h-1 rounded-full bg-amber-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${(conn.syncProgress.current / conn.syncProgress.total) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Records</p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <p className="text-[14px] font-bold text-zinc-900 leading-none tabular-nums">{formatRecords(conn.records)}</p>
                        {conn.delta !== "—" && conn.delta !== "new" && (
                          <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold tabular-nums ${conn.deltaUp ? "text-emerald-600" : "text-rose-600"}`}>
                            <Icon icon={conn.deltaUp ? "solar:arrow-right-up-linear" : "solar:arrow-right-down-linear"} width={9} />
                            {conn.delta}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Fresh</p>
                      <p className="text-[14px] font-bold text-zinc-900 leading-none tabular-nums mt-0.5">{conn.freshness}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Since</p>
                      <p className="text-[13px] font-bold text-zinc-900 leading-none mt-0.5">{conn.connectedOn.split(",")[0]}</p>
                    </div>
                  </div>

                  {/* Data points footer */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-4 pb-4 mb-4 border-b border-zinc-100 gap-2">
                    <span className="truncate"><span className="text-zinc-700 font-medium">{conn.dataPoints}</span></span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isError ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          const s = sourceById(conn.id);
                          if (s) setActiveSource(s);
                        }}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        <RefreshCw size={12} />
                        Reconnect
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(conn.id)}
                        disabled={!!syncing || conn.status === "syncing"}
                        className="flex-1"
                      >
                        <RefreshCw size={12} className={isSyncingNow || conn.status === "syncing" ? "animate-spin text-teal-600" : ""} />
                        {isSyncingNow ? "Syncing..." : conn.status === "syncing" ? "Syncing..." : "Sync now"}
                      </Button>
                    )}
                    <Button variant="outline" size="icon-sm" aria-label="Settings">
                      <Settings2 size={12} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Disconnect"
                      onClick={() => handleDisconnect(conn.id)}
                      className="hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                    >
                      <Unlink size={12} />
                    </Button>
                  </div>
                </div>
              );
            })}

        {/* Add new source card */}
        {!loading && (
          <button
            onClick={() => setPickerOpen(true)}
            className="bg-white/40 backdrop-blur-sm rounded-[24px] p-5 border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/50 transition-all group flex flex-col items-center justify-center gap-3 min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center transition-colors">
              <Plus size={20} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-500 group-hover:text-zinc-800 transition-colors">Connect source</p>
              <p className="text-xs text-zinc-400 mt-0.5">{catalog.filter((c) => c.available).length}+ integrations available</p>
            </div>
          </button>
        )}
      </div>

      {/* ── Dialogs ────────────────────────────────────────────────────── */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        {pickerOpen && (
          <SourcePicker
            connectedIds={connectedIds}
            onPick={handlePick}
          />
        )}
      </Dialog>

      <Dialog open={!!activeSource} onOpenChange={(open) => { if (!open) setActiveSource(null); }}>
        {activeSource && (
          <ConnectModal
            source={activeSource}
            onClose={() => setActiveSource(null)}
            onConnected={handleConnected}
          />
        )}
      </Dialog>
    </div>
  );
}

// ── mock helpers ─────────────────────────────────────────────────────────────
function initialRecordCount(sourceId: string): number {
  const seeds: Record<string, number> = {
    "google-analytics": 142800,
    "google-search-console": 8420,
    "google-ads": 11200,
    "meta-ads": 38400,
    "hubspot": 4210,
    "seo": 940,
    "website": 62100,
    "veracross": 1840,
    "blackbaud": 2210,
    "openapply": 780,
    "ravenna": 420,
    "isams": 1620,
    "custom-csv": 512,
  };
  return seeds[sourceId] ?? 1000;
}

function defaultDataPoints(sourceId: string): string {
  const defs: Record<string, string> = {
    "google-analytics": "Sessions · Events · Conversions",
    "google-search-console": "Queries · Impressions · CTR",
    "google-ads": "Campaigns · Keywords · Spend",
    "meta-ads": "Campaigns · Ad sets · Creatives",
    "hubspot": "Contacts · Forms · Deals",
    "seo": "Backlinks · Rankings · Domain authority",
    "website": "Page views · Referrers · Bounce rate",
    "veracross": "Families · Enrollment · Admissions",
    "blackbaud": "Constituents · Gifts · Prospects",
    "openapply": "Inquiries · Applications · Enrollments",
    "ravenna": "Applications · Decisions · Yield",
    "isams": "Pupils · Staff · Attendance",
    "custom-csv": "Mapped admissions records",
  };
  return defs[sourceId] ?? "Records";
}
