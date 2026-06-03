======== ESTÁNDARES DE COMMITS ============

Se utilizará la convención Conventional Commits para mantener un historial claro y organizado.

Tipos de commit:

feat: Nueva funcionalidad
fix: Corrección de errores
style: Cambios visuales o de estilos sin afectar la lógica
refactor: Reestructuración de código sin modificar el comportamiento
docs: Documentación
test: Creación o actualización de pruebas

Ejemplos:

feat: Implementa nuevo rol de supervisor
feat: Crea componentes UI reutilizables
feat: Añade exportación de facturas a Excel
fix: Corrige manejo de sesión expirada
fix: Corrige navegación en páginas de detalle
style: Unifica colores y estilos globales
refactor: Reorganiza servicios de gestión de viajes

Reglas:

- Los mensajes deben comenzar con mayúscula después del prefijo (feat:, fix:, style:, etc.).
- Describir la funcionalidad implementada y no los archivos modificados.
- Un commit debe representar una única funcionalidad, corrección o mejora.
- Mantener mensajes cortos, claros y descriptivos.
- Evitar mensajes genéricos como:
  - cambios
  - correcciones
  - actualización
  - prueba

Formato:

<tipo>: <Descripción>

Ejemplos válidos:

feat: Implementa navegación y menús dinámicos
feat: Crea página de gestión de cargos
fix: Corrige validación de sesión expirada
style: Mejora consistencia visual de los formularios
refactor: Reorganiza hooks de gestión de viajes

======== ESTÁNDARES DE CODIFICACIÓN ============

Idioma del código:

- El código fuente se desarrollará en inglés.
- Variables, funciones, componentes, hooks, servicios, constantes y rutas deberán utilizar nombres en inglés.
- Los textos visibles para el usuario podrán permanecer en español según los requerimientos del sistema.

Ejemplos:

Correcto:
const userData = {}
const travelHistory = []
const createExpense = () => {}

Incorrecto:
const datosUsuario = {}
const historialViajes = []
const crearGasto = () => {}

Estructura:

- Mantener separación por responsabilidades:
  - components/
  - pages/
  - hooks/
  - services/
  - layouts/
  - utils/
  - constants/

- Cada archivo debe tener una única responsabilidad principal.
- Evitar lógica compleja dentro de los componentes visuales.
- Centralizar lógica reutilizable en hooks y servicios.

Estilos:

- Utilizar Tailwind CSS.
- Evitar cadenas extensas de clases directamente en el JSX cuando sean reutilizadas.
- Centralizar estilos compartidos mediante constantes.

Ejemplo:

const styles = {
  container: "flex flex-col gap-4",
  card: "rounded-xl border bg-white p-4 shadow-sm",
  title: "text-lg font-semibold",
  buttonPrimary: "bg-primary text-white px-4 py-2 rounded-lg"
};

Uso:

<div className={styles.card}>
  <h2 className={styles.title}>Título</h2>
</div>

Beneficios:

- JSX más limpio y legible.
- Mayor reutilización.
- Menor duplicación de clases.
- Facilita mantenimiento y cambios visuales futuros.

Buenas prácticas:

- Utilizar const por defecto.
- Utilizar let únicamente cuando sea necesario.
- Evitar código duplicado.
- Mantener nombres descriptivos y consistentes.
- Mantener componentes pequeños y reutilizables.
- Realizar validaciones tanto en frontend como backend cuando corresponda.
- Eliminar código comentado antes de realizar commits.
- Evitar valores mágicos; utilizar constantes cuando sea posible.
