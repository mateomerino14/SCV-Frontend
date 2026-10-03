import {useState} from 'react';
import PasswordField from './PasswordField';

export default {
  title: 'UI/PasswordField',
  component: PasswordField,
  parameters: {
    docs: {
      description: {
        component: 'Campo de contraseña con botón para mostrar/ocultar el texto. Usado en login, cambio de contraseña y restablecimiento.',
      },
    },
  },
};

export const Interactive = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{width: 320}}>
        <PasswordField label="Contraseña" value={value} onChange={(event) => setValue(event.target.value)} />
      </div>
    );
  },
};

export const CustomColors = {
  render: () => {
    const [value, setValue] = useState('12345678');
    return (
      <div style={{width: 320, backgroundColor: '#870002', padding: 16, borderRadius: 16}}>
        <PasswordField label="Nueva Contraseña" value={value} onChange={(event) => setValue(event.target.value)}
          labelColor="#FFFFFF" textColor="#FFFFFF" iconColor="#FFFFFF" borderColor="rgba(255,255,255,0.3)" />
      </div>
    );
  },
};
