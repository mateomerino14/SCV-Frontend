import {useNavigate, useLocation} from 'react-router-dom';
import {routes} from '../../constants/routes';
import {logout} from '../../services/user/authService';

function useMenuNavigation(onClose, exactMatchPaths = []) {
  const navigate = useNavigate();
  const location = useLocation();

  // En una pantalla de detalle se marca la opcion del menu desde la que se abrio (state.from)
  const currentPath = location.state?.from || location.pathname;
  const isActive = (path) => {
    if (exactMatchPaths.includes(path)) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  // Cierra la sesion en el servidor antes de volver al ingreso
  const handleLogout = async () => {
    await logout();
    navigate(routes.login);
  };

  return {isActive, handleNavigate, handleLogout};
}

export default useMenuNavigation;