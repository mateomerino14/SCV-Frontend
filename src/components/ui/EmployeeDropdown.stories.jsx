import {useRef, useState} from 'react';
import EmployeeDropdown from './EmployeeDropdown';

const sampleEmployees = [
  {id_usuario: 1, nombre: 'Ana', apellido_paterno: 'Gómez'},
  {id_usuario: 2, nombre: 'Luis', apellido_paterno: 'Pérez'},
  {id_usuario: 3, nombre: 'María', apellido_paterno: 'Rodríguez'},
  {id_usuario: 4, nombre: 'Carlos', apellido_paterno: 'Fernández'},
];

export default {
  title: 'UI/EmployeeDropdown',
  component: EmployeeDropdown,
  parameters: {
    docs: {
      description: {
        component: 'Selector de empleado con búsqueda, usado en los filtros de las páginas de revisión (supervisor, aprobador, revisor).',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const wrapperRef = useRef(null);
    const triggerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    return (
      <div style={{width: 280}}>
        <EmployeeDropdown wrapperRef={wrapperRef} triggerRef={triggerRef} open={open} onToggle={() => setOpen((value) => !value)}
          employees={sampleEmployees} selectedId={selectedId} onSelect={(id) => {setSelectedId(id); setOpen(false);}} />
      </div>
    );
  },
};
