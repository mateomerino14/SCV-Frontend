import {LayoutDashboard, Users, Briefcase, Layers, Car, History, BellRing} from 'lucide-react';
import {routes} from '../../constants/routes';
import MenuLayout from './MenuLayout';
import {treasurySection, personalSection, accountSection} from './menuSections';

const sections = [
  {
    label: 'Administración',
    options: [
      {path: routes.adminDashboard, label: 'Resumen General', icon: LayoutDashboard},
      {path: routes.adminUsers, label: 'Usuarios', icon: Users},
      {path: routes.adminPositions, label: 'Cargos', icon: Briefcase},
      {path: routes.adminSections, label: 'Secciones', icon: Layers},
      {path: routes.adminVehicles, label: 'Vehículos', icon: Car},
      {path: routes.adminAuditLog, label: 'Historial de Accesos', icon: History},
      {path: routes.adminReminders, label: 'Recordatorios', icon: BellRing},
    ],
  },
  treasurySection,
  personalSection,
  accountSection(routes.adminProfile, routes.adminSettings),
];

const exactMatchPaths = [routes.adminDashboard, routes.employeeDashboard];

function AdminMenu({isOpen, onClose, user}) {
  return <MenuLayout isOpen={isOpen} onClose={onClose} user={user} sections={sections} exactMatchPaths={exactMatchPaths} />;
}

export default AdminMenu;
