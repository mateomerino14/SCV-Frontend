# Sistema de Control de Viáticos — Frontend

Cliente web del sistema de gestión de viajes corporativos y rendición de gastos de MAXAM.

## Requisitos

- Node.js 22 o superior
- Una instancia del backend en ejecución

## Instalación

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=http://localhost:5000
```

`VITE_API_URL` es la dirección del backend en cada etapa: `http://localhost:5000` en local, la URL del servicio de Render en el piloto y el dominio de la API (por ejemplo `https://api.tuempresa.com`) en el VPS. En Vercel se configura en las variables de entorno del proyecto y requiere volver a desplegar.

## Ejecución

```bash
npm run dev               # servidor de desarrollo
npm run build              # compilación para producción
npm run preview             # previsualización de la compilación
npm run storybook           # documentación interactiva de los componentes
npm run build-storybook     # sitio estático de Storybook
npm test                    # pruebas unitarias (Vitest)
npm run test:e2e            # pruebas de extremo a extremo (Playwright; ver "Pruebas automáticas")
```

## Stack

| Tecnología | Propósito |
|---|---|
| React | Interfaz mediante componentes funcionales y hooks |
| Vite | Compilación y servidor de desarrollo |
| Tailwind CSS | Utilidades de maquetado |
| React Router DOM | Enrutamiento y protección por rol |
| Framer Motion | Animaciones de páginas y modales |
| Axios | Cliente HTTP con interceptores |
| Recharts | Gráficos del panel administrativo |
| ExcelJS + FileSaver | Generación y descarga de la planilla en Excel |
| Lucide React | Iconografía |
| jwt-decode | Lectura del rol desde el token |
| Storybook | Documentación interactiva de `components/ui/` y de los átomos y moléculas de `features/` |

## Arquitectura

El proyecto combina una organización por dominios con una jerarquía de componentes basada en Atomic Design. La lógica de negocio vive en hooks; los componentes solo presentan.

```
Página (pages/)
   │  invoca el hook y distribuye sus valores
   ▼
Hook de negocio (hooks/<dominio>/)
   │  mantiene estado, valida y llama al servicio
   ▼
Servicio (services/<dominio>/)
   │  encapsula el endpoint y normaliza la respuesta
   ▼
apiClient (axios + interceptores JWT)
   ▼
API Backend
```

Ningún componente de presentación importa directamente un servicio.

Todas las páginas en `App.jsx` (salvo `LoginPage`) se cargan con `React.lazy`, de modo que cada ruta genera su propio fragmento de JavaScript y las librerías pesadas usadas solo por algunas pantallas (ExcelJS, Recharts) no forman parte del paquete inicial.

## Estructura

```
src/
├── components/ui/       Componentes genéricos transversales
├── features/            Dominios funcionales
│   ├── admin/
│   ├── approval/
│   ├── expense/
│   ├── trip/
│   └── user/
│       ├── atoms/       Elementos indivisibles
│       ├── molecules/   Composiciones funcionales
│       ├── organisms/   Bloques autónomos
│       ├── hooks/       Lógica presentacional
│       └── constants/   Catálogos de configuración visual
├── hooks/               Hooks de negocio por dominio
│   ├── admin/  approval/  expense/  trip/  user/  shared/
├── pages/               Páginas asociadas a rutas
│   ├── admin/  approval/  expense/  trip/  user/
│   └── hooks/           Hooks específicos de página
├── services/            Capa de acceso a la API
│   ├── admin/  approval/  expense/  trip/  user/
│   └── shared/apiClient.js
├── layouts/             Navbar, Footer y menús por rol
│   └── menu/
├── utils/               Funciones auxiliares puras
├── constants/           Paleta, rutas, inicio por rol, monedas, nombres y colores de estado
├── test/setup.js        Configuración de las pruebas unitarias
├── App.jsx              Rutas y guardas de acceso
└── main.jsx             Punto de entrada

e2e/                     Pruebas de extremo a extremo (Playwright) y sus ayudas
.github/workflows/       Ejecución automática de las pruebas en GitHub Actions
```

