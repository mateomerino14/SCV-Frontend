import LoadMoreButton from './LoadMoreButton';

export default {
  title: 'UI/LoadMoreButton',
  component: LoadMoreButton,
  parameters: {
    docs: {
      description: {
        component: 'Botón "Cargar más" de las listas paginadas; muestra "Cargando..." y se bloquea mientras carga.',
      },
    },
  },
  decorators: [(Story) => <div style={{width: 320}}><Story /></div>],
  args: {
    label: 'Cargar más',
    loading: false,
  },
};

export const Default = {};

export const Loading = {
  args: {loading: true},
};
