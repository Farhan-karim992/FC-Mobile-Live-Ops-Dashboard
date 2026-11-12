import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ShoppingBag,
  Sliders,
  Cpu,
} from 'lucide-react';
import { useLiveOps } from '../../context/LiveOpsContext';
import { ViewTab } from '../../types';

interface NavItem {
  id: ViewTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useLiveOps();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'events', label: 'Live Events', icon: <Calendar size={18} />, badge: '6 Active' },
    { id: 'players', label: 'Player Items', icon: <Users size={18} /> },
    { id: 'store', label: 'Store & Packs', icon: <ShoppingBag size={18} />, badge: 'Flash 4h' },
    { id: 'operations', label: 'Command Center', icon: <Sliders size={18} /> },
    { id: 'performance', label: 'DevTools & Perf', icon: <Cpu size={18} /> },
  ];

  return (
    <aside
      className="sidebar-desktop"
      style={{
        width: '240px',
        borderRight: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 0.75rem',
        flexShrink: 0,
      }}
    >
      <div>
        <div style={{ padding: '0 0.75rem 1rem 0.75rem', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em' }}>
          Live-Ops Modules
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-bright)' : 'transparent',
                  background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  color: isActive ? 'var(--fc-volt)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: isActive ? 'var(--fc-volt)' : 'inherit' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'rgba(0, 255, 135, 0.15)' : 'var(--bg-card)',
                      color: isActive ? 'var(--fc-volt)' : 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Service Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>API Status</span>
          <span className="badge badge-volt" style={{ fontSize: '0.65rem' }}>
            <span className="live-pulse" /> ONLINE
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
          Live-Ops REST API port 5000. All regional telemetry nodes synchronized.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
        }
      `}</style>
    </aside>
  );
};

