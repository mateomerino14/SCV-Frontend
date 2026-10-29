import {useState} from 'react';
import OptionSelector from './OptionSelector';

export default {
  title: 'Trip/Molecules/OptionSelector',
  component: OptionSelector,
  parameters: {
    docs: {
      description: {
        component: 'Grupo de botones para elegir una sola opción, como quién gestiona el hospedaje del viaje (Empresa o Propio).',
      },
    },
  },
};

export const Hospedaje = {
  render: () => {
    const [value, setValue] = useState('Propio');
    return (
      <OptionSelector label="Gestión de Hospedaje" required value={value} onChange={setValue}
        options={[{value: 'Empresa', label: 'Empresa'}, {value: 'Propio', label: 'Propio'}]}
        hint="Empresa: la empresa reserva el hotel. Propio: el empleado lo busca y lo rinde." />
    );
  },
};
