import {statusColors} from '../../../constants/tripStatusColors';
const approverTripStatusConfig = {
  APROBADO_VIAJE: {label: 'Pendiente de Aprobación', ...statusColors.APROBADO_VIAJE},
  EN_REVISION_TESORERO: {label: 'Esperando Fondos', ...statusColors.EN_REVISION_TESORERO},
  EN_CURSO: {label: 'Aprobado (En Curso)', ...statusColors.EN_CURSO},
  RECHAZADO: {label: 'Rechazado', ...statusColors.RECHAZADO},
};

export default approverTripStatusConfig;