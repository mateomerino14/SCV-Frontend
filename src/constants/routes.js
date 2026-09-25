export const routes = {
  login: '/',
  employeeDashboard: '/dashboard/empleado',
  employeeHistory: '/dashboard/empleado/historial',
  employeeProfile: '/dashboard/empleado/perfil',
  employeeSettings: '/dashboard/empleado/configuracion',
  employeeCreateTrip: '/dashboard/empleado/crear-viaje',
  adminDashboard: '/dashboard/administrador',
  adminUsers: '/dashboard/administrador/usuarios',
  adminPositions: '/dashboard/administrador/cargos',
  adminSections: '/dashboard/administrador/secciones',
  adminAuditLog: '/dashboard/administrador/historial-accesos',
  adminProfile: '/dashboard/administrador/perfil',
  adminSettings: '/dashboard/administrador/configuracion',
  supervisorPendingExpenseReviews: '/dashboard/supervisor',
  supervisorExpenseReviewHistory: '/dashboard/supervisor/historial',
  supervisorPendingTrips: '/dashboard/supervisor/viajes-pendientes',
  supervisorTripHistory: '/dashboard/supervisor/viajes-historial',
  supervisorProfile: '/dashboard/supervisor/perfil',
  supervisorSettings: '/dashboard/supervisor/configuracion',
  approverReviews: '/dashboard/aprobador/revisiones',
  approverAlcoholReviews: '/dashboard/aprobador/revision-alcohol',
  approverPendingTrips: '/dashboard/aprobador/viajes-pendientes',
  approverTripHistory: '/dashboard/aprobador/viajes-historial',
  approverProfile: '/dashboard/aprobador/perfil',
  approverSettings: '/dashboard/aprobador/configuracion',
  reviewerReviews: '/dashboard/revisor',
  substitutionRequests: '/dashboard/revisor/reemplazos',
  reviewerDeadlineRequests: '/dashboard/revisor/solicitudes-plazo',
  reviewerProfile: '/dashboard/revisor/perfil',
  reviewerSettings: '/dashboard/revisor/configuracion',
  treasurerReviews: '/dashboard/tesorero/revisiones',
};

export function tripPath(tripId) {
  return `/dashboard/empleado/viaje/${tripId}`;
}

export function editTripPath(tripId) {
  return `${tripPath(tripId)}/editar`;
}

export function registerExpensePath(tripId) {
  return `${tripPath(tripId)}/registrar-gasto`;
}

export function uploadInvoicePath(tripId) {
  return `${tripPath(tripId)}/subir-factura`;
}

export function expenseDetailPath(expenseId) {
  return `/dashboard/empleado/gasto/${expenseId}`;
}

export function editExpensePath(expenseId) {
  return `${expenseDetailPath(expenseId)}/editar-gasto`;
}

export function editInvoicePath(expenseId) {
  return `${expenseDetailPath(expenseId)}/editar-factura`;
}

export function supervisorTripReviewPath(tripId) {
  return `/dashboard/supervisor/revision/${tripId}`;
}

export function supervisorPendingTripPath(tripId) {
  return `/dashboard/supervisor/viaje-previo/${tripId}`;
}

export function supervisorExpenseDetailPath(expenseId) {
  return `/dashboard/supervisor/gasto/${expenseId}`;
}

export function approverPendingTripPath(tripId) {
  return `/dashboard/aprobador/viaje-previo/${tripId}`;
}

export function approverAlcoholReviewPath(tripId) {
  return `/dashboard/aprobador/revision-alcohol/${tripId}`;
}

export function approverExpenseDetailPath(expenseId) {
  return `/dashboard/aprobador/gasto/${expenseId}`;
}

export function reviewerReviewPath(tripId) {
  return `/dashboard/revisor/revision/${tripId}`;
}

export function reviewerExpenseDetailPath(expenseId) {
  return `/dashboard/revisor/gasto/${expenseId}`;
}

export function treasurerTripPath(tripId) {
  return `/dashboard/tesorero/viaje/${tripId}`;
}