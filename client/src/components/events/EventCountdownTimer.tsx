import React from 'react';
import { Clock } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';

interface EventCountdownTimerProps {
  endDate: string;
  isPaused?: boolean;
}

export const EventCountdownTimer: React.FC<EventCountdownTimerProps> = ({ endDate, isPaused }) => {
  const { formatted, isUrgent, isCritical, isExpired } = useCountdown(endDate);

  if (isPaused) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.25rem 0.6rem',
          background: 'rgba(255, 210, 0, 0.1)',
          border: '1px solid rgba(255, 210, 0, 0.3)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--fc-gold)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span>⏸ PAUSED</span>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.25rem 0.6rem',
          background: 'rgba(100, 116, 139, 0.15)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span>CONCLUDED</span>
      </div>
    );
  }

  let bg = 'rgba(0, 255, 135, 0.08)';
  let borderColor = 'rgba(0, 255, 135, 0.25)';
  let textColor = 'var(--fc-volt)';

  if (isCritical) {
    bg = 'rgba(255, 51, 102, 0.15)';
    borderColor = 'rgba(255, 51, 102, 0.4)';
    textColor = 'var(--fc-crimson)';
  } else if (isUrgent) {
    bg = 'rgba(255, 210, 0, 0.12)';
    borderColor = 'rgba(255, 210, 0, 0.35)';
    textColor = 'var(--fc-gold)';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.25rem 0.65rem',
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.75rem',
        color: textColor,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
      }}
    >
      <Clock size={12} className={isCritical ? 'animate-spin' : ''} />
      <span>{formatted}</span>
      {isCritical && <span className="live-pulse urgent" style={{ width: '6px', height: '6px' }} />}
    </div>
  );
};

