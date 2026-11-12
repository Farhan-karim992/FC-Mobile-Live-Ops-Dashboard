import React from 'react';
import { Users, Award, Play, Pause, PlusCircle, Trash2, Edit3, ExternalLink, AlertTriangle, Star } from 'lucide-react';
import { LiveEvent } from '../../types';
import { EventCountdownTimer } from './EventCountdownTimer';
import { Badge } from '../common/Badge';

interface EventCardProps {
  event: LiveEvent;
  onSelect: (event: LiveEvent) => void;
  onEdit: (event: LiveEvent) => void;
  onToggleStatus: (event: LiveEvent) => void;
  onExtend: (event: LiveEvent) => void;
  onDelete: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onEdit,
  onToggleStatus,
  onExtend,
  onDelete,
}) => {
  const isPaused = event.status === 'PAUSED';
  const isConcluded = event.status === 'CONCLUDED';
  const isMisconfigured = event.status === 'MISCONFIGURED' || (event.validationErrors && event.validationErrors.length > 0);

  const formatParticipants = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getStatusBadgeVariant = () => {
    if (isMisconfigured) return 'crimson';
    if (event.status === 'ACTIVE') return 'volt';
    if (event.status === 'PAUSED') return 'gold';
    if (event.status === 'UPCOMING') return 'cyan';
    return 'slate';
  };

  const getCategoryBadgeVariant = () => {
    const cat = event.category || event.type;
    if (cat === 'FLASH_SALE') return 'crimson';
    if (cat === 'SEASONAL') return 'gold';
    if (cat === 'TOURNAMENT') return 'cyan';
    if (cat === 'CHALLENGE') return 'volt';
    return 'slate';
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        border: isMisconfigured ? '1.5px solid var(--fc-crimson)' : undefined,
      }}
      onClick={() => onSelect(event)}
    >
      {/* Banner Header Image */}
      <div style={{ position: 'relative', height: '140px', width: '100%', overflow: 'hidden' }}>
        <img
          src={event.bannerUrl}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isConcluded ? 'grayscale(0.8)' : undefined }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(18, 26, 36, 1) 0%, rgba(18, 26, 36, 0.4) 60%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Badge variant={getCategoryBadgeVariant()}>
              {(event.category || event.type || 'SPECIAL').replace('_', ' ')}
            </Badge>
            <Badge variant={getStatusBadgeVariant()} pulse={event.status === 'ACTIVE'}>
              {event.status}
            </Badge>
            {event.isFeatured && (
              <Badge variant="gold">
                <Star size={10} fill="var(--fc-gold)" /> Featured
              </Badge>
            )}
          </div>
          {event.priority === 'CRITICAL' && (
            <Badge variant="crimson" pulse>
              CRITICAL
            </Badge>
          )}
        </div>

        {/* Dynamic Countdown Floating over Banner */}
        <div style={{ position: 'absolute', bottom: '10px', right: '12px' }}>
          <EventCountdownTimer
            startDate={event.startDate}
            endDate={event.endDate}
            status={event.status}
            validationErrors={event.validationErrors}
            isPaused={isPaused}
          />
        </div>
      </div>

      {/* Misconfigured Warning Strip */}
      {isMisconfigured && (
        <div
          style={{
            background: 'rgba(255, 51, 102, 0.2)',
            borderBottom: '1px solid var(--fc-crimson)',
            padding: '0.4rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          <AlertTriangle size={13} color="var(--fc-crimson)" />
          <span>Configuration Warning: {event.validationErrors?.[0] || 'End Date is before Start Date'}</span>
        </div>
      )}

      {/* Card Body */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
        <div>
          <h4
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              marginBottom: '0.25rem',
            }}
          >
            {event.title}
          </h4>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.subtitle}
          </p>
        </div>

        {/* Reward Tier */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            background: 'var(--bg-secondary)',
            padding: '0.4rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Award size={14} color="var(--fc-gold)" style={{ flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)' }}>Top Reward:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.rewardTier}
          </span>
        </div>

        {/* Engagement & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Users size={13} /> {formatParticipants(event.participantCount)} Players
            </span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{event.progressPercentage}% Complete</span>
          </div>
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${event.progressPercentage}%`,
                height: '100%',
                background: event.status === 'ACTIVE' ? 'linear-gradient(90deg, #00ff87, #00f0ff)' : 'var(--text-muted)',
                borderRadius: '2px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: 'auto' }}>
          {event.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '0.65rem',
                padding: '0.1rem 0.4rem',
                borderRadius: '3px',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Controls Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '0.5rem',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => onSelect(event)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--fc-volt)',
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <span>Details</span>
            <ExternalLink size={12} />
          </button>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {/* Edit Button */}
            <button
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem' }}
              onClick={() => onEdit(event)}
              title="Edit Event Parameters"
            >
              <Edit3 size={12} color="var(--fc-cyan)" />
            </button>

            {!isConcluded && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem' }}
                onClick={() => onToggleStatus(event)}
                title={isPaused ? 'Resume Event' : 'Pause Event'}
              >
                {isPaused ? <Play size={12} color="var(--fc-volt)" /> : <Pause size={12} />}
              </button>
            )}

            {!isConcluded && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem' }}
                onClick={() => onExtend(event)}
                title="Extend Event by 24 Hours"
              >
                <PlusCircle size={12} color="var(--fc-cyan)" />
              </button>
            )}

            <button
              className="btn btn-danger btn-sm"
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem' }}
              onClick={() => onDelete(event.id)}
              title="Delete Event"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
