import {useState} from 'react';
import {BellRing} from 'lucide-react';
import ConfigToggle from './ConfigToggle';

export default {
  title: 'User/Atoms/ConfigToggle',
  component: ConfigToggle,
  parameters: {
    docs: {
      description: {
        component: 'Opción de ajustes con interruptor de encendido y apagado.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <div style={{width: 360}}>
        <ConfigToggle icon={BellRing} label="Recordatorios automáticos" description="Resumen de pendientes por correo"
          checked={checked} onChange={setChecked} />
      </div>
    );
  },
};
