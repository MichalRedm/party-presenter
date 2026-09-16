import React, { useEffect, useState } from 'react';
import { useParty } from '../../context/PartyContext';
import { CodenamesConfig, CodenamesCard } from '../../types/codenames';
import { soundEngine } from '../../services/soundEngine';
import { Sparkles, Skull, Crown, Timer, ShieldAlert, X, RotateCcw, Eye } from 'lucide-react';

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

  const [isPopupDismissed, setIsPopupDismissed] = useState(false);

  // Auto show popup when a new game over or assassin trigger occurs
  useEffect(() => {
    if (assassinTriggered || winner) {
      setIsPopupDismissed(false);
    } else {
      setIsPopupDismissed(false);
    }
  }, [assassinTriggered, winner]);

  // Close popup with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPopupDismissed && (assassinTriggered || winner)) {
        setIsPopupDismissed(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPopupDismissed, assassinTriggered, winner]);

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
  const totalGreen = cards.filter(c => c.role === 'green').length;
  const is3Team = config.gameMode === '3-team-elegant' || config.gameMode === '3-team-epic';
  const isEpic = config.gameMode === '3-team-epic';
  const eliminated = config.eliminatedTeams || [];

  const handleCardClick = (card: CodenamesCard) => {
    if (card.revealed || winner || !activeItem) return;
    codenamesAction(activeItem.id, 'reveal', { cardId: card.id });
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const timerMins = Math.floor(timerSeconds / 60);
  const timerSecs = timerSeconds % 60;

  const currentTurnName = currentTurn === 'red' ? 'Czerwoni' : (currentTurn === 'blue' ? 'Niebiescy' : 'Zieloni');
  const currentTurnColor = currentTurn === 'red' ? 'text-rose-400' : (currentTurn === 'blue' ? 'text-blue-400' : 'text-emerald-400');
  const winnerName = winner === 'red' ? 'CZERWONYCH' : (winner === 'blue' ? 'NIEBIESKICH' : 'ZIELONYCH');

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-10 select-none max-w-7xl mx-auto z-10">
      {/* Top Game Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Red Team Score */}
        <div className={`flex items-center gap-3 px-4 md:px-6 py-2.5 rounded-xl border transition-all ${
          currentTurn === 'red' && !winner
            ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/50 shadow-lg shadow-rose-600/30'
            : 'bg-slate-950/60 border-rose-500/30'
        } ${eliminated.includes('red') ? 'opacity-30 grayscale' : ''}`}>
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-6 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-lg animate-bounce">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>ZWYCIĘSTWO DRUŻYNY {winnerName}!</span>
              </div>
              {activeItem && (
                <button
                  onClick={() => {
                    codenamesAction(activeItem.id, 'new_game');
                    setIsPopupDismissed(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 transition-all cursor-pointer hover:scale-105"
                  title="Rozpocznij nową grę"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Nowa gra</span>
                </button>
              )}
            </div>
          ) : !winner && eliminated.length > 0 ? (
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/10 text-white font-black text-base md:text-lg tracking-wider uppercase">
                <span>Tura:</span>
                <span className={`${currentTurnColor} font-extrabold`}>
                  {currentTurnName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/40 ml-1 font-bold">
                  (Odpada: {eliminated.map(t => t === 'red' ? 'Czerwoni' : (t === 'blue' ? 'Niebiescy' : 'Zieloni')).join(', ')})
                </span>
              </div>

              {currentClue && (
                <div className="text-sm font-semibold text-purple-200">
                  Podpowiedź: <span className="text-amber-300 uppercase font-black">{currentClue.word}</span> ({currentClue.count})
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/10 text-white font-black text-base md:text-lg tracking-wider uppercase">
                <span>Tura:</span>
                <span className={`${currentTurnColor} font-extrabold`}>
                  {currentTurnName}
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

        {/* Turn Timer & Blue & Green Team Score */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-slate-200">
            <Timer className={`w-4 h-4 ${timerSeconds <= 10 && isTimerRunning ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
            <span className={`font-mono text-xl font-bold ${timerSeconds <= 10 && isTimerRunning ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
              {pad(timerMins)}:{pad(timerSecs)}
            </span>
          </div>

          <div className={`flex items-center gap-3 px-4 md:px-6 py-2.5 rounded-xl border transition-all ${
            currentTurn === 'blue' && !winner
              ? 'bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-600/30'
              : 'bg-slate-950/60 border-blue-500/30'
          } ${eliminated.includes('blue') ? 'opacity-30 grayscale' : ''}`}>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Niebiescy</span>
              <span className="text-2xl font-mono font-black text-blue-100">
                {blueScore} / {totalBlue}
              </span>
            </div>
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
          </div>

          {is3Team && (
             <div className={`flex items-center gap-3 px-4 md:px-6 py-2.5 rounded-xl border transition-all ${
               currentTurn === 'green' && !winner
                 ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-600/30'
                 : 'bg-slate-950/60 border-emerald-500/30'
             } ${eliminated.includes('green') ? 'opacity-30 grayscale' : ''}`}>
               <div className="flex flex-col text-right">
                 <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Zieloni</span>
                 <span className="text-2xl font-mono font-black text-emerald-100">
                   {config.greenScore || 0} / {totalGreen}
                 </span>
               </div>
               <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
             </div>
          )}
        </div>
      </div>

      {/* Cards Board */}
      <div className={`grid ${isEpic ? 'grid-cols-6 gap-2 md:gap-3 py-2' : 'grid-cols-5 gap-3 md:gap-4 py-4'} my-auto`}>
        {cards.map(card => {
          const isRevealed = card.revealed;

          let revealedBg = 'bg-stone-700 border-stone-500 text-stone-300';
          let roleIcon = null;

          if (card.role === 'red') {
            revealedBg = 'bg-gradient-to-br from-rose-600 to-red-800 border-rose-400 text-white shadow-lg shadow-rose-600/50';
          } else if (card.role === 'blue') {
            revealedBg = 'bg-gradient-to-br from-blue-600 to-indigo-800 border-blue-400 text-white shadow-lg shadow-blue-600/50';
          } else if (card.role === 'green') {
            revealedBg = 'bg-gradient-to-br from-emerald-600 to-green-800 border-emerald-400 text-white shadow-lg shadow-emerald-600/50';
          } else if (card.role === 'assassin') {
            revealedBg = 'bg-gradient-to-br from-zinc-900 to-black border-rose-600 text-rose-400 ring-2 ring-rose-600 shadow-2xl shadow-rose-950';
            roleIcon = <Skull className="w-6 h-6 animate-pulse" />;
          } else {
            // Neutral / Tan bystander (removed /60 to fix transparency bug)
            revealedBg = 'bg-amber-950 border-amber-700/60 text-amber-200/80';
          }

          const getWordSizeClass = (word: string, isBack: boolean = false) => {
            if (word.length >= 13) return isBack ? 'text-[10px] md:text-xs lg:text-sm leading-none' : 'text-xs md:text-sm lg:text-base leading-none';
            if (word.length >= 10) return isBack ? 'text-xs md:text-sm lg:text-base leading-tight' : 'text-sm md:text-base lg:text-lg leading-tight';
            return isBack ? 'text-sm md:text-lg lg:text-xl leading-tight' : 'text-base md:text-xl lg:text-2xl leading-tight';
          };

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
                <div className="absolute inset-0 backface-hidden flex items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/20 shadow-xl hover:border-purple-400/50 transition-all">
                  <span className={`${getWordSizeClass(card.word, false)} font-black text-white tracking-wider text-center break-words drop-shadow`}>
                    {card.word}
                  </span>
                </div>

                {/* Back (Revealed color view) */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-3 rounded-2xl border shadow-xl ${revealedBg}`}
                >
                  <span className={`${getWordSizeClass(card.word, true)} font-black tracking-wide text-center uppercase drop-shadow line-through opacity-80`}>
                    {card.word}
                  </span>
                  {roleIcon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Game End / Assassin Popup Notification */}
      {!isPopupDismissed && (assassinTriggered || winner) && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          {/* Backdrop (clickable to dismiss and view the board) */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setIsPopupDismissed(true)}
          />

          {/* Popup Card */}
          <div
            className={`relative z-50 w-full max-w-2xl p-6 md:p-8 rounded-3xl border-2 shadow-2xl animate-in zoom-in-95 duration-200 text-center space-y-6 ${
              assassinTriggered
                ? 'bg-gradient-to-b from-slate-950 via-rose-950 to-slate-950 border-rose-500 shadow-rose-600/40'
                : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-amber-500/80 shadow-amber-500/30'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsPopupDismissed(true)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Zamknij popup i zobacz planszę"
              title="Zamknij popup i zobacz planszę (Esc)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Icon & Title */}
            {assassinTriggered ? (
              <>
                <ShieldAlert className="w-16 h-16 md:w-20 md:h-20 text-rose-500 mx-auto animate-bounce" />
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-6xl font-black text-rose-400 tracking-tight drop-shadow-md">
                    ZABÓJCA ODKRYTY!
                  </h2>
                  <div className="text-lg md:text-2xl text-slate-200 font-bold space-y-1">
                    {winner ? (
                      <p>
                        Drużyna <span className="text-amber-300 font-black uppercase">{winnerName}</span> wygrywa grę!
                      </p>
                    ) : (
                      <>
                        <p className="text-rose-300">
                          {eliminated.length > 0 ? (
                            <>Drużyna <span className="text-white uppercase font-black">{eliminated[eliminated.length - 1] === 'red' ? 'CZERWONYCH' : (eliminated[eliminated.length - 1] === 'blue' ? 'NIEBIESKICH' : 'ZIELONYCH')}</span> została wyeliminowana!</>
                          ) : (
                            <>Drużyna została wyeliminowana!</>
                          )}
                        </p>
                        <p className="text-sm md:text-base text-slate-400 font-normal">
                          Pozostałe drużyny kontynuują rozgrywkę. Teraz tura drużyny: <strong className={currentTurnColor}>{currentTurnName}</strong>.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Crown className="w-16 h-16 md:w-20 md:h-20 text-amber-400 mx-auto animate-bounce" />
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-6xl font-black text-amber-400 tracking-tight drop-shadow-md">
                    KONIEC GRY!
                  </h2>
                  <p className="text-lg md:text-2xl text-slate-200 font-bold">
                    Zwycięstwo odnosi drużyna <span className="text-amber-300 font-black uppercase">{winnerName}</span>!
                  </p>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsPopupDismissed(true)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all flex items-center gap-2 cursor-pointer ${
                  !winner
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                {!winner ? 'Kontynuuj grę' : 'Zobacz planszę'}
              </button>

              {winner && activeItem && (
                <button
                  onClick={() => {
                    codenamesAction(activeItem.id, 'new_game');
                    setIsPopupDismissed(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm md:text-base shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Nowa runda
                </button>
              )}
            </div>
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
