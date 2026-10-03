import SkeletonCard from './SkeletonCard';

export default {
  title: 'UI/SkeletonCard',
  component: SkeletonCard,
  parameters: {
    docs: {
      description: {
        component: 'Tarjeta con animación de carga (shimmer), usada mientras se obtienen datos del servidor.',
      },
    },
  },
};

export const Default = {
  args: {lines: 3},
};

export const FewLines = {
  args: {lines: 1},
};
