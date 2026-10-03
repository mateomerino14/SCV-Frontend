import {useState} from 'react';
import DashboardPeriodFilter from './DashboardPeriodFilter';
import {periodOptions} from '../../../utils/periodRange';

export default {
  title: 'Admin/Molecules/DashboardPeriodFilter',
  component: DashboardPeriodFilter,
  parameters: {
    docs: {
      description: {
        component: 'Filtro de periodo del resumen general: este mes, este año, todo el historial o un rango personalizado por fecha de inicio del viaje.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [preset, setPreset] = useState('mes');
    const [customRange, setCustomRange] = useState({fecha_inicio: '', fecha_fin: ''});
    const [appliedPeriod, setAppliedPeriod] = useState({fecha_inicio: '2026-10-01', fecha_fin: '2026-10-31'});
    return (
      <div style={{width: 420}}>
        <DashboardPeriodFilter options={periodOptions} preset={preset} onSelectPreset={setPreset} customRange={customRange}
          onCustomRangeChange={setCustomRange} onApply={() => setAppliedPeriod(customRange)} appliedPeriod={appliedPeriod} />
      </div>
    );
  },
};
