import TripRoute from './TripRoute';

export default {
  title: 'Trip/Atoms/TripRoute',
  component: TripRoute,
  parameters: {
    docs: {
      description: {
        component: 'Ruta del viaje (origen → destino); sin origen muestra solo el destino.',
      },
    },
  },
  args: {
    origin: 'La Paz',
    destination: 'Santa Cruz',
    size: 12,
    maxWidth: 120,
  },
};

export const Default = {};

export const DestinationOnly = {
  args: {origin: ''},
};
