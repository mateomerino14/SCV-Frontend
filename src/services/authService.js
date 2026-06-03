import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const login = async (email, password) => {
  try {
    const res = await api.post('/login', { email_corporativo: email, contrasenia: password })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Credenciales incorrectas' }
  }
}

export const checkEmail = async (email) => {
  try {
    const res = await api.post('/usuario/check-email', { email_corporativo: email })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al verificar email' }
  }
}

export const sendCode = async (email) => {
  try {
    const res = await api.post('/login/send-code', { email_corporativo: email })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al enviar código' }
  }
}

export const verifyCode = async (email, codigo) => {
  try {
    const res = await api.post('/login/verify-code', { email_corporativo: email, codigo })
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Código incorrecto' }
  }
}