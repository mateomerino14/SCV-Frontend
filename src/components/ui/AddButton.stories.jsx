import AddButton from './AddButton';

export default {
  title: 'UI/AddButton',
  component: AddButton,
  parameters: {
    docs: {
      description: {
        component: 'Botón principal para agregar un registro nuevo en las pantallas de administración; va en la fila de acciones, junto a importar y exportar.',
      },
    },
  },
};

export const Default = {
  args: {label: 'Agregar cargo'},
};

export const Disabled = {
  args: {label: 'Agregar cargo', disabled: true},
};
