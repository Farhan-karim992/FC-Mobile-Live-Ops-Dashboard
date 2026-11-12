# FC Mobile Live-Ops Command Center ⚽🔥

A production-grade, full-stack web application inspired by mobile football game live operations (Live-Ops) workflows (EA Sports FC Mobile / FIFA Mobile). Built with **React 18**, **TypeScript**, **Node.js (Express)**, and **HTML/CSS**.

Features reusable UI components, real-time event countdowns, responsive football card designs, transfer market telemetry, pack drop simulations, a dedicated **Chrome DevTools & Performance Profiler workbench**, and resilient edge-case handling.

---

## 🌟 Key Highlights & Feature Matrix

### 1. ⏱️ Live Events Hub & Timers
* **Real-Time Digital Countdowns**: High-precision ticking countdowns (`DD:HH:MM:SS`) with dynamic urgency color-coding (normal green, amber `<24h`, pulsing crimson `<4h`).
* **Multi-Criteria Filter Engine**:
  * Debounced keyword search across event titles, subtitles, tags, and reward tiers.
  * Status filtering: `Active`, `Upcoming`, `Paused`, `Concluded`.
  * Category tabs: `Promos`, `Tournaments`, `Flash 24H Sales`, `Milestone Journeys`, `Division Rivals`.
  * Multi-metric sorting: Expiry Date, Participant Count, Completion Progress %, Title.
* **Full CRUD Operations**:
  * Launch new live-ops campaigns with custom banner art, requirements, duration, and priority.
  * Pause/Resume active events (e.g., during emergency maintenance).
  * Extend event deadlines by 24 hours with one click.
  * Delete archived or obsolete campaigns with confirmation.

### 2. 🃏 Player Items & Live Form Catalog
* **Authentic FC Mobile Card Visuals**:
  * Distinct card frames: **TOTY** (blue/gold holographic shimmer), **Prime Icon** (gold metallic shine), **Rulebreakers** (neon green border), **UCL RTTF** (electric blue), and **Heroes**.
  * Dynamic OVR rating badges, position pill, nation flags, club crests, and work rate tags.
  * 6 Core Attributes: Pace (`PAC`), Shooting (`SHO`), Passing (`PAS`), Dribbling (`DRI`), Defending (`DEF`), and Physical (`PHY`).
* **Live Form Boost Modifier**: Toggle weekly real-world form buffs (+2 OVR boost with dynamic glowing flame indicator).
* **Transfer Market Telemetry**: Interactive 7-day price history trend sparkline, weak foot (1-5 stars), skill moves (1-5 stars), and trait badges.

### 3. 🎁 Live Store & Pack Drop Probability Simulator
* **Regulatory Drop Rate Transparency**: Discloses exact probability percentages (e.g., 97+ Prime TOTY: 3.5%, 95-96: 96.5%) required by gacha compliance standards.
* **Server-Side Drop RNG Simulator**: Simulates pack openings using weighted server algorithms with suspenseful opening modal and **Walkout Animation** for 95+ OVR cards!

### 4. 📡 Live Operations Command Center
* **Client Broadcast Dispatcher**: Publish in-game marquee alert banners across mobile clients with target version filters, expiry durations, and immediate dismissal controls.
* **Global Server Cluster Matrix**: Live telemetry monitoring across 5 data centers (North America, Europe West, Asia Pacific, South America, Middle East) tracking latency (`ms`), load percentage, and health status.
* **Operational Change Audit Trail**: Immutable chronological log of all administrator actions (event pauses, boost applications, store updates, broadcast dispatches).

### 5. 🛠️ Chrome DevTools & Performance Workbench
A built-in interactive developer panel designed specifically for performance optimization and mobile testing:
* **Live HUD**: Real-time FPS monitor, active DOM element counter, and JS heap memory gauge.
* **Network Throttling Simulator**: Test UI responsiveness under **Fast 3G/4G** (400ms delay) and **Slow 3G** (1,400ms delay) to verify smooth skeleton loading.
* **Fault Injection Mode**: Force 500 Server Errors to test error boundaries, toast notifications, and retry mechanisms.
* **Responsive Mobile Device Frames**: Preview the dashboard inside **iPhone 15 Pro**, **Google Pixel 8**, **iPad Mini**, or native fluid responsive viewports.
* **Chrome DevTools Guided Investigation**: Interactive steps for measuring CPU flamecharts in Performance tab, checking Paint Flashing, and inspecting Layout Shifts (CLS).

---

## 🏗️ Architecture & Component Design

