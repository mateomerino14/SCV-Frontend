import {useState} from 'react';
import DatePickerInput from './DatePickerInput';
import {COLORS} from '../../constants';

export default {
  title: 'UI/DatePickerInput',
  component: DatePickerInput,
  parameters: {
    docs: {
      description: {
        component: 'Calendario de la app: se despliega pequeño debajo del campo (o encima si no hay espacio), marca los días del viaje como franja y elige la fecha con un toque; Hoy y Borrar al pie.',
      },
    },
  },
};

export const WithTripRange = {
  render: () => {
    const [value, setValue] = useState('2026-10-26');
    return (
      <div style={{width: 320, border: `1px solid ${COLORS.dataFields}`, borderRadius: 12, padding: '12px 16px'}}>
        <DatePickerInput value={value} onChange={setValue} rangeStart="2026-10-20" rangeEnd="2026-10-28" />
      </div>
    );
  },
};

export const ClearableWithMinimum = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{width: 320, border: `1px solid ${COLORS.dataFields}`, borderRadius: 12, padding: '12px 16px'}}>
        <DatePickerInput value={value} onChange={setValue} min="2026-10-10" clearable />
      </div>
    );
  },
};
