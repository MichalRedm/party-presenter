import { ModuleDefinition, ModuleRegistry } from '../types/modules';
import { agendaModule } from './agenda';
import { textSlideModule } from './text-slide';
import { slideshowModule } from './slideshow';
import { countdownModule } from './countdown';
import { codenamesModule } from './codenames';
import { hotSeatModule } from './hot-seat';

export const MODULE_REGISTRY: ModuleRegistry = {
  agenda: agendaModule,
  'text-slide': textSlideModule,
  slideshow: slideshowModule,
  countdown: countdownModule,
  codenames: codenamesModule,
  'hot-seat': hotSeatModule,
};

export function getModuleDefinition(type: string): ModuleDefinition<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  return MODULE_REGISTRY[type] || MODULE_REGISTRY['text-slide'];
}

export function getAllAvailableModules(): ModuleDefinition<any>[] { // eslint-disable-line @typescript-eslint/no-explicit-any
  return Object.values(MODULE_REGISTRY);
}
