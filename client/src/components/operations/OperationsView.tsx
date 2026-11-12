import React, { useState, useEffect } from 'react';
import {
  Radio,
  Server,
  FileText,
  RotateCcw,
  Trash2,
  Send,
} from 'lucide-react';
import { BroadcastAlert, AuditLogEntry, LiveOpsMetrics } from '../../types';
import { liveopsService } from '../../services/liveopsService';
import { useLiveOps } from '../../context/LiveOpsContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Input, Select } from '../common/Input';
import { Skeleton } from '../common/Skeleton';
import { ErrorState } from '../common/EmptyState';

export const OperationsView: React.FC = () => {
  const { addToast, refreshBroadcasts } = useLiveOps();
  const [metrics, setMetrics] = useState<LiveOpsMetrics | null>(null);
  const [broadcasts, setBroadcasts] = useState<BroadcastAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New broadcast modal state
  const [isNewBroadcastOpen, setIsNewBroadcastOpen] = useState(false);
  const [bcTitle, setBcTitle] = useState('');
  const [bcMessage, setBcMessage] = useState('');
  const [bcType, setBcType] = useState('PROMO');
  const [bcDurationHours, setBcDurationHours] = useState('6');

  // Audit log filter
  const [auditFilter, setAuditFilter] = useState('ALL');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [mRes, bRes, lRes] = await Promise.all([
        liveopsService.getMetrics(),
        liveopsService.getBroadcasts(),
        liveopsService.getAuditLogs(),
      ]);

      if (mRes.success) setMetrics(mRes.data);
      if (bRes.success) setBroadcasts(bRes.data);
      if (lRes.success) setAuditLogs(lRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load live operations data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle.trim() || !bcMessage.trim()) return;

    try {
      const hours = parseInt(bcDurationHours, 10) || 6;
      const expiresAt = new Date(Date.now() + hours * 3600 * 1000).toISOString();
      const res = await liveopsService.createBroadcast({
        title: bcTitle,
        message: bcMessage,
        type: bcType,
        expiresAt,
      });

      if (res.success) {
        addToast('success', 'Broadcast Dispatched', `Banner broadcast "${bcTitle}" pushed to players`);
        setIsNewBroadcastOpen(false);
        setBcTitle('');
        setBcMessage('');
        fetchData();
        refreshBroadcasts();
      }
    } catch (err: any) {
      addToast('error', 'Broadcast Error', err.message);
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    try {
      const res = await liveopsService.deleteBroadcast(id);
      if (res.success) {
        setBroadcasts(prev => prev.filter(b => b.id !== id));
        addToast('info', 'Broadcast Removed', 'Alert banner dismissed.');
        refreshBroadcasts();
      }
    } catch (err: any) {
      addToast('error', 'Action Failed', err.message);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset all live-ops database tables to initial seed state?')) return;
    try {
      const res = await liveopsService.resetData();
      if (res.success) {
        addToast('warning', 'System Reset', res.message);
        fetchData();
        refreshBroadcasts();
      }
    } catch (err: any) {
      addToast('error', 'Reset Failed', err.message);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (auditFilter === 'ALL') return true;
    return log.category === auditFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Controls Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Live Operations Command Center</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            In-game marquee alerts, multi-region server latency clusters, and live operational audit logs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button variant="danger" size="sm" leftIcon={<RotateCcw size={14} />} onClick={handleResetData}>
            Reset Mock DB
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Radio size={14} />} onClick={() => setIsNewBroadcastOpen(true)}>
            Dispatch Alert
          </Button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Skeleton height="160px" />
          <Skeleton height="240px" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <>
          {/* Active Broadcasts Grid */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Radio size={18} color="var(--fc-gold)" />
                <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Active Client Broadcast Banners</h3>
              </div>
              <Badge variant="gold">{broadcasts.length} Active</Badge>
            </div>

            {broadcasts.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                No active broadcast banners. Click "Dispatch Alert" to push a marquee announcement to live players.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {broadcasts.map(b => (
                  <div
                    key={b.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <Badge variant={b.type === 'MAINTENANCE' ? 'crimson' : 'volt'}>{b.type}</Badge>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: {b.targetClientVersion}</span>
                      </div>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{b.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.message}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Expires in: {Math.max(0, Math.round((new Date(b.expiresAt).getTime() - Date.now()) / (3600 * 1000)))}h
                      </span>
                      <button
                        onClick={() => handleDeleteBroadcast(b.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                      >
                        <Trash2 size={12} /> Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Regional Server Health Matrix */}
          {metrics && (
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={18} color="var(--fc-cyan)" />
                  <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Global Matchmaking & Match Server Clusters</h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Error Rate: <strong style={{ color: 'var(--fc-volt)' }}>{metrics.errorRatePercentage}%</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {metrics.serverHealth.map(node => (
                  <div
                    key={node.cluster}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{node.region}</span>
                      <Badge variant="volt" pulse>
                        {node.status}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cluster ID: {node.cluster}</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Latency:</span>
                      <strong style={{ color: node.pingMs < 30 ? 'var(--fc-volt)' : 'var(--fc-gold)', fontFamily: 'var(--font-mono)' }}>
                        {node.pingMs} ms
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Load:</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{node.loadPercentage}%</span>
                    </div>

                    {/* Mini load bar */}
                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-card)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${node.loadPercentage}%`,
                          height: '100%',
                          background: node.loadPercentage > 75 ? 'var(--fc-gold)' : 'var(--fc-cyan)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live-Ops Audit Log Feed */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--fc-volt)" />
                <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Operational Change Audit Trail</h3>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {['ALL', 'EVENT', 'STORE', 'BROADCAST', 'HOTFIX'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setAuditFilter(cat)}
                    style={{
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: auditFilter === cat ? 'var(--fc-volt)' : 'var(--border-subtle)',
                      background: auditFilter === cat ? 'rgba(0,255,135,0.12)' : 'var(--bg-secondary)',
                      color: auditFilter === cat ? 'var(--fc-volt)' : 'var(--text-secondary)',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
              {filteredLogs.map(log => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    gap: '0.75rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--fc-volt)', fontFamily: 'var(--font-mono)' }}>
                        [{log.action}]
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {log.operator}</span>
                    </div>
                    <div style={{ color: 'var(--text-primary)' }}>{log.details}</div>
                  </div>

                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* New Broadcast Modal */}
      <Modal
        isOpen={isNewBroadcastOpen}
        onClose={() => setIsNewBroadcastOpen(false)}
        title="Dispatch Client Marquee Broadcast"
        subtitle="Sends real-time in-game banner notice to mobile clients"
        footer={
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setIsNewBroadcastOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Send size={14} />} onClick={handleCreateBroadcast}>
              Publish Broadcast
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Broadcast Title *"
            placeholder="e.g. Flash Lightning Rounds are LIVE!"
            value={bcTitle}
            onChange={e => setBcTitle(e.target.value)}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Broadcast Message *
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Detailed announcement text displayed on player home screens..."
              value={bcMessage}
              onChange={e => setBcMessage(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Select
              label="Alert Type"
              value={bcType}
              onChange={e => setBcType(e.target.value)}
              options={[
                { value: 'PROMO', label: 'Promo / Event Announcement' },
                { value: 'MAINTENANCE', label: 'Server Maintenance Notice' },
                { value: 'URGENT', label: 'Urgent Alert' },
                { value: 'COMPENSATION', label: 'Compensation Distribution' },
              ]}
            />

            <Input
              label="Duration (Hours)"
              type="number"
              min="1"
              max="72"
              value={bcDurationHours}
              onChange={e => setBcDurationHours(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
