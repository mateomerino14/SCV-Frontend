import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let estaRefrescando = false
let colaEspera = []

const procesarCola = (error, token = null) => {
  colaEspera.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  colaEspera = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const solicitudOriginal = error.config
    const status = error.response?.status
    const mensaje = error.response?.data?.error || ''

    const esRutaLogin = solicitudOriginal.url?.includes('/login') &&
      !solicitudOriginal.url?.includes('/login/refresh') &&
      !solicitudOriginal.url?.includes('/login/send-code') &&
      !solicitudOriginal.url?.includes('/login/verify-code')

    if (esRutaLogin) {
      return Promise.reject(error)
    }

    const esTokenExpirado = status === 401 && mensaje === 'Token expirado'
    const esTokenInvalido = status === 401 && mensaje.includes('Token inválido')
    const esSuspendido = status === 401 && (
      mensaje.includes('suspendida') ||
      mensaje.includes('Usuario no válido')
    )
    const esSinToken = status === 401 && mensaje.includes('token no proporcionado')
    const esRutaRefresh = solicitudOriginal.url?.includes('/login/refresh')

    if (esRutaRefresh || esSuspendido || esSinToken || esTokenInvalido) {
      localStorage.removeItem('token')
      window.dispatchEvent(new CustomEvent('session-expired'))
      return Promise.reject(error)
    }

    if (esTokenExpirado && !solicitudOriginal._reintentado) {
      if (estaRefrescando) {
        return new Promise((resolve, reject) => {
          colaEspera.push({ resolve, reject })
        }).then((token) => {
          solicitudOriginal.headers.Authorization = `Bearer ${token}`
          return api(solicitudOriginal)
        }).catch((err) => Promise.reject(err))
      }

      solicitudOriginal._reintentado = true
      estaRefrescando = true

      try {
        const res = await axios.post(`${BASE_URL}/login/refresh`, {}, { withCredentials: true })
        const nuevoToken = res.data.token
        localStorage.setItem('token', nuevoToken)
        api.defaults.headers.common.Authorization = `Bearer ${nuevoToken}`
        procesarCola(null, nuevoToken)
        solicitudOriginal.headers.Authorization = `Bearer ${nuevoToken}`
        window.dispatchEvent(new CustomEvent('token-refreshed'))
        return api(solicitudOriginal)
      } catch (refreshError) {
        procesarCola(refreshError, null)
        localStorage.removeItem('token')
        window.dispatchEvent(new CustomEvent('session-expired'))
        return Promise.reject(refreshError)
      } finally {
        estaRefrescando = false
      }
    }

    return Promise.reject(error)
  }
)

export default api;