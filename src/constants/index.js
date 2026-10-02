// Imagen de la pantalla de ingreso: archivo local src/assets/FOTO_LOGIN.jpg, incluido en la
// compilacion (no depende de internet). Se carga con glob para que, si el archivo aun no
// esta en el repositorio, la compilacion no falle y se use la imagen anterior.
const localLoginImage = Object.values(import.meta.glob('../assets/FOTO_LOGIN.jpg', {eager: true, import: 'default'}))[0];
const fallbackLoginImage = "https://media.licdn.com/dms/image/v2/D4E22AQE0FhfcXcva3w/feedshare-shrink_800/feedshare-shrink_800/0/1729181878955?e=2147483647&v=beta&t=8I4JqWT7e4UXjTX56rdge-w7HBCEqQL6iYiFCenBJiY";

export const LOGIN_IMAGE = localLoginImage || fallbackLoginImage;
export const MAXAM_LOGO = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Maxam_logo.jpg"

// Paleta de colores principales
export const COLORS = {
  primary: '#870002',
  secondary: '#D20F12',
  background: '#FFFFFF',
  text: '#2e2827',
  backgroundSecondary: '#000000',
  backgroundHeader: '#F3F6FF',
  fields: '#C2C6D4',
  dataFields: '#DEE2F0',
  title: '#500203',
  labels: '#475569',
  footer: '#E9EBF2',
  travelTypes: '#f2d9c5',
  travelTypesText: '#A45718',
  environmentTypes: '#a69896',
  environmentTypesText: '#47312E',
  bar: '#dcdcdc',
  positionRole: '#F1F2FF',
  element: '#eceded6a',
  error: '#fde9e9',
  comments: '#f5d6d622',
  // Variantes de "background" (blanco) con transparencia, para usar sobre fondos de color (modales rojos, etc.)
  backgroundOnColorBorder: 'rgba(255,255,255,0.4)',
  backgroundOnColorFill: 'rgba(255,255,255,0.12)',
  backgroundOnColorText: 'rgba(255,255,255,0.85)',
}

// Referencias de tamaño:
// sm  -> 640px  (pantallas pequenas)
// md  -> 768px  (tablets)
// lg  -> 1024px (laptops)
// xl  -> 1280px (desktops)
// 2xl -> 1536px (pantallas grandes)