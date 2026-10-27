import {Plane, User, Settings, Wallet, Briefcase} from 'lucide-react';
import {routes} from '../../constants/routes';

export const treasurySection = {
  label: 'Asignación de Fondos',
  treasurerOnly: true,
  options: [{path: routes.treasurerReviews, label: 'Asignación de Fondos', icon: Wallet}],
};

export const personalSection = {
  label: 'Mis Viajes',
  options: [
    {path: routes.employeeDashboard, label: 'Mis Viajes', icon: Briefcase},
    {path: routes.employeeHistory, label: 'Historial de Mis Viajes', icon: Plane},
  ],
};

export const accountSection = (profilePath, settingsPath) => ({
  label: 'Cuenta',
  options: [
    {path: profilePath, label: 'Mi Perfil', icon: User},
    {path: settingsPath, label: 'Ajustes de Cuenta', icon: Settings},
  ],
});
