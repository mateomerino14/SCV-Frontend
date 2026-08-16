import { useState, useEffect } from 'react'
import { getDetalleRevisor, aprobarViajeRevisor, rechazarViajeRevisor, agregarComentarioRevisor, editarComentarioRevisor, eliminarComentarioRevisor } from '../services/revisorService'

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

  const cicloActual = () => datos?.viaje?.ciclo_revision || 1

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
    const data = await rechazarViajeRevisor(id_viaje)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowRechazar(false)
    setAccionCompletada('RECHAZADO')
    setDatos((prev) => ({ ...prev, viaje: { ...prev.viaje, estado: 'RECHAZADO' } }))
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
    const data = await agregarComentarioRevisor(id_viaje, texto, gastoActivo)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setNuevoTexto('')
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
    comentarioAgregado,
    resetComentarioAgregado: () => setComentarioAgregado(false),
    comentarioEditando, setComentarioEditando,
    comentarioEliminando, setComentarioEliminando,
    textoEdicion, setTextoEdicion,
    gastoActivo, showObsGasto, nuevoTexto, setNuevoTexto,
    abrirObservacionesGasto, cerrarObservacionesGasto,
    observacionesDelGastoActivo, contarObservacionesGasto,
    handleAprobar,
    handlePedirRechazar,
    handleRechazar,
    handleAgregarComentario,
    handleAbrirEdicion, handleConfirmarEdicion,
    handleAbrirEliminacion, handleConfirmarEliminacion,
  }
}

export default useDetalleRevisor;