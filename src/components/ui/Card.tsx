import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'interactive' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  className,
  ...props
}) => {
  const variantClasses = {
    glass: 'bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 text-slate-100',
    solid: 'bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl',
    interactive: 'bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 hover:bg-slate-800/80 rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-purple-500/10',
    outline: 'bg-transparent border border-white/15 rounded-2xl p-6 text-slate-100',
  };

  return (
    <div className={twMerge(clsx(variantClasses[variant], className))} {...props}>
      {children}
    </div>
  );
};
