import {jwtDecode} from 'jwt-decode';

function useUserRole() {
  const token = localStorage.getItem('token');
  let role = null;
  try {
    role = jwtDecode(token)?.id_rol;
  }
  catch {

  }
  return {role};
}

export default useUserRole;