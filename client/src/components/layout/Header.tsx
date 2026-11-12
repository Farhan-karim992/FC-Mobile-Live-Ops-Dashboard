import React from 'react';
import { Cpu, Bell, ShieldAlert } from 'lucide-react';
import { useLiveOps } from '../../context/LiveOpsContext';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const { devToolsOpen, setDevToolsOpen, activeBroadcasts, setActiveTab } = useLiveOps();

  return (
    <header
      style={{
        height: '64px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 10, 14, 0.95)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Brand & Live status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={() => setActiveTab('overview')}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00ff87 0%, #00f0ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0,255,135,0.4)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: '#070a0e' }}>
              FC
            </span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '0.05em' }}>
                FC MOBILE
              </span>
              <span style={{ fontSize: '0.65rem', background: 'rgba(0, 255, 135, 0.15)', color: 'var(--fc-volt)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(0,255,135,0.3)', fontWeight: 700 }}>
                LIVE-OPS
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Command Center v2.4</div>
          </div>
        </div>

        {/* Live Ticker Marquee for Active Broadcasts */}
        {activeBroadcasts.length > 0 && (
          <div
            style={{
              display: 'none',
              background: 'rgba(255, 210, 0, 0.1)',
              border: '1px solid rgba(255, 210, 0, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '0.25rem 0.9rem',
              alignItems: 'center',
              gap: '0.5rem',
              maxWidth: '460px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontSize: '0.75rem',
              color: 'var(--fc-gold)',
            }}
            className="md-marquee-block"
          >
            <Bell size={13} className="animate-pulse" />
            <span style={{ fontWeight: 600 }}>{activeBroadcasts[0].title}:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{activeBroadcasts[0].message}</span>
          </div>
        )}
      </div>

      {/* Right Action Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Live CCU Telemetry Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.8rem',
            fontSize: '0.75rem',
          }}
        >
          <span className="live-pulse" />
          <span style={{ color: 'var(--text-secondary)' }}>CCU:</span>
          <span style={{ color: 'var(--fc-volt)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            184.5K
          </span>
        </div>

        {/* Emergency Hotfix button */}
        <Button
          variant="danger"
          size="sm"
          leftIcon={<ShieldAlert size={14} />}
          onClick={() => setActiveTab('operations')}
          title="Open Live Operations Center"
        >
          <span style={{ display: 'none' }} className="sm-inline">Ops Controls</span>
        </Button>

        {/* DevTools Inspector Trigger Button */}
        <Button
          variant={devToolsOpen ? 'cyan' : 'secondary'}
          size="sm"
          leftIcon={<Cpu size={14} />}
          onClick={() => setDevToolsOpen(!devToolsOpen)}
          title="Open Chrome DevTools & Performance Profiler"
        >
          <span style={{ display: 'none' }} className="sm-inline">DevTools & Perf</span>
        </Button>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .md-marquee-block { display: flex !important; }
        }
        @media (min-width: 640px) {
          .sm-inline { display: inline !important; }
        }
      `}</style>
    </header>
  );
};
