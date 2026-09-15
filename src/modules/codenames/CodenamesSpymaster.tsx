import React from 'react';
import { CodenamesConfig } from '../../types/codenames';
import { Shield, Skull, CheckCircle } from 'lucide-react';

export const CodenamesSpymaster: React.FC<{
  config: CodenamesConfig;
}> = ({ config }) => {
  const { cards = [], currentTurn = 'red', redScore = 0, blueScore = 0, winner = null } = config;

  const totalRed = cards.filter(c => c.role === 'red').length;
  const totalBlue = cards.filter(c => c.role === 'blue').length;
  const totalGreen = cards.filter(c => c.role === 'green').length;
  const is3Team = config.gameMode === '3-team-elegant' || config.gameMode === '3-team-epic';
  const isEpic = config.gameMode === '3-team-epic';

  const winnerName = winner === 'red' ? 'CZERWONYCH' : (winner === 'blue' ? 'NIEBIESKICH' : 'ZIELONYCH');
  const turnName = currentTurn === 'red' ? 'CZERWONI' : (currentTurn === 'blue' ? 'NIEBIESCY' : 'ZIELONI');
  const turnColor = currentTurn === 'red' ? 'text-rose-400' : (currentTurn === 'blue' ? 'text-blue-400' : 'text-emerald-400');

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-wider">
              Klucz Kapitanów (Ściśle Tajne)
            </h2>
            <p className="text-xs text-slate-400">
              Podgląd ról wszystkich haseł w czasie rzeczywistym.
            </p>
          </div>
        </div>

        {/* Turn & Score badge */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold">
            🔴 {redScore}/{totalRed}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-500/50 text-blue-300 text-xs font-bold">
            🔵 {blueScore}/{totalBlue}
          </div>
          {is3Team && (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
              🟢 {config.greenScore || 0}/{totalGreen}
            </div>
          )}
        </div>
      </div>

      {winner && (
        <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-center">
          Koniec gry! Zwycięstwo drużyny {winnerName}!
        </div>
      )}

      {/* Spymaster Color-Coded Grid */}
      <div className={`grid ${isEpic ? 'grid-cols-6' : 'grid-cols-5'} gap-2.5 md:gap-3`}>
        {cards.map(card => {
          let roleClasses = 'bg-stone-800 text-stone-300 border-stone-600';
          let roleBadge = 'Neutralny';

          if (card.role === 'red') {
            roleClasses = 'bg-rose-600 text-white border-rose-400 font-black shadow-lg shadow-rose-600/30';
            roleBadge = 'Czerwoni';
          } else if (card.role === 'blue') {
            roleClasses = 'bg-blue-600 text-white border-blue-400 font-black shadow-lg shadow-blue-600/30';
            roleBadge = 'Niebiescy';
          } else if (card.role === 'green') {
            roleClasses = 'bg-emerald-600 text-white border-emerald-400 font-black shadow-lg shadow-emerald-600/30';
            roleBadge = 'Zieloni';
          } else if (card.role === 'assassin') {
            roleClasses = 'bg-black text-rose-400 border-rose-600 ring-2 ring-rose-600 font-black';
            roleBadge = 'Zabójca';
          }

          return (
            <div
              key={card.id}
              className={`relative flex flex-col items-center justify-center p-3 h-20 md:h-24 rounded-xl border text-center transition-all ${roleClasses} ${
                card.revealed ? 'opacity-40 grayscale-[50%]' : ''
              }`}
            >
              {card.revealed && (
                <div className="absolute top-1.5 right-1.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}

              {card.role === 'assassin' && (
                <Skull className="w-4 h-4 absolute top-1.5 left-1.5 text-rose-500" />
              )}

              <span className={`text-xs md:text-sm font-black tracking-wide break-words ${card.revealed ? 'line-through' : ''}`}>
                {card.word}
              </span>

              <span className="text-[10px] mt-1 font-semibold uppercase opacity-75">
                {roleBadge}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-slate-500">
        Aktualna tura: <strong className={turnColor}>{turnName}</strong>. Nie pokazuj tego ekranu zgadującym graczom!
      </div>
    </div>
  );
};
