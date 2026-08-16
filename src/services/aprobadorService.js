import api from './api'

export const getEmpleadosAprobador = async () => {
  try {
    const res = await api.get('/usuario/empleados')
    return res.data
  } catch (error) {
    return { error: 'Error al obtener empleados' }
  }
}

export const getViajesPendientesAprobador = async (filtros = {}) => {
  try {
    const params = {}
    if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio
    if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin
    if (filtros.id_empleado) params.id_empleado = filtros.id_empleado
    const res = await api.get('/aprobador/viajes-pendientes', { params })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener viajes pendientes' }
  }
}

export const getMisViajesAprobador = async () => {
  try {
    const res = await api.get('/aprobador/mis-viajes')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener mis viajes' }
  }
}

export const getDetalleViajePrevioAprobador = async (id_viaje) => {
  try {
    const res = await api.get(`/aprobador/viaje/${id_viaje}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener detalle' }
  }
}

export const aprobarViajePrevioAprobador = async (id_viaje) => {
  try {
    const res = await api.post(`/aprobador/viaje/${id_viaje}/aprobar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al aprobar' }
  }
}

export const rechazarViajePrevioAprobador = async (id_viaje) => {
  try {
    const res = await api.post(`/aprobador/viaje/${id_viaje}/rechazar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al rechazar' }
  }
}

export const agregarComentarioViajePrevioAprobador = async (id_viaje, descripcion) => {
  try {
    const res = await api.post(`/aprobador/viaje/${id_viaje}/comentario`, { descripcion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al agregar comentario' }
  }
}

export const editarComentarioViajePrevioAprobador = async (id_viaje, id_comentario, descripcion) => {
  try {
    const res = await api.put(`/aprobador/viaje/${id_viaje}/comentario/${id_comentario}`, { descripcion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al editar comentario' }
  }
}

export const eliminarComentarioViajePrevioAprobador = async (id_viaje, id_comentario) => {
  try {
    const res = await api.delete(`/aprobador/viaje/${id_viaje}/comentario/${id_comentario}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al eliminar comentario' }
  }
}