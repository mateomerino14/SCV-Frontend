import { useState, useEffect } from 'react'
import { getDetalleRevisor, aprobarViajeRevisor, rechazarViajeRevisor, agregarComentarioRevisor, editarComentarioRevisor, eliminarComentarioRevisor, devolverRevisionRevisor } from '../services/revisorService'

function useDetalleRevisor(id_viaje) {
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [error, setError] = useState('')
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
      const data = await getDetalleRevisor(id_viaje)
      setLoading(false)
      if (data.error) {
        setError(data.error)
        setBloqueado(true)
        return
      }
      setDatos(data)
    }

    cargar()
  }, [id_viaje])

  const mostrarError = (msg) => { setError(msg); setTimeout(() => setError(''), 3000) }

  const handleAprobar = async () => {
    setLoadingAccion(true)
    const data = await aprobarViajeRevisor(id_viaje)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowAprobar(false)
    setAccionCompletada('APROBADO_FINAL')
    setDatos((prev) => ({ ...prev, viaje: { ...prev.viaje, estado: 'APROBADO_FINAL' } }))
  }

  const handlePedirRechazar = () => {
    const obsGuardadas = (datos?.comentarios || []).filter((c) => c.tipo === 'OBSERVACION')
    if (obsGuardadas.length === 0) {
      setShowSinObservaciones(true)
    } else {
      setShowRechazar(true)
    }
  }

  const handleRechazar = async () => {
    const obsGuardadas = (datos?.comentarios || []).filter((c) => c.tipo === 'OBSERVACION')
    const textos = obsGuardadas.map((o) => o.descripcion)
    setLoadingAccion(true)
    const data = await rechazarViajeRevisor(id_viaje, textos)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowRechazar(false)
    setAccionCompletada('RECHAZADO')
    setDatos((prev) => ({ ...prev, viaje: { ...prev.viaje, estado: 'RECHAZADO' } }))
  }

  const handleDevolver = async () => {
    const data = await devolverRevisionRevisor(id_viaje)
    if (data.error) { mostrarError(data.error); return }
    window.history.back()
  }

  const editarObservacion = (index, valor) => {
    setObservaciones((prev) => { const n = [...prev]; n[index] = valor; return n })
  }

  const handleAgregarComentario = async () => {
    const texto = observaciones[0]?.trim()
    if (!texto) { mostrarError('Debes escribir una observación'); return }
    setLoadingAccion(true)
    const data = await agregarComentarioRevisor(id_viaje, texto)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setObservaciones([''])
    setComentarioAgregado(true)
    const updated = await getDetalleRevisor(id_viaje)
    if (!updated.error) setDatos(updated)
  }

  const handleAbrirEdicion = (obs) => {
    setComentarioEditando(obs.id_comentario)
    setTextoEdicion(obs.descripcion)
  }

  const handleConfirmarEdicion = async () => {
    if (!textoEdicion.trim()) { mostrarError('El comentario no puede estar vacío'); return }
    setLoadingAccion(true)
    const data = await editarComentarioRevisor(id_viaje, comentarioEditando, textoEdicion)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setComentarioEditando(null)
    setTextoEdicion('')
    const updated = await getDetalleRevisor(id_viaje)
    if (!updated.error) setDatos(updated)
  }

  const handleAbrirEliminacion = (id) => setComentarioEliminando(id)

  const handleConfirmarEliminacion = async () => {
    setLoadingAccion(true)
    const data = await eliminarComentarioRevisor(id_viaje, comentarioEliminando)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setComentarioEliminando(null)
    const updated = await getDetalleRevisor(id_viaje)
    if (!updated.error) setDatos(updated)
  }

  return {
    datos, loading, loadingAccion, error, bloqueado,
    showAprobar, setShowAprobar,
    showRechazar, setShowRechazar,
    showSinObservaciones, setShowSinObservaciones,
    accionCompletada,
    observaciones,
    comentarioAgregado,
    resetComentarioAgregado: () => setComentarioAgregado(false),
    comentarioEditando, setComentarioEditando,
    comentarioEliminando, setComentarioEliminando,
    textoEdicion, setTextoEdicion,
    handleAprobar,
    handlePedirRechazar,
    handleRechazar,
    handleDevolver,
    handleAgregarComentario,
    handleAbrirEdicion, handleConfirmarEdicion,
    handleAbrirEliminacion, handleConfirmarEliminacion,
    editarObservacion,
  }
}

export default useDetalleRevisor;