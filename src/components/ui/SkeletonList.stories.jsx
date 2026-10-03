import SkeletonList from './SkeletonList';

export default {
  title: 'UI/SkeletonList',
  component: SkeletonList,
  parameters: {
    docs: {
      description: {
        component: 'Lista de tarjetas SkeletonCard, usada como placeholder de carga en las listas de viajes, gastos y solicitudes.',
      },
    },
  },
};

export const Default = {
  args: {count: 3, lines: 3},
};

export const SingleCard = {
  args: {count: 1, lines: 2},
};
