import EmployeeMenu from './EmployeeMenu';
import SupervisorMenu from './SupervisorMenu';
import AdminMenu from './AdminMenu';
import ReviewerMenu from './ReviewerMenu';
import ApproverMenu from './ApproverMenu';
import useUserRole from '../../hooks/shared/useUserRole';

function DynamicMenu({isOpen, onClose, user}) {
  const {role} = useUserRole();

  if (role === 1) {
    return <AdminMenu isOpen={isOpen} onClose={onClose} user={user} />;
  }
  if (role === 2) {
    return <SupervisorMenu isOpen={isOpen} onClose={onClose} user={user} />;
  }
  if (role === 4) {
    return <ReviewerMenu isOpen={isOpen} onClose={onClose} user={user} />;
  }
  if (role === 5) {
    return <ApproverMenu isOpen={isOpen} onClose={onClose} user={user} />;
  }
  return <EmployeeMenu isOpen={isOpen} onClose={onClose} user={user} />;
}

export default DynamicMenu;