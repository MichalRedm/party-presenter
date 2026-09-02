import React from 'react';
import { Input } from '../../components/ui/Input';
import { Toggle } from '../../components/ui/Toggle';
import { AgendaConfig } from './types';

export const AgendaEditor: React.FC<{
  config: AgendaConfig;
  onChange: (updatedConfig: AgendaConfig) => void;
}> = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <Input
        label="Tytuł slajdu harmonogramu"
        value={config.title || ''}
        placeholder="np. Harmonogram Imprezy"
        onChange={e => onChange({ ...config, title: e.target.value })}
      />

      <div className="space-y-4 pt-2 border-t border-slate-800">
        <Toggle
          checked={config.showEstimatedTimes !== false}
          onChange={checked => onChange({ ...config, showEstimatedTimes: checked })}
          label="Pokazuj zaplanowane godziny"
          description="Wyświetla ikonę zegara i zaplanowaną godzinę przy każdym punkcie"
        />

        <Toggle
          checked={config.showDescription !== false}
          onChange={checked => onChange({ ...config, showDescription: checked })}
          label="Pokazuj opisy punktów programu"
          description="Wyświetla krótkie notatki wprowadzone do poszczególnych punktów"
        />

        <Toggle
          checked={config.highlightCurrent !== false}
          onChange={checked => onChange({ ...config, highlightCurrent: checked })}
          label="Wyróżniaj aktualny punkt (TERAZ)"
          description="Podświetla pozycję, która jest w danym momencie aktywna"
        />
      </div>
    </div>
  );
};
