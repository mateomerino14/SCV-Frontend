import TripBalanceRow from './TripBalanceRow';
import {COLORS} from '../../../constants';

export default {
  title: 'Trip/Atoms/TripBalanceRow',
  component: TripBalanceRow,
  parameters: {
    docs: {
      description: {
        component: 'Fila del balance de un viaje: concepto a la izquierda y monto a la derecha.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    label: 'Saldo a devolver',
    value: '250.00 Bs',
    color: COLORS.title,
  },
};

export const Default = {};

export const Excess = {
  args: {label: 'Exceso a reembolsar', value: '80.00 Bs', color: COLORS.secondary},
};
