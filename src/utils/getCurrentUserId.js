import {jwtDecode} from 'jwt-decode';
import {getToken} from '../services/shared/tokenStore';

function getCurrentUserId() {
  const token = getToken();
  if (!token) {
    return null;
  }
  try {
    return jwtDecode(token)?.id_usuario;
  }
  catch {
    return null;
  }
}

export default getCurrentUserId;