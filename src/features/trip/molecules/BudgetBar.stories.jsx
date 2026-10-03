import BudgetBar from './BudgetBar';

export default {
  title: 'Trip/Molecules/BudgetBar',
  component: BudgetBar,
  parameters: {
    docs: {
      description: {
        component: 'Barra de presupuesto del empleado durante el viaje; en rojo cuando supera el monto asignado.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    accumulatedExpense: 800,
    assignedAmount: 2000,
    isUsd: false,
  },
};

export const Default = {};

export const Exceeded = {
  args: {accumulatedExpense: 2150},
};
