# SprX UI Architecture

> **Read this before adding any new nav, page, or feature.** SprX is not a single-purpose dashboard — it is a **multi-module platform**. Getting this wrong (e.g. treating Chatbot or Newsletter as "widget types" inside the Stories app) creates confusing hierarchies that are expensive to untangle later.

---

## 1. Mental model

SprX is a **platform of independent products (modules)**. Each module is effectively its own mini-app:

- Its own **dashboard** (home screen with KPIs relevant to that product)
- Its own **sidebar nav** (pages that exist only inside that module)
- Its own **data/analytics**, **settings**, **widgets**, **content management**
- Its own **route namespace** (`/dashboard/<module>/...`)

The user's relationship with the platform is:
1. **Which module am I in?** → shown by the header **Module Switcher** (9-dot apps icon, top right) and by the sidebar's module-scoped nav.
2. **What page am I on inside that module?** → shown by the page title in the header and the active sidebar item.

**Rule of thumb:** if two features belong to different products (Stories vs. Chatbot), they must not live under the same sidebar nav or the same URL namespace. Cross-module cards, peer "catalog" pages mixing products, and "Widgets" pages that list chatbots alongside story widgets are anti-patterns.

---

## 2. Module catalog (as of 2026-04-22)

Defined in `src/lib/mock-data.ts` → `appModules: AppModule[]`.

| id           | Name                    | Status        | Accent   | Route prefix (target)            |
| ------------ | ----------------------- | ------------- | -------- | -------------------------------- |
| `stories`    | Stories                 | active        | violet   | `/dashboard` *(owns root today)* |
| `newsletter` | Dynamic Newsletter      | early-access  | fuchsia  | `/dashboard/newsletter/**`       |
| `chatbot`    | AI Chatbot              | early-access  | indigo   | `/dashboard/chatbot/**`          |
| `admissions` | Admissions              | coming-soon   | teal     | `/dashboard/admissions/**`       |
| `athletics`  | Athletics               | coming-soon   | rose     | `/dashboard/athletics/**`        |
| `campaigns`  | Campaign Landing Pages  | coming-soon   | amber    | `/dashboard/campaigns/**`        |
| `trackers`   | Campaign Trackers       | coming-soon   | emerald  | `/dashboard/trackers/**`         |
| `countdown`  | Countdown Timers        | coming-soon   | sky      | `/dashboard/countdown/**`        |

Status meanings:
- **active** — ships today; a real workspace exists at its route prefix; switcher row is clickable and navigates to that workspace.
- **early-access** — hidden behind a waitlist; switcher row opens `NotifyMeDialog` with "Join beta" copy.
- **coming-soon** — announced but unbuilt; switcher row opens `NotifyMeDialog` with "Notify me" copy.

---

## 3. Navigation architecture

Two distinct dimensions, rendered in two distinct places:

### Header (global dimension — "which product")
`src/components/dashboard/Header.tsx`

- **Left:** Page title + subtitle (contextual to the current page inside the active module)
- **Right (reading order):**
  1. `GettingStartedButton` — onboarding progress pill with circular ring + checklist popover (hidden when 100% or user dismisses)
  2. `ModuleSwitcher` — **bold 3×3 square grid icon** (Facebook-style apps launcher) that opens a two-column mega-menu:
     - Left column: searchable modules list grouped by Active / Early access / Coming soon, with "You're here" indicator on the current module.
     - Right column: Shortcuts column (contextual actions for the current module + platform links).
     - Backdrop blur (`backdrop-blur-[6px]` + soft scrim) + `modal` mode → body scroll is locked, focus trapped.
  3. Bell (notifications)

### Sidebar (module-scoped dimension — "which page in this product")
`src/components/dashboard/Sidebar.tsx`

- Today hardcoded to **Stories** module nav: Dashboard · Channels · Stories · Widgets · Data · Settings.
- **Plan when a second module ships:** sidebar becomes data-driven — it reads the active module and renders that module's nav items. Switching module in the header re-skins the sidebar.

### Mega-menu module row behavior

| Status         | Click action                                        |
| -------------- | --------------------------------------------------- |
| `active`       | `<Link>` to `module.href` → navigates to that workspace |
| `early-access` | Opens `NotifyMeDialog` (Join beta)                  |
| `coming-soon`  | Opens `NotifyMeDialog` (Notify me)                  |

---

