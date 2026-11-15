import {useState} from 'react';
import CountrySelector from './CountrySelector';

export default {
  title: 'Trip/Molecules/CountrySelector',
  component: CountrySelector,
  parameters: {
    docs: {
      description: {
        component: 'País de destino de un viaje internacional: cada país muestra su clase de la escala de viáticos (1 o 2) y su región.',
      },
    },
  },
};

const Template = (args) => {
  const [value, setValue] = useState(args.value);
  return <div style={{maxWidth: 420}}><CountrySelector {...args} value={value} onChange={setValue} /></div>;
};

export const SinElegir = Template.bind({});
SinElegir.args = {value: ''};

export const PaisClaseDos = Template.bind({});
PaisClaseDos.args = {value: 'Perú'};

export const ConError = Template.bind({});
ConError.args = {value: '', error: 'Elige el país de destino'};
