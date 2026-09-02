import React from 'react';
import { useParty } from '../../context/PartyContext';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { AgendaConfig } from './types';

export const AgendaProjector: React.FC<{ config: AgendaConfig; isActive: boolean }> = ({
  config,
}) => {
  const { activeProfile, activeItem, setActiveItem } = useParty();
  const title = config.title || 'Harmonogram Imprezy';
  const showTimes = config.showEstimatedTimes !== false;
  const showDescription = config.showDescription !== false;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 md:p-10 max-w-7xl mx-auto z-10 select-none">
      {/* Header */}
      <div className="text-center space-y-2.5 mb-3 shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-sm font-semibold tracking-wider uppercase">
          <Calendar className="w-4 h-4" />
          <span>{activeProfile.name}</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-2xl">
          {title}
        </h1>
      </div>

      {/* Timeline Grid - overflow visible with padding so glows bloom naturally */}
      <div className="w-full flex-1 min-h-0 flex items-center justify-center p-4 md:p-6 overflow-visible">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch overflow-visible">
          {activeProfile.items.map((item, index) => {
            const isCurrent = item.id === activeItem?.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className="relative cursor-pointer transition-all duration-300 group"
              >
                {/* Active Card Ambient Glow Underlay */}
                {isCurrent && (
                  <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-75 blur-lg pointer-events-none animate-pulse-glow" />
                )}

                {/* Main Card Content */}
                <div
                  className={`relative h-full flex flex-col justify-between p-6 rounded-2xl transition-all duration-300 border ${
                    isCurrent
                      ? 'bg-slate-900/95 border-purple-400/90 ring-1 ring-purple-400/50 shadow-2xl'
                      : 'bg-slate-900/70 hover:bg-slate-800/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Card top bar */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-xs font-bold text-slate-300">
                        {index + 1}
                      </span>
                      {showTimes && item.time && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>
                      )}
                    </div>

                    {isCurrent && (
                      <Badge variant="purple" size="sm" className="animate-pulse">
                        <Sparkles className="w-3 h-3 mr-1" />
                        TERAZ
                      </Badge>
                    )}
                  </div>

                  {/* Title & description */}
                  <div className="my-auto space-y-2">
                    <h3 className={`text-xl md:text-2xl font-bold tracking-tight ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                      {item.title}
                    </h3>
                    {showDescription && item.notes && (
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Module type tag */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="uppercase tracking-wider font-semibold text-[10px] text-purple-300">
                      {item.type}
                    </span>
                    {item.durationMinutes && (
                      <span>~{item.durationMinutes} min</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-2 text-center text-xs md:text-sm text-slate-400 font-medium shrink-0">
        Użyj strzałek na klawiaturze lub pilota, aby przejść do kolejnych punktów programu.
      </div>
    </div>
  );
};
