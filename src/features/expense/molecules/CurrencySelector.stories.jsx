import {useState} from 'react';
import CurrencySelector from './CurrencySelector';
import {currencies} from '../../../constants/currencies';

export default {
  title: 'Expense/Molecules/CurrencySelector',
  component: CurrencySelector,
  parameters: {
    docs: {
      description: {
        component: 'Selector de la moneda de un tramo de cambio, con la lista compartida de monedas del sistema.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [currency, setCurrency] = useState('PEN');
    return (
      <div style={{width: 320}}>
        <CurrencySelector currencies={currencies} currency={currency} onChange={setCurrency} />
      </div>
    );
  },
};

export const WithError = {
  args: {currencies, currency: '', onChange: () => {}, error: 'Elige la moneda del tramo'},
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
};
