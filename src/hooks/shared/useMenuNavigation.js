import {useNavigate, useLocation} from 'react-router-dom';
import {routes} from '../../constants/routes';

function useMenuNavigation(onClose, exactMatchPaths = []) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (exactMatchPaths.includes(path)) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate(routes.login);
  };

  return {isActive, handleNavigate, handleLogout};
}

export default useMenuNavigation;