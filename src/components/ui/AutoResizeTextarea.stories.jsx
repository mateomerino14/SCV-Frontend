import {useState} from 'react';
import {Target} from 'lucide-react';
import AutoResizeTextarea from './AutoResizeTextarea';
import InputField from './InputField';
import {COLORS} from '../../constants';

export default {
  title: 'UI/AutoResizeTextarea',
  component: AutoResizeTextarea,
  parameters: {
    docs: {
      description: {
        component: 'Campo de texto que empieza en una línea, como un input, y crece solo mientras se escribe (hasta maxRows líneas, luego aparece el scroll). Se usa para el motivo del viaje dentro de InputField con alignTop.',
      },
    },
  },
};

function Example({initialValue}) {
  const [value, setValue] = useState(initialValue);
  return (
    <div style={{width: 360}}>
      <InputField label="Motivo" alignTop icon={<Target size={16} style={{color: COLORS.primary}} />}>
        <AutoResizeTextarea value={value} maxLength={500} placeholder="Inspección técnica y de producción..." style={{color: COLORS.text}}
          onChange={(event) => setValue(event.target.value)} />
      </InputField>
    </div>
  );
}

export const Empty = {
  render: () => <Example initialValue="" />,
};

export const LongText = {
  render: () => <Example initialValue="Inspección técnica de la planta de producción, reunión con el equipo de mantenimiento y revisión de los equipos de seguridad, además de capacitación al personal nuevo." />,
};
