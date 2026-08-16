import api from './api'

export const getViajesPendientesTesorero = async (filtros = {}) => {
  try {
    const params = {}
    if (filtros.fecha_inicio) params.fecha_inicio = filtros.fecha_inicio
    if (filtros.fecha_fin) params.fecha_fin = filtros.fecha_fin
    if (filtros.id_empleado) params.id_empleado = filtros.id_empleado
    const res = await api.get('/tesorero/viajes-pendientes', { params })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener viajes pendientes' }
  }
}

export const getMisViajesTesorero = async () => {
  try {
    const res = await api.get('/tesorero/mis-viajes')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener mis viajes' }
  }
}

export const getDetalleTesorero = async (id_viaje) => {
  try {
    const res = await api.get(`/tesorero/${id_viaje}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener detalle' }
  }
}

export const editarMontosTesorero = async (id_viaje, monto_asignado, monto_asignado_usd) => {
  try {
    const res = await api.put(`/tesorero/${id_viaje}/montos`, { monto_asignado, monto_asignado_usd })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al actualizar los montos' }
  }
}

export const aprobarViajeTesorero = async (id_viaje) => {
  try {
    const res = await api.post(`/tesorero/${id_viaje}/aprobar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al aprobar' }
  }
}

export const rechazarViajeTesorero = async (id_viaje) => {
  try {
    const res = await api.post(`/tesorero/${id_viaje}/rechazar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al rechazar' }
  }
}

export const agregarComentarioTesorero = async (id_viaje, descripcion) => {
  try {
    const res = await api.post(`/tesorero/${id_viaje}/comentario`, { descripcion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al agregar comentario' }
  }
}

export const editarComentarioTesorero = async (id_viaje, id_comentario, descripcion) => {
  try {
    const res = await api.put(`/tesorero/${id_viaje}/comentario/${id_comentario}`, { descripcion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al editar comentario' }
  }
}

export const eliminarComentarioTesorero = async (id_viaje, id_comentario) => {
  try {
    const res = await api.delete(`/tesorero/${id_viaje}/comentario/${id_comentario}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al eliminar comentario' }
  }
}

export const getEmpleadosTesorero = async () => {
  try {
    const res = await api.get('/usuario/empleados')
    return res.data
  } catch (error) {
    return { error: 'Error al obtener empleados' }
  }
}