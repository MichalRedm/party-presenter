import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'purple' | 'blue' | 'red' | 'emerald' | 'amber' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  size = 'md',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold tracking-wide uppercase',
  };

  const variantClasses = {
    purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/20',
    blue: 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/20',
    red: 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-500/20',
    emerald: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/20',
    amber: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/20',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  return (
    <span
      className={twMerge(
        clsx('inline-flex items-center justify-center rounded-full shrink-0 select-none', sizeClasses[size], variantClasses[variant], className)
      )}
      {...props}
    >
      {children}
    </span>
  );
};
