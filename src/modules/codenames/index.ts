import { Grid } from 'lucide-react';
import { ModuleDefinition } from '../../types/modules';
import { CodenamesProjector } from './CodenamesProjector';
import { CodenamesEditor } from './CodenamesEditor';
import { CodenamesRemote } from './CodenamesRemote';
import { CodenamesSpymaster } from './CodenamesSpymaster';
import { CodenamesConfig } from '../../types/codenames';
import { generateCodenamesBoard } from '../../services/codenamesGenerator';

export const codenamesModule: ModuleDefinition<CodenamesConfig> = {
  id: 'codenames',
  name: 'Wielka Gra w Tajniaków (Codenames)',
  description: 'Siatka 5x5, drużyny Czerwoni vs Niebiescy, stoper, punktacja i klucz kapitanów na /spymaster',
  icon: Grid,
  defaultConfig: generateCodenamesBoard(),
  ProjectorComponent: CodenamesProjector,
  AdminEditorComponent: CodenamesEditor,
  AdminRemoteComponent: CodenamesRemote,
  SpymasterComponent: CodenamesSpymaster,
};
