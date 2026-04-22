"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { Popover } from "@base-ui/react/popover";
import {
  Search,
  Check,
  Sparkles,
  ArrowRight,
  Plus,
  Radio,
  BookOpen,
  BarChart3,
  FileText,
  Users,
  Compass,
  Command,
} from "lucide-react";
import { appModules, type AppModule, type AppModuleAccent } from "@/lib/mock-data";
import { NotifyMeDialog } from "@/components/modules/NotifyMeDialog";

const accentStyles: Record<AppModuleAccent, { tile: string; icon: string; ring: string; gradient: string; glow: string }> = {
  violet:  { tile: "bg-violet-50",  icon: "text-violet-500",  ring: "ring-violet-100",  gradient: "from-violet-100 to-fuchsia-50", glow: "shadow-[0_8px_24px_rgb(139,92,246,0.18)]" },
  teal:    { tile: "bg-teal-50",    icon: "text-teal-500",    ring: "ring-teal-100",    gradient: "from-teal-100 to-emerald-50",   glow: "shadow-[0_8px_24px_rgb(20,184,166,0.18)]" },
  amber:   { tile: "bg-amber-50",   icon: "text-amber-500",   ring: "ring-amber-100",   gradient: "from-amber-100 to-orange-50",   glow: "shadow-[0_8px_24px_rgb(245,158,11,0.18)]" },
  rose:    { tile: "bg-rose-50",    icon: "text-rose-500",    ring: "ring-rose-100",    gradient: "from-rose-100 to-pink-50",      glow: "shadow-[0_8px_24px_rgb(244,63,94,0.18)]" },
  indigo:  { tile: "bg-indigo-50",  icon: "text-indigo-500",  ring: "ring-indigo-100",  gradient: "from-indigo-100 to-violet-50",  glow: "shadow-[0_8px_24px_rgb(99,102,241,0.18)]" },
  emerald: { tile: "bg-emerald-50", icon: "text-emerald-500", ring: "ring-emerald-100", gradient: "from-emerald-100 to-teal-50",   glow: "shadow-[0_8px_24px_rgb(16,185,129,0.18)]" },
  sky:     { tile: "bg-sky-50",     icon: "text-sky-500",     ring: "ring-sky-100",     gradient: "from-sky-100 to-indigo-50",     glow: "shadow-[0_8px_24px_rgb(14,165,233,0.18)]" },
  fuchsia: { tile: "bg-fuchsia-50", icon: "text-fuchsia-500", ring: "ring-fuchsia-100", gradient: "from-fuchsia-100 to-pink-50",   glow: "shadow-[0_8px_24px_rgb(217,70,239,0.18)]" },
};

function resolveCurrentModuleId(_pathname: string): string {
  return "stories";
}

// ── Module row ───────────────────────────────────────────────────────────────

type RowProps = {
  module: AppModule;
  isCurrent: boolean;
  delay: number;
  onPick: (m: AppModule) => void;
};

