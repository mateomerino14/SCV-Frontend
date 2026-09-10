export function formatDateShort(dateString) {
  const [year, month, day] = dateString.split('-');
  return new Date(year, month - 1, day).toLocaleDateString('es-ES', {day: 'numeric', month: 'short', year: 'numeric'});
}

export function formatDateRange(startDate, endDate) {
  return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'});
}