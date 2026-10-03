import ExpenseBudgetBar from './ExpenseBudgetBar';

export default {
  title: 'Approval/Molecules/ExpenseBudgetBar',
  component: ExpenseBudgetBar,
  parameters: {
    docs: {
      description: {
        component: 'Barra de presupuesto gastado en la revisión de una rendición; en rojo cuando llega al límite.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    accumulated: 1200,
    assignedAmount: 2000,
    isUsd: false,
  },
};

export const Default = {};

export const Exceeded = {
  args: {accumulated: 2300},
};

export const International = {
  args: {accumulated: 150, assignedAmount: 400, isUsd: true},
};
