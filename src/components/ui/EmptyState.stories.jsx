import EmptyState from './EmptyState';

export default {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component: 'Tarjeta con degradado institucional que se muestra cuando una lista no tiene resultados (sin viajes, sin gastos, sin solicitudes, etc).',
      },
    },
  },
  args: {
    title: 'Sin viajes registrados',
    subtitle: 'Aún no tienes viajes en esta categoría',
  },
};

export const Default = {};
