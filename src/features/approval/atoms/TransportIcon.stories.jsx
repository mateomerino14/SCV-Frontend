import TransportIcon from './TransportIcon';
import {COLORS} from '../../../constants';

export default {
  title: 'Approval/Atoms/TransportIcon',
  component: TransportIcon,
  parameters: {
    docs: {
      description: {
        component: 'Ícono del medio de transporte: avión para aéreo, auto para terrestre y flecha para los demás.',
      },
    },
  },
  argTypes: {
    transport: {control: 'select', options: ['Aéreo', 'Terrestre', 'Vehículo de Empresa']},
  },
  args: {
    transport: 'Aéreo',
    size: 24,
    color: COLORS.primary,
  },
};

export const Air = {};

export const Ground = {
  args: {transport: 'Terrestre'},
};

export const Other = {
  args: {transport: 'Vehículo de Empresa'},
};
