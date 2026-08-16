import api from './api'

export const getMiCargo = async () => {
  try {
    const res = await api.get('/usuario/mi-cargo')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener cargo' }
  }
}