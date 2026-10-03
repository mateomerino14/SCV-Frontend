import {Plane} from 'lucide-react';
import TripStatCard from './TripStatCard';
import {COLORS} from '../../../constants';

export default {
  title: 'Admin/Molecules/TripStatCard',
  component: TripStatCard,
  parameters: {
    docs: {
      description: {
        component: 'Indicador compacto del panel del administrador: ícono, cantidad y descripción.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 240}}><Story /></div>],
  args: {
    icon: Plane,
    label: 'Viajes en curso',
    value: 14,
    color: COLORS.primary,
    bg: COLORS.error,
  },
};

export const Default = {};
