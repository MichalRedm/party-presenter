import React from 'react';
import { Badge } from '../../components/ui/Badge';

export interface TextSlideConfig {
  title: string;
  subtitle?: string;
  body?: string;
  tag?: string;
  backgroundImage?: string;
  bgOpacity?: number; // 0.0 to 1.0
  bgBlur?: number; // px blur
  textAlign?: 'center' | 'left' | 'right';
  themeAccent?: string;
}

export const TextSlideProjector: React.FC<{
  config: TextSlideConfig;
  isActive: boolean;
}> = ({ config }) => {
  const {
    title,
    subtitle,
    body,
    tag,
    backgroundImage,
    bgOpacity = 0.4,
    bgBlur = 0,
    textAlign = 'center',
  } = config;

  const alignClasses = {
    center: 'items-center text-center mx-auto',
    left: 'items-start text-left mr-auto',
    right: 'items-end text-right ml-auto',
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 md:p-16 select-none overflow-hidden">
      {/* Background Image with custom opacity and blur */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            opacity: bgOpacity,
            filter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
            transform: 'scale(1.05)', // prevent blur white edges
          }}
        />
      )}

      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

      {/* Main Content Card */}
      <div className={`relative z-10 max-w-5xl flex flex-col ${alignClasses[textAlign]} space-y-6 md:space-y-8 animate-in zoom-in-95 duration-500`}>
        {tag && (
          <Badge variant="purple" size="md" className="px-5 py-2 text-sm tracking-widest font-black shadow-lg shadow-purple-500/30">
            {tag}
          </Badge>
        )}

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-2xl md:text-4xl text-purple-200 font-semibold tracking-wide max-w-4xl drop-shadow-md">
            {subtitle}
          </p>
        )}

        {body && (
          <div className="text-xl md:text-3xl text-slate-200 font-normal leading-relaxed whitespace-pre-line max-w-4xl pt-4 border-t border-white/20 drop-shadow">
            {body}
          </div>
        )}
      </div>
    </div>
  );
};