### Responsabilidad de cada capa

| Capa | Recibe | Entrega | Restricción |
|---|---|---|---|
| Servicio | Parámetros primitivos | Datos o `{error}` | No mantiene estado |
| Hook | Identificadores de ruta | Estado y manejadores | No renderiza JSX |
| Página | Parámetros de ruta | Árbol de componentes | No llama servicios |
| Organismo | Props | Fragmento de interfaz | No conoce hooks de negocio |

### Atomic Design

| Nivel | Definición | Ejemplos |
|---|---|---|
| Átomo | Elemento indivisible sin lógica de negocio | `TripRoute`, `ExpenseObsButton`, `TripStatusBadge` |
| Molécula | Composición que resuelve una unidad funcional | `ExpenseBudgetBar`, `ExpenseSettlementCard`, `CategorySelector` |
| Organismo | Bloque autónomo y complejo | `ExpenseInvoicedTable`, `ExpenseTripInfoCard`, `UserFormModal` |

## Roles y rutas

Las rutas se declaran en `App.jsx`. El componente `ProtectedRoute` verifica el token y contrasta el rol decodificado contra los roles autorizados.

| Rol | id | Ruta base |
|---|---|---|
| Administrador | 1 | `/dashboard/administrador` |
| Supervisor | 2 | `/dashboard/supervisor` |
| Empleado | 3 | `/dashboard/empleado` |
| Revisor | 4 | `/dashboard/revisor` |
| Aprobador | 5 | `/dashboard/aprobador` |
| Tesorero | — | `/dashboard/tesorero` (por cargo, no por rol) |

Las rutas con parámetros se construyen mediante funciones de `constants/routes.js` (`tripPath`, `supervisorTripReviewPath`, `reviewerExpenseDetailPath`, entre otras) en lugar de literales dispersos.

Cada rol entra a la primera opción de su menú (`constants/roleHome.js`). Si alguien abre una pantalla de otro rol, se lo lleva a la suya; con sesión activa, la pantalla de ingreso y la página 404 también llevan a su inicio.

## Gestión del estado

No se emplea una biblioteca de estado global. El estado es local a cada pantalla y se gestiona con hooks nativos dentro de los hooks de negocio.

- **Servidor**: se obtiene en `useEffect` al montar y se refresca tras cada escritura.
- **Sesión**: el token de acceso vive solo en memoria (`services/shared/tokenStore.js`), nunca en `localStorage`. Al cargar la app, si no hay token en memoria se intenta un refresco silencioso contra `/auth/refresh` usando la cookie `httpOnly` del refresh token, antes de renderizar las rutas protegidas.
- **Formularios**: se mantienen en el hook, junto con sus errores por campo.
- **Sondeo**: las bandejas de los roles revisores, las solicitudes de plazo y reemplazo, el historial de viajes del empleado y los resúmenes se refrescan cada 30 segundos, con los filtros que el usuario aplicó. Mientras el empleado tiene una solicitud de plazo o de reemplazo esperando respuesta, también se consulta cada 30 segundos para mostrar la respuesta sin recargar. Solo la carga inicial activa el indicador esquelético; si una actualización falla, se conservan los datos y se muestra un aviso.
- **Sesión expirada o invalidada**: `apiClient` detecta el token vencido (lo renueva solo), la sesión invalidada por cambio de rol o suspensión, y la cuenta suspendida; en esos casos aparece la ventana "Sesión Expirada". Además `useMenu` revisa el rol cada 30 segundos.
- **Cambio de contraseña obligatorio**: `PasswordChangeGate` (en `App.jsx`) muestra en cualquier pantalla la ventana de cambio, con un texto según el motivo que envía el servidor: contraseña temporal (cuenta nueva o clave puesta por el administrador), ingreso con código de verificación, o más de 90 días sin cambiarla. Solo en este último caso se pide la contraseña actual y se ofrece cerrar sesión para usar "¿Olvidaste tu contraseña?".
- **Cierre de sesión**: siempre pasa por el servidor, que registra la salida y borra la cookie.
- **Paginación**: las listas largas (historial de viajes, bandejas e historiales de revisión, solicitudes, usuarios, cargos, secciones, historial de accesos) muestran "Mostrando X de Y" (`ListCount`) y un botón "Cargar más" (`LoadMoreButton`). Las bandejas de revisión muestran primero lo revisado más recientemente, de 12 en 12, y se pueden acotar con los filtros de fecha.
- **Ventanas emergentes**: `ConfirmDialog` se dibuja sobre toda la pantalla (portal en `body`), con la tarjeta en rojo institucional y el ícono en un círculo blanco. Los errores de una acción (por ejemplo, finalizar un viaje sin gastos o con una justificación inapropiada) y las confirmaciones de solicitudes se muestran en estas ventanas.

