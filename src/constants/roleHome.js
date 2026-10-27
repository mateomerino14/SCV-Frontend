import {routes} from './routes';

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
