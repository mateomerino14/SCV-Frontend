// Paleta unica de colores por estado de viaje (ver documentacion, "Colores de Estado").
// Todas las etiquetas de estado y los mensajes de confirmacion/rechazo usan este mapa,
// asi un mismo estado se ve igual en todas las pantallas y roles.
const pendingReview = {bg: '#e8d5ff', color: '#5b00a0'};
const waitingApprover = {bg: '#ffd700aa', color: '#7a5900'};
const waitingFunds = {bg: '#ffd8a8aa', color: '#8a4b00'};
const pendingFinalReview = {bg: '#85aff3ab', color: '#000a65'};
const approved = {bg: '#d4edda', color: '#155724'};
const rejected = {bg: '#ffa7a8aa', color: '#500203'};

export const statusColors = {
  EN_REVISION_VIAJE: pendingReview,
  APROBADO_VIAJE: waitingApprover,
  EN_REVISION_TESORERO: waitingFunds,
  EN_CURSO: approved,
  EN_REVISION: pendingReview,
  EN_REVISION_APROBADOR: waitingApprover,
  APROBADO_SUPERVISOR: pendingFinalReview,
  APROBADO_FINAL: approved,
  RECHAZADO: rejected,
};

export function getStatusColors(state) {
  return statusColors[state] || pendingReview;
}
