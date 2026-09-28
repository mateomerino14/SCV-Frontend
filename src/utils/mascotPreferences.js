// Preferencias de la mascota guardadas en el navegador. Todo va en try/catch porque el
// almacenamiento puede no estar disponible (modo privado, bloqueado): en ese caso la
// mascota simplemente se muestra con los valores por defecto.
const enabledKey = 'scv_mascota_activa';
const seenPrefix = 'scv_mascota_vista_';

export function isMascotEnabled() {
  try {
    return localStorage.getItem(enabledKey) !== 'false';
  }
  catch {
    return true;
  }
}

export function setMascotEnabled(enabled) {
  try {
    localStorage.setItem(enabledKey, enabled ? 'true' : 'false');
  }
  catch {
    // sin almacenamiento disponible: la preferencia dura solo esta sesion
  }
}

// Cada pantalla saluda una sola vez por sesion
export function wasMascotSeen(pageKey) {
  try {
    return sessionStorage.getItem(seenPrefix + pageKey) === '1';
  }
  catch {
    return false;
  }
}

export function markMascotSeen(pageKey) {
  try {
    sessionStorage.setItem(seenPrefix + pageKey, '1');
  }
  catch {
    // sin almacenamiento disponible
  }
}

// Saludo segun la hora del dia
export function greetingFor(name) {
  const hour = new Date().getHours();
  let greeting = 'Buenas noches';
  if (hour >= 5 && hour < 12) {
    greeting = 'Buenos días';
  }
  else if (hour >= 12 && hour < 19) {
    greeting = 'Buenas tardes';
  }
  return name ? `¡${greeting}, ${name}!` : `¡${greeting}!`;
}

// Mensaje para listas de pendientes: cuantas cosas esperan al usuario
export function pendingMessage(name, count, singular, plural) {
  if (count > 0) {
    return `${greetingFor(name)} Tienes ${count} ${count === 1 ? singular : plural}.`;
  }
  return `${greetingFor(name)} No tienes pendientes aquí por ahora. ¡Todo al día!`;
}

// Olvida que pantallas ya saludo, para que el proximo inicio de sesion salude de nuevo
// (se llama al cerrar sesion, aunque se vuelva a entrar en la misma pestana)
export function resetMascotSeen() {
  try {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(seenPrefix))
      .forEach((key) => sessionStorage.removeItem(key));
  }
  catch {
    // sin almacenamiento disponible
  }
}
