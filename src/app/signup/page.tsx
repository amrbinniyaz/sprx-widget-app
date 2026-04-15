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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  "22+ social media platforms connected",
  "Unlimited stories & collections",
  "Embeddable widgets with one line of code",
  "Real-time analytics & StoryScore™",
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", school: "", email: "", password: "", role: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({ ...form });
      router.push("/onboarding/welcome");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] relative flex items-center justify-center overflow-x-hidden overflow-y-auto bg-[#F8FAFC] font-sans p-4 sm:p-8">
      {/* Light Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] sm:w-[60rem] h-[40rem] sm:h-[60rem] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[140px] opacity-70 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[30rem] sm:w-[50rem] h-[30rem] sm:h-[50rem] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[140px] opacity-70 animate-blob animation-delay-2000" />
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
              Start telling your <br/>
              <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600">school's story.</span>
            </h2>
            
            <div className="space-y-4 pr-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100 shrink-0 shadow-sm">
                    <CheckCircle2 size={14} className="text-purple-600" />
                  </div>
                  <span className="text-[15px] font-medium text-zinc-600 leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 mt-14 bg-white/70 backdrop-blur-xl border border-white hover:bg-white/90 transition-colors rounded-2xl p-5 shadow-sm">
             <div className="flex -space-x-3 mb-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className={`w-9 h-9 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center overflow-hidden z-[${10-i}] shadow-sm`}>
                   <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="avatar" className="w-full h-full object-cover" />
                 </div>
               ))}
               <div className="w-9 h-9 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center z-0 shadow-sm relative overflow-hidden">
                 <span className="text-[11px] text-purple-700 font-bold tracking-tight z-10 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">+500</span>
               </div>
             </div>
             <p className="text-[13px] font-medium text-zinc-600 leading-relaxed max-w-[250px]">Join top schools globally unifying their digital presence with SprX.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-10 lg:p-14 relative z-10 bg-white/40">
          <div className="md:hidden mb-10">
            <Image src="/SprXstories-Logo.png" alt="SprX Stories" width={140} height={48} className="h-8 w-auto" />
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-zinc-900 mb-2 tracking-tight">Create an account</h1>
            <p className="text-zinc-500 text-sm font-medium">Get started free — no credit card needed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2 focus-within:text-purple-600 transition-colors group">
                <Label className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">First name</Label>
                <Input value={form.firstName} onChange={set("firstName")} placeholder="Sarah" className="bg-white/60 border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/50 hover:border-zinc-300 hover:bg-white transition-all px-4 shadow-sm" />
              </div>
              <div className="space-y-2 focus-within:text-purple-600 transition-colors group">
                <Label className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">Last name</Label>
                <Input value={form.lastName} onChange={set("lastName")} placeholder="Mitchell" className="bg-white/60 border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/50 hover:border-zinc-300 hover:bg-white transition-all px-4 shadow-sm" />
              </div>
            </div>
            
            <div className="space-y-2 focus-within:text-purple-600 transition-colors group">
              <Label className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">School name</Label>
              <Input value={form.school} onChange={set("school")} placeholder="Oaklands Prep School" className="bg-white/60 border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/50 hover:border-zinc-300 hover:bg-white transition-all px-4 shadow-sm" />
            </div>
            
            <div className="space-y-2 focus-within:text-purple-600 transition-colors group">
              <Label className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">Work email</Label>
              <Input type="email" value={form.email} onChange={set("email")} placeholder="you@school.co.uk" className="bg-white/60 border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/50 hover:border-zinc-300 hover:bg-white transition-all px-4 shadow-sm" />
            </div>
            
            <div className="space-y-2 focus-within:text-purple-600 transition-colors group">
              <Label className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">Your role</Label>
              <Select onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger className="bg-white/60 border-zinc-200/80 text-zinc-900 h-[50px] rounded-xl focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 hover:border-zinc-300 hover:bg-white transition-all px-4 shadow-sm outline-none">
                  <SelectValue placeholder="Select your role..." />
                </SelectTrigger>
                <SelectContent className="bg-white/95 border-zinc-100 text-zinc-900 rounded-xl shadow-xl backdrop-blur-xl">
                  {["Head / Deputy Head", "Marketing Director", "Registrar", "Bursar", "IT Lead", "Other"].map((r) => (
                    <SelectItem key={r} value={r} className="focus:bg-zinc-100 focus:text-zinc-900 cursor-pointer py-2.5 rounded-lg my-0.5 mx-1">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 focus-within:text-purple-600 transition-colors group">
              <Label className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider group-focus-within:text-purple-600 transition-colors">Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Min. 8 characters" className="bg-white/60 border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 h-[50px] rounded-xl focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/50 hover:border-zinc-300 hover:bg-white transition-all px-4 pr-12 shadow-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1 bg-zinc-100/50 rounded-md backdrop-blur-sm border border-zinc-200/50">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 pt-3">
              <Checkbox id="terms" checked={agreed} onCheckedChange={(c) => setAgreed(!!c)} className="mt-0.5 border-zinc-300 focus:ring-purple-500/20 hover:border-zinc-400 bg-white/60 outline-none w-[22px] h-[22px] rounded-[6px] data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 data-[state=checked]:text-white transition-all text-white shadow-sm" />
              <Label htmlFor="terms" className="text-[13px] text-zinc-500 cursor-pointer leading-relaxed font-medium">
                By creating an account, you agree to our <a href="#" className="text-zinc-900 hover:text-purple-600 transition-colors border-b border-zinc-300 hover:border-purple-400 pb-0.5">Terms of Service</a> and <a href="#" className="text-zinc-900 hover:text-purple-600 transition-colors border-b border-zinc-300 hover:border-purple-400 pb-0.5">Privacy Policy</a>.
              </Label>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full h-[52px] mt-6 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[15px] rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 group overflow-hidden relative">
               <span className="relative z-10 flex items-center justify-center gap-2">
                 {loading ? <><Loader2 size={18} className="animate-spin text-white/70" /> Creating...</> : <>Create free account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-200 text-center">
            <p className="text-[14px] font-medium text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="text-zinc-900 hover:text-purple-600 transition-colors pb-0.5 border-b border-zinc-300 hover:border-purple-400 ml-1">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
