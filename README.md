# FC Mobile Live-Ops Dashboard ⚽🔥

A production-grade, full-stack live operations (Live-Ops) dashboard inspired by mobile football workflows (EA Sports FC Mobile). Built with **React 18**, **TypeScript**, **Node.js (Express)**, and modern responsive **CSS**.

Features high-performance data manipulation, real-time UTC event countdowns, responsive player item cards with authentic portraits, transfer market price telemetry, regulatory store pack drop simulations, a live command center, and complete test coverage.

---

## 🌟 Key Highlights & Feature Matrix

### 1. ⏱️ Live Events Hub & Real-Time Countdowns
* **Real-Time Countdown Engine**: High-precision ticking countdowns (`DD:HH:MM:SS`) derived dynamically from UTC timestamps with urgency thresholds (normal green, amber `<24h`, pulsing crimson `<4h`).
* **Multi-Criteria Filter Engine**:
  * Debounced keyword search across event titles, subtitles, tags, and reward tiers.
  * Status filtering: `Active`, `Upcoming`, `Paused`, `Concluded`, and `Misconfigured`.
  * Category tabs: `Seasonal`, `Tournament`, `Flash Sale`, `Challenge`, `Milestone`, and `Special`.
  * Multi-metric sorting: Earliest Ending, Latest Ending, Participant Count, Completion Progress %, Title.
* **Full CRUD Operations**:
  * Launch new live-ops campaigns with custom banner art, requirements, duration, and priority.
  * Edit existing event schedules and attributes with immediate live recalculation.
  * Pause or Hotfix active events during emergency maintenance.
  * Delete archived or obsolete campaigns with confirmation.
* **Configuration Validation & Glitch Detection**:
  * Pure validation algorithms detecting flawed event configurations (e.g., `End Date <= Start Date`).
  * Emits visual **Schedule Error** warning badges and audit log alerts.

### 2. 🃏 Player Items & Live Form Catalog
* **Authentic Football Player Visuals**:
  * Verified portraits of real footballers (Mbappé, Bellingham, Haaland, Vinícius Jr., Zidane, Messi, Ronaldo, Van Dijk, Rodri, De Bruyne, Saka, Alisson).
  * Distinct card frames: **TOTY** (blue/gold holographic shimmer), **Prime Icon** (gold metallic shine), **Rulebreakers** (neon green border), **UCL RTTF** (electric blue), and **Heroes**.
  * Dynamic OVR rating badges, position indicators, nation flags, club crests, and work rate tags.
  * 6 Core Attributes: Pace (`PAC`), Shooting (`SHO`), Passing (`PAS`), Dribbling (`DRI`), Defending (`DEF`), and Physical (`PHY`).
* **Live Form Boost Modifier**: Toggle weekly real-world form buffs (+2 OVR boost with dynamic glowing flame indicator).
* **Transfer Market Telemetry**: Interactive 7-day price history sparkline, weak foot (1-5 stars), skill moves (1-5 stars), and trait badges.

### 3. 🎁 Live Store & Pack Drop Probability Simulator
* **Regulatory Drop Rate Transparency**: Discloses exact probability percentages (e.g., 97+ Prime TOTY: 3.5%, 95-96: 96.5%) compliant with international gacha disclosure requirements.
* **Server-Side Drop RNG Simulator**: Simulates pack openings using weighted algorithms with animated pack reveals and **Walkout Animations** for 95+ OVR cards.

### 4. 📡 Live Operations Command Center
* **Client Broadcast Dispatcher**: Publish in-game marquee alert banners across mobile clients with target version filters, expiry durations, and immediate dismissal controls.
* **Global Server Cluster Matrix**: Live telemetry monitoring across regional data centers (North America, Europe West, Asia Pacific, South America, Middle East) tracking latency (`ms`), load percentage, and health status.
* **Operational Change Audit Trail**: Immutable chronological log of all administrator actions (event creations, updates, deletions, and emergency broadcasts).

---

## 🏗️ Architecture & Component Design

