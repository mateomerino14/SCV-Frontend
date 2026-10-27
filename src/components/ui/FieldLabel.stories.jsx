import FieldLabel from './FieldLabel';

export default {
  title: 'UI/FieldLabel',
  component: FieldLabel,
  parameters: {
    docs: {
      description: {
        component: 'Etiqueta de un campo de formulario. Los campos obligatorios llevan un asterisco rojo; los opcionales van sin marca.',
      },
    },
  },
  args: {className: 'text-xs font-bold font-inter uppercase'},
};

export const Required = {
  args: {text: 'Fecha del Gasto', required: true},
};

export const Optional = {
  args: {text: 'Proveedor'},
};
