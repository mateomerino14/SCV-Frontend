==========APUNTES DE MEDIDAS============
// sm → 640px (pantallas pequeñas)
// md → 768px (tablets)
// lg → 1024px (laptops)
// xl → 1280px (desktops)
// 2xl → 1536px (pantallas grandes)

==========COREECCIONES PENDIENTES============
[X] Numero de Dependencia de Empleado

[X] Numero de Sección

[X] Nuevo Rol (Funcionalidades)

[X] Exportar a Excel informes o datos de facturas

[X] Aprobar o rechazar viajes

[X] Listado de viajes aprobados por el supervisor con sus respectivas alertas

[X] Visualización de detalles de facturas y gastos

[X] Historial de revisiones realizadas

[?] Retención en factura (definir comportamiento)

[?] Ver el tema de eliminar viajes cada cierto periodo, consultar eso

[?] Consultar mejora en cuanto a la api de deteccion de imagen

[?] Validación de facturas: impedir registrar facturas del mismo proveedor en la misma fecha (confirmar requerimiento)

[X] Cambio obligatorio de contraseña cada 90 días

[X] Página 404

[X] Mejorar el manejo de sesión expirada. En algunos casos, al navegar entre páginas cuando el token expira, se muestra un error de carga o autorización, pero no aparece el popup de sesión expirada.

[X] Corregir bug de corregir seleccion de facturas, porque cuando elijo a una para que se despliegue la otra o demas deberian cerrarse, osea solo puedo abrir una a la vez.

[X] Agregar el estado de Eliminando al boton de eliminar gasto, para que cuando le de click hasta que se este eliminando el usuario no piense que el sistema se tranco, sino que esta eliminando.

[X] Permitir que un empleado vuelva a enviar un viaje rechazado.

[X] Corregir la navegación mediante la flecha de retorno en las páginas de detalle. Actualmente el comportamiento varía según la sección desde la que se accedió (viajes en curso, historial o detalle de gasto), generando retornos inconsistentes.

[X] Optimizar el uso de IA almacenando los resultados de análisis y alertas de facturas (bebidas alcohólicas, exceso de gasto, etc.) para evitar consultas repetidas y reducir el consumo de la API.

[X] Mejorar la experiencia del mapa al registrar un viaje: - Permitir búsqueda por dirección. - Mostrar sugerencias de ubicaciones. - Agregar opción de ubicación actual. - Facilitar la selección de destinos de forma similar a Google Maps.

[X] Agregar validaciones en los formularios de registro y modificación de empleados para el rol Administrador.

[X] Evitar revisiones duplicadas. Cuando un supervisor o revisor esté evaluando una solicitud, marcarla o bloquearla temporalmente para que otro usuario no la revise al mismo tiempo.

[X] Mejorar la apariencia visual de las etiquetas de estado.

[X] Unificar el diseño de los cards de "Sin viajes en curso" en todas las secciones, manteniendo una presentación consistente y más atractiva.

[X] Ver la implementación de Access Token + Refresh Token para gestionar cambios de rol y permisos. Cuando un administrador modifique el cargo o rol de un usuario, su sesión actual debe invalidarse automáticamente, obligándolo a iniciar sesión nuevamente para que se apliquen los nuevos permisos.

[X] Ajustar los filtros de viajes en el historial, ya que se realizaron cambios en los nombres de los estados (por ejemplo, de "Aceptado" a "Aprobado"). Revisar también otras secciones que puedan verse afectadas por estos cambios para asegurar la correcta aplicación de los filtros.

[X] Revisar las reglas de visibilidad y permisos según el rol: - Un revisor no debe visualizar ni gestionar sus propios viajes. - Un revisor o supervisor no debe poder calificarse, aprobarse o revisarse a sí mismo un viaje. - Validar si es correcto que un administrador visualice su propio usuario en los módulos de administración. - Verificar otros escenarios similares para garantizar la coherencia de permisos y evitar acciones sobre registros propios.

[X] Se egrega doble observacion repetida cuando agrego una, por alguna razon al revisar

[X] Que las etiquetas que dice especialmente aprobacion preeliminar y aprobacion final no sean largas sino abreviar por ejemplo APR.PREELIMINAR APR.FINAL

[X] Que los controles de que un viaje no puede ser revisado por dos personas, osea sea entre supervisores y entre revisores, osea si un empleado esta viendo por ejemplo detalles de su viaje enviado a revision, es ilogico que me bloquees el acceso a mi como supervisor, osea que ese control se aplica a empleados con mismos roles comoo revisores y por otro lado entre supervisores

[X] Ver correo oficial, arreglar, en el deploy se bueguea el envio de correo por alguna razon, exnvio, no pasa al pop up de verificacion o de codigo de verificacion, directo a lo que es codigo ha expirado, se queda en el pop up de ingrese su correo electronico con el boton que dice enviando

[X] Al editar un gasto de factura no me dejar editar el iva o bueno puedo editarlo pero al darle a guardar no guarda en ninguno sea factura o recibo, ni en registrar ni en editar

[?] Añadir memorandum o correo de autorizacion al solicitar revision o al inciar el viaje, no le comprendi muy bien.

[?] Ajustar el presupuesto porque puede variar del viaje , seri talvez mejor que el empleado escriba, osea los empleados tiene presupuesto por categorizacion actualmente, pero puede varias porque pueden presentar carta para solicitar mas.

[?] Revisar el tema de las retenciones:

1. Del 8 % con bienes, 5% , 3% del ite compras de bienes

2. Servicio 13%,3%

3. Sin retenciones (por motivo de proveedor, algo asi)

(Revisar del excel, que calcule automaticamente, ya que son procentajes fijos del total)

[?] Numero de telefono al registrar un usuario por alguna razon de convirtio en algo obligatorio, cuando es opcional en la interfaz.

[?] Revisar el tema de degradar o subir el cargo, porque no actualiza con el usemenu que se modifico, no vota como en teoria deberia al mosidicar el cargo.

[?] De la nada en algunos roles al poco tiempo me sale session expirada y me vota.

[?] Registrar facturas con fechas que esten en el rango de tiempo del viaje (En teoria los empleados tienen 48 horas habiles despues del viaje para normalizer el proceso de un viaje en el Sistema actual manual).

[?] Revisar el tema del refresh, actualiza los roles pero el menu por rol se buguea, cuando cambio de roles, no vota de inmediato, se buegua a ratos.

[?] No sale un viaje rechazado de un empleado, es decir cuando un viaje es rechazado por un supervisor, en su historial de revisiones en rechazado no sale, revisar para revisor mas por si acaso.

[?] Ajustar el ticket de pendiente de las cards de revisiones pendientes o que estan siendo revisadas, porque se quedan en todos los estados en pendientes.

[?] Mejorar la responsividad, por ejemplo cuando registro un usuario con un nombre largo, se sale de la pantalla, o por ejemplo mateoEmpleado que es nombre y veo un viaje con el estado de APR.PRELIMINAR, chocan.

[?] Mejorar la responsividad porque en el campo de codigo de verificacion, los campos o cuadros donde van los numeros en mobile se salen del pop up, casi de la pantalla.

[?] Verificar el codigo de seguridad que expira, dado cierto tiempo que son los 5 min si no estoy mal.

[?] Ver el tema de mejorar de modelo, porque actualmente si reconoce el texto de la imagen, pero la imagen debe ser un pdf muy nitido, con fotos del celular falla.

[?] Verificar seguridad para evitar hackeos y demas, comprobar el nivel actual de seguridad.

[?] Refactorizacion

[?] Manuales

[?] Deployados
