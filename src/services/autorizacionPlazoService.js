import api from './api'

export const solicitarAutorizacion = async (id_viaje, motivo) => {
  try {
    const res = await api.post(`/autorizacion-plazo/viaje/${id_viaje}/solicitar`, { motivo })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al enviar la solicitud' }
  }
}

export const getEstadoSolicitud = async (id_viaje) => {
  try {
    const res = await api.get(`/autorizacion-plazo/viaje/${id_viaje}/estado`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al consultar la solicitud' }
  }
}

export const getSolicitudesPendientes = async () => {
  try {
    const res = await api.get('/autorizacion-plazo/pendientes')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener solicitudes' }
  }
}

export const getSolicitudesHistorial = async () => {
  try {
    const res = await api.get('/autorizacion-plazo/historial')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener historial' }
  }
}

export const aprobarSolicitud = async (id_solicitud) => {
  try {
    const res = await api.post(`/autorizacion-plazo/${id_solicitud}/aprobar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al aprobar la solicitud' }
  }
}

export const rechazarSolicitud = async (id_solicitud, observacion) => {
  try {
    const res = await api.post(`/autorizacion-plazo/${id_solicitud}/rechazar`, { observacion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al rechazar la solicitud' }
  }
}