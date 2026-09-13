import {useState} from 'react';
import FormField from './FormField';

export default {
  title: 'UI/FormField',
  component: FormField,
  parameters: {
    docs: {
      description: {
        component: 'Campo de formulario con etiqueta, usado principalmente en los formularios de administración (usuarios, cargos).',
      },
    },
  },
  args: {
    label: 'N° de Dependencia',
    placeholder: 'Ej: DEP-01',
  },
};

export const Interactive = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <FormField {...args} value={value} onChange={(event) => setValue(event.target.value)} />;
  },
};

export const WithError = {
  args: {value: '', error: 'Este campo es requerido'},
};

export const WithHelperText = {
  args: {value: '', helperText: 'Déjalo vacío si no aplica'},
};

export const Disabled = {
  args: {value: 'DEP-04', disabled: true},
};
