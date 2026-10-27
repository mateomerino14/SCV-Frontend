import {ClipboardList, BookOpen, FileCheck, ListChecks} from 'lucide-react';
import {routes} from '../../constants/routes';
import MenuLayout from './MenuLayout';
import {treasurySection, personalSection, accountSection} from './menuSections';

const sections = [
  {
    label: 'Revisión de Viajes',
    options: [
      {path: routes.supervisorPendingTrips, label: 'Viajes Sin Asignar', icon: ListChecks},
      {path: routes.supervisorTripHistory, label: 'Viajes Asignados a Mí', icon: FileCheck},
    ],
  },
  {
    label: 'Revisión de Rendiciones',
    options: [
      {path: routes.supervisorPendingExpenseReviews, label: 'Rendiciones Sin Asignar', icon: ClipboardList},
      {path: routes.supervisorExpenseReviewHistory, label: 'Rendiciones Asignadas a Mí', icon: BookOpen},
    ],
  },
  treasurySection,
  personalSection,
  accountSection(routes.supervisorProfile, routes.supervisorSettings),
];

const exactMatchPaths = [routes.supervisorPendingExpenseReviews, routes.employeeDashboard];

function SupervisorMenu({isOpen, onClose, user}) {
  return <MenuLayout isOpen={isOpen} onClose={onClose} user={user} sections={sections} exactMatchPaths={exactMatchPaths} />;
}

export default SupervisorMenu;
