import {useRef, useState} from 'react';
import InlineDropdown from './InlineDropdown';

const transportOptions = [
  {value: 'Terrestre', label: 'Terrestre'},
  {value: 'Aéreo', label: 'Aéreo'},
  {value: 'Vehículo de Empresa', label: 'Vehículo de Empresa'},
];

export default {
  title: 'UI/InlineDropdown',
  component: InlineDropdown,
  parameters: {
    docs: {
      description: {
        component: 'Selector desplegable simple con lista de opciones fijas, usado en filtros de las tablas de revisión.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const wrapperRef = useRef(null);
    const triggerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    return (
      <div ref={wrapperRef} style={{width: 240}}>
        <InlineDropdown wrapperRef={wrapperRef} triggerRef={triggerRef} open={open} onToggle={() => setOpen((value) => !value)}
          label={selectedValue || 'Medio de transporte'} options={transportOptions} selectedValue={selectedValue}
          onSelect={(value) => {setSelectedValue(value); setOpen(false);}} />
      </div>
    );
  },
};
