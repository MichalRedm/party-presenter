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

    const freshBoard = generateCodenamesBoard(parsed, config.startingTeam);
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
            label="Drużyna rozpoczynająca"
            value={config.startingTeam}
            options={[
              { value: 'red', label: 'Czerwoni (9 haseł)' },
              { value: 'blue', label: 'Niebiescy (9 haseł)' },
            ]}
            onChange={e => onChange({ ...config, startingTeam: e.target.value as 'red' | 'blue' })}
          />

          <Input
            label="Czas tury (w sekundach)"
            type="number"
            min="30"
            max="300"
            value={config.initialTimerSeconds || 90}
            onChange={e => {
              const sec = parseInt(e.target.value, 10) || 90;
              onChange({ ...config, initialTimerSeconds: sec, timerSeconds: sec });
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
          Wpisz słowa oddzielone przecinkami lub nową linią. Aplikacja połączy je z wbudowanym polskim słownikiem (ponad 250 słów).
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
