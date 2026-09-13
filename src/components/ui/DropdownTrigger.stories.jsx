import {useRef, useState} from 'react';
import DropdownTrigger from './DropdownTrigger';

export default {
  title: 'UI/DropdownTrigger',
  component: DropdownTrigger,
  parameters: {
    docs: {
      description: {
        component: 'Botón que abre un menú desplegable, con flecha que cambia de dirección según el estado abierto/cerrado.',
      },
    },
  },
};

export const Placeholder = {
  render: (args) => {
    const triggerRef = useRef(null);
    return <DropdownTrigger {...args} triggerRef={triggerRef} label="Selecciona una opción..." hasValue={false} />;
  },
};

export const WithValue = {
  render: (args) => {
    const triggerRef = useRef(null);
    return <DropdownTrigger {...args} triggerRef={triggerRef} label="Terrestre" hasValue />;
  },
};

export const Interactive = {
  render: () => {
    const triggerRef = useRef(null);
    const [open, setOpen] = useState(false);
    return <DropdownTrigger triggerRef={triggerRef} label="Haz clic para abrir/cerrar" open={open} onClick={() => setOpen((value) => !value)} hasValue />;
  },
};

export const WithError = {
  render: (args) => {
    const triggerRef = useRef(null);
    return <DropdownTrigger {...args} triggerRef={triggerRef} label="Selecciona una opción..." hasValue={false} error />;
  },
};
