import {useState} from 'react';
import DateRangeFilter from './DateRangeFilter';

export default {
  title: 'Approval/Molecules/DateRangeFilter',
  component: DateRangeFilter,
  parameters: {
    docs: {
      description: {
        component: 'Filtro de rango de fechas "Desde" y "Hasta"; avisa si el rango queda invertido.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [startDate, setStartDate] = useState('2026-09-01');
    const [endDate, setEndDate] = useState('2026-09-30');
    return (
      <div style={{width: 360}}>
        <DateRangeFilter startDate={startDate} endDate={endDate}
          onStartDateChange={(event) => setStartDate(event.target.value)} onEndDateChange={(event) => setEndDate(event.target.value)} />
      </div>
    );
  },
};

export const InvertedRange = {
  args: {
    startDate: '2026-09-30',
    endDate: '2026-09-01',
    onStartDateChange: () => {},
    onEndDateChange: () => {},
  },
  decorators: [(Story) => <div style={{width: 360}}><Story /></div>],
};
