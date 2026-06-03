import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { cambiarContrasenia } from '../services/dashboardService'

function useContraseniavencida() {
  const [showModal, setShowModal] = useState(() => {
    const token = localStorage.getItem('token')
    if (!token) return false
    try {
      const decoded = jwtDecode(token)
      return decoded.contraseniavencida === true
    } catch {
      return false
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCambio = async (actual, nueva) => {
    setError('')
    setLoading(true)
    const data = await cambiarContrasenia(actual, nueva)
    setLoading(false)
    if (data.error) {
      setError(data.error)
      return
    }
    setShowModal(false)
  }

  return { showModal, loading, error, handleCambio }
}

export default useContraseniavencida;