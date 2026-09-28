import {statusColors} from '../../../constants/tripStatusColors';
export const tripStatusConfig = {
  EN_REVISION_VIAJE: {label: 'Pendiente', ...statusColors.EN_REVISION_VIAJE},
  APROBADO_VIAJE: {label: 'Esperando Aprobador', ...statusColors.APROBADO_VIAJE},
  EN_REVISION_TESORERO: {label: 'Esperando Fondos', ...statusColors.EN_REVISION_TESORERO},
  EN_CURSO: {label: 'Aprobado (En Curso)', ...statusColors.EN_CURSO},
  EN_REVISION: {label: 'Pend. Revisión de Gastos', ...statusColors.EN_REVISION},
  EN_REVISION_APROBADOR: {label: 'Pend. Revisión por Alcohol', ...statusColors.EN_REVISION_APROBADOR},
  APROBADO_SUPERVISOR: {label: 'Pend. Revisión Final', ...statusColors.APROBADO_SUPERVISOR},
  APROBADO_FINAL: {label: 'Aprobado', ...statusColors.APROBADO_FINAL},
  RECHAZADO: {label: 'Rechazado', ...statusColors.RECHAZADO},
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