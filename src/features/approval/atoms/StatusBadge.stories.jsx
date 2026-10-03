import StatusBadge from './StatusBadge';
import {COLORS} from '../../../constants';

export default {
  title: 'Approval/Atoms/StatusBadge',
  component: StatusBadge,
  parameters: {
    docs: {
      description: {
        component: 'Etiqueta de estado con colores configurables, usada en las tablas de revisión.',
      },
    },
  },
  args: {
    label: 'Pendiente',
    backgroundColor: COLORS.backgroundHeader,
    color: COLORS.title,
  },
};

export const Default = {};

export const Rejected = {
  args: {label: 'Rechazado', backgroundColor: COLORS.error, color: COLORS.secondary},
};
