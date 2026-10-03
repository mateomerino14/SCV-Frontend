import {routes} from './routes';

// Pantalla de inicio de cada rol: la primera opcion de su menu
const roleHomes = {
  1: routes.adminDashboard,
  2: routes.supervisorPendingTrips,
  3: routes.employeeDashboard,
  4: routes.reviewerReviews,
  5: routes.approverReviews,
};

export function getHomeRoute(roleId) {
  return roleHomes[roleId] || routes.employeeDashboard;
}
