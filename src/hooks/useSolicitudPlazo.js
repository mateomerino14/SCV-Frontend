import { useState, useEffect } from 'react'
import { solicitarAutorizacion, getEstadoSolicitud } from '../services/autorizacionPlazoService'

function useSolicitudPlazo(id_viaje) {
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const cargar = async () => {
    if (!id_viaje) return
    setLoading(true)
    const data = await getEstadoSolicitud(id_viaje)
    setLoading(false)
    if (data.error) return
    setSolicitud(data)
  }

  useEffect(() => {
    cargar()
  }, [id_viaje])

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }

  const handleSolicitar = async (motivo) => {
    if (!motivo.trim()) { mostrarError('Debes indicar el motivo del retraso'); return false }
    setEnviando(true)
    const data = await solicitarAutorizacion(id_viaje, motivo.trim())
    setEnviando(false)
    if (data.error) { mostrarError(data.error); return false }
    setShowModal(false)
    await cargar()
    return true
  }

  const tienePendiente = solicitud?.estado === 'PENDIENTE'
  const fueRechazada = solicitud?.estado === 'RECHAZADA'
  const fueAprobadaVigente = solicitud?.estado === 'APROBADA' && !solicitud?.extension_vencida
  const fueAprobadaVencida = solicitud?.estado === 'APROBADA' && !!solicitud?.extension_vencida

  const puedeSolicitar = !solicitud || fueRechazada || fueAprobadaVencida

  return {
    solicitud, loading, enviando, error,
    showModal, setShowModal,
    tienePendiente, fueAprobada: fueAprobadaVigente, fueRechazada, fueAprobadaVencida, puedeSolicitar,
    handleSolicitar, recargar: cargar,
  }
}

export default useSolicitudPlazo;