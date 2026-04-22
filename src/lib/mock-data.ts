export const mockUser = {
  id: "usr_1",
  firstName: "Sarah",
  lastName: "Mitchell",
  name: "Sarah Mitchell",
  school: "Oaklands Prep School",
  email: "sarah@oaklandsprep.co.uk",
  role: "Marketing Director",
  plan: "Growth",
  avatar: null,
};

export const mockChannels = [
  {
    id: "ch_1",
    platform: "instagram",
    name: "Instagram",
    handle: "@oaklandsprep",
    color: "from-yellow-400 via-pink-500 to-purple-600",
    postCount: 847,
    lastSynced: "2 mins ago",
    status: "active" as const,
  },
  {
    id: "ch_2",
    platform: "facebook",
    name: "Facebook",
    handle: "Oaklands Prep School",
    color: "from-blue-500 to-blue-700",
    postCount: 312,
    lastSynced: "15 mins ago",
    status: "active" as const,
  },
  {
    id: "ch_3",
    platform: "x",
    name: "X (Twitter)",
    handle: "@oaklandssport",
    color: "from-gray-700 to-gray-900",
    postCount: 1204,
    lastSynced: "1 hour ago",
    status: "active" as const,
  },
  {
    id: "ch_4",
    platform: "youtube",
    name: "YouTube",
    handle: "Oaklands School",
    color: "from-red-500 to-red-700",
    postCount: 89,
    lastSynced: "3 hours ago",
    status: "syncing" as const,
  },
  {
    id: "ch_5",
    platform: "linkedin",
    name: "LinkedIn",
    handle: "Oaklands Prep School",
    color: "from-blue-600 to-blue-800",
    postCount: 156,
    lastSynced: "6 hours ago",
    status: "active" as const,
  },
];

export const mockStories = [
  {
    id: "st_1",
    name: "Sports News Feed",
    channelId: "ch_3",
    channel: "X (Twitter)",
    postCount: 48,
    collections: ["Homepage", "Sports Hub"],
    status: "active" as const,
    updatedAt: "2 hours ago",
  },
  {
    id: "st_2",
    name: "School Events",
    channelId: "ch_2",
    channel: "Facebook",
    postCount: 32,
    collections: ["Homepage"],
    status: "active" as const,
    updatedAt: "1 day ago",
  },
  {
    id: "st_3",
    name: "Alumni Highlights",
    channelId: "ch_5",
    channel: "LinkedIn",
    postCount: 24,
    collections: ["Alumni Page"],
    status: "active" as const,
    updatedAt: "2 days ago",
  },
  {
    id: "st_4",
    name: "Open Day 2026",
    channelId: "ch_1",
    channel: "Instagram",
    postCount: 67,
    collections: ["Admissions", "Homepage"],
    status: "active" as const,
    updatedAt: "3 days ago",
  },
  {
    id: "st_5",
    name: "Admissions Updates",
    channelId: "ch_2",
    channel: "Facebook",
    postCount: 15,
    collections: ["Admissions"],
    status: "paused" as const,
    updatedAt: "1 week ago",
  },
];

export const mockWidgets = [
  {
    id: "wg_1",
    name: "Homepage Social Wall",
    layout: "grid" as const,
    storyId: "st_2",
    story: "School Events",
    theme: "dark",
    columns: 3,
    sites: 2,
    embedCode: `<script src="https://cdn.sprx.cloud/widget.js" data-id="wg_1" data-theme="dark"></script>`,
  },
  {
    id: "wg_2",
    name: "Open Day Carousel",
    layout: "carousel" as const,
    storyId: "st_4",
    story: "Open Day 2026",
    theme: "light",
    columns: 1,
    sites: 1,
    embedCode: `<script src="https://cdn.sprx.cloud/widget.js" data-id="wg_2" data-theme="light"></script>`,
  },
  {
    id: "wg_3",
    name: "Sports Feed Slider",
    layout: "slider" as const,
    storyId: "st_1",
    story: "Sports News Feed",
    theme: "auto",
    columns: 1,
    sites: 3,
    embedCode: `<script src="https://cdn.sprx.cloud/widget.js" data-id="wg_3" data-theme="auto"></script>`,
  },
  {
    id: "wg_4",
    name: "Alumni Highlights Wall",
    layout: "masonry" as const,
    storyId: "st_3",
    story: "Alumni Highlights",
    theme: "light",
    columns: 3,
    sites: 1,
    embedCode: `<script src="https://cdn.sprx.cloud/widget.js" data-id="wg_4" data-theme="light"></script>`,
  },
];

export type AppModuleStatus = "active" | "early-access" | "coming-soon";

