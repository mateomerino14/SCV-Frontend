import { useState, useEffect } from 'react'
import { getDetalleRevision, aprobarViaje, rechazarViaje, agregarComentario, editarComentario, eliminarComentario, bloquearRevision, liberarRevision } from '../services/supervisorService'

function useDetalleRevision(id_viaje) {
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [error, setError] = useState('')
  const [bloqueado, setBloqueado] = useState(false)
  const [showAprobar, setShowAprobar] = useState(false)
  const [showRechazar, setShowRechazar] = useState(false)
  const [showSinObservaciones, setShowSinObservaciones] = useState(false)
  const [observaciones, setObservaciones] = useState([''])
  const [accionCompletada, setAccionCompletada] = useState(null)
  const [comentarioAgregado, setComentarioAgregado] = useState(false)
  const [comentarioEditando, setComentarioEditando] = useState(null)
  const [comentarioEliminando, setComentarioEliminando] = useState(null)
  const [textoEdicion, setTextoEdicion] = useState('')

  useEffect(() => {
    if (!id_viaje) return

    const cargar = async () => {
      setLoading(true)
      const bloqueo = await bloquearRevision(id_viaje)
      if (bloqueo.error) {
        setError(bloqueo.error)
        setBloqueado(true)
        setLoading(false)
        return
      }
      const data = await getDetalleRevision(id_viaje)
      setLoading(false)
      if (data.error) { setError(data.error); return }
      setDatos(data)
    }

    cargar()

    return () => {
      liberarRevision(id_viaje)
    }
  }, [id_viaje])

  const mostrarError = (msg) => { setError(msg); setTimeout(() => setError(''), 3000) }

  const recargar = async () => {
    const updated = await getDetalleRevision(id_viaje)
    if (!updated.error) setDatos(updated)
  }

  const handleAprobar = async () => {
    setLoadingAccion(true)
    const data = await aprobarViaje(id_viaje)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowAprobar(false)
    setAccionCompletada('APROBADO')
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
    const data = await rechazarViaje(id_viaje, textos)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowRechazar(false)
    setAccionCompletada('RECHAZADO')
  }

  const handleAgregarComentario = async () => {
    const texto = observaciones[0]?.trim()
    if (!texto) { mostrarError('Debes escribir una observación'); return }
    setLoadingAccion(true)
    const data = await agregarComentario(id_viaje, texto)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setObservaciones([''])
    setComentarioAgregado(true)
    await recargar()
  }

  const handleAbrirEdicion = (obs) => {
    setComentarioEditando(obs.id_comentario)
    setTextoEdicion(obs.descripcion)
  }

  const handleConfirmarEdicion = async () => {
    if (!textoEdicion.trim()) { mostrarError('El comentario no puede estar vacío'); return }
    setLoadingAccion(true)
    const data = await editarComentario(id_viaje, comentarioEditando, textoEdicion)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setComentarioEditando(null)
    setTextoEdicion('')
    await recargar()
  }

  const handleAbrirEliminacion = (id_comentario) => setComentarioEliminando(id_comentario)

  const handleConfirmarEliminacion = async () => {
    setLoadingAccion(true)
    const data = await eliminarComentario(id_viaje, comentarioEliminando)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setComentarioEliminando(null)
    await recargar()
  }

  const resetComentarioAgregado = () => setComentarioAgregado(false)

  const editarObservacion = (i, val) => {
    setObservaciones((prev) => prev.map((o, idx) => (idx === i ? val : o)))
  }

  return {
    datos, loading, loadingAccion, error, bloqueado,
    showAprobar, setShowAprobar,
    showRechazar, setShowRechazar,
    showSinObservaciones, setShowSinObservaciones,
    observaciones,
    accionCompletada,
    comentarioAgregado, resetComentarioAgregado,
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

export default useDetalleRevision;