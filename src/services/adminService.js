import api from './api'

export const getUsuarios = async () => {
  try {
    const res = await api.get('/usuario/todos')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener usuarios' }
  }
}

export const crearUsuario = async (usuario) => {
  try {
    const res = await api.post('/usuario', usuario)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al crear usuario' }
  }
}

export const actualizarUsuario = async (id, datos) => {
  try {
    const res = await api.put(`/usuario/${id}`, datos)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al actualizar usuario' }
  }
}

export const suspenderUsuario = async (id) => {
  try {
    const res = await api.patch(`/usuario/${id}/suspender`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al suspender usuario' }
  }
}

export const activarUsuario = async (id) => {
  try {
    const res = await api.patch(`/usuario/${id}/activar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al activar usuario' }
  }
}

export const getCargos = async () => {
  try {
    const res = await api.get('/cargo')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener cargos' }
  }
}

export const crearCargo = async (cargo) => {
  try {
    const res = await api.post('/cargo', cargo)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al crear cargo' }
  }
}

export const actualizarCargo = async (id, datos) => {
  try {
    const res = await api.put(`/cargo/${id}`, datos)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al actualizar cargo' }
  }
}

export const suspenderCargo = async (id) => {
  try {
    const res = await api.patch(`/cargo/${id}/suspender`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al suspender cargo' }
  }
}

export const activarCargo = async (id) => {
  try {
    const res = await api.patch(`/cargo/${id}/activar`)
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al activar cargo' }
  }
}

export const getDashboardAdmin = async () => {
  try {
    const res = await api.get('/admin/dashboard')
    return res.data
  } catch (error) {
    return { error: error.response?.data?.error || 'Error al obtener dashboard' }
  }
}