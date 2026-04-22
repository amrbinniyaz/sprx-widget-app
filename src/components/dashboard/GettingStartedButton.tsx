"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Popover } from "@base-ui/react/popover";
import { Check, Sparkles, ArrowRight, X } from "lucide-react";
import { onboardingSteps, type OnboardingStep } from "@/lib/mock-data";

function ProgressRing({
  progress,
  size = 28,
  strokeWidth = 3,
  colorClass = "text-violet-600",
  trackClass = "text-violet-100",
  showLabel = false,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  trackClass?: string;
  showLabel?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)));
  const pct = Math.round(progress * 100);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={trackClass}
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClass} transition-[stroke-dashoffset] duration-700 ease-out`}
          stroke="currentColor"
        />
      </svg>
      {showLabel && (
        <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${colorClass}`}>
          {pct}%
        </span>
      )}
    </div>
  );
}

function StepRow({ step, onPick }: { step: OnboardingStep; onPick: () => void }) {
  const inner = (
    <>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${step.done ? "bg-teal-50 text-teal-500 ring-1 ring-teal-100" : "bg-zinc-50 text-zinc-400 ring-1 ring-zinc-100 group-hover:bg-violet-50 group-hover:text-violet-500 group-hover:ring-violet-100"}`}>
        {step.done ? <Check size={18} strokeWidth={3} /> : <Icon icon={step.icon} width={20} height={20} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[13.5px] font-bold leading-tight ${step.done ? "text-zinc-500 line-through decoration-zinc-300" : "text-zinc-900"}`}>
          {step.label}
        </p>
        <p className="text-[11.5px] text-zinc-500 mt-0.5 truncate leading-tight">
          {step.description}
        </p>
      </div>
      {!step.done && (
        <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 group-hover:text-violet-600 flex-shrink-0 transition-colors uppercase tracking-wider">
          Start
          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      )}
      {step.done && (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-600 flex-shrink-0 uppercase tracking-wider">
          Done
        </span>
      )}
    </>
  );

  const cls = "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group border border-transparent hover:bg-white hover:border-zinc-200/70 hover:shadow-[0_4px_12px_rgb(0,0,0,0.04)] w-full text-left animate-fade-in-up";

  if (step.done) {
    return <div className={cls.replace("hover:bg-white hover:border-zinc-200/70 hover:shadow-[0_4px_12px_rgb(0,0,0,0.04)]", "")}>{inner}</div>;
  }

  return (
    <Link href={step.href} onClick={onPick} className={cls}>
      {inner}
    </Link>
  );
}

export default function GettingStartedButton() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { completed, total, progress, remaining } = useMemo(() => {
    const total = onboardingSteps.length;
    const completed = onboardingSteps.filter((s) => s.done).length;
    return {
      completed,
      total,
      progress: completed / total,
      remaining: total - completed,
    };
  }, []);

  if (dismissed || progress >= 1) return null;

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal>
      <Popover.Trigger
        render={
          <button
            type="button"
            aria-label="Getting started progress"
            className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-[14px] bg-white/70 border border-white hover:bg-white hover:shadow-sm transition-all data-[popup-open]:bg-white data-[popup-open]:shadow-sm data-[popup-open]:ring-2 data-[popup-open]:ring-violet-100 group cursor-pointer"
          >
            <ProgressRing progress={progress} size={30} />
            <div className="text-left pr-1">
              <p className="text-[12.5px] font-bold text-zinc-900 leading-tight">
                Getting started
              </p>
              <p className="text-[10.5px] text-zinc-500 leading-tight mt-0.5">
                {Math.round(progress * 100)}% complete
              </p>
            </div>
          </button>
        }
      />
      <Popover.Portal>
        <Popover.Backdrop className="fixed inset-0 z-40 bg-zinc-900/[0.06] backdrop-blur-[4px] data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0 duration-200" />
        <Popover.Positioner align="end" side="bottom" sideOffset={14} className="z-50 outline-none">
          <Popover.Popup className="w-[400px] max-w-[calc(100vw-3rem)] bg-white/95 backdrop-blur-2xl rounded-[20px] shadow-[0_32px_80px_rgb(0,0,0,0.22)] ring-1 ring-zinc-200/60 overflow-hidden data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95 data-[open]:slide-in-from-top-3 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95 duration-150">
            <Popover.Close className="sr-only">Close</Popover.Close>

            {/* Header */}
            <div className="relative px-5 pt-5 pb-4 border-b border-zinc-100 overflow-hidden">
              <div aria-hidden className="absolute -top-10 -right-8 w-40 h-40 bg-violet-200/40 rounded-full blur-3xl pointer-events-none" />
              <div aria-hidden className="absolute -bottom-12 -left-6 w-32 h-32 bg-fuchsia-200/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-violet-500 uppercase tracking-[0.14em] leading-none flex items-center gap-1">
                    <Sparkles size={10} />
                    Setup
                  </p>
                  <p className="text-[18px] font-bold text-zinc-900 tracking-tight mt-1.5">
                    Getting started
                  </p>
                  <p className="text-[12px] text-zinc-500 mt-0.5">
                    {remaining === 0
                      ? "You're all set — great work."
                      : `${completed} of ${total} done · ${remaining} step${remaining > 1 ? "s" : ""} to go`}
                  </p>
                </div>
                <ProgressRing progress={progress} size={52} strokeWidth={4} showLabel />
              </div>

              {/* Big progress bar */}
              <div className="relative h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="px-2 py-2.5 space-y-0.5 max-h-[400px] overflow-y-auto">
              {onboardingSteps.map((step, i) => (
                <div key={step.id} style={{ animationDelay: `${i * 40}ms` }} className="contents">
                  <StepRow step={step} onPick={() => setOpen(false)} />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setDismissed(true);
                  setOpen(false);
                }}
                className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 flex items-center gap-1 transition-colors"
              >
                <X size={11} />
                Hide checklist
              </button>
              <span className="text-[10px] font-medium text-zinc-400">
                You can re-enable this in Settings
              </span>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
