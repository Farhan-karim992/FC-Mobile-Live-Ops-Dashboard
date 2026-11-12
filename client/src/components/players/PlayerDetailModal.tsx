import React from 'react';
import { Flame, Star, TrendingUp } from 'lucide-react';
import { PlayerCard } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface PlayerDetailModalProps {
  player: PlayerCard | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleBoost: (id: string) => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  player,
  isOpen,
  onClose,
  onToggleBoost,
}) => {
  if (!player) return null;

  const statEntries = [
    { label: 'Pace', value: player.stats.pace, color: '#00ff87' },
    { label: 'Shooting', value: player.stats.shooting, color: '#ff3366' },
    { label: 'Passing', value: player.stats.passing, color: '#00f0ff' },
    { label: 'Dribbling', value: player.stats.dribbling, color: '#ffd200' },
    { label: 'Defending', value: player.stats.defending, color: '#38bdf8' },
    { label: 'Physical', value: player.stats.physical, color: '#c026d3' },
  ];

  const maxPrice = Math.max(...player.priceTrend);
  const minPrice = Math.min(...player.priceTrend);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${player.name} (${player.ovr} OVR)`}
      subtitle={`${player.club} • ${player.league} • ${player.cardType.replace('_', ' ')}`}
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Button
            variant={player.isLiveBoostActive ? 'danger' : 'primary'}
            size="sm"
            leftIcon={<Flame size={14} />}
            onClick={() => onToggleBoost(player.id)}
          >
            {player.isLiveBoostActive ? 'Deactivate Live Boost' : 'Apply +2 OVR Form Boost'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header Summary */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border-bright)' }}>
            <img src={player.avatarUrl} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
              <span className="stat-ovr" style={{ fontSize: '1.75rem', color: player.isLiveBoostActive ? 'var(--fc-volt)' : '#fff' }}>
                {player.ovr}
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fc-gold)' }}>{player.position}</span>
              <Badge variant="cyan">{player.cardType}</Badge>
              {player.isLiveBoostActive && <Badge variant="volt"><Flame size={12} /> Form Boost Active</Badge>}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Nation: {player.nation} {player.nationFlagUrl} | Work Rate: {player.workRate}
            </div>
          </div>
        </div>

        {/* Detailed Stats Bars */}
        <div>
          <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            In-Game Attributes
          </h5>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {statEntries.map(s => (
              <div key={s.label} className="glass-panel" style={{ padding: '0.65rem 0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                  <strong style={{ color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(100, s.value)}%`,
                      height: '100%',
                      background: s.color,
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Foot & Skill Moves */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Weak Foot:</span>
            <div style={{ display: 'flex', gap: '2px', color: 'var(--fc-gold)' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={14}
                  fill={star <= player.weakFoot ? 'var(--fc-gold)' : 'none'}
                  stroke={star <= player.weakFoot ? 'var(--fc-gold)' : 'var(--text-muted)'}
                />
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Skill Moves:</span>
            <div style={{ display: 'flex', gap: '2px', color: 'var(--fc-volt)' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={14}
                  fill={star <= player.skillMoves ? 'var(--fc-volt)' : 'none'}
                  stroke={star <= player.skillMoves ? 'var(--fc-volt)' : 'var(--text-muted)'}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Special Traits */}
        <div>
          <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Player Traits
          </h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {player.traits.map(t => (
              <span
                key={t}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 240, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.25)',
                  color: 'var(--fc-cyan)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                ★ {t}
              </span>
            ))}
          </div>
        </div>

        {/* Transfer Market 7-Day Price Trend */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--fc-gold)', fontSize: '0.8rem', fontWeight: 600 }}>
              <TrendingUp size={16} /> Transfer Market 7-Day Trend
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {(player.marketPrice / 1000000).toFixed(1)}M Coins
            </div>
          </div>

          {/* SVG sparkline chart */}
          <div style={{ height: '70px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 300 60" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <polyline
                fill="none"
                stroke="var(--fc-gold)"
                strokeWidth="2.5"
                points={player.priceTrend
                  .map((p, i) => {
                    const x = (i / (player.priceTrend.length - 1)) * 300;
                    const diff = maxPrice - minPrice || 1;
                    const y = 50 - ((p - minPrice) / diff) * 40;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              {player.priceTrend.map((p, i) => {
                const x = (i / (player.priceTrend.length - 1)) * 300;
                const diff = maxPrice - minPrice || 1;
                const y = 50 - ((p - minPrice) / diff) * 40;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={i === player.priceTrend.length - 1 ? 4 : 2}
                    fill="var(--fc-gold)"
                  />
                );
              })}
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>7 days ago: {(player.priceTrend[0] / 1000000).toFixed(1)}M</span>
            <span>Current: {(player.marketPrice / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
