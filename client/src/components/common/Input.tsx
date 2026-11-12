import React, { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  hint,
  className = '',
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <span style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            {leftIcon}
          </span>
        )}
        <input
          className={`input-field ${className}`}
          style={{ paddingLeft: leftIcon ? '2.4rem' : undefined }}
          {...props}
        />
      </div>
      {hint && !error && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hint}</span>}
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--fc-crimson)' }}>{error}</span>}
    </div>
  );
};

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <select className={`input-field select-field ${className}`} {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--fc-crimson)' }}>{error}</span>}
    </div>
  );
};

