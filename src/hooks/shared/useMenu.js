import {useState, useEffect, useCallback, useRef} from 'react';
import {jwtDecode} from 'jwt-decode';
import {getMe} from '../../services/user/userService';
import {logout} from '../../services/user/authService';
import {getToken, clearToken} from '../../services/shared/tokenStore';

function getRoleFromToken() {
  try {
    const token = getToken();
    if (!token) {
      return null;
    }
    return jwtDecode(token)?.id_rol;
  }
  catch {
    return null;
  }
}

function useMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const originalRoleRef = useRef(getRoleFromToken());
  const loadUser = useCallback(async () => {
    try {
      const data = await getMe();
      if (!data.error) {
        if (originalRoleRef.current && data.id_rol !== originalRoleRef.current) {
          clearToken();
          window.dispatchEvent(new CustomEvent('session-expired'));
          return;
        }
        setUser(data);
      }
    }
    catch (error) {
      console.error('Error al cargar usuario:', error);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const handleExpired = () => setSessionExpired(true);
    window.addEventListener('session-expired', handleExpired);
    return () => window.removeEventListener('session-expired', handleExpired);
  }, []);

  useEffect(() => {
    const verifyRole = async () => {
      const token = getToken();
      if (!token || !originalRoleRef.current) {
        return;
      }
      try {
        const data = await getMe();
        if (data.error) {
          return;
        }
        if (data.id_rol !== originalRoleRef.current) {
          clearToken();
          window.dispatchEvent(new CustomEvent('session-expired'));
          return;
        }
        setUser(data);
      }
      catch {}
    };

    const handleTokenRefreshed = () => {
      const newRole = getRoleFromToken();
      if (newRole && originalRoleRef.current && newRole !== originalRoleRef.current) {
        clearToken();
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
    };

    const interval = setInterval(verifyRole, 30 * 1000);
    window.addEventListener('token-refreshed', handleTokenRefreshed);

    return () => {
      clearInterval(interval);
      window.removeEventListener('token-refreshed', handleTokenRefreshed);
    };
  }, []);

  const openMenu = () => {
    loadUser();
    setMenuOpen(true);
  };

  const closeMenu = () => setMenuOpen(false);
  const handleSessionExpiredClose = async () => {
    await logout();
    setSessionExpired(false);
    window.location.href = '/';
  };

  return {
    menuOpen,
    user,
    openMenu,
    closeMenu,
    loadUser,
    sessionExpired,
    handleSessionExpiredClose,
  };
}

export default useMenu;