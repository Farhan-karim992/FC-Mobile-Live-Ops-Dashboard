import React from 'react';
import { Users, Award, Shield, Zap, Flame, Play, Pause, PlusCircle, Trash2 } from 'lucide-react';
import { LiveEvent } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EventCountdownTimer } from './EventCountdownTimer';

interface EventDetailModalProps {
  event: LiveEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (event: LiveEvent) => void;
  onExtend: (event: LiveEvent) => void;
  onDelete: (id: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onToggleStatus,
  onExtend,
  onDelete,
}) => {
  if (!event) return null;

  const isPaused = event.status === 'PAUSED';
  const isConcluded = event.status === 'CONCLUDED';

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      subtitle={event.subtitle}
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 size={14} />}
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
          >
            Delete Event
          </Button>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {!isConcluded && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<PlusCircle size={14} />}
                onClick={() => {
                  onExtend(event);
                }}
              >
                Extend +24h
              </Button>
            )}

            {!isConcluded && (
              <Button
                variant={isPaused ? 'primary' : 'secondary'}
                size="sm"
                leftIcon={isPaused ? <Play size={14} /> : <Pause size={14} />}
                onClick={() => {
                  onToggleStatus(event);
                }}
              >
                {isPaused ? 'Resume Event' : 'Pause Event'}
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Banner with header stats */}
        <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <img
            src={event.bannerUrl}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(18,26,36,0.95) 0%, rgba(18,26,36,0.3) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
              <Badge variant="volt" pulse={event.status === 'ACTIVE'}>
                {event.status}
              </Badge>
              <Badge variant="cyan">{event.type}</Badge>
              {event.liveFormMultiplier && (
                <Badge variant="gold">
                  <Flame size={12} /> {event.liveFormMultiplier}x Boost
                </Badge>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Time Remaining:
              </span>
              <EventCountdownTimer endDate={event.endDate} isPaused={isPaused} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Live-Ops Overview & Mechanics
          </h5>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {event.description}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
          <div className="glass-panel" style={{ padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--fc-gold)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <Award size={14} /> Reward Tier
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {event.rewardTier}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--fc-cyan)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <Users size={14} /> Active Players
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {event.participantCount.toLocaleString()}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--fc-volt)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <Shield size={14} /> Squad Min OVR
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {event.requirements.minOvr} OVR Required
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--fc-crimson)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <Zap size={14} /> Match Energy
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {event.requirements.energyCostPerMatch || 10} Energy / Match
            </div>
          </div>
        </div>

        {/* Schedule & Operational Timing */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live Operation Timestamps
          </h5>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Start Date:</span>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                {formatDateTime(event.startDate)}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Scheduled End Date:</span>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                {formatDateTime(event.endDate)}
              </div>
            </div>
            {event.resetTimeDailyUtc && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Daily Reset Time:</span>
                <div style={{ color: 'var(--fc-cyan)', fontWeight: 600, marginTop: '2px' }}>
                  {event.resetTimeDailyUtc}
                </div>
              </div>
            )}
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Event ID:</span>
              <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {event.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
