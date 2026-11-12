import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useLiveOps } from '../../context/LiveOpsContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLiveOps();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let iconColor = 'var(--fc-volt)';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--fc-crimson)';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'var(--fc-cyan)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'var(--fc-gold)';
        }

        return (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <Icon size={18} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
