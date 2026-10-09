import {useState} from 'react';
import {Wallet} from 'lucide-react';
import TripAmountInput from './TripAmountInput';

export default {
  title: 'Trip/Atoms/TripAmountInput',
  component: TripAmountInput,
  parameters: {
    docs: {
      description: {
        component: 'Campo de monto del registro de viaje, con ícono y la moneda a la derecha.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{width: 300}}>
        <TripAmountInput label="Monto solicitado (Bs)" icon={Wallet} value={value} currency="Bs" onChange={setValue} />
      </div>
    );
  },
};

export const WithError = {
  args: {label: 'Monto solicitado (Bs)', icon: Wallet, value: '1500', currency: 'Bs', error: 'No puede superar el tope de 1200.00 Bs', onChange: () => {}},
  decorators: [(Story) => <div style={{width: 300}}><Story /></div>],
};
