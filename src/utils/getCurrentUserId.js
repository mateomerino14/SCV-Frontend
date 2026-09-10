import {jwtDecode} from 'jwt-decode';

function getCurrentUserId() {
  const token = localStorage.getItem('token');
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