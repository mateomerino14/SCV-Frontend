import { useState, useEffect } from 'react'
import {
  getDetalleViajePrevioSupervisor,
  aprobarViajePrevioSupervisor,
  rechazarViajePrevioSupervisor,
  agregarComentarioViajePrevio,
  editarComentarioViajePrevio,
  eliminarComentarioViajePrevio,
} from '../services/supervisorService'

function useDetalleViajePrevioSupervisor(id_viaje) {
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [error, setError] = useState('')
  const [errorModal, setErrorModal] = useState('')
  const [bloqueado, setBloqueado] = useState(false)
  const [showAprobar, setShowAprobar] = useState(false)
  const [showRechazar, setShowRechazar] = useState(false)
  const [showSinObservaciones, setShowSinObservaciones] = useState(false)
  const [accionCompletada, setAccionCompletada] = useState(null)
  const [observaciones, setObservaciones] = useState([''])
  const [comentarioAgregado, setComentarioAgregado] = useState(false)
  const [comentarioEditando, setComentarioEditando] = useState(null)
  const [comentarioEliminando, setComentarioEliminando] = useState(null)
  const [textoEdicion, setTextoEdicion] = useState('')

  useEffect(() => {
    if (!id_viaje) return
    const cargar = async () => {
      setLoading(true)
      const data = await getDetalleViajePrevioSupervisor(id_viaje)
      setLoading(false)
      if (data.error) {
        if (data.error.includes('siendo revisado')) { setBloqueado(true); setError(data.error) }
        else setError(data.error)
        return
      }
      setDatos(data)
    }
    cargar()
  }, [id_viaje])

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const mostrarErrorModal = (msg) => {
    setErrorModal(msg)
    setTimeout(() => setErrorModal(''), 3000)
  }

  const handleAprobar = async () => {
    setShowAprobar(false)
    setLoadingAccion(true)
    const data = await aprobarViajePrevioSupervisor(id_viaje)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setAccionCompletada('APROBADO_VIAJE')
    setDatos(prev => ({ ...prev, viaje: { ...prev.viaje, estado: 'APROBADO_VIAJE' } }))
  }

  const handlePedirRechazar = () => {
  const obsGuardadas = (datos?.comentarios || []).filter(c => c.tipo === 'OBSERVACION')
  if (obsGuardadas.length === 0) { setShowSinObservaciones(true); return }
  setShowRechazar(true)
}

  const handleRechazar = async () => {
    setShowRechazar(false)
    setLoadingAccion(true)
    const data = await rechazarViajePrevioSupervisor(id_viaje)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setAccionCompletada('RECHAZADO')
    setDatos(prev => ({ ...prev, viaje: { ...prev.viaje, estado: 'RECHAZADO' } }))
  }

  const handleAgregarComentario = async () => {
    const texto = observaciones[0] || ''
    if (!texto.trim()) return
    setLoadingAccion(true)
    const data = await agregarComentarioViajePrevio(id_viaje, texto.trim())
    setLoadingAccion(false)
    if (data.error) {
      mostrarErrorModal(data.error)
      return
    }
    setComentarioAgregado(true)
    setObservaciones([''])
    const updated = await getDetalleViajePrevioSupervisor(id_viaje)
    if (!updated.error) setDatos(updated)
  }

  const editarObservacion = (index, texto) => {
    setObservaciones(prev => {
      const nuevo = [...prev]
      nuevo[index] = texto
      return nuevo
    })
  }

  const resetComentarioAgregado = () => setComentarioAgregado(false)

  const handleAbrirEdicion = (obs) => {
    setComentarioEditando(obs.id_comentario)
    setTextoEdicion(obs.descripcion)
  }

  const handleConfirmarEdicion = async () => {
    if (!textoEdicion.trim()) return
    setLoadingAccion(true)
    const data = await editarComentarioViajePrevio(id_viaje, comentarioEditando, textoEdicion.trim())
    setLoadingAccion(false)
    if (data.error) { mostrarErrorModal(data.error); return }
    setComentarioEditando(null)
    setTextoEdicion('')
    const updated = await getDetalleViajePrevioSupervisor(id_viaje)
    if (!updated.error) setDatos(updated)
  }

  const handleAbrirEliminacion = (id_comentario) => setComentarioEliminando(id_comentario)

  const handleConfirmarEliminacion = async () => {
    setLoadingAccion(true)
    const data = await eliminarComentarioViajePrevio(id_viaje, comentarioEliminando)
    setLoadingAccion(false)
    if (data.error) { mostrarErrorModal(data.error); return }
    setComentarioEliminando(null)
    const updated = await getDetalleViajePrevioSupervisor(id_viaje)
    if (!updated.error) setDatos(updated)
  }

  return {
    datos, loading, loadingAccion, error, errorModal, bloqueado,
    showAprobar, setShowAprobar,
    showRechazar, setShowRechazar,
    showSinObservaciones, setShowSinObservaciones,
    accionCompletada,
    observaciones,
    comentarioAgregado, resetComentarioAgregado,
    comentarioEditando, setComentarioEditando,
    comentarioEliminando, setComentarioEliminando,
    textoEdicion, setTextoEdicion,
    handleAprobar, handlePedirRechazar, handleRechazar,
    handleAgregarComentario, editarObservacion,
    handleAbrirEdicion, handleConfirmarEdicion,
    handleAbrirEliminacion, handleConfirmarEliminacion,
  }
}

export default useDetalleViajePrevioSupervisor;