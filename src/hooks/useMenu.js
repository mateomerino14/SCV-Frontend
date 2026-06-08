import { useState, useEffect, useCallback } from 'react'
import { getMe } from '../services/dashboardService'
import { logout } from '../services/authService'

function useMenu() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  const cargarUsuario = useCallback(async () => {
    try {
      const data = await getMe()
      if (!data.error) setUsuario(data)
    } catch (e) {
      console.error('Error al cargar usuario:', e)
    }
  }, [])

  useEffect(() => {
    cargarUsuario()
  }, [cargarUsuario])

  useEffect(() => {
    const handleExpired = () => setSessionExpired(true)
    window.addEventListener('session-expired', handleExpired)
    return () => window.removeEventListener('session-expired', handleExpired)
  }, [])

  useEffect(() => {
    const intervalo = setInterval(async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      await getMe()
    }, 5 * 60 * 1000)
    return () => clearInterval(intervalo)
  }, [])

  const abrirMenu = () => {
    cargarUsuario()
    setMenuAbierto(true)
  }

  const cerrarMenu = () => setMenuAbierto(false)

  const handleSessionExpiredClose = async () => {
    await logout()
    setSessionExpired(false)
    window.location.href = '/'
  }

  return {
    menuAbierto,
    usuario,
    abrirMenu,
    cerrarMenu,
    cargarUsuario,
    sessionExpired,
    handleSessionExpiredClose,
  }
}

export default useMenu;