```
fc-mobile-liveops/
├── client/                     # Vite + React 18 + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Badge, Modal, Input, Select, Skeleton, Toast, EmptyState, ErrorState
│   │   │   ├── layout/         # Header (marquee + CCU), Sidebar, MobileNav
│   │   │   ├── dashboard/      # LiveOpsOverview, single-pass KPI reduction, urgent timer cards
│   │   │   ├── events/         # EventCard, EventFilterBar, EventDetailModal, CreateEventModal, EditEventModal, EventCountdownTimer
│   │   │   ├── players/        # PlayerCardItem, PlayerCatalog, PlayerDetailModal
│   │   │   ├── store/          # StorePacksGrid, PackDropSimulator
│   │   │   └── operations/     # OperationsView, BroadcastManager, ServerStatusMatrix, AuditLogFeed
│   │   ├── context/            # LiveOpsContext (global state, toasts, active broadcasts)
│   │   ├── hooks/              # useCountdown, useDebounce
│   │   ├── services/           # api.ts (resilient REST client + offline fallback), eventService, playerService, liveopsService
│   │   ├── styles/             # theme.css (EA FC aesthetic, card rarities, volt glow, holographic shimmer), index.css
│   │   ├── types/              # Comprehensive TypeScript interfaces
│   │   ├── utils/              # eventUtils.ts (single-pass KPI reductions, date validation)
│   │   ├── App.tsx             # Root layout with responsive mobile navigation & toast provider
│   │   └── main.tsx
│   ├── test/                   # Client automated unit test suites
│   ├── vite.config.ts
│   └── tsconfig.json
├── server/                     # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── controllers/        # eventController, playerController, liveopsController
│   │   ├── routes/             # eventRoutes, playerRoutes, liveopsRoutes
│   │   ├── data/               # mockDatabase (24 seeded events, TOTY/Icon players, store packs, audit logs)
│   │   ├── middleware/         # networkSimulator (latency & fault injection), errorHandler
│   │   ├── types/              # Server-side TypeScript interfaces
│   │   ├── utils/              # Server date validation and status derivation
│   │   └── server.ts           # Express app listening on port 5000
│   ├── test/                   # Server automated unit & integration test suites
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

```bash
# Terminal 1: Start Express REST API (port 5000)
npm run dev:server

# Terminal 2: Start Vite React Frontend (port 5174)
npm run dev:client
```

Open your browser at:
`http://localhost:5174`

### Running Automated Tests & Build Verification

To execute TypeScript compilation and all unit and integration test suites:
```bash
npm run check
```

---

## 📡 REST API Endpoint Documentation

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health & uptime | — |
| `GET` | `/api/events` | List live events with filters | `search`, `status`, `category`, `sort`, `order` |
| `GET` | `/api/events/:id` | Get event details | — |
| `POST` | `/api/events` | Create a new live-ops event | `{ title, description, endDate, category, status, ... }` |
| `PATCH` | `/api/events/:id` | Update status / dates / attributes | `{ status: 'PAUSED', endDate: '...' }` |
| `DELETE` | `/api/events/:id` | Remove event and write audit log | — |
| `GET` | `/api/players` | Query player cards | `search`, `position`, `cardType`, `minOvr`, `sort` |
| `GET` | `/api/players/:id` | Get single player stats | — |
| `PATCH` | `/api/players/:id/boost` | Toggle live form +2 OVR buff | — |
| `GET` | `/api/liveops/metrics` | CCU, ping, regional health stats | — |
| `GET` | `/api/liveops/broadcasts` | Active client announcements | — |
| `POST` | `/api/liveops/broadcasts` | Dispatch marquee banner alert | `{ title, message, type, expiresAt }` |
| `DELETE` | `/api/liveops/broadcasts/:id` | Dismiss marquee alert | — |
| `GET` | `/api/liveops/packs` | Special store packs & odds | — |
| `POST` | `/api/liveops/packs/simulate-pull` | Server drop table simulation | `{ packId: '...' }` |
| `GET` | `/api/liveops/audit-log` | Admin operational history | — |
| `POST` | `/api/liveops/reset-data` | Factory reset mock database | — |

---

## 🔬 Chrome DevTools Profiling & Optimization

To investigate rendering performance and mobile responsiveness:
1. **Open DevTools**: Press `F12` or `Ctrl + Shift + I` in Google Chrome.
2. **Toggle Mobile Device Toolbar**: Press `Ctrl + Shift + M`. Test fluid viewports (`iPhone 14/15 Pro`, `Pixel 7/8`, `iPad Mini`).
3. **Audit Long Tasks (Performance tab)**:
   * Click **Record** in the Performance tab.
   * Type quickly in the Player Catalog search input.
   * Stop recording. Notice how `useDebounce` limits filtering calls to 300ms intervals, keeping scripting duration under 16ms (within the 60 FPS frame budget).
4. **Inspect Paint Flashing (Rendering tab)**:
   * Press `Esc` to open the drawer > select **Rendering** > check **Paint flashing**.
   * Observe how only the card elements that change state flash green, ensuring minimal repaints.
5. **Verify Zero Cumulative Layout Shift (CLS)**:
   * In Network tab, throttle to **Slow 3G**.
   * Refresh the Events or Players tab. Skeletons hold the exact geometrical layout until images load, eliminating layout shifts.

---

## 🛡️ TypeScript & Edge-Case Handling

* **Strict Type Safety**: Full TypeScript interfaces across all data models, API payloads, filters, and component props. Zero `any` casts in production components.
* **Loading States**: Shimmer skeleton loaders styled to exact card ratios.
* **Error States**: Dedicated Error Card with retry button, diagnosis, and graceful recovery.
* **Empty States**: Clear messaging and single-click "Clear Filters" actions.
* **Debounced Inputs**: Eliminates excessive DOM calculations and prevents layout thrashing.
* **Toast System**: Non-blocking queued feedback for every operator mutation.

---

## 📄 License
MIT License. Built for demonstration of high-performance mobile football live-ops systems.
