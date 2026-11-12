import React from 'react';
import { LayoutDashboard, Calendar, Users, ShoppingBag, Sliders, Cpu } from 'lucide-react';
import { useLiveOps } from '../../context/LiveOpsContext';
import { ViewTab } from '../../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useLiveOps();

  const items: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Home', icon: <LayoutDashboard size={20} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
    { id: 'players', label: 'Players', icon: <Users size={20} /> },
    { id: 'store', label: 'Store', icon: <ShoppingBag size={20} /> },
    { id: 'operations', label: 'Ops', icon: <Sliders size={20} /> },
    { id: 'performance', label: 'DevTools', icon: <Cpu size={20} /> },
  ];

  return (
    <nav
      className="mobile-nav-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        background: 'rgba(10, 15, 22, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-bright)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 0.5rem',
        zIndex: 50,
      }}
    >
      {items.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '6px',
              cursor: 'pointer',
              color: isActive ? 'var(--fc-volt)' : 'var(--text-muted)',
              transition: 'color 0.15s ease',
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-heading)', fontWeight: isActive ? 700 : 500 }}>
              {item.label}
            </span>
          </button>
        );
      })}

      <style>{`
        @media (min-width: 769px) {
          .mobile-nav-bar { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

