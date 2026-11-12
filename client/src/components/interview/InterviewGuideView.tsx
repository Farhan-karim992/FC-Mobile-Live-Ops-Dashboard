import React, { useState } from 'react';
import { Code2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const InterviewGuideView: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number>(1);

  const interviewQuestions = [
    {
      id: 1,
      question: 'Why did you choose your particular data structures?',
      category: 'Data Structures & Algorithms',
      summary: 'Flat relational arrays with indexed maps for O(1) lookups and single-pass O(N) KPI aggregations.',
      details: (
        <div>
          <p style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>
            In live operations, event and player catalogs require rapid searching, multi-field filtering, and dynamic KPI calculations.
          </p>
          <ul style={{ margin: '0 0 1rem 1.5rem', lineHeight: 1.6 }}>
            <li>
              <strong>Primary Collections (Arrays):</strong> Event and player records are stored in continuous arrays (<code>LiveEvent[]</code>, <code>PlayerCard[]</code>) allowing cache-locality and linear $O(N)$ operations for filter, sort, and slice pagination.
            </li>
            <li>
              <strong>Single-Pass KPI Aggregation:</strong> Rather than issuing 6 separate array filter passes (which would be $6 \times O(N)$), the <code>calculateDashboardKPIs</code> function evaluates Total, Active, Upcoming, Expired, Paused, Misconfigured, and Category breakdowns in a single $O(N)$ loop.
            </li>
            <li>
              <strong>Fast Lookups:</strong> When cross-referencing event rewards with eligible player cards, the pack pull simulator uses pre-filtered candidate pools to guarantee minimum OVR in constant average time.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 2,
      question: 'How does your event status calculation work?',
      category: 'Date & Time Engineering',
      summary: 'Derived dynamically from UTC timestamps to prevent stale database state and handle time-zone drift.',
      details: (
        <div>
          <p style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>
            Rather than relying on a static database column that requires cron jobs to continuously flip from "UPCOMING" to "ACTIVE" to "EXPIRED", status is computed as a pure function of current time:
          </p>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', border: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
            {`if (validationErrors) return 'MISCONFIGURED';\nif (event.status === 'PAUSED') return 'PAUSED'; // operator override\nif (now < startDate) return 'UPCOMING';\nif (startDate <= now && now <= endDate) return 'ACTIVE';\nreturn 'CONCLUDED';`}
          </div>
          <p style={{ lineHeight: 1.6 }}>
            This completely eliminates race conditions when users in different time zones open the dashboard or when an event expires while the page remains open.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      question: 'How do you prevent unnecessary React re-renders?',
      category: 'React Performance',
      summary: 'Debounced search inputs, useMemo for expensive filter arrays, and atomic state isolation.',
      details: (
        <div>
          <ul style={{ margin: '0 0 1rem 1.5rem', lineHeight: 1.6 }}>
            <li>
              <strong>useDebounce Hook:</strong> Live text search inputs are debounced by 250ms. Fast keystrokes only update local input state, postponing the heavy $O(N)$ filter recalculation until typing pauses.
            </li>
            <li>
              <strong>useMemo Dependency Memoization:</strong> Filtered and paginated arrays (<code>filteredEvents</code>, <code>paginatedEvents</code>) are wrapped in <code>useMemo</code>, preventing unnecessary recalculation when other unrelated state changes (like toast notifications or timer ticks).
            </li>
            <li>
              <strong>Component Decomposition:</strong> The <code>EventCountdownTimer</code> component encapsulates its 1-second <code>setInterval</code> ticker internally. Ticking seconds only trigger re-renders inside the timer badge itself, leaving parent cards and tables completely untouched.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 4,
      question: 'What happens when the backend fails or is unreachable?',
      category: 'Resilience & Error Handling',
      summary: 'Graceful detection with clear user feedback, retry actions, and transparent offline fallback routing.',
      details: (
        <div>
          <p style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>
            In a live-ops production outage, a dashboard must never crash or present a blank screen. Our architecture handles failures through multiple layers:
          </p>
          <ul style={{ margin: '0 0 1rem 1.5rem', lineHeight: 1.6 }}>
            <li>
              <strong>Network Boundary Catch:</strong> In <code>api.ts</code>, network drops or unhandled fetch rejections are intercepted and routed to a local client-side memory store with full parity, ensuring operational continuity.
            </li>
            <li>
              <strong>Error State Component:</strong> Displays a high-visibility error banner with technical diagnostic reasons and a dedicated "Retry Connection" action.
            </li>
            <li>
              <strong>Chaos Simulation Workbench:</strong> The DevTools panel includes an explicit "Simulate 500 Server Error" toggle, allowing engineers to verify error-state resilience on demand.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 5,
      question: 'How did you identify and optimize performance bottlenecks?',
      category: 'Chrome DevTools & Profiling',
      summary: 'Performance tab CPU flamecharts, Paint Flashing, Layout Shift tracking, and Network throttling.',
      details: (
        <div>
          <p style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>
            We used native Chrome DevTools to systematically profile and eliminate performance bottlenecks:
          </p>
          <ul style={{ margin: '0 0 1rem 1.5rem', lineHeight: 1.6 }}>
            <li>
              <strong>Performance Tab:</strong> Captured CPU traces during rapid catalog filtering to verify that Long Tasks (&gt;50ms) were avoided, staying within the 16.6ms 60 FPS frame budget.
            </li>
            <li>
              <strong>Rendering Tab (Paint Flashing):</strong> Confirmed that typing in the search box only flashes the updated card elements green rather than re-painting the entire container.
            </li>
            <li>
              <strong>Cumulative Layout Shift (CLS):</strong> Added skeleton loaders with exact aspect ratios, preserving the layout geometry while images and data stream over simulated slow 3G networks.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 6,
      question: 'How did you handle invalid or missing data edge cases?',
      category: 'Defensive Programming',
      summary: 'Strict TypeScript interfaces, date-inversion validator, and dedicated MISCONFIGURED audit state.',
      details: (
        <div>
          <p style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>
            Human error is common in game publishing (e.g., an operator accidentally scheduling an event's End Date earlier than its Start Date):
          </p>
          <ul style={{ margin: '0 0 1rem 1.5rem', lineHeight: 1.6 }}>
            <li>
              <strong>Schema Validation:</strong> <code>validateEvent()</code> checks for empty titles, invalid ISO date strings, and inverted schedules (<code>endDate &lt;= startDate</code>).
            </li>
            <li>
              <strong>Audit Warning System:</strong> Misconfigured events are automatically flagged with a red <code>⚠️ MISCONFIGURED</code> badge and aggregated in a top-level alert banner on the dashboard.
            </li>
            <li>
              <strong>Defensive Rendering:</strong> Missing rewards or participant counts fall back to sensible defaults rather than throwing undefined property errors.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 7,
      question: 'How did you organize your component architecture?',
      category: 'Software Architecture',
      summary: 'Atomic design hierarchy: common design system, domain feature modules, layout shells, and services.',
      details: (
        <div>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', border: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
            {`components/\n  common/       -> Reusable atoms (Button, Badge, Modal, Input, Skeleton, Toast)\n  layout/       -> Shell navigation (Header, Sidebar, MobileNav)\n  dashboard/    -> High-level KPI aggregations & telemetry charts\n  events/       -> Domain CRUD (EventCard, FilterBar, DetailModal, EditModal)\n  players/      -> Live form catalog & market price radar\n  store/        -> Pack odds disclosure & walkout simulator\n  operations/   -> Marquee alerts, server health, and audit logs\n  performance/  -> Chrome DevTools workbench & device frame emulator`}
          </div>
        </div>
      ),
    },
    {
      id: 8,
      question: 'What was the most interesting bug encountered and solved?',
      category: 'Debugging & Problem Solving',
      summary: 'Cumulative Layout Shift (CLS) during asynchronous card art loading and timer tick re-renders.',
      details: (
        <div>
          <p style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>
            <strong>The Problem:</strong> When high-resolution football card banners and player avatars loaded over mobile connections, the content height jumped, causing a jarring Layout Shift score (&gt;0.25). Additionally, placing the 1-second countdown timer at the parent card level caused all cards to re-render every second.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            <strong>The Solution:</strong> We assigned fixed aspect ratios and CSS Skeleton placeholders that hold exact geometry until the image decodes. We then decoupled the timer state into an isolated <code>EventCountdownTimer</code> component that isolates state transitions inside its own micro-DOM tree.
          </p>
        </div>
      ),
    },
    {
      id: 9,
      question: 'How did you test your application?',
      category: 'Quality Assurance & CI/CD',
      summary: '52 automated unit, integration, and edge-case tests with Node native test runner and TypeScript verification.',
      details: (
        <div>
          <p style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>
            We implemented 52 automated tests across 9 test suites covering both client and server domains:
          </p>
          <ul style={{ margin: '0 0 1rem 1.5rem', lineHeight: 1.6 }}>
            <li>
              <strong>REST Controllers & Database:</strong> Tested CRUD lifecycles, query filters, drop probability normalization, and audit log caps.
            </li>
            <li>
              <strong>Date & Urgency Logic:</strong> Verified that time remaining calculations correctly flag urgent (&lt;24h) and critical (&lt;4h) states and gracefully handle past dates.
            </li>
            <li>
              <strong>Middleware & Fault Injection:</strong> Tested delay injection and HTTP 500 interception via simulated headers.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 1.75rem', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(18, 26, 36, 0.9) 100%)', border: '1px solid var(--border-bright)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Code2 size={20} color="var(--fc-cyan)" />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', color: 'var(--fc-cyan)', fontWeight: 700, letterSpacing: '0.08em' }}>
            ENGINEERING CHALLENGES & INTERVIEW REFERENCE
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>
          EA Software Engineering Technical Reference
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '750px' }}>
          Technical explanations of architecture decisions, data structures, React rendering optimizations, edge-case validation, and browser debugging workflows implemented in this project.
        </p>
      </div>

      {/* Two Column Layout: Question Selector & Active Answer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {/* Left List of Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '0.25rem' }}>
            9 Key Interview Questions
          </div>

          {interviewQuestions.map(q => {
            const isSelected = activeQuestion === q.id;
            return (
              <button
                key={q.id}
                onClick={() => setActiveQuestion(q.id)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--fc-volt)' : 'var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: isSelected ? 'var(--fc-volt)' : 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Q{q.id} • {q.category}
                  </span>
                  {isSelected && <Badge variant="volt">Active</Badge>}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                  {q.question}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Explanation Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(() => {
            const current = interviewQuestions.find(q => q.id === activeQuestion)!;
            return (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Badge variant="cyan">{current.category}</Badge>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Question {current.id} of 9
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', lineHeight: 1.3 }}>
                    {current.question}
                  </h3>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 255, 135, 0.08)',
                    borderLeft: '4px solid var(--fc-volt)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  💡 <strong>Core Takeaway:</strong> {current.summary}
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {current.details}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
