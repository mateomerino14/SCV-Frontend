import ExpenseField from './ExpenseField';
import {COLORS} from '../../../constants';

export default {
  title: 'Expense/Atoms/ExpenseField',
  component: ExpenseField,
  parameters: {
    docs: {
      description: {
        component: 'Contenedor de un campo del formulario de gastos, con etiqueta, sufijo opcional (moneda) y mensaje de error.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    label: 'Monto',
    suffix: 'Bs',
  },
};

const input = <input className="flex-1 text-sm font-inter outline-none" style={{color: COLORS.text}} defaultValue="150.00" />;

export const Default = {
  args: {children: input},
};

export const WithError = {
  args: {children: input, error: 'El monto es requerido'},
};
