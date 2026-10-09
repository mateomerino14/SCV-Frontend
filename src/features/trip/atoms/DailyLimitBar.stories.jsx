import DailyLimitBar from './DailyLimitBar';

export default {
  title: 'Trip/Atoms/DailyLimitBar',
  component: DailyLimitBar,
  parameters: {
    docs: {
      description: {
        component: 'Barra del gasto de un día contra el límite diario de una moneda: verde dentro del límite, ámbar desde el 80% y roja cuando lo supera.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    currency: 'Bs',
    amount: 120,
    limit: 250,
  },
};

export const WithinLimit = {};

export const NearLimit = {
  args: {amount: 220},
};

export const Exceeded = {
  args: {amount: 320},
};

export const Usd = {
  args: {currency: 'USD', amount: 45, limit: 80},
};