## 4. Route convention

```
/dashboard                         → Stories module home (until Stories is moved to /dashboard/stories/**)
/dashboard/channels                → Stories · Channels
/dashboard/stories                 → Stories · Stories list
/dashboard/widgets                 → Stories · Widgets (means *story widgets*, NOT a module catalog)
/dashboard/data                    → Stories · Analytics
/dashboard/settings                → Stories · Settings

# Future modules get their own top-level segment:
/dashboard/chatbot                 → AI Chatbot home
/dashboard/chatbot/conversations   → AI Chatbot · Conversations
/dashboard/chatbot/persona         → AI Chatbot · Persona / training
/dashboard/chatbot/widgets         → AI Chatbot · Widgets (its own embeddable widgets, separate from story widgets)
/dashboard/chatbot/data            → AI Chatbot · Analytics
/dashboard/chatbot/settings        → AI Chatbot · Settings

/dashboard/newsletter              → Newsletter home
/dashboard/newsletter/campaigns    → Newsletter · Campaigns
/dashboard/newsletter/templates    → Newsletter · Templates
/dashboard/newsletter/data         → Newsletter · Analytics
...
```

**Critical:** `/dashboard/widgets` is a Stories-module page, not a platform-wide widgets catalog. Each module has its OWN `/widgets` sub-route if widgets are part of that module's surface.

---

## 5. Module → workspace blueprint

Every module's workspace follows the same skeleton so users have zero re-learning when they switch. Example: **AI Chatbot** when it ships.

### Routes
```
/dashboard/chatbot                 → Dashboard (KPIs: total conversations, avg CSAT, deflection rate)
/dashboard/chatbot/conversations   → Conversation inbox / history
/dashboard/chatbot/persona         → Edit bot persona, tone, system prompt
/dashboard/chatbot/training        → Upload docs, URLs, Q&A pairs
/dashboard/chatbot/widgets         → Embed widget config for the chat bubble
/dashboard/chatbot/data            → Analytics (heatmaps of intents, CSAT trends)
/dashboard/chatbot/settings        → Module-level settings (brand colours, availability hours)
```

### Sidebar nav for the AI Chatbot module
```
Dashboard · Conversations · Persona · Training · Widgets · Data · Settings
```

### Module home (dashboard) content
- Hero KPI row: today's conversations, avg. response time, CSAT
- Chart: conversation volume over time
- Recent conversations feed
- "Train your bot" CTA if training set is empty

### Where each route's page.tsx lives
```
src/app/dashboard/chatbot/page.tsx
src/app/dashboard/chatbot/conversations/page.tsx
src/app/dashboard/chatbot/persona/page.tsx
src/app/dashboard/chatbot/training/page.tsx
src/app/dashboard/chatbot/widgets/page.tsx
src/app/dashboard/chatbot/data/page.tsx
src/app/dashboard/chatbot/settings/page.tsx
```

Every other module (Newsletter, Admissions, Athletics, Campaigns, Trackers, Countdown) follows the same blueprint — just swap the module-specific nav items and KPIs.

---

## 6. How to ship a new module

When a module is ready to leave Coming Soon / Early Access status:

1. **Flip status in `appModules`** (`src/lib/mock-data.ts`) → set `status: "active"` and add `href: "/dashboard/<id>"`.
2. **Create the route tree** under `src/app/dashboard/<id>/**` with pages listed in section 5.
3. **Define the module's sidebar nav items** — when the sidebar is made data-driven, add an entry like:
   ```ts
   export const moduleNavItems: Record<string, NavItem[]> = {
     stories:  [ { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true }, ... ],
     chatbot:  [ { label: "Dashboard", href: "/dashboard/chatbot", icon: LayoutDashboard, exact: true }, ... ],
     ...
   };
   ```
4. **Update `resolveCurrentModuleId(pathname)` in `ModuleSwitcher.tsx`** — map route prefix → module id. Example:
   ```ts
   if (pathname.startsWith("/dashboard/chatbot")) return "chatbot";
   if (pathname.startsWith("/dashboard/newsletter")) return "newsletter";
   return "stories"; // default
   ```
5. **Build the module home** at `src/app/dashboard/<id>/page.tsx` following the dashboard KPI pattern (see `src/app/dashboard/page.tsx` for Stories as reference — glass cards, animated headline, KPI row, chart, feed).
6. **Wire shortcuts in the mega-menu's right column** — the "In this module" shortcuts should be module-aware (not always the Stories shortcuts). Make the shortcut list derive from the active module's own action set.

