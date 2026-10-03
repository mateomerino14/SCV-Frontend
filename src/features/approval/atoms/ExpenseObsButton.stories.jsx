import ExpenseObsButton from './ExpenseObsButton';
import {COLORS} from '../../../constants';

export default {
  title: 'Approval/Atoms/ExpenseObsButton',
  component: ExpenseObsButton,
  parameters: {
    docs: {
      description: {
        component: 'Botón de observaciones de un gasto en las tablas de revisión; con observaciones se pinta en rojo y muestra la cantidad.',
      },
    },
  },
  args: {
    count: 0,
    accentColor: COLORS.title,
  },
};

export const WithoutObservations = {};

export const WithObservations = {
  args: {count: 3},
};
