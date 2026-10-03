import {Clock} from 'lucide-react';
import PhaseTotalCard from './PhaseTotalCard';
import {COLORS} from '../../../constants';

export default {
  title: 'Admin/Molecules/PhaseTotalCard',
  component: PhaseTotalCard,
  parameters: {
    docs: {
      description: {
        component: 'Tarjeta del panel del administrador con el total de viajes de una fase.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    icon: Clock,
    title: 'Aprobación de Viaje',
    subtitle: 'Viajes esperando aprobación previa',
    total: 8,
    color: COLORS.primary,
    bg: COLORS.error,
  },
};

export const Default = {};
