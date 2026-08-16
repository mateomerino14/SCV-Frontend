import { useState, useEffect, useCallback } from 'react'
import { getSolicitudesPendientes, getSolicitudesHistorial, aprobarSolicitud, rechazarSolicitud } from '../services/autorizacionPlazoService'

const INTERVALO_POLLING = 30000

function useSolicitudesPlazo() {
  const [pendientes, setPendientes] = useState([])
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('PENDIENTES')

  const cargar = useCallback(async (mostrarLoading = true) => {
    if (mostrarLoading) setLoading(true)
    const [pend, hist] = await Promise.all([getSolicitudesPendientes(), getSolicitudesHistorial()])
    if (mostrarLoading) setLoading(false)
    if (pend.error) { if (mostrarLoading) setError(pend.error); return }
    if (hist.error) { if (mostrarLoading) setError(hist.error); return }
    setPendientes(pend)
    setHistorial(hist)
  }, [])

  useEffect(() => {
    cargar(true)
  }, [cargar])

  useEffect(() => {
    const interval = setInterval(() => {
      cargar(false)
    }, INTERVALO_POLLING)
    return () => clearInterval(interval)
  }, [cargar])

  const mostrarError = (msg) => { setError(msg); setTimeout(() => setError(''), 3000) }

  const handleAprobar = async (id_solicitud) => {
    setLoadingAccion(true)
    const data = await aprobarSolicitud(id_solicitud)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return false }
    await cargar(true)
    return true
  }

  const handleRechazar = async (id_solicitud, observacion) => {
    setLoadingAccion(true)
    const data = await rechazarSolicitud(id_solicitud, observacion)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return false }
    await cargar(true)
    return true
  }

  return {
    viajes: tab === 'PENDIENTES' ? pendientes : historial,
    totalPendientes: pendientes.length,
    loading, loadingAccion, error,
    tab, setTab,
    handleAprobar, handleRechazar,
  }
}

export default useSolicitudesPlazo;