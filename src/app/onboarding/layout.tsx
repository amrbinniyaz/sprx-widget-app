"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const steps = [
  { label: "Connect channel", path: "/onboarding/channel" },
  { label: "Build widget",    path: "/onboarding/widget"  },
  { label: "Publish",          path: "/onboarding/plan"    },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((s) => pathname.startsWith(s.path));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden font-sans">
      {/* Universal Light Dynamic Background for Onboarding */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] sm:w-[60rem] h-[40rem] sm:h-[60rem] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[140px] opacity-60 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[30rem] sm:w-[50rem] h-[30rem] sm:h-[50rem] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[140px] opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[45rem] sm:w-[65rem] h-[45rem] sm:h-[65rem] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[100px] sm:blur-[150px] opacity-50 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgbZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMzYgMzRoMjR2MjRIMzZWMzR6TTI0IDM2VjM2aC0yMnYtMjJIMjRnIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-60 mix-blend-overlay" />
      </div>

      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/SprXstories-Logo.png" alt="SprX Stories" width={120} height={40} className="h-8 w-auto" />
          </Link>

          {/* Steps */}
          <div className="hidden md:flex items-center">
            {steps.map((step, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <div key={i} className="flex items-center">
                  <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                    active
                      ? "bg-zinc-900 text-white"
                      : done
                      ? "text-green-600"
                      : "text-zinc-400"
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      active
                        ? "bg-white/15 text-white"
                        : done
                        ? "bg-green-500 text-white"
                        : "border border-zinc-300 text-zinc-400"
                    }`}>
                      {done ? "✓" : i + 1}
                    </span>
                    {step.label}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="relative mx-2 w-14 h-[2px] rounded-full bg-zinc-200/70 overflow-hidden">
                      <div className={`absolute inset-y-0 left-0 rounded-full bg-zinc-400 transition-all duration-700 ${i < currentIndex ? "w-full" : "w-0"}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="md:hidden text-xs font-semibold text-zinc-500 tracking-wide uppercase">Step {currentIndex + 1} of {steps.length}</div>
          <p className="text-xs text-zinc-500 hidden sm:block font-medium">Need help? <span className="text-purple-600 hover:text-purple-700 cursor-pointer font-bold border-b border-purple-200 hover:border-purple-400 pb-0.5 transition-colors">Chat with us</span></p>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-zinc-100/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-in-out relative"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50" />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-12 px-4 relative z-10">{children}</main>
    </div>
  );
}
