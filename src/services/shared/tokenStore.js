import {resetMascotSeen} from '../../utils/mascotPreferences';

let currentToken = null;

export function getToken() {
  return currentToken;
}

export function setToken(token) {
  currentToken = token;
  window.dispatchEvent(new CustomEvent('token-changed'));
}

export function clearToken() {
  currentToken = null;
  resetMascotSeen();
  window.dispatchEvent(new CustomEvent('token-changed'));
}