function ModuleRow({ module, isCurrent, delay, onPick }: RowProps) {
  const accent = accentStyles[module.accent];
  const isActive = module.status === "active";

  const body = (
    <>
      <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${accent.gradient} ring-1 ${accent.ring} flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isCurrent ? accent.glow : "group-hover:scale-105 group-hover:-rotate-3 group-hover:shadow-[0_6px_18px_rgb(0,0,0,0.1)]"}`}>
        <Icon icon={module.icon} width={26} height={26} className={accent.icon} />
        {isCurrent && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center shadow-sm">
            <Check size={11} className="text-white stroke-[3]" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[14px] font-bold text-zinc-900 leading-tight">{module.name}</p>
          {isCurrent && (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded-full uppercase tracking-[0.08em] leading-none">
              You&apos;re here
            </span>
          )}
          {module.status === "early-access" && (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-violet-700 bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded-full uppercase tracking-[0.08em] leading-none">
              <Sparkles size={9} />
              Beta
            </span>
          )}
          {module.status === "coming-soon" && (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-zinc-500 bg-white border border-zinc-200 px-1.5 py-0.5 rounded-full uppercase tracking-[0.08em] leading-none">
              Soon
            </span>
          )}
        </div>
        <p className="text-[12px] text-zinc-500 leading-snug mt-0.5 line-clamp-2">
          {module.tagline}
        </p>
      </div>
    </>
  );

  const baseClass = "relative flex items-start gap-3 px-3 py-3 rounded-2xl w-full text-left transition-all group border animate-fade-in-up";
  const style = { animationDelay: `${delay}ms` };

  if (isCurrent) {
    return (
      <div className={`${baseClass} overflow-hidden bg-gradient-to-r from-violet-50/80 via-white to-white border-violet-100`} style={style}>
        {/* Soft violet glow for the current row */}
        <span aria-hidden className="absolute -left-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-violet-300/25 rounded-full blur-3xl pointer-events-none" />
        <span className="relative flex items-start gap-3 w-full">{body}</span>
      </div>
    );
  }

  if (isActive && module.href) {
    return (
      <Link
        href={module.href}
        onClick={() => onPick(module)}
        className={`${baseClass} border-transparent hover:bg-white hover:border-zinc-200/70 hover:shadow-[0_6px_18px_rgb(0,0,0,0.06)]`}
        style={style}
      >
        {body}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onPick(module)}
      className={`${baseClass} border-transparent hover:bg-white hover:border-zinc-200/70 hover:shadow-[0_6px_18px_rgb(0,0,0,0.06)] cursor-pointer`}
      style={style}
    >
      {body}
    </button>
  );
}

function Section({ label, count, children }: { label: string; count: number; children: ReactNode }) {
  if (count === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 px-3 mb-1.5">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em]">{label}</p>
        <span className="text-[10px] font-bold text-zinc-300">{count}</span>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

// ── Shortcut row ─────────────────────────────────────────────────────────────

type ShortcutProps = {
  icon: ReactNode;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  delay?: number;
};

function Shortcut({ icon, label, description, href, onClick, delay = 0 }: ShortcutProps) {
  const inner = (
    <>
      <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200/70 flex items-center justify-center flex-shrink-0 text-zinc-600 group-hover:border-zinc-300 group-hover:text-zinc-900 group-hover:shadow-sm group-hover:-translate-y-0.5 transition-all">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-zinc-800 leading-tight truncate">{label}</p>
        {description && (
          <p className="text-[11px] text-zinc-500 mt-0.5 truncate leading-tight">{description}</p>
        )}
      </div>
    </>
  );

  const cls = "flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all group cursor-pointer hover:bg-white hover:shadow-sm w-full text-left animate-fade-in-up";
  const style = { animationDelay: `${delay}ms` };

  if (href) {
    return <Link href={href} className={cls} onClick={onClick} style={style}>{inner}</Link>;
  }
  return <button type="button" onClick={onClick} className={cls} style={style}>{inner}</button>;
}

// ── Keyboard hint ────────────────────────────────────────────────────────────

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-mono font-bold text-zinc-500 bg-white border border-zinc-200 rounded-md shadow-[0_1px_0_rgb(0,0,0,0.05)]">
      {children}
    </kbd>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function ModuleSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notifyFor, setNotifyFor] = useState<AppModule | null>(null);
  const [query, setQuery] = useState("");

  const currentId = resolveCurrentModuleId(pathname);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return appModules;
    return appModules.filter(
      (m) => m.name.toLowerCase().includes(q) || m.tagline.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(
    () => ({
      active: filtered.filter((m) => m.status === "active"),
      early: filtered.filter((m) => m.status === "early-access"),
      soon: filtered.filter((m) => m.status === "coming-soon"),
    }),
    [filtered],
  );

  // Running index for staggered animation delay across all visible rows
  let rowIndex = 0;
  const stepMs = 28;
  const nextDelay = () => rowIndex++ * stepMs;

  const handlePick = (m: AppModule) => {
    if (m.status === "active") {
      setOpen(false);
      setQuery("");
      return;
    }
    setOpen(false);
    setQuery("");
    setNotifyFor(m);
  };

  const closeAll = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen} modal>
        <Popover.Trigger
          render={
            <button
              type="button"
              aria-label="Switch module"
              className="relative w-10 h-10 flex items-center justify-center rounded-[14px] bg-white/50 border border-white hover:bg-white hover:shadow-sm transition-all text-zinc-500 hover:text-zinc-800 data-[popup-open]:bg-white data-[popup-open]:shadow-sm data-[popup-open]:text-zinc-900 data-[popup-open]:ring-2 data-[popup-open]:ring-violet-100 group cursor-pointer"
            >
              {/* Bold 3x3 rounded-square grid (Facebook-style apps launcher) */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="group-hover:text-purple-600 group-data-[popup-open]:text-purple-600 group-data-[popup-open]:scale-110 transition-all duration-200"
              >
                <rect x="1.5"  y="1.5"  width="4" height="4" fill="currentColor" />
                <rect x="7"    y="1.5"  width="4" height="4" fill="currentColor" />
                <rect x="12.5" y="1.5"  width="4" height="4" fill="currentColor" />
                <rect x="1.5"  y="7"    width="4" height="4" fill="currentColor" />
                <rect x="7"    y="7"    width="4" height="4" fill="currentColor" />
                <rect x="12.5" y="7"    width="4" height="4" fill="currentColor" />
                <rect x="1.5"  y="12.5" width="4" height="4" fill="currentColor" />
                <rect x="7"    y="12.5" width="4" height="4" fill="currentColor" />
                <rect x="12.5" y="12.5" width="4" height="4" fill="currentColor" />
              </svg>
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-violet-500 group-data-[popup-open]:scale-0 transition-transform" />
            </button>
          }
        />
        <Popover.Portal>
          {/* Backdrop — blur + soft scrim so the menu is the clear focus */}
          <Popover.Backdrop
            className="fixed inset-0 z-40 bg-zinc-900/[0.08] backdrop-blur-[6px] data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0 duration-200"
          />

          <Popover.Positioner
            align="end"
            alignOffset={0}
            side="bottom"
            sideOffset={14}
            className="z-50 outline-none"
          >
            <Popover.Popup className="w-[680px] max-w-[calc(100vw-3rem)] flex bg-white/95 backdrop-blur-2xl rounded-[20px] shadow-[0_32px_80px_rgb(0,0,0,0.22)] ring-1 ring-zinc-200/60 overflow-hidden data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95 data-[open]:slide-in-from-top-3 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95 duration-150">
              {/* Hidden close for modal focus trap / screen readers */}
              <Popover.Close className="sr-only">Close</Popover.Close>
              {/* ═══ LEFT: MODULES ═══ */}
              <div className="flex-1 min-w-0 flex flex-col max-h-[620px]">
                <div className="px-5 pt-5 pb-3 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] leading-none">SprX platform</p>
                      <p className="text-[18px] font-bold text-zinc-900 tracking-tight mt-1">Modules</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 bg-zinc-50 border border-zinc-100 px-2 py-1 rounded-full uppercase tracking-wider">
                      <span className="w-1 h-1 rounded-full bg-zinc-400" />
                      {appModules.length}
                    </span>
                  </div>

                  {/* Search */}
                  <div className="flex items-center gap-2 bg-zinc-100/80 border border-zinc-200/60 rounded-xl px-3 py-2 focus-within:bg-white focus-within:border-zinc-300 focus-within:shadow-sm transition-all">
                    <Search size={14} className="text-zinc-400 flex-shrink-0" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search modules..."
                      className="flex-1 bg-transparent outline-none text-[13px] text-zinc-800 placeholder:text-zinc-400 font-medium"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-[10px] font-bold text-zinc-400 hover:text-zinc-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-4">
                  {filtered.length === 0 && (
                    <div className="px-3 py-10 text-center animate-fade-in-up">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-3">
                        <Search size={18} className="text-zinc-400" />
                      </div>
                      <p className="text-[13px] font-semibold text-zinc-700">No modules match &quot;{query}&quot;</p>
                      <p className="text-[12px] text-zinc-400 mt-0.5">Try a different search term.</p>
                    </div>
                  )}

                  <Section label="Active" count={grouped.active.length}>
                    {grouped.active.map((m) => (
                      <ModuleRow key={m.id} module={m} isCurrent={m.id === currentId} delay={nextDelay()} onPick={handlePick} />
                    ))}
                  </Section>

                  <Section label="Early access" count={grouped.early.length}>
                    {grouped.early.map((m) => (
                      <ModuleRow key={m.id} module={m} isCurrent={false} delay={nextDelay()} onPick={handlePick} />
                    ))}
                  </Section>

                  <Section label="Coming soon" count={grouped.soon.length}>
                    {grouped.soon.map((m) => (
                      <ModuleRow key={m.id} module={m} isCurrent={false} delay={nextDelay()} onPick={handlePick} />
                    ))}
                  </Section>
                </div>

                {/* Keyboard hint footer — left column */}
                <div className="px-5 py-2.5 border-t border-zinc-100 bg-white/60 flex items-center gap-3 text-[10px] font-semibold text-zinc-500 flex-shrink-0">
                  <span className="flex items-center gap-1">
                    <Command size={10} /> <span>K</span> <span className="text-zinc-400 font-normal ml-0.5">to search</span>
                  </span>
                  <span className="w-px h-3 bg-zinc-200" />
                  <span className="flex items-center gap-1">
                    <Kbd>Esc</Kbd> <span className="text-zinc-400 font-normal">to close</span>
                  </span>
                </div>
              </div>

              {/* ═══ RIGHT: SHORTCUTS ═══ */}
              <div className="w-[240px] flex-shrink-0 bg-gradient-to-b from-zinc-50/80 to-white border-l border-zinc-100 flex flex-col">
                <div className="px-4 pt-5 pb-3">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em] leading-none">In this module</p>
                  <p className="text-[15px] font-bold text-zinc-900 tracking-tight mt-1">Shortcuts</p>
                </div>

                <div className="px-2 space-y-0.5">
                  <Shortcut icon={<Plus size={16} />} label="New widget" description="Start with a layout" href="/dashboard/widgets" onClick={closeAll} delay={nextDelay()} />
                  <Shortcut icon={<BookOpen size={16} />} label="New story" description="Curate from a channel" href="/dashboard/stories" onClick={closeAll} delay={nextDelay()} />
                  <Shortcut icon={<Radio size={16} />} label="Connect channel" description="Instagram, X, LinkedIn…" href="/dashboard/channels" onClick={closeAll} delay={nextDelay()} />
                  <Shortcut icon={<BarChart3 size={16} />} label="Analytics" description="SprXdata™ insights" href="/dashboard/data" onClick={closeAll} delay={nextDelay()} />
                </div>

                <div className="mt-4 pt-3 px-4 border-t border-zinc-100">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.12em]">Platform</p>
                </div>
                <div className="px-2 space-y-0.5 pb-4">
                  <Shortcut icon={<Compass size={16} />} label="What's new" href="#" delay={nextDelay()} />
                  <Shortcut icon={<FileText size={16} />} label="Docs & guides" href="#" delay={nextDelay()} />
                  <Shortcut icon={<Users size={16} />} label="Invite team" href="/dashboard/settings" onClick={closeAll} delay={nextDelay()} />
                </div>

                <a
                  href="#"
                  className="mt-auto mx-3 mb-3 flex items-center justify-between gap-2 px-3 py-2.5 text-[11px] font-bold text-zinc-700 hover:text-white bg-white hover:bg-zinc-900 border border-zinc-200 hover:border-zinc-900 rounded-xl transition-all group"
                >
                  <span>Request a module</span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <NotifyMeDialog
        category={notifyFor}
        onOpenChange={(o) => {
          if (!o) setNotifyFor(null);
        }}
      />
    </>
  );
}
