"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";
import { Bell, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AppModule, AppModuleAccent } from "@/lib/mock-data";

const accentBg: Record<AppModuleAccent, { bg: string; icon: string }> = {
  violet:  { bg: "bg-violet-50",  icon: "text-violet-500" },
  teal:    { bg: "bg-teal-50",    icon: "text-teal-500" },
  amber:   { bg: "bg-amber-50",   icon: "text-amber-500" },
  rose:    { bg: "bg-rose-50",    icon: "text-rose-500" },
  indigo:  { bg: "bg-indigo-50",  icon: "text-indigo-500" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-500" },
  sky:     { bg: "bg-sky-50",     icon: "text-sky-500" },
  fuchsia: { bg: "bg-fuchsia-50", icon: "text-fuchsia-500" },
};

type Props = {
  category: AppModule | null;
  onOpenChange: (open: boolean) => void;
};

export function NotifyMeDialog({ category, onOpenChange }: Props) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (category) setEmail(user?.email ?? "");
  }, [category, user?.email]);

  if (!category) return null;

  const accent = accentBg[category.accent];
  const isBeta = category.status === "early-access";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 450));
    setSubmitting(false);
    toast.success(
      isBeta
        ? `You're on the ${category.name} beta list — we'll email you when it opens.`
        : `You'll hear from us the moment ${category.name} launches.`,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={!!category} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        <div className={`${accent.bg} px-6 pt-6 pb-5 flex items-center gap-4 border-b border-white`}>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-[0_4px_14px_rgb(0,0,0,0.06)] border border-white flex items-center justify-center flex-shrink-0">
            <Icon icon={category.icon} width={28} height={28} className={accent.icon} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              {isBeta ? <Sparkles size={10} /> : <Bell size={10} />}
              {isBeta ? "Join the beta" : "Coming soon"}
            </p>
            <DialogTitle className="text-[17px] font-bold text-zinc-900 mt-0.5 truncate">
              {category.name}
            </DialogTitle>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-4">
          <DialogHeader className="space-y-1.5">
            <DialogDescription className="text-[13px] text-zinc-600 leading-relaxed">
              {isBeta
                ? `${category.tagline}. Get early access before general availability.`
                : `${category.tagline}. We'll email you the moment it's ready to embed.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <label htmlFor="notify-email" className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
              Email
            </label>
            <Input
              id="notify-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.com"
              className="h-10 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting || !email.trim()}>
              {submitting ? "Adding..." : isBeta ? "Join waitlist" : "Notify me"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
