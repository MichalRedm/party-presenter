import React, { useState } from 'react';
import { CodenamesConfig } from '../../types/codenames';
import { Textarea, Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { generateCodenamesBoard } from '../../services/codenamesGenerator';
import { Dices, RefreshCw } from 'lucide-react';

export const CodenamesEditor: React.FC<{
  config: CodenamesConfig;
  onChange: (updatedConfig: CodenamesConfig) => void;
}> = ({ config, onChange }) => {
  const [customWordsText, setCustomWordsText] = useState(
    (config.customWordBank || []).join('\n')
  );

  const handleApplyCustomWords = () => {
    const parsed = customWordsText
      .split(/[\n,]+/)
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length > 0);

    const freshBoard = generateCodenamesBoard(
      parsed,
      config.startingTeam,
      config.gameMode,
      config.hasAssassin !== false
    );
    onChange({
      ...freshBoard,
      customWordBank: parsed,
      initialTimerSeconds: config.initialTimerSeconds || 90,
      timerSeconds: config.initialTimerSeconds || 90,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Dices className="w-4 h-4 text-purple-400" />
          Ustawienia partii Tajniaków
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tryb gry"
            value={config.gameMode || 'standard'}
            options={[
              { value: 'standard', label: '2 drużyny (25 kart)' },
              { value: '3-team-elegant', label: '3 drużyny - elegancki (25 kart, 0 neutralnych)' },
              { value: '3-team-epic', label: '3 drużyny - epicki (36 kart)' },
            ]}
            onChange={e => {
              const newMode = e.target.value as 'standard' | '3-team-elegant' | '3-team-epic';
              const parsed = config.customWordBank || [];
              const freshBoard = generateCodenamesBoard(
                parsed,
                undefined,
                newMode,
                config.hasAssassin !== false
              );
              onChange({
                ...freshBoard,
                customWordBank: parsed,
                initialTimerSeconds: config.initialTimerSeconds || 90,
                timerSeconds: config.initialTimerSeconds || 90,
              });
            }}
          />

          <Select
            label="Karta Zabójcy"
            value={config.hasAssassin !== false ? 'yes' : 'no'}
            options={[
              { value: 'yes', label: 'Włączona (1 czarna karta)' },
              { value: 'no', label: 'Wyłączona (brak zabójcy na planszy)' },
            ]}
            onChange={e => {
              const hasAssassin = e.target.value === 'yes';
              const parsed = (config.customWordBank || []);
              const freshBoard = generateCodenamesBoard(
                parsed,
                config.startingTeam,
                config.gameMode,
                hasAssassin
              );
              onChange({
                ...freshBoard,
                customWordBank: parsed,
                initialTimerSeconds: config.initialTimerSeconds || 90,
                timerSeconds: config.initialTimerSeconds || 90,
              });
            }}
          />

          <Select
            label="Drużyna rozpoczynająca"
            value={config.startingTeam}
            options={config.gameMode && config.gameMode !== 'standard' ? [
              { value: 'red', label: 'Czerwoni' },
              { value: 'blue', label: 'Niebiescy' },
              { value: 'green', label: 'Zieloni' },
            ] : [
              { value: 'red', label: 'Czerwoni (9 haseł)' },
              { value: 'blue', label: 'Niebiescy (9 haseł)' },
            ]}
            onChange={e => onChange({ ...config, startingTeam: e.target.value as 'red' | 'blue' | 'green' })}
          />

          <Input
            label="Czas tury (w sekundach)"
            type="number"
            min="30"
            max="300"
            value={config.initialTimerSeconds || 90}
            onChange={e => {
              const sec = parseInt(e.target.value, 10) || 90;
              onChange({ ...config, initialTimerSeconds: sec, timerSeconds: sec, isTimerRunning: false, timerEndTime: null });
            }}
          />
        </div>

        <Button
          type="button"
          variant="glow"
          onClick={handleApplyCustomWords}
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Przetasuj i wygeneruj nową planszę
        </Button>
      </div>

      {/* Custom Words Bank Editor */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
          Własny bank słów (Personalizowane hasła o solenizancie/imprezie)
        </h4>
        <p className="text-xs text-slate-400">
          Wpisz słowa oddzielone przecinkami lub nową linią. Wszystkie słowa z własnego banku pojawią się na planszy w pierwszej kolejności, a wbudowany słownik uzupełni wyłącznie brakujące miejsca.
        </p>

        <Textarea
          rows={6}
          value={customWordsText}
          placeholder="MICHAŁ, URODZINY, TRZYDZIESTKA, TATRY, PIZZA, GITARA, KRAKÓW..."
          onChange={e => setCustomWordsText(e.target.value)}
        />

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleApplyCustomWords}
        >
          Zapisz słowa i wygeneruj planszę
        </Button>
      </div>
    </div>
  );
};
