import {jwtDecode} from 'jwt-decode';
import {getToken} from '../../services/shared/tokenStore';

const roleFromToken = (token) => {
  try {
    return jwtDecode(token)?.id_rol ?? null;
  }
  catch {
    return null;
  }
};

function useUserRole() {
  return {role: roleFromToken(getToken())};
}

export default useUserRole;