import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Sparkles,
  Server,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Flame,
} from 'lucide-react';
import { LiveOpsMetrics, LiveEvent } from '../../types';
import { liveopsService } from '../../services/liveopsService';
import { eventService } from '../../services/eventService';
import { useLiveOps } from '../../context/LiveOpsContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Skeleton } from '../common/Skeleton';
import { ErrorState } from '../common/EmptyState';
import { EventCountdownTimer } from '../events/EventCountdownTimer';

export const LiveOpsOverview: React.FC = () => {
  const { setActiveTab, setDevToolsOpen } = useLiveOps();
  const [metrics, setMetrics] = useState<LiveOpsMetrics | null>(null);
  const [urgentEvents, setUrgentEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [mRes, eRes] = await Promise.all([
        liveopsService.getMetrics(),
        eventService.getEvents({ status: 'ACTIVE', sort: 'endDate', order: 'asc' }),
      ]);

      if (mRes.success) setMetrics(mRes.data);
      if (eRes.success) setUrgentEvents(eRes.data.slice(0, 3));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch overview metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem 1.75rem',
          background: 'linear-gradient(135deg, rgba(0, 255, 135, 0.08) 0%, rgba(0, 240, 255, 0.05) 50%, rgba(18, 26, 36, 0.9) 100%)',
          border: '1px solid var(--border-bright)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="live-pulse" />
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', color: 'var(--fc-volt)', fontWeight: 700, letterSpacing: '0.08em' }}>
              LIVE OPERATIONS ACTIVE
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#fff', lineHeight: 1.2 }}>
            FC Mobile Live-Ops Command Center
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '640px' }}>
            Manage in-game events, player items, live drop distributions, and server clusters in real time.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm" leftIcon={<Zap size={14} />} onClick={() => setActiveTab('events')}>
            Manage Events
          </Button>
          <Button variant="cyan" size="sm" leftIcon={<Flame size={14} />} onClick={() => setActiveTab('players')}>
            Form Boosts
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setDevToolsOpen(true)}>
            DevTools & Perf
          </Button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel" style={{ padding: '1.25rem', height: '120px' }}>
              <Skeleton width="40%" height="16px" />
              <Skeleton width="70%" height="32px" style={{ margin: '0.75rem 0' }} />
              <Skeleton width="50%" height="12px" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <>
          {/* Top KPI Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {/* CCU Card */}
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Concurrent Users (CCU)</span>
                <Users size={16} color="var(--fc-volt)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span className="stat-ovr" style={{ fontSize: '2.2rem', color: 'var(--fc-volt)' }}>
                  {metrics?.ccuCurrent.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Peak: {metrics?.ccuPeakToday.toLocaleString()}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} color="var(--fc-volt)" />
                <span>+6.4% vs last week's average</span>
              </div>
            </div>

            {/* Active Events */}
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Live Events</span>
                <Calendar size={16} color="var(--fc-cyan)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span className="stat-ovr" style={{ fontSize: '2.2rem', color: 'var(--fc-cyan)' }}>
                  {metrics?.activeEventsCount}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>campaigns live</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Next daily reset: <strong style={{ color: '#fff' }}>19:00 UTC</strong>
              </div>
            </div>

            {/* Drop Rate Multiplier */}
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Global Drop Rate Bonus</span>
                <Sparkles size={16} color="var(--fc-gold)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span className="stat-ovr" style={{ fontSize: '2.2rem', color: 'var(--fc-gold)' }}>
                  {metrics?.globalDropRateBonus}x
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--fc-gold)' }}>Promo Active</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Store Flash Lightning rounds boosted
              </div>
            </div>

            {/* Server Health Status */}
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Server Health Matrix</span>
                <Server size={16} color="var(--fc-volt)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span className="stat-ovr" style={{ fontSize: '2.2rem', color: '#fff' }}>
                  5 / 5
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--fc-volt)' }}>Optimal</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Avg Ping: <strong>28ms</strong> across all clusters
              </div>
            </div>
          </div>

          {/* Expiring Soon & Critical Live-Ops Alerts */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--fc-crimson)" />
                <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>
                  Live-Ops Timers & Expiring Campaigns
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('events')}
                style={{ background: 'transparent', border: 'none', color: 'var(--fc-volt)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
              >
                <span>View All Events</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {urgentEvents.map(evt => (
                <div
                  key={evt.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <Badge variant={evt.type === 'FLASH_SALE' ? 'crimson' : 'volt'}>{evt.type}</Badge>
                      <EventCountdownTimer endDate={evt.endDate} />
                    </div>
                    <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.2rem' }}>{evt.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {evt.subtitle}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--fc-gold)', fontWeight: 600 }}>
                      🏆 {evt.rewardTier}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {(evt.participantCount / 1000).toFixed(0)}K Joined
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
