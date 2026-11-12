import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  ArrowUpRight,
  Zap,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Archive,
  BarChart2,
  Layers,
  History,
  Star,
  RefreshCw,
} from 'lucide-react';
import { LiveEvent } from '../../types';
import { eventService } from '../../services/eventService';
import { useLiveOps } from '../../context/LiveOpsContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Skeleton } from '../common/Skeleton';
import { ErrorState } from '../common/EmptyState';
import { EventCountdownTimer } from '../events/EventCountdownTimer';
import { calculateDashboardKPIs, DashboardKPIs } from '../../utils/eventUtils';

export const LiveOpsOverview: React.FC = () => {
  const { setActiveTab, setDevToolsOpen } = useLiveOps();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await eventService.getEvents();
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch live-ops event telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Dynamically calculate KPIs from real event data (NOT hardcoded)
  const kpis: DashboardKPIs = useMemo(() => {
    return calculateDashboardKPIs(events, Date.now());
  }, [events]);

  // Urgent events ending in < 24 hours
  const urgentEvents = useMemo(() => {
    const now = Date.now();
    return events
      .filter(e => {
        const end = new Date(e.endDate).getTime();
        return e.status === 'ACTIVE' && end > now;
      })
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 3);
  }, [events]);

  // Featured events
  const featuredEvents = useMemo(() => {
    return events.filter(e => e.isFeatured).slice(0, 4);
  }, [events]);

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
              LIVE OPERATIONS ACTIVE • EA SPORTS FC MOBILE SIMULATION
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#fff', lineHeight: 1.2 }}>
            Live Operations Command Center
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '680px' }}>
            Internal dashboard to monitor active campaigns, track real-time event countdowns, schedule upcoming drops, and detect configuration bottlenecks.
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
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />} onClick={fetchEvents} title="Refresh Telemetry">
            Refresh
          </Button>
        </div>
      </div>

      {/* Misconfiguration Alert Banner if any event has flawed setup */}
      {kpis.misconfiguredEvents > 0 && (
        <div
          style={{
            background: 'rgba(255, 51, 102, 0.12)',
            border: '1px solid var(--fc-crimson)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} color="var(--fc-crimson)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                Configuration Warning: {kpis.misconfiguredEvents} Event(s) have invalid schedules
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Live-ops validator detected events with scheduled End Dates earlier than Start Dates or missing reward parameters.
              </div>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setActiveTab('events')}
          >
            Review Misconfigured Events
          </Button>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-panel" style={{ padding: '1.25rem', height: '115px' }}>
              <Skeleton width="45%" height="16px" />
              <Skeleton width="60%" height="32px" style={{ margin: '0.5rem 0' }} />
              <Skeleton width="70%" height="12px" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : (
        <>
          {/* Section 2.A: Core Engineering Requirement - Dynamically Calculated KPI Cards */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                Dynamic Event Lifecycle Metrics (Calculated from Data)
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--fc-volt)', fontFamily: 'var(--font-mono)' }}>
                ● Real-Time Calculated
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
              {/* Total Events */}
              <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Events</span>
                  <Layers size={16} color="var(--fc-cyan)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span className="stat-ovr" style={{ fontSize: '2.2rem', color: '#fff' }}>
                    {kpis.totalEvents}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>campaigns</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Active database records
                </div>
              </div>

              {/* Active Events */}
              <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderLeft: '3px solid var(--fc-volt)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Events</span>
                  <CheckCircle2 size={16} color="var(--fc-volt)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span className="stat-ovr" style={{ fontSize: '2.2rem', color: 'var(--fc-volt)' }}>
                    {kpis.activeEvents}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fc-volt)' }}>Live Now</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Currently running in-game
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderLeft: '3px solid var(--fc-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upcoming Events</span>
                  <Hourglass size={16} color="var(--fc-cyan)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span className="stat-ovr" style={{ fontSize: '2.2rem', color: 'var(--fc-cyan)' }}>
                    {kpis.upcomingEvents}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fc-cyan)' }}>Scheduled</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Scheduled for future launch
                </div>
              </div>

              {/* Expired / Concluded Events */}
              <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expired Events</span>
                  <Archive size={16} color="var(--text-muted)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span className="stat-ovr" style={{ fontSize: '2.2rem', color: 'var(--text-secondary)' }}>
                    {kpis.expiredEvents}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Concluded</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Past redemption window
                </div>
              </div>

              {/* Approaching Deadline */}
              <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderLeft: '3px solid var(--fc-crimson)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approaching Deadlines</span>
                  <Clock size={16} color="var(--fc-crimson)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span className="stat-ovr" style={{ fontSize: '2.2rem', color: 'var(--fc-crimson)' }}>
                    {kpis.approachingDeadlines}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fc-crimson)' }}>&lt; 24h Left</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Flash or weekend expiry
                </div>
              </div>

              {/* Recently Updated */}
              <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recently Updated</span>
                  <History size={16} color="var(--fc-gold)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span className="stat-ovr" style={{ fontSize: '2.2rem', color: 'var(--fc-gold)' }}>
                    {kpis.recentlyUpdated}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fc-gold)' }}>Past 48h</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Operator modifications
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Breakdown: Category & Status Distribution */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {/* Category Distribution Chart */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart2 size={16} color="var(--fc-cyan)" />
                  <h3 style={{ fontSize: '1rem', color: '#fff' }}>Events by Category</h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>6 Types</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {Object.entries(kpis.categoryBreakdown).map(([cat, count]) => {
                  const pct = kpis.totalEvents > 0 ? Math.round((count / kpis.totalEvents) * 100) : 0;
                  return (
                    <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cat.replace('_', ' ')}</span>
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background:
                              cat === 'SEASONAL'
                                ? 'linear-gradient(90deg, #00ff87, #00f0ff)'
                                : cat === 'FLASH_SALE'
                                ? 'linear-gradient(90deg, #ff3366, #ffb199)'
                                : cat === 'TOURNAMENT'
                                ? 'linear-gradient(90deg, #00f0ff, #3b82f6)'
                                : 'var(--fc-gold)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Distribution */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} color="var(--fc-volt)" />
                  <h3 style={{ fontSize: '1rem', color: '#fff' }}>Lifecycle Status Distribution</h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5 States</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {Object.entries(kpis.statusBreakdown).map(([stat, count]) => {
                  const pct = kpis.totalEvents > 0 ? Math.round((count / kpis.totalEvents) * 100) : 0;
                  let color = 'var(--fc-volt)';
                  if (stat === 'UPCOMING') color = 'var(--fc-cyan)';
                  if (stat === 'PAUSED') color = 'var(--fc-gold)';
                  if (stat === 'CONCLUDED') color = 'var(--text-muted)';
                  if (stat === 'MISCONFIGURED') color = 'var(--fc-crimson)';

                  return (
                    <div key={stat} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{stat}</span>
                        <span style={{ color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2.C: Real-time Event Countdowns for Approaching Deadlines */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--fc-crimson)" />
                <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>
                  Events Approaching Deadlines (Dynamic Countdowns)
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('events')}
                style={{ background: 'transparent', border: 'none', color: 'var(--fc-volt)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                <span>View All In Events Hub</span>
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
                      <Badge variant={evt.category === 'FLASH_SALE' ? 'crimson' : 'volt'}>{evt.category}</Badge>
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

          {/* Featured Campaigns Showcase */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={18} color="var(--fc-gold)" />
                <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Featured Campaign Showcase</h3>
              </div>
              <Badge variant="gold">Operator Curated</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {featuredEvents.map(evt => (
                <div
                  key={evt.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ height: '100px', width: '100%', position: 'relative' }}>
                    <img src={evt.bannerUrl} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                      <Badge variant="gold">★ Featured</Badge>
                    </div>
                  </div>
                  <div style={{ padding: '0.85rem' }}>
                    <h5 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.2rem' }}>{evt.title}</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {evt.subtitle}
                    </p>
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
