import {useState} from 'react';
import ForeignCurrencyFields from './ForeignCurrencyFields';
import {currencies} from '../../../constants/currencies';

export default {
  title: 'Expense/Molecules/ForeignCurrencyFields',
  component: ForeignCurrencyFields,
  parameters: {
    docs: {
      description: {
        component: 'Moneda de la factura de un gasto internacional y cómo se rinde: en USD, en Bs o con ambos tipos de cambio. Solo pide el tipo de cambio que hace falta.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [currency, setCurrency] = useState('PEN');
    const [exchangeRate, setExchangeRate] = useState('1.85');
    const [bsRate, setBsRate] = useState('6.96');
    const [renditionMode, setRenditionMode] = useState('BOB');
    return (
      <div style={{width: 360}}>
        <ForeignCurrencyFields currencies={currencies} currency={currency} exchangeRate={exchangeRate} bsRate={bsRate} amount={170}
          onCurrencyChange={setCurrency} onExchangeRateChange={setExchangeRate} onBsRateChange={setBsRate}
          renditionMode={renditionMode} onRenditionModeChange={setRenditionMode} />
      </div>
    );
  },
};

export const WithErrors = {
  args: {currencies, currency: 'PEN', exchangeRate: '', bsRate: '', amount: 170, errors: {exchangeRate: 'El tipo de cambio es requerido', bsRate: 'El tipo de cambio a bolivianos es requerido'},
    onCurrencyChange: () => {}, onExchangeRateChange: () => {}, onBsRateChange: () => {}},
  decorators: [(Story) => <div style={{width: 360}}><Story /></div>],
};

export const BsFundInUsd = {
  name: 'En USD con fondo solo en Bs',
  args: {currencies, currency: 'CLP', exchangeRate: '920', bsRate: '6.96', amount: 18400, renditionMode: 'USD', tripHasUsdFund: false,
    onCurrencyChange: () => {}, onExchangeRateChange: () => {}, onBsRateChange: () => {}, onRenditionModeChange: () => {}},
  decorators: [(Story) => <div style={{width: 360}}><Story /></div>],
};
