import React, { useState } from 'react';
import {
  Cpu,
  Gauge,
  Wifi,
  Smartphone,
  Layers,
  Activity,
  Terminal,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { useLiveOps } from '../../context/LiveOpsContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const DevToolsInspectorPanel: React.FC = () => {
  const { stats, networkLogs, clearLogs } = usePerformanceMonitor();
  const { devToolsSettings, updateDevToolsSettings } = useLiveOps();
  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'network' | 'viewport' | 'guide'>('metrics');

  const fpsColor =
    stats.fps >= 55 ? 'var(--fc-volt)' : stats.fps >= 30 ? 'var(--fc-gold)' : 'var(--fc-crimson)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={22} color="var(--fc-cyan)" />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
              Chrome DevTools & Performance Profiler
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Investigate rendering bottlenecks, frame rates, responsive mobile device viewports, and simulate network conditions.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveSubTab('metrics')}
            className={`btn btn-sm ${activeSubTab === 'metrics' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.75rem' }}
          >
            <Gauge size={13} /> Live HUD
          </button>
          <button
            onClick={() => setActiveSubTab('network')}
            className={`btn btn-sm ${activeSubTab === 'network' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.75rem' }}
          >
            <Wifi size={13} /> Network Throttle
          </button>
          <button
            onClick={() => setActiveSubTab('viewport')}
            className={`btn btn-sm ${activeSubTab === 'viewport' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.75rem' }}
          >
            <Smartphone size={13} /> Device Frames
          </button>
          <button
            onClick={() => setActiveSubTab('guide')}
            className={`btn btn-sm ${activeSubTab === 'guide' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.75rem' }}
          >
            <HelpCircle size={13} /> DevTools Guide
          </button>
        </div>
      </div>

      {/* 1. Live HUD Metrics Tab */}
      {activeSubTab === 'metrics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Key Vitals Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* FPS Gauge */}
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Display Frame Rate</span>
                <Badge variant={stats.fps >= 50 ? 'volt' : 'crimson'} pulse>
                  LIVE
                </Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <span className="stat-ovr" style={{ fontSize: '2.5rem', color: fpsColor }}>
                  {stats.fps}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>FPS</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Target: 60 FPS (16.6ms frame budget)
              </div>
            </div>

            {/* DOM Node Count */}
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active DOM Elements</span>
                <Layers size={16} color="var(--fc-cyan)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <span className="stat-ovr" style={{ fontSize: '2.5rem', color: 'var(--fc-cyan)' }}>
                  {stats.domNodeCount}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>nodes</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Lighthouse recommendation: &lt; 1,500 total nodes
              </div>
            </div>

            {/* Heap Memory */}
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JS Heap Memory</span>
                <Activity size={16} color="var(--fc-gold)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <span className="stat-ovr" style={{ fontSize: '2.5rem', color: 'var(--fc-gold)' }}>
                  {stats.memoryMb ? `${stats.memoryMb}` : 'N/A'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MB</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {stats.memoryMb ? 'Browser performance.memory active' : 'Chrome desktop only API'}
              </div>
            </div>
          </div>

          {/* Network Activity Waterfall */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={16} color="var(--fc-volt)" />
                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Recent REST API Network Requests</h4>
              </div>
              <Button variant="ghost" size="sm" onClick={clearLogs} style={{ fontSize: '0.7rem' }}>
                Clear Log
              </Button>
            </div>

            {networkLogs.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                No API requests recorded yet in this session. Interact with events or players to see telemetry logs.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '240px', overflowY: 'auto' }}>
                {networkLogs.map((log, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.75rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ color: log.method === 'GET' ? 'var(--fc-volt)' : 'var(--fc-cyan)', fontWeight: 700 }}>
                        {log.method}
                      </span>
                      <span style={{ color: 'var(--text-primary)' }}>{log.url}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: log.status === 200 || log.status === 201 ? 'var(--fc-volt)' : 'var(--fc-crimson)', fontWeight: 700 }}>
                        {log.status}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{log.duration}ms</span>
                      <span style={{ color: 'var(--text-muted)' }}>{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Network Throttling & Chaos Simulation */}
      {activeSubTab === 'network' && (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>
              Simulate Network Conditions & API Faults
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Test how the live-ops interface behaves under poor mobile bandwidth (Slow 3G) and verify loading skeleton animations and error recovery buttons.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {/* No throttling */}
            <div
              onClick={() => updateDevToolsSettings({ simulatedDelayMs: 0, simulateError: false })}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid',
                borderColor: devToolsSettings.simulatedDelayMs === 0 && !devToolsSettings.simulateError ? 'var(--fc-volt)' : 'var(--border-subtle)',
                background: devToolsSettings.simulatedDelayMs === 0 && !devToolsSettings.simulateError ? 'rgba(0,255,135,0.08)' : 'var(--bg-secondary)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>No Throttle (Localhost)</span>
                {devToolsSettings.simulatedDelayMs === 0 && !devToolsSettings.simulateError && <CheckCircle size={16} color="var(--fc-volt)" />}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Instant responses (&lt; 20ms). Normal full-speed development.
              </p>
            </div>

            {/* Fast 3G */}
            <div
              onClick={() => updateDevToolsSettings({ simulatedDelayMs: 400, simulateError: false })}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid',
                borderColor: devToolsSettings.simulatedDelayMs === 400 && !devToolsSettings.simulateError ? 'var(--fc-cyan)' : 'var(--border-subtle)',
                background: devToolsSettings.simulatedDelayMs === 400 && !devToolsSettings.simulateError ? 'rgba(0,240,255,0.08)' : 'var(--bg-secondary)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>Fast 3G / 4G (400ms)</span>
                {devToolsSettings.simulatedDelayMs === 400 && !devToolsSettings.simulateError && <CheckCircle size={16} color="var(--fc-cyan)" />}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Simulates standard mobile roaming latency.
              </p>
            </div>

            {/* Slow 3G */}
            <div
              onClick={() => updateDevToolsSettings({ simulatedDelayMs: 1400, simulateError: false })}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid',
                borderColor: devToolsSettings.simulatedDelayMs === 1400 && !devToolsSettings.simulateError ? 'var(--fc-gold)' : 'var(--border-subtle)',
                background: devToolsSettings.simulatedDelayMs === 1400 && !devToolsSettings.simulateError ? 'rgba(255,210,0,0.08)' : 'var(--bg-secondary)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>Slow 3G (1,400ms)</span>
                {devToolsSettings.simulatedDelayMs === 1400 && !devToolsSettings.simulateError && <CheckCircle size={16} color="var(--fc-gold)" />}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tests smooth skeleton loaders and prevents UI layout jumps.
              </p>
            </div>

            {/* Simulated 500 Error */}
            <div
              onClick={() => updateDevToolsSettings({ simulateError: true })}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid',
                borderColor: devToolsSettings.simulateError ? 'var(--fc-crimson)' : 'var(--border-subtle)',
                background: devToolsSettings.simulateError ? 'rgba(255,51,102,0.1)' : 'var(--bg-secondary)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--fc-crimson)' }}>500 Server Error</span>
                {devToolsSettings.simulateError && <AlertTriangle size={16} color="var(--fc-crimson)" />}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Forces backend to return 500 to test ErrorState and retry buttons.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Responsive Device Frames Tab */}
      {activeSubTab === 'viewport' && (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>
              Responsive Mobile Viewport Simulator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Emulate how the FC Mobile Live-Ops dashboard looks and operates on physical mobile devices.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { id: 'native', label: 'Native Responsive (Fluid 100%)' },
              { id: 'iphone', label: 'iPhone 15 Pro (393px)' },
              { id: 'pixel', label: 'Google Pixel 8 (412px)' },
              { id: 'ipad', label: 'iPad Mini (768px)' },
            ].map(d => (
              <Button
                key={d.id}
                variant={devToolsSettings.deviceViewport === d.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => updateDevToolsSettings({ deviceViewport: d.id as any })}
              >
                {d.label}
              </Button>
            ))}
          </div>

          <div
            style={{
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            <strong>Current emulation:</strong>{' '}
            <span style={{ color: 'var(--fc-volt)', textTransform: 'capitalize' }}>
              {devToolsSettings.deviceViewport}
            </span>
            . To test touch gestures, open Chrome DevTools (F12) and toggle the Device Toolbar (Ctrl+Shift+M).
          </div>
        </div>
      )}

      {/* 4. Chrome DevTools Investigation Guide */}
      {activeSubTab === 'guide' && (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.25rem' }}>
              Investigating Live-Ops Performance in Chrome DevTools
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              A systematic guide to auditing bottlenecks, render times, and mobile responsiveness using native Chrome DevTools.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* Step 1: Performance Profiling */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--fc-volt)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>1</span>
                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Performance Tab & CPU Profiles</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Press <code>F12</code> &gt; <strong>Performance</strong>. Click <strong>Record</strong>, interact with the Player Catalog filter or open a pack, then click Stop. Inspect the Main Thread flamechart to spot any Long Tasks exceeding the 50ms budget.
              </p>
            </div>

            {/* Step 2: Paint Flashing */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--fc-cyan)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>2</span>
                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Rendering & Paint Flashing</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                In Chrome DevTools, open the drawer (<code>Esc</code>) &gt; <strong>Rendering</strong> tab. Check <strong>Paint flashing</strong>. When you type in the search box, only the filtered cards will flash green, proving our debounced memoization avoids whole-page re-paints.
              </p>
            </div>

            {/* Step 3: Cumulative Layout Shift */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--fc-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>3</span>
                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Cumulative Layout Shift (CLS)</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Check <strong>Layout Shift Regions</strong>. Notice how our Skeleton components reserve the exact dimensions of cards before data arrives, achieving near-zero CLS on slow 3G mobile devices.
              </p>
            </div>

            {/* Step 4: Network Waterfall */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--fc-crimson)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>4</span>
                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Network Waterfall & Payloads</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                In the <strong>Network</strong> tab, inspect the REST endpoints (<code>/api/events</code>, <code>/api/players</code>). Verify gzipped JSON transfer sizes and check how our custom headers <code>x-simulate-delay</code> allow repeatable chaos testing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
