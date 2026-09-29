import {statusColors} from '../../../constants/tripStatusColors';
import {statusLabels} from '../../../constants/tripStatusLabels';
export const tripStatusConfig = {
  EN_REVISION_VIAJE: {label: statusLabels.EN_REVISION_VIAJE, ...statusColors.EN_REVISION_VIAJE},
  APROBADO_VIAJE: {label: statusLabels.APROBADO_VIAJE, ...statusColors.APROBADO_VIAJE},
  EN_REVISION_TESORERO: {label: statusLabels.EN_REVISION_TESORERO, ...statusColors.EN_REVISION_TESORERO},
  EN_CURSO: {label: statusLabels.EN_CURSO, ...statusColors.EN_CURSO},
  EN_REVISION: {label: statusLabels.EN_REVISION, ...statusColors.EN_REVISION},
  EN_REVISION_APROBADOR: {label: statusLabels.EN_REVISION_APROBADOR, ...statusColors.EN_REVISION_APROBADOR},
  APROBADO_SUPERVISOR: {label: statusLabels.APROBADO_SUPERVISOR, ...statusColors.APROBADO_SUPERVISOR},
  APROBADO_FINAL: {label: statusLabels.APROBADO_FINAL, ...statusColors.APROBADO_FINAL},
  RECHAZADO: {label: statusLabels.RECHAZADO, ...statusColors.RECHAZADO},
};

export const reviewStatusConfig = {
  CONFORME: {label: 'Conforme', bg: '#d4edda', color: '#155724'},
  OBSERVADO: {label: 'Observado', bg: '#fef3cd', color: '#856404'},
};

export const alertConfig = {
  EXCESO_PRESUPUESTO: {label: 'Exceso Detectado', color: '#856404', bg: '#fef3cd'},
  ALCOHOL: {label: 'Alcohol', color: '#721c24', bg: '#f8d7da'},
};

export const expenseTypeLabels = {F: 'Factura', R: 'Recibo', C: 'Compra', S: 'Servicio'};