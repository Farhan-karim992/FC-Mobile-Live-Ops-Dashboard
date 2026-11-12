import React, { ReactNode } from 'react';
import { SearchX, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No live-ops records found',
  description = 'Try adjusting your search query, status filters, or OVR thresholds.',
  icon = <SearchX size={48} color="var(--text-muted)" />,
  actionText,
  onAction,
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        margin: '1.5rem 0',
      }}
    >
      <div style={{ opacity: 0.8 }}>{icon}</div>
      <div>
        <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{title}</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} style={{ marginTop: '0.5rem' }}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'LiveOps API Connection Error',
  message,
  onRetry,
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        border: '1px solid rgba(255, 51, 102, 0.4)',
        background: 'rgba(255, 51, 102, 0.05)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        margin: '1.5rem 0',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(255, 51, 102, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AlertTriangle size={28} color="var(--fc-crimson)" />
      </div>

      <div>
        <h4 style={{ fontSize: '1.2rem', color: 'var(--fc-crimson)', marginBottom: '0.35rem' }}>{title}</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
          {message}
        </p>
      </div>

      {onRetry && (
        <Button variant="danger" size="md" leftIcon={<RefreshCcw size={16} />} onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};
