import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { cambiarContrasenia } from '../services/dashboardService'

const leerContraseniavencida = () => {
  const token = localStorage.getItem('token')
  if (!token) return false
  try {
    const decoded = jwtDecode(token)
    return decoded.contraseniavencida === true
  } catch {
    return false
  }
}

function useContraseniavencida() {
  const [showModal, setShowModal] = useState(leerContraseniavencida)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleTokenRefreshed = () => {
      const vencida = leerContraseniavencida()
      if (vencida) setShowModal(true)
    }

    window.addEventListener('token-refreshed', handleTokenRefreshed)
    return () => window.removeEventListener('token-refreshed', handleTokenRefreshed)
  }, [])

  const handleCambio = async (actual, nueva) => {
    setError('')
    setLoading(true)
    const data = await cambiarContrasenia(actual, nueva)
    setLoading(false)
    if (data.error) { setError(data.error); return }
    setShowModal(false)
  }

  return { showModal, loading, error, handleCambio }
}

export default useContraseniavencida;