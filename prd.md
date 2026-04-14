# PRD — SprX™ App Prototype
**Product:** SprX™ Application — Auth + Onboarding + Dashboard  
**Owner:** Amr Niyaz · Interactive Schools  
**Status:** Draft v1.0  
**Date:** April 2026  
**Purpose:** Demo prototype for internal stakeholder review

---

## 1. Overview

### 1.1 Purpose
This app is a standalone prototype covering the full user journey from signup through to widget creation inside the SprX™ platform. It is designed for a boss/stakeholder demo — not production — and will later be merged with the main `sprx-saas` marketing site.

### 1.2 Scope
- Authentication (login / signup) — mocked, no real backend
- 4-step onboarding wizard
- Full app dashboard with sidebar navigation
- Core module pages: Channels, Stories, Widgets, Data, Settings

### 1.3 Tech Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Animations | Tailwind transitions + CSS keyframes |
| Auth | Mocked (localStorage state, no backend) |
| Data | Static/mock data only |

---

## 2. Design Principles

1. **Slick & modern** — dark base (#09090b), glass morphism cards, purple brand accents
2. **Easy to navigate** — persistent sidebar, breadcrumbs, clear active states
3. **Demo-ready** — every screen has realistic mock data, no empty states
4. **Consistent** — matches the dark theme and brand palette of `sprx-saas` landing page

### 2.1 Brand Tokens
```
--brand-purple:  #7c3aed
--brand-teal:    #14b8a6
--brand-coral:   #f43f5e
--brand-amber:   #f59e0b
--surface-base:  #09090b
--surface-card:  rgba(255,255,255,0.03)
--border-subtle: rgba(255,255,255,0.08)
--text-primary:  #ffffff
--text-muted:    #71717a
```

---

## 3. Routes & Pages

```
/                     → redirect to /login
/login                → Login page
/signup               → Signup page

/onboarding           → redirect to /onboarding/welcome
/onboarding/welcome   → Step 1: Welcome + plan selection
/onboarding/channel   → Step 2: Connect first social channel
/onboarding/story     → Step 3: Create first story
/onboarding/widget    → Step 4: Create first widget + embed code

/dashboard            → Dashboard overview
/dashboard/channels   → Connected social channels
/dashboard/stories    → Stories & collections
/dashboard/widgets    → Widgets + embed codes
/dashboard/data       → Analytics overview (SprXdata)
/dashboard/settings   → Account & billing settings
```

---

## 4. Page Specifications

---

### 4.1 Login — `/login`

**Layout:** Full-screen split — left: branded panel, right: form

**Left panel (40%):**
- Dark background with purple/teal gradient glow
- SprX™ logo + tagline
- Animated social feed preview cards (same style as landing page hero)
- Quote/testimonial from a school

**Right panel (60%):**
- "Welcome back" heading
- Email + Password fields (shadcn Input)
- "Remember me" checkbox
- Primary CTA: "Sign in" button (full width, purple)
- Divider: "or"
- "Continue with Google" (ghost button)
- Link: "Don't have an account? Sign up"
- Mocked: any email/password combo works

---

### 4.2 Signup — `/signup`

**Layout:** Same split as login

**Right panel form:**
- "Create your account" heading
- First name + Last name (2 cols)
- School name
- Email
- Password + Confirm password
- Role selector: Head / Marketing Director / Registrar / IT Lead / Other
- Terms checkbox
- CTA: "Create account" → goes to `/onboarding/welcome`
- Link: "Already have an account? Sign in"

---

### 4.3 Onboarding Wizard — `/onboarding/*`

**Layout:** Full-screen, centered, no sidebar. Top progress bar showing steps 1–4.

#### Step 1 — Welcome `/onboarding/welcome`
- Heading: "Welcome to SprX™, [First Name]"
- Subtext: "Let's get your school set up in under 5 minutes."
- 3 plan cards (Core / Growth / Intelligence) — same tiers as landing page pricing
- Each card: name, price, module list, "Select Plan" button
- Skip link: "I'll choose a plan later →"
- CTA: "Continue" → `/onboarding/channel`

#### Step 2 — Connect Channel `/onboarding/channel`
- Heading: "Connect your first social channel"
- Subtext: "SprX syncs your content automatically once connected."
- Grid of platform tiles: Instagram, Facebook, X, TikTok, LinkedIn, YouTube, Pinterest, RSS (+ 14 more shown as locked/coming)
- Each tile: platform icon + name + "Connect" button
- Clicking "Connect" shows a mock loading state then "Connected ✓"
- CTA: "Continue" → `/onboarding/story`

#### Step 3 — Create Story `/onboarding/story`
- Heading: "Create your first story"
- Left: Form panel
  - Story name input
  - Channel selector (dropdown, shows connected channel)
  - Filter rules (mock toggles: images only, no reposts, min likes)
  - Preview toggle
- Right: Live preview panel showing mock story cards from connected channel
- CTA: "Create Story & Continue" → `/onboarding/widget`

#### Step 4 — Create Widget `/onboarding/widget`
- Heading: "Build your embed widget"
- Left: Widget configurator
  - Widget name
  - Layout selector: Grid / Masonry / Carousel / Slider (visual radio cards)
  - Columns selector (1–4)
  - Theme: Light / Dark / Auto
  - Show/hide: Avatar, Date, Likes, Caption
- Right: Live preview of the widget with mock posts
- Bottom: Embed code panel (grey code block, copy button)
- CTA: "Go to Dashboard →" → `/dashboard`

---

### 4.4 Dashboard — `/dashboard`

**Layout:** Persistent left sidebar (240px) + top header bar + main content area

**Sidebar:**
- SprX™ logo at top
- School name + avatar
- Nav items with icons:
  - Dashboard (Home icon)
  - Channels
  - Stories
  - Widgets
  - Data (SprXdata)
  - Settings
- Bottom: Plan badge + "Upgrade" link + user avatar + logout

**Top header:**
- Page title (breadcrumb)
- Search bar (decorative for prototype)
- Notification bell (decorative)
- User avatar dropdown

**Main content — Overview cards (row of 4):**
- Total Stories: 12
- Active Widgets: 3
- Connected Channels: 5
- Posts Synced: 1,847

**Recent Activity feed** — last 5 actions with timestamps

**Quick Actions row:**
- + New Story
- + New Widget  
- + Connect Channel

**Stories performance table** — name, channel, posts, last synced, status

---

### 4.5 Channels — `/dashboard/channels`

**Layout:** Dashboard shell + page content

**Content:**
- Page title "Channels" + "Connect Channel" button (top right)
- Connected channels grid (card per channel):
  - Platform icon + name
  - Account handle
  - Posts synced count
  - Last synced timestamp
  - Status badge (Active / Syncing / Error)
  - Actions: Sync now | Settings | Disconnect
- Mock data: Instagram (@oaklandsschool), Facebook (Oaklands Prep), X (@oaklandssport), YouTube (Oaklands School), LinkedIn (Oaklands Prep School)
- "Connect new channel" card at end of grid (dashed border, + icon)

---

### 4.6 Stories — `/dashboard/stories`

**Layout:** Dashboard shell

**Content:**
- Page title + "New Story" button
- Filter tabs: All | Active | Archived
- Stories table/grid:
  - Story name
  - Source channel
  - Post count
  - Collections it belongs to
  - Status toggle (active/paused)
  - Last updated
  - Actions: Edit | Duplicate | Archive
- Mock stories: "Sports News Feed", "School Events", "Alumni Highlights", "Open Day 2026", "Admissions Updates"

---

### 4.7 Widgets — `/dashboard/widgets`

**Layout:** Dashboard shell

**Content:**
- Page title + "Create Widget" button
- Widget cards grid (2 cols):
  - Widget name
  - Layout type badge (Grid / Carousel)
  - Thumbnail preview (mock)
  - Story it pulls from
  - Embed status: Embedded on X sites
  - Actions: Edit | Copy Code | Preview | Delete
- Mock widgets: "Homepage Social Wall", "Open Day Carousel", "Sports Feed Slider"
- Clicking "Copy Code" shows a toast notification

**Widget detail / editor (modal or slide-over):**
- Same configurator as onboarding step 4
- Live preview
- Embed code at bottom

---

### 4.8 Data — `/dashboard/data`

**Layout:** Dashboard shell

**Content (decorative/mock charts):**
- Date range picker (last 7 / 30 / 90 days)
- KPI row: Total Impressions, Engagement Rate, Top Platform, Story Score
- Line chart: Impressions over time (mock SVG or static image)
- Bar chart: Engagement by platform
- Table: Top performing stories

---

### 4.9 Settings — `/dashboard/settings`

**Layout:** Dashboard shell + left sub-nav tabs

**Tabs:**
- Profile — name, school, role, avatar upload (mock)
- Account — email, password change (mock)
- Plan & Billing — current plan badge, usage meters, upgrade CTA
- Team — invite members (mock table)
- Integrations — API key display, webhook URL (mock)

---

## 5. Navigation & UX Patterns

### 5.1 Auth Guard
- All `/dashboard/*` and `/onboarding/*` routes check for mock auth state in localStorage
- If not logged in → redirect to `/login`
- After login/signup → redirect to last intended route or `/dashboard`

### 5.2 Sidebar Active States
- Current route highlighted with purple left border + background tint
- Hover states on all nav items

### 5.3 Toasts / Notifications
- "Channel connected successfully"
- "Story created"
- "Embed code copied to clipboard"
- "Widget saved"

### 5.4 Loading States
- Skeleton cards on dashboard load
- Spinner on channel connect
- Progress bar on onboarding step transitions

---

## 6. Component Library (shadcn/ui)

Components to install:
- Button, Input, Label, Card
- Select, Checkbox, Switch, RadioGroup
- Dialog, Sheet (slide-over)
- Tabs, Badge, Avatar
- Table, DropdownMenu
- Toast (Sonner)
- Progress, Separator
- Tooltip

---

## 7. Mock Data

All data is static — no API calls. Mock data lives in `/src/lib/mock-data.ts`.

Entities:
- `user`: { name, school, email, plan, avatar }
- `channels[]`: { id, platform, handle, postCount, lastSynced, status }
- `stories[]`: { id, name, channelId, postCount, status, updatedAt }
- `widgets[]`: { id, name, layout, storyId, embedCode, sites }
- `metrics`: { impressions, engagement, topPlatform, storyScore }

---

## 8. Build Order

| Phase | Tasks |
|---|---|
| 1 | Project scaffold (Next.js + shadcn/ui + Tailwind) |
| 2 | Auth pages (Login + Signup) |
| 3 | Onboarding wizard (4 steps) |
| 4 | Dashboard layout shell (sidebar + header) |
| 5 | Dashboard overview page |
| 6 | Channels page |
| 7 | Stories page |
| 8 | Widgets page + embed code |
| 9 | Data page (mock charts) |
| 10 | Settings page |
