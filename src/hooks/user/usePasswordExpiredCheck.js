import {useState, useEffect} from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import {changePassword} from '../../services/user/userService';
import {getToken, setToken} from '../../services/shared/tokenStore';

const baseUrl = import.meta.env.VITE_API_URL;

// Motivo por el que el usuario debe cambiar su contrasena segun su token:
// 'TEMPORAL' (recien creado o recupero el acceso con codigo), 'VENCIDA' (90 dias) o null
function readPasswordChangeReason() {
  const token = getToken();
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    if (decoded.contraseniavencida !== true) {
      return null;
    }
    return decoded.motivo_cambio_contrasenia || 'VENCIDA';
  }
  catch {
    return null;
  }
}

function usePasswordExpiredCheck() {
  const [reason, setReason] = useState(readPasswordChangeReason);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const syncWithToken = () => setReason(readPasswordChangeReason());
    // El servidor rechazo una accion porque falta cambiar la contrasena (por ejemplo, el
    // token aun no lo indicaba): se muestra la ventana igual
    const handleRequired = () => setReason((current) => current || readPasswordChangeReason() || 'VENCIDA');
    window.addEventListener('token-refreshed', syncWithToken);
    window.addEventListener('token-changed', syncWithToken);
    window.addEventListener('password-change-required', handleRequired);
    return () => {
      window.removeEventListener('token-refreshed', syncWithToken);
      window.removeEventListener('token-changed', syncWithToken);
      window.removeEventListener('password-change-required', handleRequired);
    };
  }, []);

  const handleChange = async (currentPassword, newPassword) => {
    setError('');
    setLoading(true);
    const data = await changePassword(currentPassword, newPassword);
    if (data.error) {
      setLoading(false);
      setError(data.error);
      return;
    }
    try {
      const response = await axios.post(`${baseUrl}/auth/refresh`, {}, {withCredentials: true});
      setToken(response.data.token);
    }
    catch {
      // Si no se pudo renovar, la recarga de abajo vuelve a iniciar la sesion con la cookie
    }
    // La pantalla de fondo pudo quedar sin datos mientras el servidor pedia el cambio:
    // se recarga para mostrarla completa
    window.location.reload();
  };

  return {showModal: !!reason && !!getToken(), reason, loading, error, handleChange};
}

export default usePasswordExpiredCheck;
