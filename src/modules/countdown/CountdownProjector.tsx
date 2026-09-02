import React, { useState, useEffect, useRef } from 'react';
import { useParty } from '../../context/PartyContext';
import { Sparkles, Hourglass } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

export interface CountdownConfig {
  targetTime: string; // "00:00" or ISO string
  label?: string;
  celebrateOnZero?: boolean;
  celebrationText?: string;
}

export const CountdownProjector: React.FC<{
  config: CountdownConfig;
  isActive: boolean;
}> = ({ config, isActive }) => {
  const { triggerConfetti } = useParty();
  const { targetTime = '00:00', label = 'Wielkie Odliczanie', celebrateOnZero = true, celebrationText = 'STO LAT! 🎉🍾' } = config;

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; totalSeconds: number; isPast: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isPast: false,
  });

  const celebrationTriggeredRef = useRef(false);

  useEffect(() => {
    celebrationTriggeredRef.current = false;
  }, [targetTime]);

  useEffect(() => {
    if (!isActive) return;

    const calculateTime = () => {
      const now = new Date();
      let targetDate = new Date();

      if (targetTime.includes(':')) {
        const [hours, minutes] = targetTime.split(':').map(Number);
        targetDate.setHours(hours, minutes, 0, 0);

        // If target is earlier today (e.g. 00:00 target when current is 23:00), push to next day
        if (targetDate.getTime() <= now.getTime() - 1000 * 60 * 5) {
          // It was meant for midnight / tomorrow
          targetDate.setDate(targetDate.getDate() + 1);
        }
      } else {
        targetDate = new Date(targetTime);
      }

      const diffMs = targetDate.getTime() - now.getTime();
      const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

      const isPast = diffMs <= 0 && diffMs > -1000 * 60 * 60; // within 1 hour past

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Audio tick on final 10 seconds
      if (totalSeconds <= 10 && totalSeconds > 0) {
        soundEngine.playTick();
      }

      // Celebration on hitting zero
      if (totalSeconds === 0 && !celebrationTriggeredRef.current && celebrateOnZero) {
        celebrationTriggeredRef.current = true;
        soundEngine.playVictory();
        triggerConfetti({ count: 250, spread: 100 });
      }

      setTimeLeft({ hours, minutes, seconds, totalSeconds, isPast });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [isActive, targetTime, celebrateOnZero, triggerConfetti]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const isCelebration = timeLeft.totalSeconds === 0 && timeLeft.isPast;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 md:p-16 select-none text-center">
      {/* Background glow pulse */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[140px] pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 max-w-5xl space-y-8 animate-in zoom-in-95 duration-500">
        {/* Label Header */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-lg font-bold tracking-widest uppercase shadow-lg shadow-amber-500/20">
          <Hourglass className="w-5 h-5 animate-spin duration-3000" />
          <span>{label}</span>
        </div>

        {/* Big Counter Digits */}
        {!isCelebration ? (
          <div className="flex items-center justify-center gap-4 md:gap-8 my-4">
            {/* Hours */}
            {timeLeft.hours > 0 && (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-36 md:w-56 h-28 md:h-44 flex items-center justify-center rounded-3xl bg-slate-900/80 border border-white/15 backdrop-blur-2xl shadow-2xl">
                    <span className="text-6xl md:text-9xl font-mono font-black text-white tracking-tight drop-shadow-2xl tabular-nums select-none text-center">
                      {pad(timeLeft.hours)}
                    </span>
                  </div>
                  <span className="mt-3 text-sm md:text-lg font-bold text-slate-400 uppercase tracking-widest">
                    Godzin
                  </span>
                </div>
                <span className="text-5xl md:text-8xl font-mono font-black text-purple-400/60 -mt-8">:</span>
              </>
            )}

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-36 md:w-56 h-28 md:h-44 flex items-center justify-center rounded-3xl bg-slate-900/80 border border-white/15 backdrop-blur-2xl shadow-2xl">
                <span className="text-6xl md:text-9xl font-mono font-black text-white tracking-tight drop-shadow-2xl tabular-nums select-none text-center">
                  {pad(timeLeft.minutes)}
                </span>
              </div>
              <span className="mt-3 text-sm md:text-lg font-bold text-slate-400 uppercase tracking-widest">
                Minut
              </span>
            </div>

            <span className="text-5xl md:text-8xl font-mono font-black text-purple-400/60 -mt-8">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className={`w-36 md:w-56 h-28 md:h-44 flex items-center justify-center rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all ${
                timeLeft.totalSeconds <= 10
                  ? 'bg-rose-950/80 border-rose-500 shadow-rose-600/50 scale-105 animate-pulse ring-4 ring-rose-500/40'
                  : 'bg-slate-900/80 border-white/15'
              }`}>
                <span className={`text-6xl md:text-9xl font-mono font-black tracking-tight drop-shadow-2xl tabular-nums select-none text-center ${
                  timeLeft.totalSeconds <= 10 ? 'text-rose-300' : 'text-purple-300'
                }`}>
                  {pad(timeLeft.seconds)}
                </span>
              </div>
              <span className="mt-3 text-sm md:text-lg font-bold text-slate-400 uppercase tracking-widest">
                Sekund
              </span>
            </div>
          </div>
        ) : (
          /* Victory celebration screen */
          <div className="space-y-6 animate-in zoom-in duration-700">
            <h2 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 tracking-tight drop-shadow-2xl animate-bounce">
              {celebrationText}
            </h2>
            <p className="text-2xl md:text-4xl text-white/90 font-bold flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
              Wznieśmy wspólny toast! 🥂
              <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
            </p>
          </div>
        )}

        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
          Cel: {targetTime}
        </p>
      </div>
    </div>
  );
};
