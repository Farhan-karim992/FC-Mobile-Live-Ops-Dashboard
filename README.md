# FC Mobile Live-Ops Dashboard

A full-stack live operations (Live-Ops) dashboard inspired by mobile football game architectures (EA Sports FC Mobile). Built with React 18, TypeScript, Node.js, Express, and responsive CSS.

The application implements real-time UTC event countdown calculations, responsive player card data models, transfer market price telemetry, regulatory store pack drop simulations, a live operations command center, and automated test suites.

---

## Key Highlights and Features

### 1. Live Events Hub and Real-Time Countdowns
* **Real-Time Countdown Engine**: High-precision countdown timers derived dynamically from UTC timestamps with urgency thresholds (standard state, under 24 hours, and urgent under 4 hours).
* **Multi-Criteria Filter Engine**:
  * Debounced keyword search across event titles, subtitles, tags, and reward tiers.
  * Status filtering: Active, Upcoming, Paused, Concluded, and Misconfigured.
  * Category tabs: Seasonal, Tournament, Flash Sale, Challenge, Milestone, and Special.
  * Multi-metric sorting: Earliest Ending, Latest Ending, Participant Count, Completion Progress %, and Title.
* **Full CRUD Operations**:
  * Launch new live-ops campaigns with custom banners, requirements, durations, and priorities.
  * Edit existing event schedules and attributes with immediate recalculation.
  * Pause or hotfix active events during emergency maintenance windows.
  * Delete obsolete campaigns with confirmation.
* **Configuration Validation and Glitch Detection**:
  * Pure validation algorithms detecting flawed event configurations (such as End Date scheduled earlier than Start Date).
  * Emits visual Schedule Error warnings and audit log alerts.

### 2. Player Items and Live Form Catalog
* **Player Data Models**:
  * Authentic player models including Kylian Mbappe, Jude Bellingham, Erling Haaland, Vinicius Junior, Zinedine Zidane, Lionel Messi, Cristiano Ronaldo, Virgil van Dijk, Rodri, Kevin De Bruyne, Bukayo Saka, and Alisson Becker.
  * Distinct card tier styles: TOTY, Prime Icon, Rulebreakers, UCL RTTF, and Heroes.
  * Dynamic OVR rating badges, position indicators, nation flags, club affiliations, and work rate tags.
  * Six core attributes: Pace (PAC), Shooting (SHO), Passing (PAS), Dribbling (DRI), Defending (DEF), and Physical (PHY).
* **Live Form Boost Modifier**: Toggle real-world weekly form multipliers (+2 OVR boost with dynamic visual indicators).
* **Transfer Market Telemetry**: Interactive 7-day price history sparkline, weak foot ratings, skill moves ratings, and trait badges.

### 3. Live Store and Pack Drop Probability Simulator
* **Regulatory Drop Rate Transparency**: Discloses exact probability percentages (such as 97+ Prime TOTY: 3.5%, 95-96: 96.5%) compliant with international gacha disclosure requirements.
* **Server-Side Drop RNG Simulator**: Simulates pack openings using weighted algorithms with animated card reveals and walkout animations for 95+ OVR cards.

### 4. Live Operations Command Center
* **Client Broadcast Dispatcher**: Publish in-game marquee alert banners across mobile clients with target version filters, expiry durations, and immediate dismissal controls.
* **Global Server Cluster Matrix**: Live telemetry monitoring across regional data centers (North America, Europe West, Asia Pacific, South America, Middle East) tracking latency, load percentage, and health status.
* **Operational Change Audit Trail**: Immutable chronological log of all administrator actions (event creations, updates, deletions, and emergency broadcasts).

---

## Architecture and Component Design

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
│   │   ├── styles/             # theme.css (EA FC aesthetic, card rarities, volt glow), index.css
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

## Getting Started

### Prerequisites
* Node.js: v18.0.0 or higher
* npm: v9.0.0 or higher

### Installation
From the root directory:
```bash
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

### Running Automated Tests and Build Verification

To execute TypeScript compilation and all unit and integration test suites:
```bash
npm run check
```

---

## REST API Endpoint Documentation

| Method | Endpoint | Description | Parameters / Payload |
| :--- | :--- | :--- | :--- |
| GET | /api/health | Service health and uptime | None |
| GET | /api/events | List live events with filters | search, status, category, sort, order |
| GET | /api/events/:id | Get event details | None |
| POST | /api/events | Create a new live-ops event | { title, description, endDate, category, status, ... } |
| PATCH | /api/events/:id | Update status, dates, or attributes | { status: 'PAUSED', endDate: '...' } |
| DELETE | /api/events/:id | Remove event and record in audit log | None |
| GET | /api/players | Query player cards | search, position, cardType, minOvr, sort |
| GET | /api/players/:id | Get single player attributes | None |
| PATCH | /api/players/:id/boost | Toggle live form +2 OVR modifier | None |
| GET | /api/liveops/metrics | CCU, ping, regional health stats | None |
| GET | /api/liveops/broadcasts | Active client announcements | None |
| POST | /api/liveops/broadcasts | Dispatch marquee banner alert | { title, message, type, expiresAt } |
| DELETE | /api/liveops/broadcasts/:id | Dismiss marquee alert | None |
| GET | /api/liveops/packs | Special store packs and odds | None |
| POST | /api/liveops/packs/simulate-pull | Server drop table simulation | { packId: '...' } |
| GET | /api/liveops/audit-log | Admin operational history | None |
| POST | /api/liveops/reset-data | Factory reset mock database | None |

---

## Performance Profiling and Optimization

Techniques applied to ensure responsive 60 FPS performance on mobile viewports:
1. **Long Task Prevention**: Input handlers use debouncing to limit search and filtering computations to 300ms intervals, avoiding main-thread layout thrashing.
2. **Single-Pass Aggregations**: Dashboard metrics are evaluated in an O(N) single-pass reduction rather than multi-pass array iterations.
3. **Paint Optimization**: Card updates are localized to prevent full viewport repaints.
4. **Zero Cumulative Layout Shift (CLS)**: Skeletons preserve layout geometry during asynchronous data fetching.

---

## TypeScript and Edge-Case Handling

* **Strict Type Safety**: Full TypeScript interfaces across all data models, API payloads, filters, and component props. Zero untyped variables in production components.
* **Loading States**: Shimmer skeleton loaders styled to exact card ratios.
* **Error States**: Dedicated Error Card with retry button, diagnosis, and graceful recovery.
* **Empty States**: Clear messaging and single-click clear filter actions.
* **Debounced Inputs**: Eliminates excessive DOM calculations and prevents layout thrashing.
* **Toast System**: Non-blocking queued feedback for every operator mutation.

---

## License
MIT License. Built for demonstration of high-performance mobile football live-ops systems.
