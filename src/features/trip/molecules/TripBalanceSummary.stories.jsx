import TripBalanceSummary from './TripBalanceSummary';

export default {
  title: 'Trip/Molecules/TripBalanceSummary',
  component: TripBalanceSummary,
  parameters: {
    docs: {
      description: {
        component: 'Balance del viaje: fondo recibido, gasto y saldo a devolver o exceso a reembolsar, por moneda.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 340}}><Story /></div>],
  args: {
    trip: {monto_asignado: '2000', monto_asignado_usd: '400'},
    accumulatedExpense: 1750,
    accumulatedExpenseUsd: 0,
    exceedsBudget: false,
    exceedsBudgetUsd: false,
    isInternational: false,
  },
};

export const National = {};

export const InternationalWithExcess = {
  args: {isInternational: true, accumulatedExpenseUsd: 460, exceedsBudgetUsd: true},
};
