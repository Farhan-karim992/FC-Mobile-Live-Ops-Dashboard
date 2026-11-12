import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { EventStatus } from '../../types';

interface EventCountdownTimerProps {
  startDate?: string;
  endDate: string;
  status?: EventStatus;
  validationErrors?: string[];
  isPaused?: boolean;
}

interface DynamicCountdown {
  phase: 'UPCOMING' | 'ACTIVE' | 'CONCLUDED' | 'INVALID';
  formatted: string;
  isUrgent: boolean;
  isCritical: boolean;
  label: string;
}

export const EventCountdownTimer: React.FC<EventCountdownTimerProps> = ({
  startDate,
  endDate,
  status,
  validationErrors,
  isPaused,
}) => {
  const calculate = (): DynamicCountdown => {
    // 1. Check for validation errors or invalid date formats
    if (validationErrors && validationErrors.length > 0) {
      return {
        phase: 'INVALID',
        formatted: 'Date Config Error',
        isUrgent: false,
        isCritical: true,
        label: 'Config Error',
      };
    }

    const endMs = new Date(endDate).getTime();
    if (isNaN(endMs)) {
      return {
        phase: 'INVALID',
        formatted: 'Invalid End Date',
        isUrgent: false,
        isCritical: true,
        label: 'Error',
      };
    }

    const startMs = startDate ? new Date(startDate).getTime() : 0;
    if (startDate && isNaN(startMs)) {
      return {
        phase: 'INVALID',
        formatted: 'Invalid Start Date',
        isUrgent: false,
        isCritical: true,
        label: 'Error',
      };
    }

    if (startMs > 0 && endMs <= startMs) {
      return {
        phase: 'INVALID',
        formatted: 'End <= Start Date',
        isUrgent: false,
        isCritical: true,
        label: 'Config Error',
      };
    }

    const now = Date.now();

    // 2. Upcoming event (Starts in...)
    if (startMs > 0 && now < startMs) {
      const diff = startMs - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeStr = days > 0
        ? `${days}d ${pad(hours)}h ${pad(minutes)}m`
        : `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

      return {
        phase: 'UPCOMING',
        formatted: timeStr,
        isUrgent: false,
        isCritical: false,
        label: 'Starts in:',
      };
    }

    // 3. Active event (Ends in...)
    if (now <= endMs) {
      const diff = endMs - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeStr = days > 0
        ? `${days}d ${pad(hours)}h ${pad(minutes)}m`
        : `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

      return {
        phase: 'ACTIVE',
        formatted: timeStr,
        isUrgent: diff < 24 * 3600 * 1000,
        isCritical: diff < 4 * 3600 * 1000,
        label: 'Ends in:',
      };
    }

    // 4. Concluded / Expired event
    return {
      phase: 'CONCLUDED',
      formatted: 'Concluded',
      isUrgent: false,
      isCritical: false,
      label: 'Expired',
    };
  };

  const [state, setState] = useState<DynamicCountdown>(calculate);

  useEffect(() => {
    const timer = setInterval(() => {
      setState(calculate());
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate, endDate, validationErrors]);

  if (isPaused || status === 'PAUSED') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.25rem 0.6rem',
          background: 'rgba(255, 210, 0, 0.1)',
          border: '1px solid rgba(255, 210, 0, 0.35)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--fc-gold)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
        }}
      >
        <span>⏸ PAUSED BY OPS</span>
      </div>
    );
  }

  if (state.phase === 'INVALID' || status === 'MISCONFIGURED') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.25rem 0.6rem',
          background: 'rgba(255, 51, 102, 0.15)',
          border: '1px solid var(--fc-crimson)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--fc-crimson)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
        }}
        title="Configuration error detected: End Date scheduled earlier than Start Date"
      >
        <AlertTriangle size={12} />
        <span>⚠️ {state.formatted}</span>
      </div>
    );
  }

  if (state.phase === 'CONCLUDED' || status === 'CONCLUDED') {
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
        <CheckCircle size={12} />
        <span>CONCLUDED</span>
      </div>
    );
  }

  if (state.phase === 'UPCOMING') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.25rem 0.65rem',
          background: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--fc-cyan)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
        }}
      >
        <Clock size={12} />
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{state.label}</span>
        <span>{state.formatted}</span>
      </div>
    );
  }

  // Active Phase
  let bg = 'rgba(0, 255, 135, 0.08)';
  let borderColor = 'rgba(0, 255, 135, 0.25)';
  let textColor = 'var(--fc-volt)';

  if (state.isCritical) {
    bg = 'rgba(255, 51, 102, 0.15)';
    borderColor = 'rgba(255, 51, 102, 0.4)';
    textColor = 'var(--fc-crimson)';
  } else if (state.isUrgent) {
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
      <Clock size={12} className={state.isCritical ? 'animate-spin' : ''} />
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{state.label}</span>
      <span>{state.formatted}</span>
      {state.isCritical && <span className="live-pulse urgent" style={{ width: '6px', height: '6px' }} />}
    </div>
  );
};
