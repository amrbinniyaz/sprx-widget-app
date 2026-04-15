"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Zap, Crown, ShieldCheck } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Core",
    price: "£6,000",
    period: "/ year",
    desc: "Perfect for getting started",
    icon: Zap,
    accentColor: "text-teal-600",
    accentBg: "bg-teal-50 border-teal-100",
    borderActive: "border-teal-400 bg-white/80 shadow-[0_8px_30px_rgba(13,148,136,0.12)]",
    checkColor: "text-teal-500",
    modules: ["SprXcms™", "SprXstories™", "SprXwidgets™", "Basic analytics", "Email support"],
  },
  {
    name: "Growth",
    price: "£12,000",
    period: "/ year",
    desc: "For growing schools",
    icon: Sparkles,
    accentColor: "text-purple-600",
    accentBg: "bg-purple-50 border-purple-100",
    borderActive: "border-purple-400 bg-white/90 shadow-[0_8px_40px_rgba(124,58,237,0.15)]",
    checkColor: "text-purple-600",
    modules: ["Everything in Core", "SprXdata™ analytics", "SprX EnrollIQ™", "SprXdisplay™", "SprXvr™", "Priority support"],
    featured: true,
  },
  {
    name: "Intelligence",
    price: "£18,000",
    period: "/ year",
    desc: "AI-first schools",
    icon: Crown,
    accentColor: "text-rose-600",
    accentBg: "bg-rose-50 border-rose-100",
    borderActive: "border-rose-400 bg-white/80 shadow-[0_8px_30px_rgba(225,29,72,0.12)]",
    checkColor: "text-rose-500",
    modules: ["Everything in Growth", "SprX AI Chatbot™", "SprXvoice™", "SprXcomms™ (soon)", "Dedicated success manager"],
  },
];

export default function PlanPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>("Growth");

  return (
    <div className="max-w-6xl mx-auto flex flex-col justify-center min-h-[calc(100vh-12rem)]">
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-purple-700 text-xs font-bold uppercase tracking-wider mb-5">
          <Sparkles size={13} className="text-purple-500" /> Step 3: Choose your plan
        </div>
        <h1 className="text-4xl sm:text-5xl font-light text-zinc-900 mb-3 tracking-tight">
          {user?.firstName ? `Almost there, ${user.firstName}!` : "Almost there!"} 🎉
        </h1>
        <p className="text-zinc-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
          Choose a plan to unlock your dashboard. Every plan starts with a <span className="text-zinc-800 font-semibold">15-day free trial</span> — no credit card required.
        </p>

        {/* Trial badge */}
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-[13px] font-semibold">
          <ShieldCheck size={15} className="text-green-500" />
          15 days free · No credit card · Cancel anytime
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 mb-10">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          const isSelected = selected === plan.name;
          return (
            <button
              key={plan.name}
              onClick={() => setSelected(plan.name)}
              className={`relative text-left rounded-[2rem] p-7 border-2 transition-all duration-300 cursor-pointer animate-fade-in-up hover:-translate-y-1 ${
                isSelected
                  ? plan.borderActive + " scale-[1.02] z-10"
                  : "border-white/60 bg-white/40 backdrop-blur-xl hover:bg-white/60 hover:shadow-xl hover:shadow-black/5 hover:border-white z-0 scale-100"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-purple-500/30 whitespace-nowrap z-20">
                  Most Popular
                </div>
              )}

              <div className="flex justify-between items-start mb-5">
                <div className={`w-11 h-11 rounded-2xl border ${plan.accentBg} shadow-sm flex items-center justify-center`}>
                  <Icon size={20} className={plan.accentColor} />
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-purple-600 bg-purple-600" : "border-zinc-300 bg-white"
                }`}>
                  {isSelected && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </div>

              <div className="mb-5">
                <h3 className="text-xl font-bold text-zinc-900 mb-0.5">{plan.name}</h3>
                <p className="text-sm font-medium text-zinc-500">{plan.desc}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-zinc-200/50">
                <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">{plan.price}</span>
                <span className="text-zinc-500 font-medium ml-1 text-sm">{plan.period}</span>
                <p className="text-[12px] text-green-600 font-semibold mt-1">15-day free trial included</p>
              </div>

              <ul className="space-y-3">
                {plan.modules.map((m) => (
                  <li key={m} className="flex items-start gap-3 text-[14px] font-medium text-zinc-600 leading-snug">
                    <CheckCircle2 size={16} className={`flex-shrink-0 mt-0.5 ${plan.checkColor}`} />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 backdrop-blur-md border border-white rounded-2xl p-4 shadow-sm">
        <Button variant="ghost" onClick={() => router.push("/onboarding/widget")} className="text-[13px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors h-[42px] rounded-lg hover:bg-white/50 px-4 gap-2">
          <ArrowLeft size={15} /> Back
        </Button>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button onClick={() => router.push("/dashboard")} className="text-[13px] font-medium text-zinc-400 hover:text-zinc-600 transition-colors underline underline-offset-2">
            Start trial without selecting a plan
          </button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[14px] px-7 h-[46px] rounded-xl transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
              Start 15-day free trial <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
