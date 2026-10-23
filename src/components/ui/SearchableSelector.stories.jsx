import {useState} from 'react';
import SearchableSelector from './SearchableSelector';

export default {
  title: 'UI/SearchableSelector',
  component: SearchableSelector,
  parameters: {
    docs: {
      description: {
        component: 'Selector con buscador para listas largas (cargos, secciones, jefes y categorías de gasto); permite una opción "sin asignar".',
      },
    },
  },
};

const options = [
  {value: 1, label: 'Ventas'},
  {value: 2, label: 'Logística'},
  {value: 3, label: 'Mantenimiento'},
  {value: 4, label: 'Recursos Humanos'},
];

export const Interactive = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{width: 320}}>
        <SearchableSelector label="Sección" options={options} value={value} onChange={setValue}
          placeholder="Selecciona una sección" searchPlaceholder="Buscar sección..." emptyOption={{value: '', label: 'Sin sección'}} />
      </div>
    );
  },
};
