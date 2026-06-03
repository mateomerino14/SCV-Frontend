import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const getToken = () => localStorage.getItem('token')

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const mensaje = error.response?.data?.error || ''
    if (
      status === 401 ||
      (status === 400 && mensaje.includes('Token inválido'))
    ) {
      window.dispatchEvent(new CustomEvent('session-expired'))
    }
    return Promise.reject(error)
  }
)

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

export const enviarRevision = async (id_viaje, justificacion) => {
  try {
    const res = await api.put(`/viaje/${id_viaje}/enviar-revision`, { justificacion })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al enviar a revisión' }
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
    const token = getToken()
    const res = await axios.post(`${BASE_URL}/factura/extraer`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    })
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
    const token = getToken()
    const res = await axios.post(`${BASE_URL}/factura/guardar`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al guardar la factura' }
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
    const token = getToken()
    const res = await axios.post(`${BASE_URL}/gasto/registrar`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al registrar el gasto' }
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
    const token = getToken()
    const res = await axios.put(`${BASE_URL}/gasto/${id_gasto}/actualizar`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al actualizar el gasto' }
  }
}

export const actualizarFactura = async (id_gasto, datos, imagenFile) => {
  try {
    const formData = new FormData()
    formData.append('datos', JSON.stringify(datos))
    if (imagenFile) formData.append('imagen', imagenFile)
    const token = getToken()
    const res = await axios.put(`${BASE_URL}/factura/${id_gasto}/actualizar`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al actualizar la factura' }
  }
}

export const getHistorialViajes = async () => {
  try {
    const res = await api.get('/viaje/historial')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener el historial de viajes' }
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
    const token = getToken()
    const res = await axios.put(`${BASE_URL}/usuario/me/foto`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al actualizar la foto' }
  }
}