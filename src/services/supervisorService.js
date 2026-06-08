import api from './api'

export const getPendientes = async (filtros = {}) => {
  try {
    const params = {}
    if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio
    if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin
    if (filtros.id_empleado) params.id_empleado = filtros.id_empleado
    const res = await api.get('/revision/pendientes', { params })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener pendientes' }
  }
}

export const getHistorialRevisiones = async (filtros = {}) => {
  try {
    const params = {}
    if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio
    if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin
    if (filtros.id_empleado) params.id_empleado = filtros.id_empleado
    const res = await api.get('/revision/historial', { params })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener historial' }
  }
}

export const getDetalleRevision = async (id_viaje) => {
  try {
    const res = await api.get(`/revision/${id_viaje}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener detalle' }
  }
}

export const aprobarViaje = async (id_viaje) => {
  try {
    const res = await api.post(`/revision/${id_viaje}/aprobar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al aprobar' }
  }
}

export const rechazarViaje = async (id_viaje, observaciones) => {
  try {
    const res = await api.post(`/revision/${id_viaje}/rechazar`, { observaciones })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al rechazar' }
  }
}

export const getEmpleados = async () => {
  try {
    const res = await api.get('/usuario/empleados')
    return res.data
  } catch (error) {
    return { error: 'Error al obtener empleados' }
  }
}

export const agregarComentario = async (id_viaje, descripcion) => {
  try {
    const res = await api.post(`/revision/${id_viaje}/comentario`, { descripcion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al agregar comentario' }
  }
}

export const editarComentario = async (id_viaje, id_comentario, descripcion) => {
  try {
    const res = await api.put(`/revision/${id_viaje}/comentario/${id_comentario}`, { descripcion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al editar comentario' }
  }
}

export const eliminarComentario = async (id_viaje, id_comentario) => {
  try {
    const res = await api.delete(`/revision/${id_viaje}/comentario/${id_comentario}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al eliminar comentario' }
  }
}

export const bloquearRevision = async (id_viaje) => {
  try {
    const res = await api.post(`/revision/${id_viaje}/bloquear`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al bloquear revisión' }
  }
}

export const liberarRevision = async (id_viaje) => {
  try {
    const res = await api.post(`/revision/${id_viaje}/liberar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al liberar revisión' }
  }
}