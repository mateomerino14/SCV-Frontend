import { useState, useEffect } from 'react'
import {
  getDetalleTesorero, editarMontosTesorero, aprobarViajeTesorero, rechazarViajeTesorero,
  agregarComentarioTesorero, editarComentarioTesorero, eliminarComentarioTesorero,
} from '../services/tesoreroService'

const MAX_MONTO = 999999.99

function useDetalleTesorero(id_viaje) {
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

  const [montoAsignado, setMontoAsignado] = useState('')
  const [montoAsignadoUsd, setMontoAsignadoUsd] = useState('')
  const [editandoMontos, setEditandoMontos] = useState(false)
  const [guardandoMontos, setGuardandoMontos] = useState(false)

  useEffect(() => {
    if (!id_viaje) return

    const cargar = async () => {
      setLoading(true)
      const data = await getDetalleTesorero(id_viaje)
      setLoading(false)
      if (data.error) {
        setError(data.error)
        setBloqueado(true)
        return
      }
      setDatos(data)
      setMontoAsignado(String(data.viaje.monto_asignado))
      setMontoAsignadoUsd(String(data.viaje.monto_asignado_usd || 0))
    }

    cargar()
  }, [id_viaje])

  const mostrarError = (msg) => { setError(msg); setTimeout(() => setError(''), 3000) }

  const recargar = async () => {
    const updated = await getDetalleTesorero(id_viaje)
    if (!updated.error) {
      setDatos(updated)
      setMontoAsignado(String(updated.viaje.monto_asignado))
      setMontoAsignadoUsd(String(updated.viaje.monto_asignado_usd || 0))
    }
  }

  const handleMontoAsignadoChange = (valor) => {
    if (valor === '') { setMontoAsignado(''); return }
    if (!/^\d*\.?\d{0,2}$/.test(valor)) return
    if (parseFloat(valor) > MAX_MONTO) return
    setMontoAsignado(valor)
  }

  const handleMontoAsignadoUsdChange = (valor) => {
    if (valor === '') { setMontoAsignadoUsd(''); return }
    if (!/^\d*\.?\d{0,2}$/.test(valor)) return
    if (parseFloat(valor) > MAX_MONTO) return
    setMontoAsignadoUsd(valor)
  }

  const handleGuardarMontos = async () => {
    if (!montoAsignado || parseFloat(montoAsignado) < 0 || isNaN(parseFloat(montoAsignado))) {
      mostrarError('El monto en Bs debe ser un número válido')
      return
    }
    setGuardandoMontos(true)
    const data = await editarMontosTesorero(id_viaje, parseFloat(montoAsignado), parseFloat(montoAsignadoUsd) || 0)
    setGuardandoMontos(false)
    if (data.error) { mostrarError(data.error); return }
    setEditandoMontos(false)
    await recargar()
  }

  const handleAprobar = async () => {
    setLoadingAccion(true)
    const data = await aprobarViajeTesorero(id_viaje)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowAprobar(false)
    setAccionCompletada('EN_CURSO')
    setDatos((prev) => prev ? { ...prev, viaje: { ...prev.viaje, estado: 'EN_CURSO' } } : prev)
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
    setLoadingAccion(true)
    const data = await rechazarViajeTesorero(id_viaje)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowRechazar(false)
    setAccionCompletada('RECHAZADO')
    setDatos((prev) => prev ? { ...prev, viaje: { ...prev.viaje, estado: 'RECHAZADO' } } : prev)
  }

  const handleAgregarComentario = async () => {
    const texto = observaciones[0]?.trim()
    if (!texto) { mostrarError('Debes escribir una observación'); return }
    setLoadingAccion(true)
    const data = await agregarComentarioTesorero(id_viaje, texto)
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
    const data = await editarComentarioTesorero(id_viaje, comentarioEditando, textoEdicion)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setComentarioEditando(null)
    setTextoEdicion('')
    await recargar()
  }

  const handleAbrirEliminacion = (id_comentario) => setComentarioEliminando(id_comentario)

  const handleConfirmarEliminacion = async () => {
    setLoadingAccion(true)
    const data = await eliminarComentarioTesorero(id_viaje, comentarioEliminando)
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
    montoAsignado, setMontoAsignado,
    montoAsignadoUsd, setMontoAsignadoUsd,
    handleMontoAsignadoChange, handleMontoAsignadoUsdChange,
    editandoMontos, setEditandoMontos,
    guardandoMontos, handleGuardarMontos,
    handleAprobar,
    handlePedirRechazar,
    handleRechazar,
    handleAgregarComentario,
    handleAbrirEdicion, handleConfirmarEdicion,
    handleAbrirEliminacion, handleConfirmarEliminacion,
    editarObservacion,
  }
}

export default useDetalleTesorero;