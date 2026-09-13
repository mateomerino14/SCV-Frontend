export const tripStatusConfig = {
  EN_REVISION_VIAJE: {label: 'Pendiente', bg: '#e8d5ff', color: '#5b00a0'},
  APROBADO_VIAJE: {label: 'Esperando Aprobador', bg: '#ffd700aa', color: '#7a5900'},
  EN_REVISION_TESORERO: {label: 'Esperando Fondos', bg: '#ffd8a8aa', color: '#8a4b00'},
  EN_CURSO: {label: 'Aprobado (En Curso)', bg: '#d4edda', color: '#155724'},
  EN_REVISION: {label: 'Pend. Revisión de Gastos', bg: '#e8d5ff', color: '#5b00a0'},
  EN_REVISION_APROBADOR: {label: 'Pend. Revisión por Alcohol', bg: '#f8d7da', color: '#721c24'},
  APROBADO_SUPERVISOR: {label: 'Pend. Revisión Final', bg: '#85aff3ab', color: '#000a65'},
  APROBADO_FINAL: {label: 'Aprobado', bg: '#d4edda', color: '#155724'},
  RECHAZADO: {label: 'Rechazado', bg: '#ffa7a8aa', color: '#500203'},
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