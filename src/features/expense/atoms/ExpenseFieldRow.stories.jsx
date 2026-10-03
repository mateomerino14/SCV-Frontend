import {Calendar, Wallet} from 'lucide-react';
import ExpenseFieldRow from './ExpenseFieldRow';

export default {
  title: 'Expense/Atoms/ExpenseFieldRow',
  component: ExpenseFieldRow,
  parameters: {
    docs: {
      description: {
        component: 'Fila de dato de solo lectura en el detalle de un gasto: ícono, etiqueta y valor.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    icon: Calendar,
    label: 'Fecha',
    value: '15/09/2026',
  },
};

export const Default = {};

export const Last = {
  args: {icon: Wallet, label: 'Monto', value: '150.00 Bs', last: true},
};
