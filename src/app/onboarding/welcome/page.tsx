"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Sparkles, Zap, Crown } from "lucide-react";
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

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>("Growth");

  return (
    <div className="max-w-6xl mx-auto flex flex-col justify-center min-h-[calc(100vh-12rem)]">
      <div className="text-center mb-14 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-purple-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles size={14} className="text-purple-500" /> Step 1: Choose your plan
        </div>
        <h1 className="text-4xl sm:text-5xl font-light text-zinc-900 mb-4 tracking-tight">
          Welcome to SprX™{user?.firstName ? `, ${user.firstName}` : ""}! 👋
        </h1>
        <p className="text-zinc-500 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Let&apos;s get your school set up in under 5 minutes. First, choose a plan that perfectly fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          const isSelected = selected === plan.name;
          return (
            <button
              key={plan.name}
              onClick={() => setSelected(plan.name)}
              className={`relative text-left rounded-[2rem] p-8 border-2 transition-all duration-300 cursor-pointer animate-fade-in-up hover:-translate-y-1 ${
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
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl border ${plan.accentBg} shadow-sm flex items-center justify-center`}>
                  <Icon size={22} className={plan.accentColor} />
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-purple-600 bg-purple-600" : "border-zinc-300 bg-white"
                }`}>
                  {isSelected && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 mb-1">{plan.name}</h3>
                <p className="text-sm font-medium text-zinc-500">{plan.desc}</p>
              </div>
              
              <div className="mb-8 pb-8 border-b border-zinc-200/50">
                <span className="text-4xl font-extrabold text-zinc-900 tracking-tight">{plan.price}</span>
                <span className="text-zinc-500 font-medium ml-1">{plan.period}</span>
              </div>
              
              <ul className="space-y-4">
                {plan.modules.map((m) => (
                  <li key={m} className="flex items-start gap-3 text-[15px] font-medium text-zinc-600 leading-snug">
                    <CheckCircle2 size={18} className={`flex-shrink-0 mt-0.5 ${plan.checkColor}`} />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/40 backdrop-blur-md border border-white rounded-[2rem] p-6 shadow-sm">
        <button onClick={() => router.push("/onboarding/channel")} className="text-[15px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors px-4 border-b-2 border-transparent hover:border-zinc-900 pb-1">
          I&apos;ll choose a plan later
        </button>
        <Button onClick={() => router.push("/onboarding/channel")} className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-base px-8 h-[54px] rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 group overflow-hidden relative">
          <span className="relative z-10 flex items-center justify-center gap-2 text-white">
            Continue to Next Step <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
        </Button>
      </div>
    </div>
  );
}
