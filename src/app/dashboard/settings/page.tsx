"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { mockTeam } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, CreditCard, Users, Code2, Bell, Copy, CheckCircle2, Zap, ChevronRight } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Plan & Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
  { id: "api", label: "API & Integrations", icon: Code2 },
  { id: "notifications", label: "Notifications", icon: Bell },
];

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
        {/* Settings sidebar nav */}
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-purple-50 text-purple-700 border border-purple-100"
                      : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
                  }`}
                >
                  <Icon size={15} className={activeTab === tab.id ? "text-brand-purple" : "text-zinc-400"} />
                  {tab.label}
                  {activeTab === tab.id && <ChevronRight size={12} className="ml-auto text-purple-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-6">
              <h3 className="font-semibold text-zinc-900">Profile</h3>
              <div className="flex items-center gap-5 pb-5 border-b border-zinc-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-teal-500 flex items-center justify-center text-2xl font-bold text-white">
                  {user?.firstName?.[0] || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800">{user?.name}</p>
                  <p className="text-xs text-zinc-400 mb-2">{user?.email}</p>
                  <button className="text-xs text-brand-purple hover:text-purple-700 transition-colors">Change avatar</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-zinc-700 text-sm">First name</Label>
                  <Input defaultValue={user?.firstName} className="border-zinc-200 text-zinc-900 h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-700 text-sm">Last name</Label>
                  <Input defaultValue={user?.lastName} className="border-zinc-200 text-zinc-900 h-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-700 text-sm">School</Label>
                <Input defaultValue={user?.school} className="border-zinc-200 text-zinc-900 h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-700 text-sm">Email</Label>
                <Input defaultValue={user?.email} className="border-zinc-200 text-zinc-900 h-10" />
              </div>
              <Button onClick={handleSave} className="bg-brand-purple hover:bg-purple-700 text-white px-6 shadow-sm">Save changes</Button>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-5">
              {/* Current plan */}
              <div className="bg-white rounded-2xl p-6 border border-purple-200 bg-purple-50/50 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={16} className="text-brand-purple" />
                      <h3 className="font-bold text-zinc-900 text-lg">{user?.plan} Plan</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-200">Active</span>
                    </div>
                    <p className="text-sm text-zinc-500">Renews 1 April 2027 · £12,000 / year</p>
                  </div>
                  <button className="text-xs text-brand-purple hover:text-purple-700 transition-colors">Manage billing →</button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Channels used", value: 5, max: "Unlimited" },
                    { label: "Stories created", value: 5, max: "Unlimited" },
                    { label: "Widgets active", value: 3, max: 10 },
                    { label: "API calls this month", value: "2,847", max: "50,000" },
                  ].map((u) => (
                    <div key={u.label} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">{u.label}</span>
                      <span className="text-zinc-700 font-medium">{u.value} <span className="text-zinc-400 font-normal">/ {u.max}</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
                <h3 className="font-semibold text-zinc-900 text-sm mb-3">Upgrade to Intelligence</h3>
                <p className="text-xs text-zinc-500 mb-4">Add AI Chatbot, SprXvoice™, and dedicated success management. £18,000 / year.</p>
                <Button className="bg-brand-purple hover:bg-purple-700 text-white text-sm shadow-sm">View Intelligence plan</Button>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50">
                <h3 className="font-semibold text-zinc-900 text-sm">Team members</h3>
                <button
                  onClick={() => toast.info("Invite sent!")}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-purple hover:bg-purple-700 text-white text-xs font-medium transition-all shadow-sm"
                >
                  + Invite member
                </button>
              </div>
              {mockTeam.map((member, i) => (
                <div key={member.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors ${i < mockTeam.length - 1 ? "border-b border-zinc-100" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-teal-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {member.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800">{member.name}</p>
                    <p className="text-xs text-zinc-400">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${member.status === "active" ? "bg-teal-50 text-teal-600 border-teal-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                      {member.status}
                    </span>
                    <span className="text-xs text-zinc-400">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
                <h3 className="font-semibold text-zinc-900 text-sm">API Key</h3>
                <p className="text-xs text-zinc-500">Use this key to access the SprX™ API. Keep it secret.</p>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={mockApiKey}
                    type="password"
                    className="border-zinc-200 text-zinc-900 font-mono text-xs h-10 flex-1"
                  />
                  <button
                    onClick={handleCopyKey}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      copied ? "bg-teal-50 border-teal-200 text-teal-600" : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <button onClick={() => toast.success("New API key generated!")} className="text-xs text-rose-500 hover:text-rose-600 transition-colors">Regenerate key</button>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
                <h3 className="font-semibold text-zinc-900 text-sm">Webhook URL</h3>
                <Input
                  placeholder="https://your-school.co.uk/sprx-webhook"
                  className="border-zinc-200 text-zinc-900 placeholder:text-zinc-400 h-10"
                />
                <Button onClick={handleSave} variant="outline" className="border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 text-sm">Save webhook</Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-5">
              <h3 className="font-semibold text-zinc-900">Notifications</h3>
              {[
                { label: "Story sync completed", desc: "When a story finishes syncing posts" },
                { label: "New channel connected", desc: "When a new social channel is linked" },
                { label: "Widget embedded", desc: "When your widget is added to a new site" },
                { label: "Weekly digest", desc: "Weekly summary of your SprX™ performance" },
                { label: "Low StoryScore alert", desc: "When your score drops below 60" },
              ].map((n) => (
                <div key={n.label} className="flex items-start justify-between py-3 border-b border-zinc-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{n.label}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{n.desc}</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-brand-purple mt-0.5" />
                </div>
              ))}
              <Button onClick={handleSave} className="bg-brand-purple hover:bg-purple-700 text-white px-6 shadow-sm">Save preferences</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
