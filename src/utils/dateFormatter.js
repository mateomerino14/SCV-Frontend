// Fecha corta ("28 sept 2026"); acepta YYYY-MM-DD o un timestamp y devuelve '' si no hay fecha
export function formatDateShort(dateString) {
  if (!dateString) {
    return '';
  }
  const [year, month, day] = String(dateString).slice(0, 10).split('-');
  return new Date(year, month - 1, day).toLocaleDateString('es-ES', {day: 'numeric', month: 'short', year: 'numeric'});
}

export function formatDateRange(startDate, endDate) {
  return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'});
}