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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="min-h-[100dvh] relative flex items-center justify-center bg-[#F8FAFC] font-sans p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[140px] opacity-60 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[140px] opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[55rem] h-[55rem] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[150px] opacity-50 animate-blob animation-delay-4000" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/SprXstories-Logo.png" alt="SprX Stories" width={200} height={68} className="h-14 w-auto" />
        </div>

        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-1">Sign in</h1>
            <p className="text-zinc-400 text-sm">Welcome back to your SprX dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 group">
              <Label htmlFor="email" className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300 h-[48px] rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-400 hover:border-zinc-300 transition-all px-4 shadow-sm"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2 group">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">Password</Label>
                <button type="button" className="text-[12px] text-zinc-400 hover:text-purple-600 transition-colors font-medium">Forgot password?</button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300 h-[48px] rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-400 hover:border-zinc-300 transition-all px-4 pr-12 shadow-sm"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-md">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox id="remember" className="border-zinc-300 w-[18px] h-[18px] rounded-[5px] data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 transition-all shadow-sm" />
              <Label htmlFor="remember" className="text-[13px] text-zinc-500 cursor-pointer">Remember me for 30 days</Label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-[48px] mt-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[14px] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
              <span className="flex items-center justify-center gap-2">
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                  : <>Sign in <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>}
              </span>
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/70 px-3 text-[11px] font-medium uppercase tracking-widest text-zinc-300">or</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full h-[48px] bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 font-medium gap-3 rounded-xl shadow-sm transition-all"
            onClick={() => toast.info("Google SSO coming soon")}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-[13px] text-zinc-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-zinc-700 hover:text-purple-600 transition-colors font-medium">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
