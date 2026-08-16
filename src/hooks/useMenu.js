import { useState, useEffect, useCallback, useRef } from 'react'
import { getMe } from '../services/dashboardService'
import { logout } from '../services/authService'
import { jwtDecode } from 'jwt-decode'

function getRolFromToken() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    return jwtDecode(token)?.id_rol
  } catch { return null }
}

function useMenu() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)
  const rolOriginalRef = useRef(getRolFromToken())

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
    const verificarRol = async () => {
      const token = localStorage.getItem('token')
      if (!token || !rolOriginalRef.current) return
      try {
        const data = await getMe()
        if (data.error) return
        if (data.id_rol !== rolOriginalRef.current) {
          localStorage.removeItem('token')
          window.dispatchEvent(new CustomEvent('session-expired'))
          return
        }
        setUsuario(data)
      } catch {}
    }

    const handleTokenRefreshed = () => {
      const nuevoRol = getRolFromToken()
      if (nuevoRol && rolOriginalRef.current && nuevoRol !== rolOriginalRef.current) {
        localStorage.removeItem('token')
        window.dispatchEvent(new CustomEvent('session-expired'))
      }
    }

    const intervalo = setInterval(verificarRol, 30 * 1000)
    window.addEventListener('token-refreshed', handleTokenRefreshed)

    return () => {
      clearInterval(intervalo)
      window.removeEventListener('token-refreshed', handleTokenRefreshed)
    }
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