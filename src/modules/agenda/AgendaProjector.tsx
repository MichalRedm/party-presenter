import React from 'react';
import { useParty } from '../../context/PartyContext';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { AgendaConfig, AgendaItem } from './types';

export const AgendaProjector: React.FC<{ config: AgendaConfig; isActive: boolean }> = ({
  config,
}) => {
  const { activeProfile, setActiveItem, activeTheme } = useParty();
  const title = config.title || 'Harmonogram Imprezy';
  const showTimes = config.showEstimatedTimes !== false;
  const showDescription = config.showDescription === true;
  const layout = config.layout || 'timeline';

  // Render items from custom config.items, or fallback to profile items for backwards compatibility
  // Note: We deliberately set notes: undefined in fallback to protect private host backstage notes from leaking on stage!
  const displayItems: AgendaItem[] =
    config.items && config.items.length > 0
      ? config.items
      : activeProfile.items.map(item => ({
          id: item.id,
          title: item.title,
          time: item.time,
          durationMinutes: item.durationMinutes,
          notes: undefined,
          linkedItemId: item.id,
        }));

  const handleItemClick = (item: AgendaItem) => {
    const targetId = item.linkedItemId || item.id;
    if (activeProfile.items.some(pItem => pItem.id === targetId)) {
      setActiveItem(targetId);
    }
  };

  const totalItems = displayItems.length;

  // Decide columns for timeline:
  // If explicitly set, use that. Otherwise: <= 5 items -> 1 column, >= 6 items -> 2 columns
  const effectiveColumns =
    config.columns === 1 || config.columns === 2
      ? config.columns
      : totalItems <= 5
        ? 1
        : 2;

  // Render Horizontal layout
  if (layout === 'horizontal') {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-between p-6 md:p-12 max-w-[95vw] mx-auto z-10 select-none overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-3 shrink-0 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-semibold tracking-wider uppercase backdrop-blur-md">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>{activeProfile.name}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-2xl">
            {title}
          </h1>
        </div>

        {/* Horizontal Flow Container */}
        <div className="w-full flex-1 flex items-center justify-center min-h-0 px-4">
          <div className="w-full flex items-center justify-between gap-3 relative max-w-7xl">
            {/* Connecting line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-purple-500/20 via-white/30 to-purple-500/20 -z-0 rounded-full" />

            {displayItems.map((item, index) => {
              const hasTarget = Boolean(
                item.linkedItemId &&
                  activeProfile.items.some(pItem => pItem.id === item.linkedItemId)
              );

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`relative z-10 flex-1 flex flex-col items-center text-center transition-all duration-300 group ${
                    hasTarget ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                  }`}
                >
                  {/* Step node badge */}
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl shadow-xl transition-all duration-300 border backdrop-blur-md"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      borderColor: activeTheme?.colors?.accentPrimary || '#a855f7',
                      color: activeTheme?.colors?.accentSecondary || '#fef08a',
                      boxShadow: `0 0 25px ${activeTheme?.colors?.glowColor || 'rgba(168, 85, 247, 0.3)'}`,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Time */}
                  {showTimes && item.time && (
                    <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/15 text-sm md:text-base font-bold text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                    </div>
                  )}

                  {/* Title */}
                  <div className="mt-3 px-2">
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-2 leading-snug drop-shadow-md">
                      {item.title}
                    </h3>
                    {showDescription && item.notes && (
                      <p className="mt-1 text-xs md:text-sm text-slate-300/80 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-6 shrink-0" />
      </div>
    );
  }

  // Render Compact Grid layout
  if (layout === 'grid') {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-between p-6 md:p-10 max-w-7xl mx-auto z-10 select-none overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-2 shrink-0 pt-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-semibold tracking-wider uppercase backdrop-blur-md">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>{activeProfile.name}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
            {title}
          </h1>
        </div>

        {/* Compact Grid */}
        <div className="w-full flex-1 flex items-center justify-center min-h-0 px-2 py-4">
          <div
            className={`w-full grid gap-4 items-center ${
              totalItems <= 4
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl'
                : totalItems <= 6
                  ? 'grid-cols-2 md:grid-cols-3 max-w-6xl'
                  : 'grid-cols-2 md:grid-cols-4 max-w-7xl'
            }`}
          >
            {displayItems.map((item, index) => {
              const hasTarget = Boolean(
                item.linkedItemId &&
                  activeProfile.items.some(pItem => pItem.id === item.linkedItemId)
              );

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 backdrop-blur-md flex flex-col justify-between group ${
                    hasTarget ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'
                  }`}
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-purple-300 border border-white/10">
                      {index + 1}
                    </span>
                    {showTimes && item.time && (
                      <span className="text-sm font-black text-amber-300 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        {item.time}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {showDescription && item.notes && (
                    <p className="mt-1.5 text-xs text-slate-300/80 line-clamp-2">
                      {item.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-4 shrink-0" />
      </div>
    );
  }

  // Default: Vertical Stage Timeline (1 or 2 columns with Zero Scroll)
  const isTwoColumns = effectiveColumns === 2;
  const leftColumnItems = isTwoColumns
    ? displayItems.slice(0, Math.ceil(totalItems / 2))
    : displayItems;
  const rightColumnItems = isTwoColumns
    ? displayItems.slice(Math.ceil(totalItems / 2))
    : [];

  const renderTimelineColumn = (items: AgendaItem[], startIndex: number) => {
    // Dynamic sizing based on items per column to guarantee Zero Scroll
    const itemsCount = items.length;
    const paddingY = itemsCount <= 4 ? 'py-3.5 md:py-4' : 'py-2 md:py-2.5';
    const titleSize =
      itemsCount <= 4
        ? 'text-2xl md:text-3xl'
        : itemsCount <= 6
          ? 'text-xl md:text-2xl'
          : 'text-lg md:text-xl';
    const timeSize =
      itemsCount <= 4 ? 'text-lg md:text-xl' : 'text-base md:text-lg';

    return (
      <div className="relative flex flex-col justify-center gap-2.5 md:gap-3.5 w-full">
        {items.map((item, idx) => {
          const actualIndex = startIndex + idx;
          const hasTarget = Boolean(
            item.linkedItemId &&
              activeProfile.items.some(pItem => pItem.id === item.linkedItemId)
          );

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`relative flex items-center group transition-all duration-300 ${
                hasTarget ? 'cursor-pointer hover:translate-x-1.5' : 'cursor-default'
              }`}
            >
              {/* Time pill column */}
              <div className="w-[72px] md:w-[88px] shrink-0 text-right pr-2">
                {showTimes && item.time ? (
                  <span
                    className={`font-black tracking-tight ${timeSize}`}
                    style={{
                      color: activeTheme?.colors?.accentSecondary || '#fef08a',
                    }}
                  >
                    {item.time}
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium text-sm">
                    #{actualIndex + 1}
                  </span>
                )}
              </div>

              {/* Timeline Track (Line segment + Circle Node) - perfectly centered */}
              <div className="relative self-stretch flex items-center justify-center w-10 md:w-12 shrink-0">
                {/* Vertical connecting line passing through the exact center of circles */}
                {items.length > 1 && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-0.5 pointer-events-none"
                    style={{
                      backgroundColor: activeTheme?.colors?.accentPrimary
                        ? `${activeTheme.colors.accentPrimary}60`
                        : 'rgba(168, 85, 247, 0.4)',
                      top: idx === 0 ? '50%' : '-0.75rem',
                      bottom: idx === items.length - 1 ? '50%' : '-0.75rem',
                    }}
                  />
                )}

                {/* Circle node - perfectly centered over the line */}
                <div
                  className="relative z-10 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg group-hover:scale-110"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: activeTheme?.colors?.accentPrimary || '#a855f7',
                    boxShadow: `0 0 16px ${activeTheme?.colors?.glowColor || 'rgba(168, 85, 247, 0.4)'}`,
                  }}
                >
                  <span className="text-xs md:text-sm font-black text-white">
                    {actualIndex + 1}
                  </span>
                </div>
              </div>

              {/* Title & optional notes card */}
              <div
                className={`flex-1 min-w-0 ${paddingY} px-4 md:px-5 rounded-2xl border transition-all duration-300 backdrop-blur-md ml-1 md:ml-2 ${
                  hasTarget
                    ? 'bg-slate-900/60 hover:bg-slate-900/90 border-white/10 hover:border-purple-400/40'
                    : 'bg-slate-900/40 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={`font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors leading-tight ${titleSize}`}
                  >
                    {item.title}
                  </h3>
                  {hasTarget && (
                    <Sparkles className="w-4 h-4 text-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  )}
                </div>

                {showDescription && item.notes && (
                  <p className="mt-1 text-sm text-slate-300/85 line-clamp-1 leading-normal">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 md:p-10 max-w-7xl mx-auto z-10 select-none overflow-hidden">
      {/* Stage Header */}
      <div className="text-center space-y-2.5 shrink-0 pt-1">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-sm font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>{activeProfile.name}</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-2xl">
          {title}
        </h1>
      </div>

      {/* Main Content Area - perfectly centered and constrained for Zero Scroll */}
      <div className="w-full flex-1 flex items-center justify-center min-h-0 px-2 md:px-6 my-auto">
        {isTwoColumns ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl">
            {renderTimelineColumn(leftColumnItems, 0)}
            {renderTimelineColumn(rightColumnItems, leftColumnItems.length)}
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            {renderTimelineColumn(displayItems, 0)}
          </div>
        )}
      </div>

      {/* Discreet bottom spacing to balance layout */}
      <div className="h-4 shrink-0" />
    </div>
  );
};

