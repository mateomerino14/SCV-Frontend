import api from './api'

export const getPendientesRevisor = async (filtros = {}) => {
  try {
    const params = {}
    if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio
    if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin
    if (filtros.id_empleado) params.id_empleado = filtros.id_empleado
    const res = await api.get('/revisor/pendientes', { params })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener pendientes' }
  }
}

export const getMisRevisionesRevisor = async (filtros = {}) => {
  try {
    const params = {}
    if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio
    if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin
    if (filtros.id_empleado) params.id_empleado = filtros.id_empleado
    const res = await api.get('/revisor/mis-revisiones', { params })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener mis revisiones' }
  }
}

export const tomarRevisionRevisor = async (id_viaje) => {
  try {
    const res = await api.post(`/revisor/${id_viaje}/tomar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al tomar la revisión' }
  }
}

export const devolverRevisionRevisor = async (id_viaje) => {
  try {
    const res = await api.post(`/revisor/${id_viaje}/devolver`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al devolver la revisión' }
  }
}

export const getDetalleRevisor = async (id_viaje) => {
  try {
    const res = await api.get(`/revisor/${id_viaje}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener detalle' }
  }
}

export const aprobarViajeRevisor = async (id_viaje) => {
  try {
    const res = await api.post(`/revisor/${id_viaje}/aprobar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al aprobar' }
  }
}

export const rechazarViajeRevisor = async (id_viaje, observaciones) => {
  try {
    const res = await api.post(`/revisor/${id_viaje}/rechazar`, { observaciones })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al rechazar' }
  }
}

export const agregarComentarioRevisor = async (id_viaje, descripcion) => {
  try {
    const res = await api.post(`/revisor/${id_viaje}/comentario`, { descripcion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al agregar comentario' }
  }
}

export const editarComentarioRevisor = async (id_viaje, id_comentario, descripcion) => {
  try {
    const res = await api.put(`/revisor/${id_viaje}/comentario/${id_comentario}`, { descripcion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al editar comentario' }
  }
}

export const eliminarComentarioRevisor = async (id_viaje, id_comentario) => {
  try {
    const res = await api.delete(`/revisor/${id_viaje}/comentario/${id_comentario}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al eliminar comentario' }
  }
}

export const getEmpleadosRevisor = async () => {
  try {
    const res = await api.get('/usuario/empleados')
    return res.data
  } catch (error) {
    return { error: 'Error al obtener empleados' }
  }
}