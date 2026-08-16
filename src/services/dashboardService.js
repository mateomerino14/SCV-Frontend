import api from './api'

export const getMe = async () => {
  try {
    const res = await api.get('/usuario/me')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener usuario' }
  }
}

export const getDashboard = async () => {
  try {
    const res = await api.get('/viaje/dashboard')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener dashboard' }
  }
}

export const crearViaje = async (viaje) => {
  try {
    const res = await api.post('/viaje', viaje)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al crear viaje' }
  }
}

export const obtenerDetalleViaje = async (id_viaje) => {
  try {
    const res = await api.get(`/viaje/${id_viaje}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener el viaje' }
  }
}

export const confirmarFinalizacion = async (id_viaje, justificacion) => {
  try {
    const res = await api.put(`/viaje/${id_viaje}/confirmar-finalizacion`, { justificacion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al confirmar finalización' }
  }
}

export const editarViaje = async (id_viaje, datos) => {
  try {
    const res = await api.put(`/viaje/${id_viaje}/editar`, datos)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al editar el viaje' }
  }
}

export const eliminarGasto = async (id_gasto) => {
  try {
    const res = await api.delete(`/gasto/${id_gasto}`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al eliminar el gasto' }
  }
}

export const extraerFactura = async (file) => {
  try {
    const formData = new FormData()
    formData.append('factura', file)
    const res = await api.post('/factura/extraer', formData)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al extraer la factura' }
  }
}

export const guardarFactura = async (datos, imagenFile) => {
  try {
    const formData = new FormData()
    formData.append('datos', JSON.stringify(datos))
    if (imagenFile) formData.append('imagen', imagenFile)
    const res = await api.post('/factura/guardar', formData)
    return res.data
  } catch (error) {
    return {
      error: error.response?.data?.error || 'Error al guardar la factura',
      requiereAutorizacion: !!error.response?.data?.requiereAutorizacion,
    }
  }
}

export const getCategorias = async () => {
  try {
    const res = await api.get('/categoriaGasto')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener las categorías' }
  }
}

export const registrarGasto = async (datos, imagenFile) => {
  try {
    const formData = new FormData()
    formData.append('datos', JSON.stringify(datos))
    if (imagenFile) formData.append('imagen', imagenFile)
    const res = await api.post('/gasto/registrar', formData)
    return res.data
  } catch (error) {
    return {
      error: error.response?.data?.error || 'Error al registrar el gasto',
      requiereAutorizacion: !!error.response?.data?.requiereAutorizacion,
    }
  }
}

export const obtenerDetalleGasto = async (id_gasto) => {
  try {
    const res = await api.get(`/gasto/${id_gasto}/detalle`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener el gasto' }
  }
}

export const actualizarGasto = async (id_gasto, datos, imagenFile) => {
  try {
    const formData = new FormData()
    formData.append('datos', JSON.stringify(datos))
    if (imagenFile) formData.append('imagen', imagenFile)
    const res = await api.put(`/gasto/${id_gasto}/actualizar`, formData)
    return res.data
  } catch (error) {
    return {
      error: error.response?.data?.error || 'Error al actualizar el gasto',
      requiereAutorizacion: !!error.response?.data?.requiereAutorizacion,
    }
  }
}

export const actualizarFactura = async (id_gasto, datos, imagenFile) => {
  try {
    const formData = new FormData()
    formData.append('datos', JSON.stringify(datos))
    if (imagenFile) formData.append('imagen', imagenFile)
    const res = await api.put(`/factura/${id_gasto}/actualizar`, formData)
    return res.data
  } catch (error) {
    return {
      error: error.response?.data?.error || 'Error al actualizar la factura',
      requiereAutorizacion: !!error.response?.data?.requiereAutorizacion,
    }
  }
}

export const getHistorialViajes = async (pagina = 1, limite = 20, filtro = 'TODOS') => {
  try {
    const res = await api.get('/viaje/historial', { params: { pagina, limite, filtro } })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener el historial' }
  }
}

export const cambiarContrasenia = async (contrasenia_actual, contrasenia_nueva) => {
  try {
    const res = await api.put('/usuario/me/cambiar-contrasenia', { contrasenia_actual, contrasenia_nueva })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al cambiar la contraseña' }
  }
}

export const actualizarPerfil = async (datos) => {
  try {
    const res = await api.put('/usuario/me/actualizar', datos)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al actualizar el perfil' }
  }
}

export const actualizarFotoPerfil = async (imagenFile) => {
  try {
    const formData = new FormData()
    formData.append('foto', imagenFile)
    const res = await api.put('/usuario/me/foto', formData)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al actualizar la foto' }
  }
}

export const enviarReciboAgrupado = async (id_viaje, tipo, internacional = false) => {
  try {
    const res = await api.post(`/gasto/viaje/${id_viaje}/recibo/${tipo}`, null, { params: { internacional } })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al generar el recibo' }
  }
}


export const enviarReciboIndividual = async (id_gasto) => {
  try {
    const res = await api.post(`/gasto/${id_gasto}/recibo`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al generar el recibo' }
  }
}


export const enviarViajeARevision = async (id_viaje) => {
  try {
    const res = await api.put(`/viaje/${id_viaje}/enviar-revision`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al enviar el viaje a revisión' }
  }
}