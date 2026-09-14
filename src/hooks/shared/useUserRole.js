import {jwtDecode} from 'jwt-decode';
import {getToken} from '../../services/shared/tokenStore';

function useUserRole() {
  const token = getToken();
  let role = null;
  try {
    role = jwtDecode(token)?.id_rol;
  }
  catch {
  }
  return {role};
}

export default useUserRole;