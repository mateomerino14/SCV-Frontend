import {useState} from 'react';
import InstallmentRateField from './InstallmentRateField';

export default {
  title: 'Expense/Molecules/InstallmentRateField',
  component: InstallmentRateField,
  parameters: {
    docs: {
      description: {
        component: 'Tipo de cambio de un tramo: se obtiene solo según la fecha del gasto; si la API no responde, permite ingresarlo a mano.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 340}}><Story /></div>],
  args: {
    currency: 'PEN',
    date: '2026-10-05',
  },
};

export const Automatic = {
  args: {rateStatus: 'ok', exchangeRate: '3.4502'},
};

export const Loading = {
  args: {rateStatus: 'loading'},
};

export const WithoutDate = {
  args: {rateStatus: 'nodate', date: ''},
};

export const Manual = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <InstallmentRateField {...args} rateStatus="manual" exchangeRate={value} onManualChange={setValue} />;
  },
};
