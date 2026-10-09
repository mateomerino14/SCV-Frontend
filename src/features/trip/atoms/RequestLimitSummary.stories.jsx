import RequestLimitSummary from './RequestLimitSummary';

export default {
  title: 'Trip/Atoms/RequestLimitSummary',
  component: RequestLimitSummary,
  parameters: {
    docs: {
      description: {
        component: 'Cálculo del tope de un viaje en una moneda: días por tarifa diaria más el hospedaje estimado.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 300}}><Story /></div>],
  args: {
    days: 4,
    dailyRate: 300,
    reference: 1200,
    lodging: '600',
    limit: 1800,
    currency: 'Bs',
  },
};

export const Default = {};

export const Usd = {
  args: {dailyRate: 40, reference: 160, lodging: '120', limit: 280, currency: 'USD'},
};