```
fc-mobile-liveops/
├── client/                     # Vite + React 18 + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Badge, Modal, Input, Select, Skeleton, Toast, EmptyState, ErrorState
│   │   │   ├── layout/         # Header (marquee + CCU), Sidebar, MobileNav
│   │   │   ├── dashboard/      # LiveOpsOverview, KPI widgets, urgent timer cards
│   │   │   ├── events/         # EventCard, EventFilterBar, EventDetailModal, CreateEventModal, EventCountdownTimer
│   │   │   ├── players/        # PlayerCardItem, PlayerCatalog, PlayerDetailModal
│   │   │   ├── store/          # StorePacksGrid, PackDropSimulator
│   │   │   ├── operations/     # OperationsView, BroadcastManager, ServerStatusMatrix, AuditLogFeed
│   │   │   └── performance/    # DevToolsInspectorPanel (FPS gauge, network throttle, device frame switcher)
│   │   ├── context/            # LiveOpsContext (global tab state, toasts, broadcast sync, DevTools settings)
│   │   ├── hooks/              # useCountdown, useDebounce, usePerformanceMonitor
│   │   ├── services/           # api.ts (resilient REST client + offline fallback), eventService, playerService, liveopsService
│   │   ├── styles/             # theme.css (EA FC aesthetic, card rarities, volt glow, holographic shimmer), index.css
│   │   ├── types/              # Comprehensive TypeScript interfaces
│   │   ├── App.tsx             # Root layout with device-frame switcher & toast provider
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── tsconfig.json
├── server/                     # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── controllers/        # eventController, playerController, liveopsController
│   │   ├── routes/             # eventRoutes, playerRoutes, liveopsRoutes
│   │   ├── data/               # mockDatabase (rich seed events, TOTY/Icon players, store packs, audit logs)
│   │   ├── middleware/         # networkSimulator (supports x-simulate-delay & x-simulate-error), errorHandler
│   │   ├── types/              # Server-side TypeScript interfaces
│   │   └── server.ts           # Express app listening on port 5000
│   ├── tsconfig.json
│   └── package.json
├── package.json                # Root package with monorepo scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation
From the root directory:
```bash
# Install server and client dependencies
npm run install:all
```

### Running in Development

**Option 1: Run both concurrently**
```bash
# Terminal 1: Start Express REST API (port 5000)
npm run dev:server

# Terminal 2: Start Vite React Frontend (port 5173)
npm run dev:client
```

**Option 2: Standalone Frontend with Offline Resilient Fallback**
The frontend includes built-in offline simulation routing. Even without the backend running, the frontend gracefully activates its local fallback data store so every feature, filter, search, boost, and pack opening works immediately!

Open your browser at:
`http://localhost:5173`

---

## 📡 REST API Endpoint Documentation

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health & uptime | — |
| `GET` | `/api/events` | List live events with filters | `search`, `status`, `type`, `sort`, `order` |
| `GET` | `/api/events/:id` | Get event details | — |
| `POST` | `/api/events` | Create a new live-ops event | `{ title, description, endDate, type, status, ... }` |
| `PATCH` | `/api/events/:id` | Update status / dates | `{ status: 'PAUSED', endDate: '...' }` |
| `DELETE` | `/api/events/:id` | Remove event | — |
| `GET` | `/api/players` | Query player cards | `search`, `position`, `cardType`, `minOvr`, `sort` |
| `GET` | `/api/players/:id` | Get single player stats | — |
| `PATCH` | `/api/players/:id/boost` | Toggle live form +2 OVR buff | — |
| `GET` | `/api/liveops/metrics` | CCU, ping, health stats | — |
| `GET` | `/api/liveops/broadcasts` | Active client announcements | — |
| `POST` | `/api/liveops/broadcasts` | Dispatch marquee banner alert | `{ title, message, type, expiresAt }` |
| `DELETE` | `/api/liveops/broadcasts/:id` | Dismiss marquee alert | — |
| `GET` | `/api/liveops/packs` | Special store packs & odds | — |
| `POST` | `/api/liveops/packs/simulate-pull` | Server drop table simulation | `{ packId: '...' }` |
| `GET` | `/api/liveops/audit-log` | Admin operational history | — |
| `POST` | `/api/liveops/reset-data` | Factory reset mock database | — |

---

## 🔬 Chrome DevTools Investigation Guide

To investigate rendering performance and mobile responsiveness:
1. **Open DevTools**: Press `F12` or `Ctrl + Shift + I` in Chrome.
2. **Toggle Mobile Device Toolbar**: Press `Ctrl + Shift + M`. Test different screen sizes (`iPhone 14 Pro`, `Pixel 7`, or responsive dimensions).
3. **Audit Long Tasks (Performance tab)**:
   * Click **Record** in the Performance tab.
   * Type quickly in the Player Catalog search input.
   * Stop recording. Notice how `useDebounce` limits filtering calls to 300ms intervals, keeping scripting duration under 16ms (within the 60 FPS frame budget).
4. **Inspect Paint Flashing (Rendering tab)**:
   * Press `Esc` to open the drawer &gt; select **Rendering** &gt; check **Paint flashing**.
   * Observe how only the card elements that change state flash green, ensuring minimal repaints.
5. **Verify Zero Layout Shift (CLS)**:
   * In the DevTools panel inside the app, switch network to **Slow 3G (1,400ms)**.
   * Refresh the Events or Players tab. Skeletons hold the exact geometrical layout until images load, preventing layout shifts.

---

## 🛡️ TypeScript & Edge-Case Handling

* **Strict Type Safety**: Full TypeScript interfaces across all data models, API payloads, filters, and component props. Zero `any` casts in production components.
* **Loading States**: Shimmer skeleton loaders styled to exact card ratios.
* **Error States**: Dedicated Error Card with retry button, helpful diagnosis, and automatic fallback.
* **Empty States**: Distinct illustrations and single-click "Clear All Filters" actions.
* **Debounced Inputs**: Eliminates excessive DOM calculations and prevents layout thrashing.
* **Toast System**: Non-blocking queued feedback for every operator mutation.

---

## 📄 License
MIT License. Built for demonstration of high-performance mobile football live-ops systems.

