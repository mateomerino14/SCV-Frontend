import TripTransportBadge from './TripTransportBadge';

export default {
  title: 'Trip/Atoms/TripTransportBadge',
  component: TripTransportBadge,
  parameters: {
    docs: {
      description: {
        component: 'Distintivo del medio de transporte del viaje; no se muestra si no hay transporte.',
      },
    },
  },
  args: {
    transport: 'Aéreo',
  },
};

export const Default = {};