## Imágenes

Las imágenes propias del sistema están en `src/assets/` y se importan desde el código, así que Vite las incluye en la compilación y no dependen de internet:

| Archivo | Uso |
|---|---|
| `foto-login.jpg` | Imagen de la pantalla de ingreso (`LOGIN_IMAGE` en `constants/index.js`) |

Para cambiar la imagen de ingreso basta con reemplazar ese archivo manteniendo el nombre exacto, en minúsculas y con extensión `.jpg` (en Vercel y en Linux se distinguen). Si el archivo no está en el repositorio, la compilación no falla: se usa la imagen anterior de internet.

## Sistema de diseño

La paleta se centraliza en `constants/index.js`. Ningún componente define colores literales.

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#870002` | Acciones principales |
| `secondary` | `#D20F12` | Acciones destructivas y errores |
| `title` | `#500203` | Títulos |
| `text` | `#2e2827` | Cuerpo de texto |
| `labels` | `#475569` | Etiquetas y texto secundario |
| `background` | `#FFFFFF` | Fondo general |
| `backgroundSecondary` | `#000000` | Cabeceras de alto contraste |
| `backgroundHeader` | `#F3F6FF` | Tarjetas y encabezados de tabla |
| `dataFields` | `#DEE2F0` | Bordes y separadores |
| `fields` | `#C2C6D4` | Controles deshabilitados |
| `error` | `#fde9e9` | Fondo de mensajes de error |

Tipografías: **Inter** para contenido general, **Nunito** para botones.

**Estados de viaje.** Cada estado tiene un solo nombre (`constants/tripStatusLabels.js`) y un solo par de colores (`constants/tripStatusColors.js`) en todas las pantallas y roles. Los avisos de confirmación o rechazo usan el color del estado en que queda el viaje. La única excepción es "En Curso" en las pantallas del empleado, que usa el rojo institucional porque marca su viaje activo.

## Funcionalidades destacadas

### Planilla de rendición

`useTripExcelExport` construye la planilla oficial en Excel con ExcelJS: logotipo anclado a un rango de celdas, tabla de simbología, distinción cromática entre gastos nacionales e internacionales, listas de validación en la columna de cuenta Oracle, columna de tramos de cambio, totales por moneda, la justificación de cada día que excedió la cuota diaria, y cinco bloques de firma.

Además, el revisor y el tesorero exportan con un botón las **planillas de todos los viajes de su lista** (según el filtro aplicado) en un solo archivo: una hoja *Resumen* con una fila por viaje y una hoja de planilla por viaje. El administrador puede exportar las planillas del periodo elegido en el Resumen General.

El empleado descarga en cambio la planilla en **PDF** (no editable, generada por el backend) una vez que su viaje está aprobado en su totalidad; los revisores siguen usando el Excel. Ambos formatos se generan a partir de los mismos valores de retención calculados y persistidos por el backend; no se recalculan al exportar.

### Monto del viaje

