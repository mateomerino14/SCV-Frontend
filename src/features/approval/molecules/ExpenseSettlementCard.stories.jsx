import ExpenseSettlementCard from './ExpenseSettlementCard';

export default {
  title: 'Approval/Molecules/ExpenseSettlementCard',
  component: ExpenseSettlementCard,
  parameters: {
    docs: {
      description: {
        component: 'Resultado de la rendición para el revisor: saldo a devolver o exceso a reembolsar por moneda, con las justificaciones de los días excedidos.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 380}}><Story /></div>],
};

export const National = {
  args: {amount: 250, exceeds: false, isInternational: false},
};

export const InternationalWithExcess = {
  args: {
    amount: 80,
    exceeds: false,
    isInternational: true,
    amountUsd: 35,
    exceedsUsd: true,
    exceededDays: [{fecha: '2026-10-08', montoBs: 0, montoUsd: 95, excedeBs: false, excedeUsd: true}],
    dayJustifications: {'2026-10-08': 'Cena de trabajo con el cliente en Lima.'},
  },
};
