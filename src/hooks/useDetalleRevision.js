import { useState, useEffect } from 'react'
import { getDetalleRevision, aprobarViaje, rechazarViaje, agregarComentario, editarComentario, eliminarComentario, devolverRevision } from '../services/supervisorService'

function useDetalleRevision(id_viaje) {
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [error, setError] = useState('')
  const [bloqueado, setBloqueado] = useState(false)
  const [showAprobar, setShowAprobar] = useState(false)
  const [showRechazar, setShowRechazar] = useState(false)
  const [showSinObservaciones, setShowSinObservaciones] = useState(false)
  const [accionCompletada, setAccionCompletada] = useState(null)
  const [comentarioAgregado, setComentarioAgregado] = useState(false)
  const [comentarioEditando, setComentarioEditando] = useState(null)
  const [comentarioEliminando, setComentarioEliminando] = useState(null)
  const [textoEdicion, setTextoEdicion] = useState('')

  const [gastoActivo, setGastoActivo] = useState(null)
  const [showObsGasto, setShowObsGasto] = useState(false)
  const [nuevoTexto, setNuevoTexto] = useState('')

  useEffect(() => {
    if (!id_viaje) return

    const cargar = async () => {
      setLoading(true)
      const data = await getDetalleRevision(id_viaje)
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
    setDatos((prev) => ({ ...prev, viaje: { ...prev.viaje, estado: 'APROBADO_SUPERVISOR' } }))
  }

  const cicloActual = () => datos?.viaje?.ciclo_revision || 1

  const handlePedirRechazar = () => {
    const obsGuardadas = (datos?.comentarios || []).filter((c) =>
      c.tipo === 'OBSERVACION' &&
      (c.ciclo_revision || 1) === cicloActual() &&
      c.id_gasto != null
    )
    if (obsGuardadas.length === 0) {
      setShowSinObservaciones(true)
    } else {
      setShowRechazar(true)
    }
  }

  const handleRechazar = async () => {
    setLoadingAccion(true)
    const data = await rechazarViaje(id_viaje)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowRechazar(false)
    setAccionCompletada('RECHAZADO')
    setDatos((prev) => ({ ...prev, viaje: { ...prev.viaje, estado: 'RECHAZADO' } }))
  }

  const handleDevolver = async () => {
    const data = await devolverRevision(id_viaje)
    if (data.error) { mostrarError(data.error); return }
    window.history.back()
  }

  const abrirObservacionesGasto = (id_gasto) => {
    setGastoActivo(id_gasto)
    setNuevoTexto('')
    setShowObsGasto(true)
  }

  const cerrarObservacionesGasto = () => {
    setShowObsGasto(false)
    setGastoActivo(null)
    setNuevoTexto('')
  }

  const observacionesDelGastoActivo = () => {
    if (!gastoActivo || !datos?.comentarios) return []
    return datos.comentarios.filter((c) => c.tipo === 'OBSERVACION' && c.id_gasto === gastoActivo)
  }

  const contarObservacionesGasto = (id_gasto) => {
    if (!datos?.comentarios) return 0
    return datos.comentarios.filter((c) => c.tipo === 'OBSERVACION' && c.id_gasto === id_gasto).length
  }

  const handleAgregarComentario = async () => {
    const texto = nuevoTexto.trim()
    if (!texto) { mostrarError('Debes escribir una observación'); return }
    setLoadingAccion(true)
    const data = await agregarComentario(id_viaje, texto, gastoActivo)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setNuevoTexto('')
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

  return {
    datos, loading, loadingAccion, error, bloqueado,
    showAprobar, setShowAprobar,
    showRechazar, setShowRechazar,
    showSinObservaciones, setShowSinObservaciones,
    accionCompletada,
    comentarioAgregado, resetComentarioAgregado,
    comentarioEditando, setComentarioEditando,
    comentarioEliminando, setComentarioEliminando,
    textoEdicion, setTextoEdicion,
    gastoActivo, showObsGasto, nuevoTexto, setNuevoTexto,
    abrirObservacionesGasto, cerrarObservacionesGasto,
    observacionesDelGastoActivo, contarObservacionesGasto,
    handleAprobar,
    handlePedirRechazar,
    handleRechazar,
    handleDevolver,
    handleAgregarComentario,
    handleAbrirEdicion, handleConfirmarEdicion,
    handleAbrirEliminacion, handleConfirmarEliminacion,
  }
}

export default useDetalleRevision;