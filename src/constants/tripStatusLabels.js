import {getStatusColors} from './tripStatusColors';

export const statusLabels = {
  BORRADOR: 'Borrador',
  EN_REVISION_VIAJE: 'Revisión Previa',
  APROBADO_VIAJE: 'Esperando Aprobador',
  EN_REVISION_TESORERO: 'Esperando Fondos',
  EN_CURSO: 'En Curso',
  EN_REVISION: 'En Revisión',
  EN_REVISION_APROBADOR: 'Revisión de No Deducibles',
  APROBADO_SUPERVISOR: 'Apr. Preliminar',
  APROBADO_FINAL: 'Aprobado',
  RECHAZADO: 'Rechazado',
};

export function getStatusLabel(state) {
  return statusLabels[state] || state;
}

export function getStatusBadge(state) {
  return {label: getStatusLabel(state), ...getStatusColors(state)};
}
