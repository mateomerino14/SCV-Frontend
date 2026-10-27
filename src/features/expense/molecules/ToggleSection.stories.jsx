import {useState} from 'react';
import {List} from 'lucide-react';
import ToggleSection from './ToggleSection';

export default {
  title: 'Expense/Molecules/ToggleSection',
  component: ToggleSection,
  parameters: {
    docs: {
      description: {
        component: 'Bloque del formulario que se activa con un interruptor, como la lista de subgastos.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [active, setActive] = useState(true);
    return (
      <div style={{width: 360}}>
        <ToggleSection active={active} onToggleActive={() => setActive(!active)} icon={List} label="Subgastos">
          <p style={{fontFamily: 'Inter, sans-serif', fontSize: 13}}>Contenido del bloque</p>
        </ToggleSection>
      </div>
    );
  },
};
