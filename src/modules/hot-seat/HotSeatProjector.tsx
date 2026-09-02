import React, { useState, useEffect } from 'react';
import { useParty } from '../../context/PartyContext';
import { HotSeatConfig } from '../../types/hotseat';
import { Flame, Dices, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const HotSeatProjector: React.FC<{
  config: HotSeatConfig;
  isActive: boolean;
}> = ({ config }) => {
  const { activeItem, hotseatAction } = useParty();
  const {
    questions = [],
    selectedCategory = 'all',
    activeQuestionId = null,
  } = config;

  const [isSpinning, setIsSpinning] = useState(false);
  const [animatedQuestionText, setAnimatedQuestionText] = useState<string>('');

  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  // Filter available questions
  const availableQuestions = questions.filter(q => {
    if (q.used) return false;
    if (selectedCategory === 'all') return true;
    return q.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const totalInCategory = questions.filter(q => {
    if (selectedCategory === 'all') return true;
    return q.category.toLowerCase() === selectedCategory.toLowerCase();
  }).length;

  const usedInCategory = totalInCategory - availableQuestions.length;

  const handleDraw = () => {
    if (!activeItem || availableQuestions.length === 0 || isSpinning) return;
    setIsSpinning(true);

    // Slot machine roulette effect cycling through random texts
    let count = 0;
    const interval = setInterval(() => {
      count++;
      const randomQ = questions[Math.floor(Math.random() * questions.length)];
      if (randomQ) {
        setAnimatedQuestionText(randomQ.question);
      }
      if (count > 15) {
        clearInterval(interval);
        setIsSpinning(false);
        hotseatAction(activeItem.id, 'draw');
      }
    }, 90);
  };

  const handleMarkUsed = () => {
    if (!activeItem || !activeQuestionId) return;
    hotseatAction(activeItem.id, 'mark_used', { questionId: activeQuestionId });
  };

  useEffect(() => {
    if (activeQuestion) {
      setAnimatedQuestionText(activeQuestion.question);
    }
  }, [activeQuestion]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-8 md:p-14 max-w-6xl mx-auto z-10 select-none">
      {/* Top Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-sm font-bold tracking-widest uppercase shadow-lg shadow-rose-500/20">
          <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
          <span>GORĄCE KRZESŁO</span>
        </div>

        {/* Selected Category Pill */}
        <div className="flex items-center gap-3">
          <Badge variant="purple" size="md" className="px-4 py-1.5 text-sm">
            Kategoria: {selectedCategory === 'all' ? 'Wszystkie kategorie' : selectedCategory}
          </Badge>

          <span className="text-sm font-bold text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10">
            Wykorzystano: {usedInCategory} / {totalInCategory}
          </span>
        </div>
      </div>

      {/* Main Center Card (Question Display / Roulette) */}
      <div className="w-full my-auto flex flex-col items-center justify-center">
        <div className={`relative w-full max-w-4xl min-h-[320px] md:min-h-[380px] p-8 md:p-14 rounded-3xl backdrop-blur-2xl border flex flex-col items-center justify-center text-center transition-all duration-500 shadow-2xl ${
          isSpinning
            ? 'bg-purple-950/80 border-purple-500 ring-4 ring-purple-500/40 shadow-purple-600/50 scale-[1.02]'
            : activeQuestion
            ? 'bg-slate-900/85 border-white/20 shadow-black/80'
            : 'bg-slate-900/50 border-white/10'
        }`}>
          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 rounded-3xl blur-xl opacity-20 pointer-events-none" />

          {isSpinning ? (
            <div className="space-y-4 animate-pulse">
              <Dices className="w-16 h-16 text-purple-400 mx-auto animate-spin" />
              <p className="text-2xl md:text-4xl font-black text-purple-200 tracking-wide line-clamp-3">
                {animatedQuestionText || 'Losowanie pytania...'}
              </p>
            </div>
          ) : activeQuestion ? (
            <div className="relative z-10 flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 duration-300">
              {/* Category & Author pill */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge variant="amber" size="md" className="text-xs">
                  {activeQuestion.category}
                </Badge>
                {activeQuestion.author && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300 border border-white/10">
                    <User className="w-3.5 h-3.5 text-purple-300" />
                    Kto pyta: <strong className="text-white">{activeQuestion.author}</strong>
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-snug drop-shadow-lg max-w-3xl">
                "{activeQuestion.question}"
              </h2>
            </div>
          ) : (
            <div className="space-y-4 text-slate-400">
              <Sparkles className="w-16 h-16 text-slate-500 mx-auto" />
              <p className="text-2xl md:text-3xl font-bold text-slate-300">
                {availableQuestions.length > 0
                  ? 'Kliknij „Wylosuj pytanie”, aby rozpocząć rundę!'
                  : 'Brak dostępnych pytań w tej kategorii.'}
              </p>
              <p className="text-sm text-slate-500">
                Pozostało {availableQuestions.length} pytań do wylosowania.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant="glow"
          size="xl"
          onClick={handleDraw}
          disabled={isSpinning || availableQuestions.length === 0}
          icon={<Dices className="w-6 h-6" />}
          className="px-10 py-4 text-xl"
        >
          {isSpinning ? 'Losowanie...' : 'Wylosuj pytanie 🎲'}
        </Button>

        {activeQuestion && (
          <Button
            variant="secondary"
            size="lg"
            onClick={handleMarkUsed}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          >
            Oznacz jako odpowiedziane
          </Button>
        )}
      </div>
    </div>
  );
};
