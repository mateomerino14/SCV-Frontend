import {useState} from 'react';
import SectionDropdown from './SectionDropdown';

export default {
  title: 'UI/SectionDropdown',
  component: SectionDropdown,
  parameters: {
    docs: {
      description: {
        component: 'Filtro desplegable de secciones activas, con la opción "Todas las secciones" al inicio.',
      },
    },
  },
};

const sections = [
  {id_seccion: 1, nombre: 'Ventas', activo: true},
  {id_seccion: 2, nombre: 'Logística', activo: true},
  {id_seccion: 3, nombre: 'Mantenimiento', activo: true},
  {id_seccion: 4, nombre: 'Sección Inactiva', activo: false},
];

export const Interactive = {
  render: () => {
    const [selectedSection, setSelectedSection] = useState('');
    return (
      <div style={{width: 260}}>
        <SectionDropdown sections={sections} selectedSection={selectedSection} onSelect={setSelectedSection} />
      </div>
    );
  },
};
