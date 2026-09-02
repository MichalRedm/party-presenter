import { Type } from 'lucide-react';
import { ModuleDefinition } from '../../types/modules';
import { TextSlideProjector, TextSlideConfig } from './TextSlideProjector';
import { TextSlideEditor } from './TextSlideEditor';

export const textSlideModule: ModuleDefinition<TextSlideConfig> = {
  id: 'text-slide',
  name: 'Slajd Tekstowy / Ogłoszenie',
  description: 'Wielki, czytelny tekst z tytułem, podtytułem, zdjęciem w tle i etykietą',
  icon: Type,
  defaultConfig: {
    title: 'Witajcie na Imprezie!',
    subtitle: 'Rozgośćcie się i bawcie świetnie!',
    body: 'Życzymy udanej zabawy i niezapomnianej nocy!',
    tag: 'IMPREZA 🎉',
    bgOpacity: 0.4,
    bgBlur: 0,
    textAlign: 'center',
  },
  ProjectorComponent: TextSlideProjector,
  AdminEditorComponent: TextSlideEditor,
};
