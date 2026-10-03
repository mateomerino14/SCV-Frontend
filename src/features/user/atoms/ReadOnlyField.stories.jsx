import {Mail} from 'lucide-react';
import ReadOnlyField from './ReadOnlyField';

export default {
  title: 'User/Atoms/ReadOnlyField',
  component: ReadOnlyField,
  parameters: {
    docs: {
      description: {
        component: 'Dato del perfil que el usuario no puede editar; sin valor muestra un guion.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    icon: Mail,
    label: 'Correo Corporativo',
    value: 'maria.supervisora@maxam.com',
  },
};

export const Default = {};

export const Empty = {
  args: {value: ''},
};