Al crear o editar un viaje, el sistema calcula el monto con las tarifas del cargo del empleado: en un viaje nacional, días × tarifa en Bs; en uno internacional, el día de salida y el de regreso con la tarifa en Bs y los días intermedios con la tarifa en USD. Tesorería ajusta el monto final al asignar los fondos.

### Control de gasto diario

El presupuesto se controla día por día y por moneda: en un viaje nacional contra la tarifa diaria en Bs; en uno internacional, cada día con las dos tarifas por separado (Bs y USD), y se puede gastar en cualquiera de las dos monedas cualquier día. Los gastos de hotel quedan fuera de ese control y se comparan contra el total asignado. El **Control Diario** (`DailyBreakdownCard`) muestra una tarjeta por día con una barra por moneda y su estado (dentro del límite, cerca, excedido o justificado); lo ven el empleado y los revisores. Cuando un día (o el total de hoteles) excede la tarifa, `useTripDetail` exige una justificación por cada exceso antes de permitir el envío a revisión.

### Tipo de cambio

En los tramos de otra moneda de un gasto internacional, el empleado escribe el monto y el tipo de cambio que le aplicaron, y el formulario muestra el equivalente en USD.

### Revisión adicional por alcohol

Cuando una rendición contiene bebidas alcohólicas, tras la aprobación del supervisor pasa por una revisión adicional del aprobador (`ApproverAlcoholReviewsPage`) antes de llegar al revisor final. Las filas de gasto con alcohol se resaltan en las tablas de revisión.

### Rendición por terceros

Un empleado puede solicitar desde su viaje que otra persona rinda los gastos en su nombre (`useSubstitutionRequest`). El revisor aprueba o rechaza la solicitud (`SubstitutionRequestsPage`); el viaje aparece en el dashboard del sustituto con la etiqueta "Rendición de [nombre]", sin afectar los documentos oficiales, que siempre llevan el nombre del titular original. Si el viaje se envía a revisión antes de que el revisor responda, la solicitud se cierra sola y en el historial aparece como "Cerrada" (no como rechazada); si el revisor intenta atenderla, una ventana emergente le explica que ya se cerró.

### Digitalización de comprobantes

Al crear o editar un viaje, el motivo admite hasta 500 caracteres (`constants/tripLimits.js`) en un campo de varias líneas con contador; en las listas se recorta a dos o tres líneas y en el detalle se ve completo.

La carga de facturas presenta cada comprobante en tres columnas —imagen, formulario y detalle de productos— permitiendo corregir los datos extraídos antes de confirmar. Cada factura mantiene su propio estado: en extracción, con datos, con error o guardada. Al registrar, la fecha de emisión siempre se puede corregir (por si la IA la leyó mal); al modificar una factura guardada (`EditInvoicePage`, `InvoiceForm` con `lockDate`) queda bloqueada. Con Factura (F) el campo es el subtotal (sin IVA) y el formulario le suma el 13 %; con Recibo (R) el IVA no aplica y el monto es el total pagado, también en la planilla en Excel. Al cambiar entre F y R se conserva el total pagado. El campo «Número de Factura / Código» admite símbolos (`@`, `$`, `#`) para los códigos de recibos y boletos. La cantidad del detalle (`InvoiceDetailPanel`) admite hasta 3 decimales (53.345 litros o 6 unidades) y se muestra sin ceros de más (`formatQuantity`). En los gastos sin factura, la tarjeta de retenciones muestra el total del documento, el RC-IVA o IUE, el IT y el importe a cancelar (total menos retenciones), calculados en `utils/withholdings.js`; `WithholdingFormulaNote` lo explica.

### Control de plazos

`useDeadlineAuthorization` determina si el plazo de carga venció, considerando la tolerancia de cuatro días y las extensiones aprobadas vigentes. Cuando expiró sin autorización, los controles se deshabilitan y se ofrece solicitar una extensión al revisor. El plazo es del viaje: una extensión aprobada vale también para el reemplazo, que puede pedirla igual que el titular; el revisor ve quién la pidió.

### Historial de revisión

