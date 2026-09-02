import React from 'react';
import { useParty } from '../../context/PartyContext';
import { HotSeatConfig } from '../../types/hotseat';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Dices, CheckCircle2, RotateCcw, Flame } from 'lucide-react';

export const HotSeatRemote: React.FC<{
  config: HotSeatConfig;
  onChange: (updatedConfig: HotSeatConfig) => void;
}> = ({ config }) => {
  const { activeItem, hotseatAction } = useParty();

  if (!activeItem) return null;

  const categories = config.categories || [];
  const questions = config.questions || [];
  const selectedCat = config.selectedCategory || 'all';

  const categoryOptions = [
    { value: 'all', label: `Wszystkie kategorie (${questions.filter(q => !q.used).length} do losowania)` },
    ...categories.map(cat => ({
      value: cat,
      label: `${cat} (${questions.filter(q => q.category === cat && !q.used).length} do losowania)`,
    })),
  ];

  const availableCount = questions.filter(q => {
    if (q.used) return false;
    if (selectedCat === 'all') return true;
    return q.category.toLowerCase() === selectedCat.toLowerCase();
  }).length;

  return (
    <div className="space-y-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500" />
          Szybkie sterowanie Gorącym Krzesłem
        </h4>

        <span className="text-xs font-semibold text-slate-400">
          Dostępnych pytań: <strong className="text-purple-300">{availableCount}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Category selector */}
        <Select
          value={selectedCat}
          options={categoryOptions}
          onChange={e => hotseatAction(activeItem.id, 'select_category', { category: e.target.value })}
        />

        {/* Draw question */}
        <Button
          variant="glow"
          onClick={() => hotseatAction(activeItem.id, 'draw')}
          disabled={availableCount === 0}
          icon={<Dices className="w-4 h-4" />}
          className="w-full"
        >
          Wylosuj pytanie
        </Button>

        {/* Mark Used */}
        <Button
          variant="secondary"
          onClick={() => {
            if (config.activeQuestionId) {
              hotseatAction(activeItem.id, 'mark_used', { questionId: config.activeQuestionId });
            }
          }}
          disabled={!config.activeQuestionId}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          className="w-full"
        >
          Oznacz jako zużyte
        </Button>
      </div>

      {/* Reset all */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
        <span>Zresetuj status pytań, aby móc losować je ponownie:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (window.confirm('Czy na pewno chcesz odblokować wszystkie pytania?')) {
              hotseatAction(activeItem.id, 'reset_used');
            }
          }}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Resetuj zużyte pytania
        </Button>
      </div>
    </div>
  );
};
