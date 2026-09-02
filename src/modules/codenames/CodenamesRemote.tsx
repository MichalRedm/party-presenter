import React, { useState } from 'react';
import { useParty } from '../../context/PartyContext';
import { CodenamesConfig } from '../../types/codenames';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Play, Pause, RotateCcw, Sparkles, ExternalLink, KeyRound, Eye, EyeOff } from 'lucide-react';
import { CodenamesSpymaster } from './CodenamesSpymaster';

export const CodenamesRemote: React.FC<{
  config: CodenamesConfig;
  onChange: (updatedConfig: CodenamesConfig) => void;
}> = ({ config }) => {
  const { activeItem, codenamesAction } = useParty();
  const [clueWord, setClueWord] = useState('');
  const [clueCount, setClueCount] = useState(1);
  const [showSpymasterKey, setShowSpymasterKey] = useState(false);

  if (!activeItem) return null;

  const handleSetClue = () => {
    if (!clueWord.trim()) return;
    codenamesAction(activeItem.id, 'update_clue', { clueWord: clueWord.trim(), clueCount });
    setClueWord('');
  };

  return (
    <div className="space-y-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Szybkie sterowanie Tajniakami
        </h4>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSpymasterKey(!showSpymasterKey)}
            icon={showSpymasterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          >
            {showSpymasterKey ? 'Ukryj klucz' : 'Podejrzyj klucz'}
          </Button>

          <a
            href="/spymaster"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Otwórz /spymaster w nowej karcie
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>

      {/* Main Quick Action Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Next Turn */}
        <Button
          variant="primary"
          onClick={() => codenamesAction(activeItem.id, 'next_turn')}
          className="w-full"
        >
          Zmień turę ({config.currentTurn === 'red' ? 'Niebiescy' : 'Czerwoni'})
        </Button>

        {/* Timer toggle */}
        <Button
          variant="secondary"
          onClick={() => codenamesAction(activeItem.id, 'toggle_timer')}
          icon={config.isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          className="w-full"
        >
          {config.isTimerRunning ? 'Pauza stoper' : 'Start stoper'} ({config.timerSeconds}s)
        </Button>

        {/* Reset timer */}
        <Button
          variant="secondary"
          onClick={() => codenamesAction(activeItem.id, 'reset_timer')}
          icon={<RotateCcw className="w-4 h-4" />}
          className="w-full"
        >
          Resetuj czas
        </Button>

        {/* New Game */}
        <Button
          variant="outline"
          onClick={() => {
            if (window.confirm('Czy na pewno chcesz wygenerować nową planszę Tajniaków?')) {
              codenamesAction(activeItem.id, 'new_game');
            }
          }}
          className="w-full text-amber-300 hover:text-amber-200 border-amber-500/30"
        >
          Nowa runda
        </Button>
      </div>

      {/* Clue Setter */}
      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            value={clueWord}
            placeholder="Wpisz podpowiedź (np. KOSMOS)"
            onChange={e => setClueWord(e.target.value)}
          />
        </div>
        <div className="w-24">
          <Input
            type="number"
            min="1"
            max="9"
            value={clueCount}
            onChange={e => setClueCount(parseInt(e.target.value, 10) || 1)}
          />
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={handleSetClue}
          disabled={!clueWord.trim()}
        >
          Wyświetl podpowiedź
        </Button>
      </div>

      {/* Embedded Spymaster Key preview toggle */}
      {showSpymasterKey && (
        <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/40 animate-in fade-in">
          <CodenamesSpymaster config={config} />
        </div>
      )}
    </div>
  );
};
