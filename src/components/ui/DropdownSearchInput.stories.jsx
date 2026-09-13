import {useState, useRef} from 'react';
import DropdownSearchInput from './DropdownSearchInput';

export default {
  title: 'UI/DropdownSearchInput',
  component: DropdownSearchInput,
  parameters: {
    docs: {
      description: {
        component: 'Campo de búsqueda que se muestra dentro de un dropdown con muchas opciones (por ejemplo, el selector de empleados).',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);
    return <DropdownSearchInput inputRef={inputRef} value={value} onChange={(event) => setValue(event.target.value)} placeholder="Buscar empleado..." />;
  },
};
