import TripStatusBadge from './TripStatusBadge';

export default {
  title: 'Trip/Atoms/TripStatusBadge',
  component: TripStatusBadge,
  parameters: {
    docs: {
      description: {
        component: 'Etiqueta del estado de un viaje con los colores oficiales de cada estado.',
      },
    },
  },
  argTypes: {
    status: {control: 'select', options: ['BORRADOR', 'EN_REVISION_VIAJE', 'APROBADO_VIAJE', 'EN_REVISION_TESORERO', 'EN_CURSO', 'EN_REVISION', 'EN_REVISION_APROBADOR', 'APROBADO_SUPERVISOR', 'APROBADO_FINAL', 'RECHAZADO']},
  },
  args: {
    status: 'EN_CURSO',
  },
};

export const InProgress = {};

export const FinalApproval = {
  args: {status: 'APROBADO_FINAL'},
};

export const Rejected = {
  args: {status: 'RECHAZADO'},
};
