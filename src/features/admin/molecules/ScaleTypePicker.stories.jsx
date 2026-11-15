import {useState} from 'react';
import ScaleTypePicker from './ScaleTypePicker';

export default {
  title: 'Admin/Molecules/ScaleTypePicker',
  component: ScaleTypePicker,
  parameters: {
    docs: {
      description: {
        component: 'Elige el tipo de la escala de viáticos (A, B, C u otro tipo agregado) de un cargo; cada opción muestra sus tarifas y el hospedaje permitido.',
      },
    },
  },
};

const scale = [
  {tipo: 'C', descripcion: 'Gerente General y Gerentes de Área', monto_interior: 460, monto_clase_1_usd: 345, monto_clase_2_usd: 280, hospedaje: 'Hasta 5 estrellas'},
  {tipo: 'B', descripcion: 'Jefes de Área', monto_interior: 340, monto_clase_1_usd: 280, monto_clase_2_usd: 230, hospedaje: 'Hasta 3 estrellas'},
  {tipo: 'A', descripcion: 'Personal no comprendido en las anteriores categorías', monto_interior: 230, monto_clase_1_usd: 230, monto_clase_2_usd: 170, hospedaje: 'Hasta 3 estrellas'},
];

const Template = (args) => {
  const [value, setValue] = useState(args.value);
  return <div style={{maxWidth: 380}}><ScaleTypePicker {...args} value={value} onChange={setValue} /></div>;
};

export const SinElegir = Template.bind({});
SinElegir.args = {scale, value: ''};

export const TipoB = Template.bind({});
TipoB.args = {scale, value: 'B'};

export const ConError = Template.bind({});
ConError.args = {scale, value: '', error: 'Elige el tipo de la escala'};