export type AppModuleAccent =
  | "violet"
  | "teal"
  | "amber"
  | "rose"
  | "indigo"
  | "emerald"
  | "sky"
  | "fuchsia";

export type AppModule = {
  id: string;
  name: string;
  tagline: string;
  status: AppModuleStatus;
  accent: AppModuleAccent;
  icon: string;
  href?: string;
};

export const appModules: AppModule[] = [
  {
    id: "stories",
    name: "Stories",
    tagline: "Turn your social feed into on-site widgets",
    status: "active",
    accent: "violet",
    icon: "solar:gallery-wide-bold-duotone",
    href: "/dashboard",
  },
  {
    id: "newsletter",
    name: "Dynamic Newsletter",
    tagline: "AI-personalised newsletters on autopilot",
    status: "early-access",
    accent: "fuchsia",
    icon: "solar:letter-opened-bold-duotone",
  },
  {
    id: "chatbot",
    name: "AI Chatbot",
    tagline: "24/7 support trained on your content",
    status: "early-access",
    accent: "indigo",
    icon: "solar:chat-round-dots-bold-duotone",
  },
  {
    id: "admissions",
    name: "Admissions",
    tagline: "Enrolment forms and applicant tracking",
    status: "coming-soon",
    accent: "teal",
    icon: "solar:document-add-bold-duotone",
  },
  {
    id: "athletics",
    name: "Athletics",
    tagline: "Live schedules, scores, and rosters",
    status: "coming-soon",
    accent: "rose",
    icon: "solar:basketball-bold-duotone",
  },
  {
    id: "campaigns",
    name: "Campaign Landing Pages",
    tagline: "High-converting pages for drives",
    status: "coming-soon",
    accent: "amber",
    icon: "solar:target-bold-duotone",
  },
  {
    id: "trackers",
    name: "Campaign Trackers",
    tagline: "Goal thermometers with live totals",
    status: "coming-soon",
    accent: "emerald",
    icon: "solar:chart-bold-duotone",
  },
  {
    id: "countdown",
    name: "Countdown Timers",
    tagline: "Open-day countdowns that build urgency",
    status: "coming-soon",
    accent: "sky",
    icon: "solar:calendar-minimalistic-bold-duotone",
  },
];

export type OnboardingStep = {
  id: string;
  label: string;
  description: string;
  icon: string;
  href: string;
  done: boolean;
};

export const onboardingSteps: OnboardingStep[] = [
  {
    id: "connect-channel",
    label: "Connect a channel",
    description: "Link Instagram, X, LinkedIn, or any social account",
    icon: "solar:link-bold-duotone",
    href: "/dashboard/channels",
    done: true,
  },
  {
    id: "create-story",
    label: "Create your first story",
    description: "Curate posts into a branded feed",
    icon: "solar:book-bookmark-bold-duotone",
    href: "/dashboard/stories",
    done: true,
  },
  {
    id: "build-widget",
    label: "Build your first widget",
    description: "Pick a layout and theme that matches your site",
    icon: "solar:widget-bold-duotone",
    href: "/dashboard/widgets",
    done: false,
  },
  {
    id: "embed-site",
    label: "Embed on your website",
    description: "Paste one line of code — your feed goes live",
    icon: "solar:code-square-bold-duotone",
    href: "/dashboard/widgets",
    done: false,
  },
];

export const mockMetrics = {
  impressions: 142800,
  impressionsDelta: 12.4,
  engagement: 8.7,
  engagementDelta: 2.1,
  topPlatform: "Instagram",
  storyScore: 91,
  storyScoreDelta: 4,
};

export const mockActivity = [
  { id: 1, action: "Story synced", detail: "Sports News Feed updated with 12 new posts", time: "2 mins ago", icon: "refresh" },
  { id: 2, action: "Widget embedded", detail: "Homepage Social Wall added to oaklandsprep.co.uk", time: "1 hour ago", icon: "code" },
  { id: 3, action: "Channel connected", detail: "LinkedIn connected successfully", time: "3 hours ago", icon: "link" },
  { id: 4, action: "Story created", detail: "Open Day 2026 story created", time: "1 day ago", icon: "plus" },
  { id: 5, action: "Widget created", detail: "Open Day Carousel widget created", time: "1 day ago", icon: "layout" },
];

export const mockTeam = [
  { id: "t_1", name: "Sarah Mitchell", email: "sarah@oaklandsprep.co.uk", role: "Admin", status: "active" },
  { id: "t_2", name: "James Crawford", email: "james@oaklandsprep.co.uk", role: "Editor", status: "active" },
  { id: "t_3", name: "Emma Thompson", email: "emma@oaklandsprep.co.uk", role: "Viewer", status: "pending" },
];
