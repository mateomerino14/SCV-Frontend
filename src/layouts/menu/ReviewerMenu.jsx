import {ClipboardList, AlertTriangle, Users} from 'lucide-react';
import {routes} from '../../constants/routes';
import MenuLayout from './MenuLayout';
import {treasurySection, personalSection, accountSection} from './menuSections';

const sections = [
  {
    label: 'Revisión Final',
    options: [{path: routes.reviewerReviews, label: 'Rendiciones por Revisar', icon: ClipboardList}],
  },
  {
    label: 'Solicitudes',
    options: [
      {path: routes.reviewerDeadlineRequests, label: 'Solicitudes de Plazo', icon: AlertTriangle},
      {path: routes.substitutionRequests, label: 'Solicitudes de Reemplazo', icon: Users},
    ],
  },
  treasurySection,
  personalSection,
  accountSection(routes.reviewerProfile, routes.reviewerSettings),
];

const exactMatchPaths = [routes.reviewerReviews, routes.employeeDashboard];

function ReviewerMenu({isOpen, onClose, user}) {
  return <MenuLayout isOpen={isOpen} onClose={onClose} user={user} sections={sections} exactMatchPaths={exactMatchPaths} />;
}

export default ReviewerMenu;
