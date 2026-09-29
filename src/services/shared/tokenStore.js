import {resetMascotSeen} from '../../utils/mascotPreferences';

let currentToken = null;

export function getToken() {
  return currentToken;
}

// Avisa a la app que cambio la sesion (ingreso, renovacion) para que revise, por ejemplo,
// si hay un cambio de contrasena pendiente
export function setToken(token) {
  currentToken = token;
  window.dispatchEvent(new CustomEvent('token-changed'));
}

// Al cerrar la sesion (por cualquier via) Casquito vuelve a saludar en el proximo ingreso
export function clearToken() {
  currentToken = null;
  resetMascotSeen();
  window.dispatchEvent(new CustomEvent('token-changed'));
}
