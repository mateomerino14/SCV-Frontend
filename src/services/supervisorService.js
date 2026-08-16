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

export const getMisRevisiones = async (filtros = {}) => {
  try {
    const params = {}
    if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio
    if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin
    if (filtros.id_empleado) params.id_empleado = filtros.id_empleado
    const res = await api.get('/revision/mis-revisiones', { params })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener mis revisiones' }
  }
}

export const tomarRevision = async (id_viaje) => {
  try {
    const res = await api.post(`/revision/${id_viaje}/tomar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al tomar la revisión' }
  }
}

export const devolverRevision = async (id_viaje) => {
  try {
    const res = await api.post(`/revision/${id_viaje}/devolver`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al devolver la revisión' }
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

export const agregarComentario = async (id_viaje, descripcion, id_gasto = null) => {
  try {
    const res = await api.post(`/revision/${id_viaje}/comentario`, { descripcion, id_gasto })
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

export const getViajesPendientesSupervisor = async (filtros = {}) => {
  try {
    const params = {}
    if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio
    if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin
    if (filtros.id_empleado) params.id_empleado = filtros.id_empleado
    const res = await api.get('/revision/viajes-pendientes', { params })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener viajes pendientes' }
  }
}

export const getMisViajesSupervisor = async () => {
  try {
    const res = await api.get('/revision/mis-viajes')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener mis viajes' }
  }
}

export const tomarViajePreRevision = async (id_viaje) => {
  try {
    const res = await api.post(`/revision/viaje/${id_viaje}/tomar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al tomar el viaje' }
  }
}

export const devolverViajePreRevision = async (id_viaje) => {
  try {
    const res = await api.post(`/revision/viaje/${id_viaje}/devolver`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al devolver el viaje' }
  }
}

export const getDetalleViajePrevioSupervisor = async (id_viaje) => {
  try {
    const res = await api.get(`/revision/viaje/${id_viaje}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener detalle' }
  }
}

export const aprobarViajePrevioSupervisor = async (id_viaje) => {
  try {
    const res = await api.post(`/revision/viaje/${id_viaje}/aprobar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al aprobar' }
  }
}

export const rechazarViajePrevioSupervisor = async (id_viaje) => {
  try {
    const res = await api.post(`/revision/viaje/${id_viaje}/rechazar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al rechazar' }
  }
}

export const agregarComentarioViajePrevio = async (id_viaje, descripcion) => {
  try {
    const res = await api.post(`/revision/viaje/${id_viaje}/comentario`, { descripcion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al agregar comentario' }
  }
}

export const editarComentarioViajePrevio = async (id_viaje, id_comentario, descripcion) => {
  try {
    const res = await api.put(`/revision/viaje/${id_viaje}/comentario/${id_comentario}`, { descripcion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al editar comentario' }
  }
}

export const eliminarComentarioViajePrevio = async (id_viaje, id_comentario) => {
  try {
    const res = await api.delete(`/revision/viaje/${id_viaje}/comentario/${id_comentario}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al eliminar comentario' }
  }
}