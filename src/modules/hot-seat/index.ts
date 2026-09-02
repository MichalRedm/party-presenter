import { Flame } from 'lucide-react';
import { ModuleDefinition } from '../../types/modules';
import { HotSeatProjector } from './HotSeatProjector';
import { HotSeatEditor } from './HotSeatEditor';
import { HotSeatRemote } from './HotSeatRemote';
import { HotSeatConfig } from '../../types/hotseat';

export const hotSeatModule: ModuleDefinition<HotSeatConfig> = {
  id: 'hot-seat',
  name: 'Gorące Krzesło (Pytania i Wyzwania)',
  description: 'Losowanie pytań i wyzwań zebranych przez Formularz Google z trybem ślepego importu',
  icon: Flame,
  defaultConfig: {
    categories: ['Pytania o solenizanta', 'Wyzwania i zadania', 'Wspomnienia i anegdoty', 'Pytania bez cenzury', 'Głupie pytania'],
    selectedCategory: 'all',
    activeQuestionId: null,
    blindImportMode: true,
    spinDurationMs: 2500,
    questions: [],
  },
  ProjectorComponent: HotSeatProjector,
  AdminEditorComponent: HotSeatEditor,
  AdminRemoteComponent: HotSeatRemote,
};
