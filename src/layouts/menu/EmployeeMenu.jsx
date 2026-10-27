import {routes} from '../../constants/routes';
import MenuLayout from './MenuLayout';
import {treasurySection, personalSection, accountSection} from './menuSections';

const sections = [
  personalSection,
  treasurySection,
  accountSection(routes.employeeProfile, routes.employeeSettings),
];

const exactMatchPaths = [routes.employeeDashboard];

function EmployeeMenu({isOpen, onClose, user}) {
  return <MenuLayout isOpen={isOpen} onClose={onClose} user={user} sections={sections} exactMatchPaths={exactMatchPaths} />;
}

export default EmployeeMenu;
