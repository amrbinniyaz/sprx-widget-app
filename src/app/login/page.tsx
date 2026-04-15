"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

const socialCards = [
  { name: "Oaklands Prep", platform: "Instagram", time: "Just now", text: "What a privilege to welcome 120 prospective families to our Open Morning today!", likes: 589, iconBg: "bg-pink-100", iconColor: "text-pink-600" },
  { name: "School Sport", platform: "X", time: "3 hours ago", text: "Huge congratulations to our U13 netball team — county champions for the third year running!", likes: 1204, iconBg: "bg-zinc-100", iconColor: "text-zinc-900" },
  { name: "Alumni Network", platform: "LinkedIn", time: "1 day ago", text: "98% of our 2025 leavers secured places at their first-choice senior school.", likes: 2459, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] relative flex items-center justify-center overflow-x-hidden overflow-y-auto bg-[#F8FAFC] font-sans p-4 sm:p-8">
      {/* Light Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40rem] sm:w-[60rem] h-[40rem] sm:h-[60rem] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[140px] opacity-70 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[30rem] sm:w-[50rem] h-[30rem] sm:h-[50rem] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[140px] opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[45rem] sm:w-[65rem] h-[45rem] sm:h-[65rem] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[150px] opacity-60 animate-blob animation-delay-4000" />
        
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgbZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMzYgMzRoMjR2MjRIMzZWMzR6TTI0IDM2VjM2aC0yMnYtMjJIMjRnIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-60 mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden my-auto animate-fade-in-up">
        
        {/* Left Side: Brand Context */}
        <div className="hidden md:flex flex-col justify-between w-5/12 p-10 lg:p-14 bg-gradient-to-br from-white/40 to-white/10 border-r border-white/50 relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-14">
              <Image src="/SprXstories-Logo.png" alt="SprX Stories" width={160} height={54} className="h-10 w-auto" />
            </div>
            
            <h2 className="text-4xl font-light text-zinc-800 leading-[1.15] mb-8">
              Welcome back to <br/>
              <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600">your dashboard.</span>
            </h2>
            
            <p className="text-[15px] font-medium text-zinc-600 leading-relaxed mb-8">
              Your school&apos;s unified social presence.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col gap-4">
            {socialCards.map((card, i) => (
              <div key={i} className={`rounded-2xl p-5 border border-white bg-white/70 backdrop-blur-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up`} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${card.iconBg} flex items-center justify-center`}>
                      <span className={`text-[10px] font-bold ${card.iconColor}`}>{card.platform.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{card.name}</p>
                      <p className="text-[11px] text-zinc-500 font-medium">{card.time} · {card.platform}</p>
                    </div>
                  </div>
                  <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded-full">{card.likes.toLocaleString()} <span className="text-purple-400">♥</span></span>
                </div>
                <p className="text-[13px] text-zinc-600 font-medium leading-relaxed mt-2">{card.text}</p>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-14 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-white backdrop-blur-sm rounded-2xl p-5 shadow-sm">
             <blockquote className="text-[14px] font-medium text-zinc-700 italic leading-relaxed">
               &ldquo;SprX saved us 3 hours a week and increased our admissions enquiries by 36%.&rdquo;
             </blockquote>
             <div className="mt-4 flex items-center gap-3">
               <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xs font-bold text-zinc-900 shadow-sm border border-zinc-100">JT</div>
               <div>
                 <p className="text-xs font-bold text-zinc-900">James Thompson</p>
                 <p className="text-[11px] text-zinc-500 font-medium">Marketing Director, Wellington College</p>
               </div>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-10 lg:p-14 relative z-10 bg-white/40 flex flex-col justify-center">
          <div className="md:hidden mb-10">
            <Image src="/SprXstories-Logo.png" alt="SprX Stories" width={140} height={48} className="h-8 w-auto" />
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-zinc-900 mb-2 tracking-tight">Sign in</h1>
            <p className="text-zinc-500 text-sm font-medium">Welcome back to your SprX dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 focus-within:text-purple-600 transition-colors group">
              <Label htmlFor="email" className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/60 border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/50 hover:border-zinc-300 hover:bg-white transition-all px-4 shadow-sm"
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2 focus-within:text-purple-600 transition-colors group">
              <div className="flex items-center justify-between pointer-events-none">
                <Label htmlFor="password" className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">Password</Label>
                <button type="button" className="text-[12px] text-zinc-500 hover:text-purple-600 transition-colors font-semibold pointer-events-auto">Forgot password?</button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/60 border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/50 hover:border-zinc-300 hover:bg-white transition-all px-4 pr-12 shadow-sm"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1 bg-zinc-100/50 rounded-md backdrop-blur-sm border border-zinc-200/50">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-1">
              <Checkbox id="remember" className="mt-0.5 border-zinc-300 focus:ring-purple-500/20 hover:border-zinc-400 bg-white/60 outline-none w-[20px] h-[20px] rounded-[6px] data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 data-[state=checked]:text-white transition-all text-white shadow-sm" />
              <Label htmlFor="remember" className="text-[13px] text-zinc-600 cursor-pointer font-medium">Remember me for 30 days</Label>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full h-[52px] mt-6 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[15px] rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 group overflow-hidden relative">
               <span className="relative z-10 flex items-center justify-center gap-2">
                 {loading ? <><Loader2 size={18} className="animate-spin text-white/70" /> Signing in...</> : <>Sign in <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#F8FAFC]/80 backdrop-blur-xl px-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400 rounded-full">or continue with</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full h-[52px] bg-white/60 border-zinc-200/80 hover:bg-white text-zinc-700 hover:text-zinc-900 font-semibold gap-3 rounded-xl shadow-sm hover:shadow-md transition-all"
            onClick={() => toast.info("Google SSO coming soon")}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>

          <div className="mt-10 pt-8 border-t border-zinc-200 text-center">
            <p className="text-[14px] font-medium text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-zinc-900 hover:text-purple-600 transition-colors pb-0.5 border-b border-zinc-300 hover:border-purple-400 ml-1">Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
