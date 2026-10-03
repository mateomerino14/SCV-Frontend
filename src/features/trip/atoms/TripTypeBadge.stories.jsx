import TripTypeBadge from './TripTypeBadge';

export default {
  title: 'Trip/Atoms/TripTypeBadge',
  component: TripTypeBadge,
  parameters: {
    docs: {
      description: {
        component: 'Distintivo del tipo de viaje: Nacional o Internacional.',
      },
    },
  },
  args: {
    isInternational: false,
  },
};

export const National = {};

export const International = {
  args: {isInternational: true},
};
