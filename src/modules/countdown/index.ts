import { Timer } from 'lucide-react';
import { ModuleDefinition } from '../../types/modules';
import { CountdownProjector, CountdownConfig } from './CountdownProjector';
import { CountdownEditor } from './CountdownEditor';

export const countdownModule: ModuleDefinition<CountdownConfig> = {
  id: 'countdown',
  name: 'Wielkie Odliczanie (Countdown)',
  description: 'Wielki stoper odliczający do danej godziny (np. północ, toast, tort) z konfetti',
  icon: Timer,
  defaultConfig: {
    targetTime: '00:00',
    label: 'Wielkie Odliczanie',
    celebrateOnZero: true,
    celebrationText: 'STO LAT! 🎉🥂🎂',
  },
  ProjectorComponent: CountdownProjector,
  AdminEditorComponent: CountdownEditor,
};
