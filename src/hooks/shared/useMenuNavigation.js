import {useNavigate, useLocation} from 'react-router-dom';
import {routes} from '../../constants/routes';
import {logout} from '../../services/user/authService';

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

  // Cierra la sesion en el servidor (registra la SALIDA y borra la cookie de sesion)
  // antes de volver al inicio de sesion
  const handleLogout = async () => {
    await logout();
    navigate(routes.login);
  };

  return {isActive, handleNavigate, handleLogout};
}

export default useMenuNavigation;