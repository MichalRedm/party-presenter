import React from 'react';
import { Input } from '../../components/ui/Input';
import { Toggle } from '../../components/ui/Toggle';
import { CountdownConfig } from './CountdownProjector';

export const CountdownEditor: React.FC<{
  config: CountdownConfig;
  onChange: (updatedConfig: CountdownConfig) => void;
}> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <Input
        label="Godzina docelowa (HH:mm lub ISO)"
        value={config.targetTime || '00:00'}
        placeholder="00:00 lub 23:30"
        onChange={e => onChange({ ...config, targetTime: e.target.value })}
        helperText="Wpisz np. 00:00 (północ), 21:30 lub inną wybraną godzinę"
      />

      <Input
        label="Etykieta licznika"
        value={config.label || ''}
        placeholder="np. Wielkie Odliczanie do Północy"
        onChange={e => onChange({ ...config, label: e.target.value })}
      />

      <Input
        label="Napis gratulacyjny po wybiciu 00:00"
        value={config.celebrationText || ''}
        placeholder="np. STO LAT! STO LAT! 🎂🍾🎉"
        onChange={e => onChange({ ...config, celebrationText: e.target.value })}
      />

      <div className="pt-2 border-t border-slate-800">
        <Toggle
          checked={config.celebrateOnZero !== false}
          onChange={checked => onChange({ ...config, celebrateOnZero: checked })}
          label="Automatyczne konfetti i fanfary po osiągnięciu zera"
          description="Uruchamia wystrzał konfetti oraz radosną fanfarę victory"
        />
      </div>
    </div>
  );
};
