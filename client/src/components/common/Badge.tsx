import React, { ReactNode, CSSProperties } from 'react';

export interface BadgeProps {
  variant?: 'volt' | 'cyan' | 'gold' | 'crimson' | 'slate';
  children: ReactNode;
  pulse?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'slate',
  children,
  pulse = false,
  className = '',
  style,
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} style={style}>
      {pulse && <span className={`live-pulse ${variant === 'crimson' ? 'urgent' : ''}`} />}
      {children}
    </span>
  );
};
