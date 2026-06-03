import { useState, useEffect, useCallback } from 'react'
import { getMe } from '../services/dashboardService'

function useMenu() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  const cargarUsuario = useCallback(async () => {
    try {
      const data = await getMe()
      if (!data.error) {
        setUsuario(data)
      }
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

  const abrirMenu = () => {
    cargarUsuario()
    setMenuAbierto(true)
  }

  const cerrarMenu = () => setMenuAbierto(false)

  const handleSessionExpiredClose = () => {
    localStorage.removeItem('token')
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