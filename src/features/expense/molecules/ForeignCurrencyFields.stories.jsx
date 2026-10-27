import {useState} from 'react';
import ForeignCurrencyFields from './ForeignCurrencyFields';
import {currencies} from '../../../constants/currencies';

export default {
  title: 'Expense/Molecules/ForeignCurrencyFields',
  component: ForeignCurrencyFields,
  parameters: {
    docs: {
      description: {
        component: 'Moneda de la factura y tipos de cambio de un gasto internacional: pasa el monto a USD y a Bs con los tipos de cambio que escribe el empleado.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [currency, setCurrency] = useState('PEN');
    const [exchangeRate, setExchangeRate] = useState('3.78');
    const [bsRate, setBsRate] = useState('6.96');
    return (
      <div style={{width: 360}}>
        <ForeignCurrencyFields currencies={currencies} currency={currency} exchangeRate={exchangeRate} bsRate={bsRate} amount={170}
          onCurrencyChange={setCurrency} onExchangeRateChange={setExchangeRate} onBsRateChange={setBsRate} />
      </div>
    );
  },
};

export const WithErrors = {
  args: {currencies, currency: 'PEN', exchangeRate: '', bsRate: '', amount: 170, errors: {exchangeRate: 'El tipo de cambio es requerido', bsRate: 'El tipo de cambio a bolivianos es requerido'},
    onCurrencyChange: () => {}, onExchangeRateChange: () => {}, onBsRateChange: () => {}},
  decorators: [(Story) => <div style={{width: 360}}><Story /></div>],
};
