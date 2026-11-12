import React from 'react';
import { Flame, Coins } from 'lucide-react';
import { PlayerCard } from '../../types';

interface PlayerCardItemProps {
  player: PlayerCard;
  onSelect: (player: PlayerCard) => void;
  onToggleBoost: (e: React.MouseEvent, id: string) => void;
}

export const PlayerCardItem: React.FC<PlayerCardItemProps> = ({
  player,
  onSelect,
  onToggleBoost,
}) => {
  const getCardRarityClass = () => {
    switch (player.cardType) {
      case 'TOTY': return 'card-toty shimmer-effect';
      case 'PRIME_ICON': return 'card-prime-icon shimmer-effect';
      case 'RULEBREAKER': return 'card-rulebreaker';
      case 'UCL_RTTF': return 'card-ucl';
      case 'HERO': return 'card-hero';
      default: return 'glass-panel';
    }
  };

  const formatPrice = (p: number) => {
    if (p >= 1000000) return `${(p / 1000000).toFixed(1)}M`;
    if (p >= 1000) return `${(p / 1000).toFixed(0)}K`;
    return p.toLocaleString();
  };

  return (
    <div
      className={`fc-card ${getCardRarityClass()}`}
      onClick={() => onSelect(player)}
      style={{
        width: '100%',
        maxWidth: '240px',
        margin: '0 auto',
        padding: '0.85rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {/* Top Header: OVR, Position, Nation Flag, Club */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              className="stat-ovr"
              style={{
                fontSize: '2rem',
                color: player.isLiveBoostActive ? 'var(--fc-volt)' : '#fff',
                textShadow: player.isLiveBoostActive ? '0 0 12px var(--fc-volt-glow)' : '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {player.ovr}
            </span>
            {player.isLiveBoostActive && (
              <span style={{ fontSize: '0.75rem', color: 'var(--fc-volt)', fontWeight: 800, marginLeft: '2px' }}>
                ▲
              </span>
            )}
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: 'var(--fc-gold)',
              marginTop: '-4px',
            }}
          >
            {player.position}
          </span>
          <div style={{ fontSize: '1.1rem', marginTop: '4px' }} title={player.nation}>
            {player.nationFlagUrl}
          </div>
        </div>

        {/* Player Avatar */}
        <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.4)' }}>
          <img
            src={player.avatarUrl}
            alt={player.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
            loading="lazy"
          />
        </div>
      </div>

      {/* Player Name and Club */}
      <div style={{ textAlign: 'center', marginTop: '2px' }}>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '1rem',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {player.knownAs}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
          {player.club}
        </div>
      </div>

      {/* 6 Core Stats Grid (PAC, SHO, PAS, DRI, DEF, PHY) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          background: 'rgba(0,0,0,0.3)',
          padding: '0.45rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-heading)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>PAC </span>
          <strong style={{ color: '#fff' }}>{player.stats.pace}</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>SHO </span>
          <strong style={{ color: '#fff' }}>{player.stats.shooting}</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>PAS </span>
          <strong style={{ color: '#fff' }}>{player.stats.passing}</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>DRI </span>
          <strong style={{ color: '#fff' }}>{player.stats.dribbling}</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>DEF </span>
          <strong style={{ color: '#fff' }}>{player.stats.defending}</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>PHY </span>
          <strong style={{ color: '#fff' }}>{player.stats.physical}</strong>
        </div>
      </div>

      {/* Footer: Market Value & Live Form Boost Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.4rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--fc-gold)', fontFamily: 'var(--font-mono)' }}>
          <Coins size={12} />
          <span>{formatPrice(player.marketPrice)}</span>
        </div>

        <button
          onClick={e => onToggleBoost(e, player.id)}
          className={`btn btn-sm ${player.isLiveBoostActive ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}
          title={player.isLiveBoostActive ? 'Live Form Boost Active (+2 OVR)' : 'Apply Live Form Boost'}
        >
          <Flame size={11} className={player.isLiveBoostActive ? 'animate-bounce' : ''} />
          <span>{player.isLiveBoostActive ? 'Boosted' : 'Boost'}</span>
        </button>
      </div>
    </div>
  );
};
