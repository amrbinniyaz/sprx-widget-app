"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Loader2, School, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SchoolResult {
  id: string;
  name: string;
  domain?: string;
  city?: string;
  country?: string;
  phone?: string;
}

interface SchoolAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (school: SchoolResult) => void;
  placeholder?: string;
  className?: string;
}

export function SchoolAutocomplete({ value, onChange, onSelect, placeholder = "Oaklands Prep School", className }: SchoolAutocompleteProps) {
  const [results, setResults] = useState<SchoolResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/schools?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 300);
  };

  const handleSelect = (school: SchoolResult) => {
    onChange(school.name);
    onSelect(school);
    setOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "w-full bg-white/60 border border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 h-[50px] rounded-xl px-4 pr-10 shadow-sm transition-all outline-none",
            "focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/50 hover:border-zinc-300 hover:bg-white",
            className
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
        </div>
      </div>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border border-zinc-100 rounded-xl shadow-xl overflow-hidden">
          {results.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3.5 text-sm text-zinc-400">
              <School size={15} />
              <span>No schools found — you can still type yours below</span>
            </div>
          ) : (
            <ul className="max-h-[280px] overflow-y-auto py-1.5">
              {results.map((school, i) => (
                <li
                  key={school.id}
                  onMouseDown={() => handleSelect(school)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                    activeIndex === i ? "bg-purple-50" : "hover:bg-zinc-50"
                  )}
                >
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                    <School size={14} className="text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-800 truncate">{school.name}</p>
                    {(school.city || school.country) && (
                      <p className="flex items-center gap-1 text-xs text-zinc-400 mt-0.5">
                        <MapPin size={11} />
                        {[school.city, school.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
