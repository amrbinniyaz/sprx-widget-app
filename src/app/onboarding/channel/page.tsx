"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Lock, Plus, Link as LinkIcon, Radio } from "lucide-react";
import { toast } from "sonner";

const platforms = [
  { id: "instagram", name: "Instagram", color: "from-pink-500 via-rose-500 to-amber-500", available: true },
  { id: "facebook", name: "Facebook", color: "from-blue-500 to-blue-700", available: true },
  { id: "x", name: "X (Twitter)", color: "from-zinc-700 to-zinc-900", available: true },
  { id: "tiktok", name: "TikTok", color: "from-zinc-900 via-pink-600 to-cyan-500", available: true },
  { id: "linkedin", name: "LinkedIn", color: "from-blue-600 to-blue-800", available: true },
  { id: "youtube", name: "YouTube", color: "from-red-500 to-red-700", available: true },
  { id: "pinterest", name: "Pinterest", color: "from-red-500 to-rose-700", available: true },
  { id: "rss", name: "RSS Feed", color: "from-orange-400 to-amber-500", available: true },
  { id: "vimeo", name: "Vimeo", color: "from-cyan-500 to-blue-600", available: false },
  { id: "tumblr", name: "Tumblr", color: "from-indigo-600 to-blue-900", available: false },
  { id: "flickr", name: "Flickr", color: "from-pink-600 to-pink-800", available: false },
  { id: "soundcloud", name: "SoundCloud", color: "from-orange-400 to-orange-600", available: false },
];

const PlatformIcon = ({ id }: { id: string }) => {
  const icons: Record<string, string> = {
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    tiktok: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z",
    linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    youtube: "M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z",
    pinterest: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z",
    rss: "M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z",
  };
  const d = icons[id];
  if (!d) return <div className="w-[16px] h-[16px] rounded bg-white/30" />;
  return <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-white"><path d={d} /></svg>;
};

export default function ChannelPage() {
  const router = useRouter();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string[]>([]);

  const handleConnect = async (id: string, isAvailable: boolean) => {
    if (!isAvailable) { toast.info("This integration is coming soon!"); return; }
    if (connected.includes(id) || connecting === id) return;
    
    setConnecting(id);
    await new Promise((r) => setTimeout(r, 1400));
    setConnected((prev) => [...prev, id]);
    setConnecting(null);
    toast.success(`${platforms.find(p => p.id === id)?.name} successfully connected!`);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col justify-center min-h-[calc(100vh-10rem)]">
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-4">
          <LinkIcon size={12} className="text-purple-500" /> Step 2: Connect profiles
        </div>
        <h1 className="text-3xl sm:text-4xl font-light text-zinc-900 mb-3 tracking-tight">
          Unify your digital <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600">footprint.</span>
        </h1>
        <p className="text-zinc-500 text-sm sm:text-[15px] font-medium max-w-2xl mx-auto leading-relaxed">
          SprX automatically ingests and curates your content. Securely connect at least one channel to power your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
        {platforms.map((p, i) => {
          const isConnected = connected.includes(p.id);
          const isConnecting = connecting === p.id;
          
          return (
            <div 
              key={p.id} 
              onClick={() => handleConnect(p.id, p.available)}
              className={`relative rounded-2xl p-4 border transition-all duration-300 animate-fade-in-up overflow-hidden group ${
                isConnected 
                  ? "border-green-400 bg-green-50/80 shadow-[0_4px_20px_rgba(74,222,128,0.15)] cursor-default scale-100" 
                  : p.available 
                    ? "border-white/60 bg-white/40 backdrop-blur-xl hover:bg-white/80 hover:shadow-lg hover:shadow-black/5 hover:border-purple-300 cursor-pointer hover:-translate-y-[2px]" 
                    : "border-white/20 bg-white/20 backdrop-blur-md grayscale opacity-70 cursor-not-allowed hover:opacity-90"
              }`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {isConnected && <div className="absolute inset-0 bg-green-400/5 mix-blend-overlay pointer-events-none" />}
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className={`w-10 h-10 rounded-[10px] bg-gradient-to-br ${p.color} shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <PlatformIcon id={p.id} />
                </div>
                
                <div className="flex flex-col items-end">
                  {!p.available && <div className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center backdrop-blur-sm"><Lock size={12} className="text-zinc-500" /></div>}
                  {isConnected && <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_10px_rgba(74,222,128,0.5)]"><CheckCircle2 size={12} className="text-white" /></div>}
                  {p.available && !isConnected && !isConnecting && <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-purple-50 group-hover:border-purple-200 group-hover:text-purple-600 transition-colors"><Plus size={14} /></div>}
                  {isConnecting && <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center"><Loader2 size={12} className="text-purple-600 animate-spin" /></div>}
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-[14px] font-bold text-zinc-900 mb-0.5">{p.name}</h3>
                <p className={`text-[11px] font-medium transition-colors ${isConnected ? "text-green-600" : p.available ? "text-zinc-500 group-hover:text-purple-600" : "text-zinc-400"}`}>
                  {isConnecting ? "Authenticating..." : isConnected ? "Active & Syncing" : p.available ? "Click to connect" : "Coming 2026"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`transition-all duration-500 overflow-hidden ${connected.length > 0 ? "opacity-100 max-h-[150px] mb-6" : "opacity-0 max-h-0"}`}>
        <div className="bg-white/60 backdrop-blur-xl border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_8px_30px_rgba(74,222,128,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shadow-inner relative">
               <Radio size={16} className="text-green-600 absolute" />
               <div className="w-full h-full rounded-full border-2 border-green-400 animate-ping opacity-20" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-zinc-900 leading-tight">Sync engine initiated</h4>
              <p className="text-[12px] text-zinc-500 font-medium">Successfully connecting {connected.length} channels to your dashboard.</p>
            </div>
          </div>
          <div className="flex -space-x-3">
             {connected.map((id, i) => {
               const platform = platforms.find(p => p.id === id);
               return platform ? (
                 <div key={id} className={`w-8 h-8 rounded-full bg-gradient-to-br ${platform.color} border-2 border-white flex items-center justify-center shadow-sm z-[${20-i}]`}>
                   <PlatformIcon id={id} />
                 </div>
               ) : null;
             })}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 backdrop-blur-md border border-white rounded-2xl p-4 shadow-sm">
        <Button variant="ghost" onClick={() => router.push("/onboarding/welcome")} className="text-[13px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors h-[42px] rounded-lg hover:bg-white/50 px-4 gap-2">
          <ArrowLeft size={16} /> Review Plan
        </Button>
        <Button onClick={() => {
          if (connected.length === 0) { toast.error("Please connect at least one channel to continue"); return; }
          router.push("/onboarding/story");
        }} className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[14px] px-6 h-[46px] rounded-lg shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 group overflow-hidden relative">
          <span className="relative z-10 flex items-center justify-center gap-2 text-white">
            Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
        </Button>
      </div>
    </div>
  );
}
