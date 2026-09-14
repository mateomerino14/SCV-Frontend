let currentToken = null;

export function getToken() {
  return currentToken;
}

export function setToken(token) {
  currentToken = token;
}

export function clearToken() {
  currentToken = null;
}
