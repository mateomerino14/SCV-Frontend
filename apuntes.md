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

[X] Revisar las reglas de visibilidad y permisos según el rol:
    - Un revisor no debe visualizar ni gestionar sus propios viajes.
    - Un revisor o supervisor no debe poder calificarse, aprobarse o revisarse a sí mismo un viaje.
    - Validar si es correcto que un administrador visualice su propio usuario en los módulos de administración.
    - Verificar otros escenarios similares para garantizar la coherencia de permisos y evitar acciones sobre registros propios.
