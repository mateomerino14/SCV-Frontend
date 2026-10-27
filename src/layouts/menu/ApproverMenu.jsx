import {ClipboardCheck, Wine, FileCheck, BookOpen} from 'lucide-react';
import {routes} from '../../constants/routes';
import MenuLayout from './MenuLayout';
import {treasurySection, personalSection, accountSection} from './menuSections';

const sections = [
  {
    label: 'Aprobación de Viajes',
    options: [{path: routes.approverReviews, label: 'Viajes por Aprobar', icon: ClipboardCheck}],
  },
  {
    label: 'Revisión de Rendiciones',
    options: [{path: routes.approverAlcoholReviews, label: 'Rendiciones con Alcohol', icon: Wine}],
  },
  {
    label: 'Mi Equipo',
    options: [
      {path: routes.supervisorTripHistory, label: 'Viajes de Mi Equipo', icon: FileCheck},
      {path: routes.supervisorExpenseReviewHistory, label: 'Rendiciones de Mi Equipo', icon: BookOpen},
    ],
  },
  treasurySection,
  personalSection,
  accountSection(routes.approverProfile, routes.approverSettings),
];

const exactMatchPaths = [routes.employeeDashboard];

function ApproverMenu({isOpen, onClose, user}) {
  return <MenuLayout isOpen={isOpen} onClose={onClose} user={user} sections={sections} exactMatchPaths={exactMatchPaths} />;
}

export default ApproverMenu;
