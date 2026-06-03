import { useState, useEffect } from 'react'
import { getDetalleRevisor, aprobarViajeRevisor, rechazarViajeRevisor, agregarComentarioRevisor, editarComentarioRevisor, eliminarComentarioRevisor } from '../services/revisorService'

function useDetalleRevisor(id_viaje) {
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [error, setError] = useState('')
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
      if (!data.error) setDatos(data)
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

  const editarObservacion = (index, valor) => {
    setObservaciones((prev) => { const n = [...prev]; n[index] = valor; return n })
  }

  const handleAgregarComentario = async () => {
    const obs = observaciones.filter((o) => o.trim() !== '')
    if (obs.length === 0) { mostrarError('Agrega al menos una observación'); return }
    setLoadingAccion(true)
    for (const o of obs) await agregarComentarioRevisor(id_viaje, o)
    setLoadingAccion(false)
    setObservaciones([''])
    setComentarioAgregado(true)
    const data = await getDetalleRevisor(id_viaje)
    if (!data.error) setDatos(data)
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
    datos, loading, loadingAccion, error,
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
    handleAgregarComentario,
    handleAbrirEdicion, handleConfirmarEdicion,
    handleAbrirEliminacion, handleConfirmarEliminacion,
    editarObservacion,
  }
}

export default useDetalleRevisor;