Cada bandeja de revisión (supervisor, aprobador, tesorero, revisor) tiene las pestañas Pendientes, Aprobados y Rechazados. **Aprobados** muestra todo lo que esa persona aprobó, con el estado actual del viaje, aunque ahora lo revise otra persona. **Rechazados** muestra solo lo que rechazó y sigue rechazado. El supervisor y el aprobador pueden devolver un viaje o rendición que tomaron por error (`ReturnReviewButton`, con confirmación).

Para rechazar se usan solo las observaciones propias de la ronda actual; las de otros revisores se ven pero no se pueden editar, eliminar ni usar para rechazar.

### Administración

Resumen general con indicadores por fase y gráficos, con filtro de periodo (este mes, que es el valor inicial, este año, todo o un rango, por fecha de inicio del viaje); el gráfico por sección cuenta solo los viajes con fondos entregados por tesorería; gestión de usuarios con buscador en cargo, sección y jefe directo (`SearchableSelector`); sugerencia de nombres existentes al crear cargos y secciones; historial de accesos (ingresos, salidas y cambios de contraseña) con filtro de periodo (por defecto el mes actual, en días de Bolivia); ambos usan los mismos botones de periodo (`PeriodPresets`), filtros por evento y usuario, paginación de 20 en 20 y exportación a Excel.

**Exportar a Excel** (`useAdminExcelExport`, `ExportButton`): el Resumen General (del periodo elegido), Usuarios, Cargos, Secciones e Historial de Accesos tienen su botón, que exporta lo que se está viendo con el mismo estilo (encabezado rojo MAXAM y nombre con la fecha).

**Recordatorios** (`ReminderSettingsPage`, `useReminderSettings`): el administrador activa o desactiva el resumen de pendientes por correo, elige los días de la semana y hasta 4 horas de envío (hora de Bolivia), y ve un resumen en lenguaje natural de cuándo saldrá. El backend aplica los cambios al guardar, sin reiniciarse. Desde la misma pantalla puede ver una vista previa de a quién le llegaría el resumen con los pendientes actuales y enviarlo en el momento.

### Casquito

Mascota que saluda una vez por pantalla y sesión con un mensaje según la hora y los pendientes. Se puede desactivar en Ajustes de Cuenta y respeta la preferencia de reducir movimiento.

## Documentación de componentes

Los componentes de `components/ui/`, todos los átomos de `features/` y las moléculas reutilizables están documentados con Storybook (cada historia junto a su componente). Cada historia describe el propósito del componente y sus variantes principales; los componentes con estado interno (dropdowns, diálogos) incluyen un wrapper interactivo para probarlos en vivo.

```bash
npm run storybook
```

## Pruebas automáticas

| Tipo | Qué prueba | Comando | Dónde |
|---|---|---|---|
| Unitarias | Componentes y utilidades: estados del control diario, periodos, Excel, cantidades con decimales del detalle de factura | `npm test` | Junto a cada archivo (`*.test.js`, `*.test.jsx`) |
| De extremo a extremo | El sistema completo en un navegador real: ingreso por rol, monto calculado del viaje, control diario, tipo de cambio de los tramos y exportaciones | `npm run test:e2e` | `e2e/` |

Las pruebas unitarias no necesitan nada más. Las de extremo a extremo necesitan el backend y el frontend levantados con la base de prueba (organización de `testing_02_organizacion_prueba.sql`); `E2E_BASE_URL` y `E2E_API_URL` indican dónde están (por defecto `localhost:5173` y `localhost:5055`). La primera vez hay que instalar el navegador con `npx playwright install chromium`.

En GitHub las pruebas se ejecutan solas en cada `push` y pull request (`.github/workflows/pruebas.yml`): compila el proyecto y Storybook, corre las pruebas unitarias y, para las de extremo a extremo, descarga el backend de la misma rama, crea una base temporal y levanta todo. Si algo falla, el reporte con capturas queda en la pestaña **Actions**.

## Convenciones

Ver `reglas.md` en la raíz del repositorio.