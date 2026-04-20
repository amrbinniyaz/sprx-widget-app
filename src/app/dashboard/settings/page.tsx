"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { mockTeam } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, CreditCard, Users, Code2, Bell, Copy, CheckCircle2, Zap, Plus } from "lucide-react";

const tabs = [
  { id: "profile",       label: "Profile",           icon: User },
  { id: "billing",       label: "Plan & Billing",    icon: CreditCard },
  { id: "team",          label: "Team",              icon: Users },
  { id: "api",           label: "API & Integrations",icon: Code2 },
  { id: "notifications", label: "Notifications",     icon: Bell },
];

const card = "bg-white/60 backdrop-blur-xl rounded-[20px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [copied, setCopied] = useState(false);
  const mockApiKey = "sprx_live_sk_8f4j2k9m3n7p1q6r5t0w";

  const handleSave = () => toast.success("Settings saved successfully!");

  const handleCopyKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopied(true);
    toast.success("API key copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex gap-8">

        {/* Sidebar nav */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-white" : "text-zinc-400"} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* ── PROFILE ───────────────────────────────────────────────── */}
          {activeTab === "profile" && (
            <div className={`${card} p-6 space-y-6`}>
              <div>
                <h3 className="text-base font-semibold text-zinc-900">Profile</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Update your personal details</p>
              </div>

              {/* Avatar row */}
              <div className="flex items-center gap-4 p-4 bg-zinc-50/60 rounded-2xl border border-zinc-100/80">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(user?.name ?? "User")}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                    alt={user?.name ?? "Avatar"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-800">{user?.name}</p>
                  <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                </div>
                <button className="text-xs font-medium text-zinc-500 hover:text-zinc-800 border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-all">
                  Change photo
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">First name</Label>
                  <Input defaultValue={user?.firstName} className="border-zinc-200 text-zinc-900 h-10 rounded-xl bg-white/60" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">Last name</Label>
                  <Input defaultValue={user?.lastName} className="border-zinc-200 text-zinc-900 h-10 rounded-xl bg-white/60" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-600">School</Label>
                <Input defaultValue={user?.school} className="border-zinc-200 text-zinc-900 h-10 rounded-xl bg-white/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-600">Email</Label>
                <Input defaultValue={user?.email} className="border-zinc-200 text-zinc-900 h-10 rounded-xl bg-white/60" />
              </div>
              <div className="flex justify-end pt-2 border-t border-zinc-100">
                <Button onClick={handleSave}>Save changes</Button>
              </div>
            </div>
          )}

          {/* ── BILLING ───────────────────────────────────────────────── */}
          {activeTab === "billing" && (
            <div className="space-y-4">
              {/* Current plan */}
              <div className={`${card} p-6`}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={15} className="text-zinc-700" />
                      <h3 className="font-bold text-zinc-900">{user?.plan} Plan</h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 font-medium">Active</span>
                    </div>
                    <p className="text-xs text-zinc-400">Renews 1 April 2027 · £12,000 / year</p>
                  </div>
                  <button className="text-xs font-medium text-zinc-500 hover:text-zinc-800 border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-all">
                    Manage billing
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Channels used",       value: "5",     max: "Unlimited" },
                    { label: "Stories created",     value: "5",     max: "Unlimited" },
                    { label: "Widgets active",      value: "3",     max: "10" },
                    { label: "API calls this month",value: "2,847", max: "50,000" },
                  ].map((u) => (
                    <div key={u.label} className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
                      <span className="text-sm text-zinc-500">{u.label}</span>
                      <span className="text-sm font-semibold text-zinc-800">
                        {u.value} <span className="text-zinc-400 font-normal text-xs">/ {u.max}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade */}
              <div className={`${card} p-6`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-sm mb-1">Upgrade to Intelligence</h3>
                    <p className="text-xs text-zinc-400 max-w-sm">Add AI Chatbot, SprXvoice™, and dedicated success management. £18,000 / year.</p>
                  </div>
                  <Button variant="outline">View plan</Button>
                </div>
              </div>
            </div>
          )}

          {/* ── TEAM ──────────────────────────────────────────────────── */}
          {activeTab === "team" && (
            <div className={`${card} overflow-hidden`}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Team members</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{mockTeam.length} members</p>
                </div>
                <Button size="sm" onClick={() => toast.info("Invite sent!")}>
                  <Plus size={13} /> Invite member
                </Button>
              </div>
              {mockTeam.map((member, i) => (
                <div key={member.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/60 transition-colors ${i < mockTeam.length - 1 ? "border-b border-zinc-100" : ""}`}>
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800">{member.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">{member.role}</span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${
                      member.status === "active"
                        ? "bg-teal-50 text-teal-600 border-teal-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── API & INTEGRATIONS ────────────────────────────────────── */}
          {activeTab === "api" && (
            <div className="space-y-4">
              <div className={`${card} p-6 space-y-4`}>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">API Key</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Use this key to access the SprX™ API. Keep it secret.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={mockApiKey}
                    type="password"
                    className="border-zinc-200 text-zinc-900 font-mono text-xs h-10 flex-1 rounded-xl bg-white/60"
                  />
                  <button
                    onClick={handleCopyKey}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all flex-shrink-0 ${
                      copied
                        ? "bg-teal-50 border-teal-200 text-teal-600"
                        : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
                    }`}
                  >
                    {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <button onClick={() => toast.success("New API key generated!")} className="text-xs text-rose-500 hover:text-rose-600 transition-colors font-medium">
                  Regenerate key
                </button>
              </div>

              <div className={`${card} p-6 space-y-4`}>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Webhook URL</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Receive real-time events from SprX™ to your server.</p>
                </div>
                <Input
                  placeholder="https://your-school.co.uk/sprx-webhook"
                  className="border-zinc-200 text-zinc-900 placeholder:text-zinc-400 h-10 rounded-xl bg-white/60"
                />
                <div className="flex justify-end pt-2 border-t border-zinc-100">
                  <Button variant="outline" onClick={handleSave}>Save webhook</Button>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ─────────────────────────────────────────── */}
          {activeTab === "notifications" && (
            <div className={`${card} p-6`}>
              <div className="mb-5">
                <h3 className="text-base font-semibold text-zinc-900">Notifications</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Choose what you want to be notified about</p>
              </div>
              <div className="space-y-0">
                {[
                  { label: "Story sync completed",  desc: "When a story finishes syncing posts",          defaultChecked: true },
                  { label: "New channel connected", desc: "When a new social channel is linked",          defaultChecked: true },
                  { label: "Widget embedded",       desc: "When your widget is added to a new site",      defaultChecked: false },
                  { label: "Weekly digest",         desc: "Weekly summary of your SprX™ performance",    defaultChecked: true },
                  { label: "Low StoryScore alert",  desc: "When your score drops below 60",               defaultChecked: true },
                ].map((n, i, arr) => (
                  <div key={n.label} className={`flex items-center justify-between py-4 ${i < arr.length - 1 ? "border-b border-zinc-100" : ""}`}>
                    <div>
                      <p className="text-sm font-medium text-zinc-800">{n.label}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{n.desc}</p>
                    </div>
                    <Switch defaultChecked={n.defaultChecked} className="data-[state=checked]:bg-zinc-900" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t border-zinc-100 mt-2">
                <Button onClick={handleSave}>Save preferences</Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
