// Nombre unico de cada estado de viaje, el mismo en todas las pantallas y roles
export const statusLabels = {
  BORRADOR: 'Borrador',
  EN_REVISION_VIAJE: 'Revisión Previa',
  APROBADO_VIAJE: 'Esperando Aprobador',
  EN_REVISION_TESORERO: 'Esperando Fondos',
  EN_CURSO: 'En Curso',
  EN_REVISION: 'En Revisión',
  EN_REVISION_APROBADOR: 'Revisión por Alcohol',
  APROBADO_SUPERVISOR: 'Apr. Preliminar',
  APROBADO_FINAL: 'Aprobado',
  RECHAZADO: 'Rechazado',
};

export function getStatusLabel(state) {
  return statusLabels[state] || state;
}
