import { useState, useEffect } from 'react'
import {
  getDetalleAprobador,
  aprobarViajeAprobador,
  rechazarViajeAprobador,
  agregarComentarioAprobador,
  editarComentarioAprobador,
  eliminarComentarioAprobador,
} from '../services/aprobadorService'

function useDetalleAprobador(id_viaje) {
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
    const cargar = async () => {
      setLoading(true)
      const data = await getDetalleAprobador(id_viaje)
      setLoading(false)
      if (data.error) {
        setBloqueado(true)
        setError(data.error)
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

  const handleAprobar = async () => {
    setLoadingAccion(true)
    const data = await aprobarViajeAprobador(id_viaje)
    setLoadingAccion(false)
    setShowAprobar(false)
    if (data.error) { mostrarError(data.error); return }
    setAccionCompletada('APROBADO_APROBADOR')
  }

  const handlePedirRechazar = () => {
    const obs = datos?.comentarios?.filter(c => c.tipo === 'OBSERVACION') || []
    if (obs.length === 0) { setShowSinObservaciones(true); return }
    setShowRechazar(true)
  }

  const handleRechazar = async () => {
    setLoadingAccion(true)
    const data = await rechazarViajeAprobador(id_viaje)
    setLoadingAccion(false)
    setShowRechazar(false)
    if (data.error) { mostrarError(data.error); return }
    setAccionCompletada('RECHAZADO')
  }

  const handleAgregarComentario = async () => {
    const textos = observaciones.filter(o => o.trim())
    if (textos.length === 0) return
    setLoadingAccion(true)
    for (const texto of textos) {
      await agregarComentarioAprobador(id_viaje, texto)
    }
    setLoadingAccion(false)
    setComentarioAgregado(true)
    setObservaciones([''])
    const data = await getDetalleAprobador(id_viaje)
    if (!data.error) setDatos(data)
  }

  const resetComentarioAgregado = () => setComentarioAgregado(false)

  const editarObservacion = (i, val) => {
    setObservaciones(prev => { const n = [...prev]; n[i] = val; return n })
  }

  const handleAbrirEdicion = (obs) => {
    setComentarioEditando(obs.id_comentario)
    setTextoEdicion(obs.descripcion)
  }

  const handleConfirmarEdicion = async () => {
    setLoadingAccion(true)
    const data = await editarComentarioAprobador(id_viaje, comentarioEditando, textoEdicion)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setComentarioEditando(null)
    setTextoEdicion('')
    const updated = await getDetalleAprobador(id_viaje)
    if (!updated.error) setDatos(updated)
  }

  const handleAbrirEliminacion = (id) => setComentarioEliminando(id)

  const handleConfirmarEliminacion = async () => {
    setLoadingAccion(true)
    const data = await eliminarComentarioAprobador(id_viaje, comentarioEliminando)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setComentarioEliminando(null)
    const updated = await getDetalleAprobador(id_viaje)
    if (!updated.error) setDatos(updated)
  }

  return {
    datos, loading, loadingAccion, error, bloqueado,
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
    handleAgregarComentario,
    handleAbrirEdicion, handleConfirmarEdicion,
    handleAbrirEliminacion, handleConfirmarEliminacion,
    editarObservacion,
  }
}

export default useDetalleAprobador;