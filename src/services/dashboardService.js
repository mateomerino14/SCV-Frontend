const BASE_URL = import.meta.env.VITE_API_URL

const getToken = () => localStorage.getItem('token')

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
})

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/usuario/me`, { headers: headers() })
  return res.json()
}

export const getDashboard = async () => {
  const res = await fetch(`${BASE_URL}/viaje/dashboard`, { headers: headers() })
  return res.json()
}

export const crearViaje = async (viaje) => {
  const res = await fetch(`${BASE_URL}/viaje`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(viaje)
  })
  return res.json()
}