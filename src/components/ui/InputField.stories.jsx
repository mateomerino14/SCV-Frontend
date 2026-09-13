import {useState} from 'react';
import {Target} from 'lucide-react';
import InputField from './InputField';
import {COLORS} from '../../constants';

export default {
  title: 'UI/InputField',
  component: InputField,
  parameters: {
    docs: {
      description: {
        component: 'Contenedor de campo con etiqueta e ícono opcional, usado en los formularios de creación/edición de viajes y gastos. El input real se pasa como children.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{width: 320}}>
        <InputField label="Motivo" icon={<Target size={16} style={{color: COLORS.labels}} />}>
          <input type="text" placeholder="Inspección técnica y de producción..." className="w-full bg-transparent outline-none font-inter text-sm"
            style={{color: COLORS.text}} value={value} onChange={(event) => setValue(event.target.value)} />
        </InputField>
      </div>
    );
  },
};

export const WithError = {
  render: () => (
    <div style={{width: 320}}>
      <InputField label="Destino" error="El destino es requerido">
        <input type="text" placeholder="¿A dónde se dirige?" className="w-full bg-transparent outline-none font-inter text-sm" style={{color: COLORS.text}} />
      </InputField>
    </div>
  ),
};
