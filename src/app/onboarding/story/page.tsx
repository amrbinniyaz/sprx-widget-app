"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Heart, MessageCircle, Share2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const mockPosts = [
  { id: 1, author: "Sarah Johnson", handle: "@oaklandsprep", time: "2h", text: "What a wonderful Open Day! Thank you to all 120 families who visited us today. We can't wait to welcome your children.", likes: 589, comments: 42, hasImage: true, imageColor: "from-pink-200 to-rose-300" },
  { id: 2, author: "Sports Dept", handle: "@oaklandssport", time: "1d", text: "County champions for the 3rd year running! Incredible performance from our U13 netball team 🏆", likes: 1204, comments: 86, hasImage: true, imageColor: "from-emerald-200 to-teal-300" },
  { id: 3, author: "Admissions", handle: "@oaklandsprep", time: "2d", text: "Applications for September 2027 entry are now open. Book your personal tour with our registrar.", likes: 312, comments: 24, hasImage: false, imageColor: "" },
  { id: 4, author: "Art Dept", handle: "@oaklandsprep", time: "3d", text: "Incredible work from our Year 10 art students — GCSE coursework in full swing!", likes: 478, comments: 31, hasImage: true, imageColor: "from-purple-200 to-violet-300" },
];

export default function StoryPage() {
  const router = useRouter();
  const [storyName, setStoryName] = useState("School Social Feed");
  const [channel, setChannel] = useState("instagram");
  const [filters, setFilters] = useState({ imagesOnly: false, noReposts: true, minLikes: false });

  const handleContinue = () => {
    if (!storyName.trim()) { toast.error("Please give your story a name"); return; }
    toast.success(`Story "${storyName}" created!`);
    router.push("/onboarding/widget");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-medium mb-4">
          Step 3 of 4
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-3">Create your first story</h1>
        <p className="text-zinc-500 max-w-lg mx-auto">
          A Story is a curated feed of posts from your connected channels. Configure your filters and see a live preview.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Config panel */}
        <div className="space-y-6 animate-fade-in-up">
          <div className="bg-white rounded-2xl p-6 border border-zinc-200 space-y-5 shadow-sm">
            <h3 className="font-semibold text-zinc-900">Story settings</h3>

            <div className="space-y-1.5">
              <Label className="text-zinc-700 text-sm">Story name</Label>
              <Input
                value={storyName}
                onChange={(e) => setStoryName(e.target.value)}
                className="border-zinc-200 text-zinc-900 h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-700 text-sm">Source channel</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="border-zinc-200 text-zinc-900 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200">
                  <SelectItem value="instagram" className="text-zinc-700 focus:bg-zinc-50">Instagram · @oaklandsprep</SelectItem>
                  <SelectItem value="facebook" className="text-zinc-700 focus:bg-zinc-50">Facebook · Oaklands Prep</SelectItem>
                  <SelectItem value="x" className="text-zinc-700 focus:bg-zinc-50">X · @oaklandssport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-medium text-zinc-700">Filter rules</h4>
              {[
                { key: "imagesOnly", label: "Images & videos only", icon: ImageIcon },
                { key: "noReposts", label: "No reposts / shares", icon: Share2 },
                { key: "minLikes", label: "Min. 50 likes", icon: Heart },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} className="text-zinc-400" />
                    <span className="text-sm text-zinc-600">{label}</span>
                  </div>
                  <Switch
                    checked={filters[key as keyof typeof filters]}
                    onCheckedChange={(v) => setFilters((f) => ({ ...f, [key]: v }))}
                    className="data-[state=checked]:bg-brand-purple"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-purple-50 border border-purple-200">
            <p className="text-xs text-zinc-600">
              <span className="text-purple-700 font-medium">✓ Smart moderation on.</span> SprX will automatically hide posts flagged as inappropriate. You can review and override in the Stories dashboard.
            </p>
          </div>
        </div>

        {/* Live preview */}
        <div className="animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-zinc-900 text-sm">Live preview</h3>
            <span className="text-xs text-zinc-400">{mockPosts.length} posts</span>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 space-y-3 max-h-[480px] overflow-y-auto">
            {mockPosts.map((post) => (
              <div key={post.id} className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 flex items-center justify-center text-xs font-bold text-white">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-800">{post.author}</p>
                    <p className="text-[10px] text-zinc-400">{post.handle} · {post.time}</p>
                  </div>
                </div>
                {post.hasImage && (
                  <div className={`h-28 rounded-lg mb-2 bg-gradient-to-br ${post.imageColor} flex items-center justify-center`}>
                    <ImageIcon size={24} className="text-white/60" />
                  </div>
                )}
                <p className="text-xs text-zinc-600 leading-relaxed mb-2 line-clamp-2">{post.text}</p>
                <div className="flex items-center gap-4 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1"><Heart size={10} />{post.likes.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={10} />{post.comments}</span>
                  <span className="flex items-center gap-1"><Share2 size={10} />Share</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <Button variant="ghost" onClick={() => router.push("/onboarding/channel")} className="text-zinc-500 hover:text-zinc-700 gap-2">
          <ArrowLeft size={16} /> Back
        </Button>
        <Button onClick={handleContinue} className="bg-brand-purple hover:bg-purple-700 text-white gap-2 px-6 h-11 shadow-sm hover:shadow-md transition-all">
          Create Story & Continue <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
