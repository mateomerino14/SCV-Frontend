import {useNavigate, useLocation} from 'react-router-dom';
import {routes} from '../../constants/routes';
import {clearToken} from '../../services/shared/tokenStore';

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
    clearToken();
    navigate(routes.login);
  };

  return {isActive, handleNavigate, handleLogout};
}

export default useMenuNavigation;