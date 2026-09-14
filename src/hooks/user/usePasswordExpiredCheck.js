import {useState, useEffect} from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import {changePassword} from '../../services/user/userService';
import {getToken, setToken} from '../../services/shared/tokenStore';

const baseUrl = import.meta.env.VITE_API_URL;

function readPasswordExpired() {
  const token = getToken();
  if (!token) {
    return false;
  }
  try {
    const decoded = jwtDecode(token);
    return decoded.contraseniavencida === true;
  }
  catch {
    return false;
  }
}

function usePasswordExpiredCheck() {
  const [showModal, setShowModal] = useState(readPasswordExpired);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const handleTokenRefreshed = () => {
      if (readPasswordExpired()) {
        setShowModal(true);
      }
      else {
        setShowModal(false);
      }
    };
    window.addEventListener('token-refreshed', handleTokenRefreshed);
    return () => window.removeEventListener('token-refreshed', handleTokenRefreshed);
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.post(`${baseUrl}/auth/refresh`, {}, {withCredentials: true});
      const newToken = response.data.token;
      setToken(newToken);
      window.dispatchEvent(new CustomEvent('token-refreshed'));
    }
    catch {
      return;
    }
  };

  const handleChange = async (currentPassword, newPassword) => {
    setError('');
    setLoading(true);
    const data = await changePassword(currentPassword, newPassword);
    if (data.error) {
      setLoading(false);
      setError(data.error);
      return;
    }
    await refreshToken();
    setLoading(false);
    setShowModal(false);
  };

  return {showModal, loading, error, handleChange};
}

export default usePasswordExpiredCheck;