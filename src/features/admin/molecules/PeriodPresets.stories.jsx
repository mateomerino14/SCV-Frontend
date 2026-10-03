import {useState} from 'react';
import PeriodPresets from './PeriodPresets';
import {periodOptions} from '../../../utils/periodRange';

export default {
  title: 'Admin/Molecules/PeriodPresets',
  component: PeriodPresets,
  parameters: {
    docs: {
      description: {
        component: 'Botones de periodo (este mes, este año, todo o personalizado) que comparten el resumen general y el historial de accesos.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [selected, setSelected] = useState('mes');
    return (
      <div style={{width: 420}}>
        <PeriodPresets options={periodOptions} selected={selected} onSelect={setSelected} />
      </div>
    );
  },
};
