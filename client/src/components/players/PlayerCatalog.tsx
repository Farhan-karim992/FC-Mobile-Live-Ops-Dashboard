import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, RefreshCw } from 'lucide-react';
import { PlayerCard, PlayerFilterState } from '../../types';
import { playerService } from '../../services/playerService';
import { useDebounce } from '../../hooks/useDebounce';
import { useLiveOps } from '../../context/LiveOpsContext';
import { PlayerCardItem } from './PlayerCardItem';
import { PlayerDetailModal } from './PlayerDetailModal';
import { Skeleton } from '../common/Skeleton';
import { EmptyState, ErrorState } from '../common/EmptyState';
import { Button } from '../common/Button';

export const PlayerCatalog: React.FC = () => {
  const { addToast } = useLiveOps();
  const [players, setPlayers] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<PlayerFilterState>({
    search: '',
    position: 'ALL',
    cardType: 'ALL',
    minOvr: 80,
    maxOvr: 99,
    sort: 'ovr',
    order: 'desc',
  });

  const debouncedSearch = useDebounce(filters.search, 300);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerCard | null>(null);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await playerService.getPlayers({
        ...filters,
        search: debouncedSearch,
      });
      if (res.success) {
        setPlayers(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch player items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [debouncedSearch, filters.position, filters.cardType, filters.minOvr, filters.sort, filters.order]);

  const handleToggleBoost = async (e: React.MouseEvent | null, id: string) => {
    if (e) e.stopPropagation();
    try {
      const res = await playerService.togglePlayerBoost(id);
      if (res.success) {
        setPlayers(prev => prev.map(p => (p.id === id ? res.data : p)));
        if (selectedPlayer && selectedPlayer.id === id) {
          setSelectedPlayer(res.data);
        }
        addToast(
          res.data.isLiveBoostActive ? 'success' : 'info',
          'Live Form Updated',
          res.message
        );
      }
    } catch (err: any) {
      addToast('error', 'Boost Update Failed', err.message);
    }
  };

  const positionGroups = [
    { label: 'All', value: 'ALL' },
    { label: 'Attackers (ST, RW, LW)', value: 'ST' },
    { label: 'Midfielders (CAM, CM, CDM)', value: 'CAM' },
    { label: 'Defenders (CB)', value: 'CB' },
    { label: 'Goalkeepers (GK)', value: 'GK' },
  ];

  const rarityOptions = [
    { label: 'All Rarities', value: 'ALL' },
    { label: 'TOTY', value: 'TOTY' },
    { label: 'Prime Icons', value: 'PRIME_ICON' },
    { label: 'UCL RTTF', value: 'UCL_RTTF' },
    { label: 'Rulebreakers', value: 'RULEBREAKER' },
    { label: 'Heroes', value: 'HERO' },
  ];

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Player Items & Live Form Catalog</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Inspect special live-ops editions, boost weekly form ratings, and view market telemetry.
          </p>
        </div>

        <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />} onClick={fetchPlayers}>
          Refresh Roster
        </Button>
      </div>

      {/* Filter panel */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search player, club, nation (e.g. Mbappé, Real Madrid, France)..."
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <select
            className="input-field select-field"
            value={filters.cardType}
            onChange={e => setFilters(prev => ({ ...prev, cardType: e.target.value }))}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            {rarityOptions.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <select
            className="input-field select-field"
            value={filters.sort}
            onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="ovr">Sort: Overall (OVR)</option>
            <option value="marketPrice">Sort: Market Price</option>
            <option value="pace">Sort: Pace</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setFilters(prev => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))}
            style={{ padding: '0.45rem 0.75rem' }}
          >
            <ArrowUpDown size={14} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{filters.order}</span>
          </button>
        </div>

        {/* Position pills & OVR Slider */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {positionGroups.map(p => (
              <button
                key={p.value}
                onClick={() => setFilters(prev => ({ ...prev, position: p.value }))}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: filters.position === p.value ? 'var(--fc-volt)' : 'var(--border-subtle)',
                  background: filters.position === p.value ? 'rgba(0, 255, 135, 0.15)' : 'var(--bg-secondary)',
                  color: filters.position === p.value ? 'var(--fc-volt)' : 'var(--text-secondary)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>Min OVR: <strong style={{ color: 'var(--fc-volt)' }}>{filters.minOvr}</strong></span>
            <input
              type="range"
              min="80"
              max="99"
              value={filters.minOvr}
              onChange={e => setFilters(prev => ({ ...prev, minOvr: parseInt(e.target.value, 10) }))}
              style={{ width: '100px', accentColor: 'var(--fc-volt)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Grid Results / Loading / Empty / Error */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-panel" style={{ padding: '1rem', height: '320px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width="40px" height="40px" />
                <Skeleton width="70px" height="70px" borderRadius="50%" />
              </div>
              <Skeleton width="80%" height="20px" />
              <Skeleton width="60%" height="14px" />
              <Skeleton width="100%" height="60px" />
              <Skeleton width="100%" height="30px" style={{ marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPlayers} />
      ) : players.length === 0 ? (
        <EmptyState
          title="No player items match your criteria"
          description="Try broadening your position selection, rarity tier, or lowering the minimum OVR threshold."
          actionText="Reset Filter Criteria"
          onAction={() => setFilters({
            search: '',
            position: 'ALL',
            cardType: 'ALL',
            minOvr: 80,
            maxOvr: 99,
            sort: 'ovr',
            order: 'desc',
          })}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.25rem' }}>
          {players.map(p => (
            <PlayerCardItem
              key={p.id}
              player={p}
              onSelect={setSelectedPlayer}
              onToggleBoost={handleToggleBoost}
            />
          ))}
        </div>
      )}

      {/* Player Detail Modal */}
      <PlayerDetailModal
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onToggleBoost={id => handleToggleBoost(null, id)}
      />
    </div>
  );
};
