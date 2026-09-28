import {resetMascotSeen} from '../../utils/mascotPreferences';

let currentToken = null;

export function getToken() {
  return currentToken;
}

export function setToken(token) {
  currentToken = token;
}

// Al cerrar la sesion (por cualquier via) Casquito vuelve a saludar en el proximo ingreso
export function clearToken() {
  currentToken = null;
  resetMascotSeen();
}