---

## 7. Anti-patterns — don't do these

❌ **Flat catalog of module types on one page.** Listing Stories, Chatbot, Newsletter, Admissions, Campaigns as peer cards on `/dashboard/widgets` is a category error — a chatbot is a whole product, not a widget type. The mega-menu already covers discovery; don't duplicate it inside a product workspace.

❌ **Sidebar items that span products.** Today's sidebar (Dashboard / Channels / Stories / Widgets / Data / Settings) is **Stories-module nav** even though it looks global. Don't add a "Chatbot" item to it — switch modules via the header instead.

❌ **Global `/data` or `/settings` pages.** Analytics and settings are per-module. Stories has its own `/dashboard/data`; Chatbot will have `/dashboard/chatbot/data`.

❌ **Cross-module linking in sidebar nav.** Sidebar is scoped to the active module. Cross-module jumps go through the header switcher.

❌ **Hiding the switcher.** The apps icon stays visible at all times — users need a consistent way to switch modules. No collapsing it behind the user menu.

---

## 8. Visual / interaction system

- **Glass cards:** `bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]`. Hover lift: `hover:shadow-[0_16px_40px_rgb(0,0,0,0.1)] hover:-translate-y-0.5`.
- **Accent palette per module** — defined in `accentStyles` maps (see `ModuleSwitcher.tsx`). Eight named accents: violet, teal, amber, rose, indigo, emerald, sky, fuchsia. Each includes `tile`, `icon`, `ring`, `gradient`, and `glow` classnames. Reuse the same keys when a module needs visual identity.
- **Brand tokens** — `globals.css` `@theme inline` block: `--color-brand-purple: #7c3aed`, `--color-brand-teal: #0d9488`, `--color-brand-coral: #e11d48`, `--color-brand-amber: #d97706`.
- **Icons** — Iconify (`@iconify/react`) Solar duotone set for module/feature icons; `lucide-react` for action icons. Platform logos via `logos:*` set (Instagram, LinkedIn, X, etc.).
- **Animations** — `animate-fade-in-up` (defined in `globals.css`) for content entry; stagger with `style={{ animationDelay: "${i * 28}ms" }}`.
- **Popovers / dialogs** — `@base-ui/react` primitives. For any full-screen-ish menu: set `modal` on `Popover.Root`, render `<Popover.Backdrop>` with `backdrop-blur-[6px] bg-zinc-900/[0.08]`, include a visually-hidden `<Popover.Close className="sr-only">` inside `Popup` for focus trapping.
- **Avatars** — DiceBear `notionists` set for user avatars (see `Sidebar.tsx`).

---

## 9. Key files — single sources of truth

| Concern                              | File                                                |
| ------------------------------------ | --------------------------------------------------- |
| Module catalog + types               | `src/lib/mock-data.ts` → `appModules`, `AppModule`  |
| Onboarding checklist                 | `src/lib/mock-data.ts` → `onboardingSteps`          |
| Header composition                   | `src/components/dashboard/Header.tsx`               |
| Sidebar composition                  | `src/components/dashboard/Sidebar.tsx`              |
| Module switcher (apps launcher)      | `src/components/modules/ModuleSwitcher.tsx`         |
| Early-access / coming-soon dialog    | `src/components/modules/NotifyMeDialog.tsx`         |
| Getting-started pill + popover       | `src/components/dashboard/GettingStartedButton.tsx` |
| Brand tokens / animations            | `src/app/globals.css` (`@theme inline` block)       |
| Auth state (user name, email, plan)  | `src/context/auth-context.tsx`                      |

---

## 10. TL;DR for future sessions

- **SprX is a platform of modules.** Stories is one of them. Chatbot, Newsletter, etc. are others.
- **Each module = its own dashboard, its own routes, its own sidebar nav, its own everything.** When the user clicks AI Chatbot in the switcher, they land on `/dashboard/chatbot` (a dedicated chatbot dashboard), and the sidebar changes to show chatbot-specific pages (Dashboard, Conversations, Persona, Training, Widgets, Data, Settings).
- **The header switcher is the only cross-module navigation surface.** Don't invent competing ones.
- **`/dashboard/widgets` means story widgets, not a module catalog.** Keep it that way.
