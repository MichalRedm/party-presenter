import { Images } from 'lucide-react';
import { ModuleDefinition } from '../../types/modules';
import { SlideshowProjector, SlideshowConfig } from './SlideshowProjector';
import { SlideshowEditor } from './SlideshowEditor';

export const slideshowModule: ModuleDefinition<SlideshowConfig> = {
  id: 'slideshow',
  name: 'Pokaz Zdjęć (Slideshow)',
  description: 'Galeria wspomnień i zdjęć z automatycznym lub ręcznym przewijaniem',
  icon: Images,
  defaultConfig: {
    images: [],
    intervalSeconds: 6,
    autoPlay: true,
    transitionEffect: 'fade',
  },
  ProjectorComponent: SlideshowProjector,
  AdminEditorComponent: SlideshowEditor,
};
