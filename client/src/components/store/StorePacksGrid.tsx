import React, { useState, useEffect } from 'react';
import { Sparkles, Info, RefreshCw, Zap } from 'lucide-react';
import { StorePack, PlayerCard } from '../../types';
import { liveopsService } from '../../services/liveopsService';
import { useLiveOps } from '../../context/LiveOpsContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Skeleton } from '../common/Skeleton';
import { ErrorState } from '../common/EmptyState';
import { EventCountdownTimer } from '../events/EventCountdownTimer';

export const StorePacksGrid: React.FC = () => {
  const { addToast } = useLiveOps();
  const [packs, setPacks] = useState<StorePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pack Pull simulation state
  const [selectedPack, setSelectedPack] = useState<StorePack | null>(null);
  const [probabilityPack, setProbabilityPack] = useState<StorePack | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pullResult, setPullResult] = useState<{ player: PlayerCard; rarityTier: string; isWalkout: boolean } | null>(null);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await liveopsService.getPacks();
      if (res.success) {
        setPacks(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch store packs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  const handleSimulatePull = async (pack: StorePack) => {
    try {
      setSelectedPack(pack);
      setIsPulling(true);
      setPullResult(null);

      // simulate dramatic opening suspense
      const res = await liveopsService.simulatePackPull(pack.id);
      if (res.success) {
        setPullResult(res.data);
        addToast(
          res.data.isWalkout ? 'success' : 'info',
          res.data.isWalkout ? '🔥 WALKOUT PULL!' : 'Pack Opened',
          `Pulled ${res.data.player.knownAs} (${res.data.player.ovr} OVR ${res.data.player.cardType})`
        );
      }
    } catch (err: any) {
      addToast('error', 'Simulation Failed', err.message);
    } finally {
      setIsPulling(false);
    }
  };

  const getCostBadge = (pack: StorePack) => {
    if (pack.costType === 'FC_POINTS') {
      return (
        <span style={{ color: 'var(--fc-volt)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          {pack.cost.toLocaleString()} FP
        </span>
      );
    }
    if (pack.costType === 'GEMS') {
      return (
        <span style={{ color: 'var(--fc-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          {pack.cost.toLocaleString()} Gems
        </span>
      );
    }
    return (
      <span style={{ color: 'var(--fc-gold)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
        {(pack.cost / 1000000).toFixed(1)}M Coins
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Live Store & Pack Drop Simulator</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Monitor active store bundles, check transparent probability tables, and test real server-side drop distributions.
          </p>
        </div>

        <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />} onClick={fetchPacks}>
          Refresh Store
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel" style={{ height: '320px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Skeleton width="100%" height="120px" />
              <Skeleton width="60%" height="24px" />
              <Skeleton width="80%" height="16px" />
              <Skeleton width="100%" height="38px" style={{ marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPacks} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {packs.map(pack => (
            <div
              key={pack.id}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              {/* Pack Foil Header Banner */}
              <div
                style={{
                  height: '110px',
                  background: pack.bannerColor,
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge variant="slate" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none' }}>
                    {pack.category}
                  </Badge>
                  <EventCountdownTimer endDate={pack.expiryDate} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} color="#fff" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                    Guarantees {pack.guaranteedMinOvr}+ OVR
                  </span>
                </div>
              </div>

              {/* Pack Body */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {pack.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {pack.description}
                  </p>
                </div>

                {/* Featured Players list */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Featured: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{pack.featuredPlayers.join(', ')}</strong>
                </div>

                {/* Price & Quota */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-secondary)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    marginTop: 'auto',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cost:</span>
                  <div style={{ fontSize: '0.9rem' }}>{getCostBadge(pack)}</div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Info size={13} />}
                    onClick={() => setProbabilityPack(pack)}
                    style={{ flex: 1, fontSize: '0.75rem' }}
                  >
                    Drop %
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Zap size={14} />}
                    onClick={() => handleSimulatePull(pack)}
                    style={{ flex: 1.5, fontSize: '0.75rem' }}
                  >
                    Simulate Pull
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Probability Disclosure Modal */}
      <Modal
        isOpen={!!probabilityPack}
        onClose={() => setProbabilityPack(null)}
        title={probabilityPack ? `${probabilityPack.name} — Odds Disclosure` : ''}
        subtitle="Mandatory regulatory transparency: verified server drop rates per pull."
        maxWidth="500px"
      >
        {probabilityPack && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '0.75rem 1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.5rem 0' }}>Item Tier / Rarity</th>
                    <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {probabilityPack.dropRates.map((tier, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.6rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tier.range}
                      </td>
                      <td style={{ padding: '0.6rem 0', textAlign: 'right', color: 'var(--fc-volt)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {tier.chancePercentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              * Probabilities are calculated independently on every single opening. Pulling an item does not alter subsequent probabilities.
            </p>
          </div>
        )}
      </Modal>

      {/* Simulation Opening Modal with Walkout Effect! */}
      <Modal
        isOpen={!!selectedPack && (isPulling || !!pullResult)}
        onClose={() => {
          setSelectedPack(null);
          setPullResult(null);
        }}
        title="Live-Ops Pack Pull Simulator"
        subtitle={selectedPack?.name}
        maxWidth="520px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => selectedPack && handleSimulatePull(selectedPack)}
              disabled={isPulling}
            >
              Pull Again
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedPack(null);
                setPullResult(null);
              }}
            >
              Done
            </Button>
          </div>
        }
      >
        {isPulling ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '3px dashed var(--fc-volt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'spin 2s linear infinite',
              }}
            >
              <Sparkles size={32} color="var(--fc-volt)" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>Opening Pack...</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Evaluating drop tables and rolling seed RNG on server...
              </p>
            </div>
          </div>
        ) : pullResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center' }}>
            {pullResult.isWalkout && (
              <div
                style={{
                  background: 'linear-gradient(90deg, #ff0844 0%, #ffb199 50%, #00ff87 100%)',
                  padding: '0.35rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  color: '#000',
                  letterSpacing: '0.1em',
                  boxShadow: '0 0 25px rgba(255, 8, 68, 0.6)',
                  animation: 'pulse 1s infinite alternate',
                }}
              >
                🔥 WALKOUT ANIMATION TRIGGERED!
              </div>
            )}

            {/* Pulled Card */}
            <div
              className={`fc-card ${pullResult.player.ovr >= 97 ? 'card-toty shimmer-effect' : 'card-rulebreaker'}`}
              style={{
                width: '220px',
                padding: '1rem',
                textAlign: 'center',
                boxShadow: '0 10px 40px rgba(0,0,0,0.9)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="stat-ovr" style={{ fontSize: '2rem', color: 'var(--fc-gold)' }}>
                  {pullResult.player.ovr}
                </span>
                <span style={{ fontWeight: 800, color: '#fff' }}>{pullResult.player.position}</span>
                <span style={{ fontSize: '1.2rem' }}>{pullResult.player.nationFlagUrl}</span>
              </div>

              <div style={{ width: '90px', height: '90px', margin: '0.5rem auto', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
                <img src={pullResult.player.avatarUrl} alt={pullResult.player.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <h4 style={{ fontSize: '1.1rem', color: '#fff', textTransform: 'uppercase' }}>
                {pullResult.player.knownAs}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pullResult.player.club}</p>
            </div>

            <div className="glass-panel" style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Drop Tier Rolled:</span>
              <strong style={{ color: 'var(--fc-volt)' }}>{pullResult.rarityTier}</strong>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
