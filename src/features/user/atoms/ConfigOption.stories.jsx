import {KeyRound} from 'lucide-react';
import ConfigOption from './ConfigOption';

export default {
  title: 'User/Atoms/ConfigOption',
  component: ConfigOption,
  parameters: {
    docs: {
      description: {
        component: 'Opción de la pantalla de ajustes que abre otra acción (por ejemplo, cambiar la contraseña).',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 340}}><Story /></div>],
  args: {
    icon: KeyRound,
    label: 'Cambiar Contraseña',
  },
};

export const Default = {};
