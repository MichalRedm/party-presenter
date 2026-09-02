import { CalendarDays } from 'lucide-react';
import { ModuleDefinition } from '../../types/modules';
import { AgendaProjector } from './AgendaProjector';
import { AgendaEditor } from './AgendaEditor';
import { AgendaConfig } from './types';

export * from './types';

export const agendaModule: ModuleDefinition<AgendaConfig> = {
  id: 'agenda',
  name: 'Harmonogram (Agenda)',
  description: 'Przegląd całego programu imprezy z zaznaczonym aktualnym punktem i czasem',
  icon: CalendarDays,
  defaultConfig: {
    title: 'Harmonogram Imprezy',
    showEstimatedTimes: true,
    showDescription: true,
    highlightCurrent: true,
  },
  ProjectorComponent: AgendaProjector,
  AdminEditorComponent: AgendaEditor,
};
