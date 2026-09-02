import React, { useEffect } from 'react';
import { useParty } from '../../context/PartyContext';
import { CodenamesConfig, CodenamesCard } from '../../types/codenames';
import { soundEngine } from '../../services/soundEngine';
import { Sparkles, Skull, Crown, Timer, ShieldAlert } from 'lucide-react';

export const CodenamesProjector: React.FC<{
  config: CodenamesConfig;
  isActive: boolean;
}> = ({ config, isActive }) => {
  const { activeItem, codenamesAction } = useParty();
  const {
    cards = [],
    currentTurn = 'red',
    redScore = 0,
    blueScore = 0,
    winner = null,
    assassinTriggered = false,
    timerSeconds = 90,
    isTimerRunning = false,
    currentClue = null,
  } = config;

  // Turn timer countdown
  useEffect(() => {
    if (!isActive || !isTimerRunning || winner || timerSeconds <= 0) return;

    const interval = setInterval(() => {
      if (timerSeconds <= 1) {
        soundEngine.playBuzzer();
        if (activeItem) {
          codenamesAction(activeItem.id, 'toggle_timer');
        }
      } else {
        if (timerSeconds <= 10) {
          soundEngine.playTick();
        }
        if (activeItem) {
          // decrement
          const item = activeItem;
          codenamesAction(item.id, 'update_clue', { clueWord: currentClue?.word, clueCount: currentClue?.count });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isTimerRunning, winner, timerSeconds, activeItem, codenamesAction, currentClue]);

  const totalRed = cards.filter(c => c.role === 'red').length;
  const totalBlue = cards.filter(c => c.role === 'blue').length;

  const handleCardClick = (card: CodenamesCard) => {
    if (card.revealed || winner || !activeItem) return;
    codenamesAction(activeItem.id, 'reveal', { cardId: card.id });
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const timerMins = Math.floor(timerSeconds / 60);
  const timerSecs = timerSeconds % 60;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-10 select-none max-w-7xl mx-auto z-10">
      {/* Top Game Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Red Team Score */}
        <div className={`flex items-center gap-3 px-6 py-2.5 rounded-xl border transition-all ${
          currentTurn === 'red' && !winner
            ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/50 shadow-lg shadow-rose-600/30'
            : 'bg-slate-950/60 border-rose-500/30'
        }`}>
          <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Czerwoni</span>
            <span className="text-2xl font-mono font-black text-rose-100">
              {redScore} / {totalRed}
            </span>
          </div>
        </div>

        {/* Turn Status & Clue */}
        <div className="flex flex-col items-center justify-center text-center">
          {winner ? (
            <div className="flex items-center gap-2 px-6 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-lg animate-bounce">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>ZWYCIĘSTWO DRUŻYNY {winner === 'red' ? 'CZERWONYCH' : 'NIEBIESKICH'}!</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/10 text-white font-black text-base md:text-lg tracking-wider uppercase">
                <span>Tura:</span>
                <span className={currentTurn === 'red' ? 'text-rose-400 font-extrabold' : 'text-blue-400 font-extrabold'}>
                  {currentTurn === 'red' ? 'Czerwoni' : 'Niebiescy'}
                </span>
              </div>

              {currentClue && (
                <div className="text-sm font-semibold text-purple-200">
                  Podpowiedź: <span className="text-amber-300 uppercase font-black">{currentClue.word}</span> ({currentClue.count})
                </div>
              )}
            </div>
          )}
        </div>

        {/* Turn Timer & Blue Team Score */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-slate-200">
            <Timer className={`w-4 h-4 ${timerSeconds <= 10 && isTimerRunning ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
            <span className={`font-mono text-xl font-bold ${timerSeconds <= 10 && isTimerRunning ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
              {pad(timerMins)}:{pad(timerSecs)}
            </span>
          </div>

          <div className={`flex items-center gap-3 px-6 py-2.5 rounded-xl border transition-all ${
            currentTurn === 'blue' && !winner
              ? 'bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-600/30'
              : 'bg-slate-950/60 border-blue-500/30'
          }`}>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Niebiescy</span>
              <span className="text-2xl font-mono font-black text-blue-100">
                {blueScore} / {totalBlue}
              </span>
            </div>
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 5x5 Cards Board */}
      <div className="grid grid-cols-5 gap-3 md:gap-4 my-auto py-4">
        {cards.map(card => {
          const isRevealed = card.revealed;

          let revealedBg = 'bg-stone-700 border-stone-500 text-stone-300';
          let roleIcon = null;

          if (card.role === 'red') {
            revealedBg = 'bg-gradient-to-br from-rose-600 to-red-800 border-rose-400 text-white shadow-lg shadow-rose-600/50';
          } else if (card.role === 'blue') {
            revealedBg = 'bg-gradient-to-br from-blue-600 to-indigo-800 border-blue-400 text-white shadow-lg shadow-blue-600/50';
          } else if (card.role === 'assassin') {
            revealedBg = 'bg-gradient-to-br from-zinc-900 to-black border-rose-600 text-rose-400 ring-2 ring-rose-600 shadow-2xl shadow-rose-950';
            roleIcon = <Skull className="w-6 h-6 animate-pulse" />;
          } else {
            // Neutral / Tan bystander
            revealedBg = 'bg-amber-950/60 border-amber-700/60 text-amber-200/80';
          }

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="relative h-20 md:h-24 lg:h-28 perspective-1000 cursor-pointer"
            >
              <div
                className={`w-full h-full duration-500 transform-style-3d transition-transform ${
                  isRevealed ? 'rotate-y-180' : 'hover:scale-[1.03]'
                }`}
              >
                {/* Front (Hidden / Word view) */}
                <div className="absolute inset-0 backface-hidden flex items-center justify-center p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 shadow-xl hover:border-purple-400/50 transition-all">
                  <span className="text-base md:text-xl lg:text-2xl font-black text-white tracking-wider text-center break-words drop-shadow">
                    {card.word}
                  </span>
                </div>

                {/* Back (Revealed color view) */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-3 rounded-2xl border shadow-xl ${revealedBg}`}
                >
                  <span className="text-sm md:text-lg lg:text-xl font-black tracking-wide text-center uppercase drop-shadow line-through opacity-80">
                    {card.word}
                  </span>
                  {roleIcon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assassin Overlay Notification */}
      {assassinTriggered && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in zoom-in">
          <div className="max-w-2xl p-8 rounded-3xl bg-rose-950/90 border-2 border-rose-500 shadow-2xl shadow-rose-600/50 text-center space-y-6">
            <ShieldAlert className="w-20 h-20 text-rose-500 mx-auto animate-bounce" />
            <h2 className="text-5xl md:text-7xl font-black text-rose-400 tracking-tight">
              ZABÓJCA ODKRYTY!
            </h2>
            <p className="text-2xl text-slate-200 font-bold">
              Drużyna <span className="text-amber-300 font-black">{winner === 'red' ? 'CZERWONYCH' : 'NIEBIESKICH'}</span> wygrywa grę!
            </p>
          </div>
        </div>
      )}

      {/* Footer / Spymaster Hint */}
      <div className="flex items-center justify-between text-xs md:text-sm text-slate-400 pt-2 border-t border-white/10">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Kapitanowie podglądają kolory na żywo na ekranie telefonu: <strong className="text-purple-300">/spymaster</strong>
        </span>
        <span>Kliknij kartę, aby ją odkryć</span>
      </div>
    </div>
  );
};
