import { useState, useEffect } from 'react'
import { obtenerDetalleViaje, confirmarFinalizacion, eliminarGasto } from '../services/dashboardService'

function useDetalleViaje(id_viaje) {
  const [viaje, setViaje] = useState(null)
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingEnvio, setLoadingEnvio] = useState(false)
  const [loadingEliminar, setLoadingEliminar] = useState(false)
  const [error, setError] = useState('')
  const [justificacion, setJustificacion] = useState('')
  const [observaciones, setObservaciones] = useState([])
  const [enviado, setEnviado] = useState(false)
  const [showTodosNacional, setShowTodosNacional] = useState(false)
  const [showTodosInternacional, setShowTodosInternacional] = useState(false)
  const [showEliminarModal, setShowEliminarModal] = useState(false)
  const [gastoAEliminar, setGastoAEliminar] = useState(null)
  const [showConfirmarRevisionModal, setShowConfirmarRevisionModal] = useState(false)

  useEffect(() => {
    if (!id_viaje) return
    const cargarDetalle = async () => {
      setLoading(true)
      const data = await obtenerDetalleViaje(id_viaje)
      setLoading(false)
      if (data.error) {
        const esErrorSesion = data.error.includes('Token inválido') || data.error.includes('token no proporcionado') || data.error.includes('suspendida')
        if (!esErrorSesion) setError(data.error)
        return
      }
      setViaje(data.viaje)
      setGastos(data.gastos)
      if (data.comentarios && data.comentarios.length > 0) {
        const justificaciones = data.comentarios.filter((c) => c.tipo === 'JUSTIFICACION')
        const obs = data.comentarios.filter((c) => c.tipo === 'OBSERVACION')
        if (justificaciones.length > 0) setJustificacion(justificaciones[0].descripcion)
        setObservaciones(obs)
      }
    }
    cargarDetalle()
  }, [id_viaje])

  const gastosNacionales = gastos.filter((g) => !g.es_gasto_internacional)
  const gastosInternacionales = gastos.filter((g) => !!g.es_gasto_internacional)
  const gastoAcumulado = gastosNacionales.reduce((sum, g) => sum + parseFloat(g.monto_total || 0), 0)
  const gastoAcumuladoUsd = gastosInternacionales.reduce((sum, g) => sum + parseFloat(g.monto_total || 0), 0)
  const excedePresupuesto = viaje ? gastoAcumulado > parseFloat(viaje.monto_asignado) : false
  const excedePresupuestoUsd = viaje ? gastoAcumuladoUsd > parseFloat(viaje.monto_asignado_usd || 0) : false

  const viajeEnCurso = viaje
    ? viaje.estado === 'EN_CURSO' || (viaje.estado === 'RECHAZADO' && !!viaje.fue_iniciado)
    : false

  const gastosMostradosNacional = showTodosNacional ? gastosNacionales : gastosNacionales.slice(0, 3)
  const gastosMostradosInternacional = showTodosInternacional ? gastosInternacionales : gastosInternacionales.slice(0, 3)

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const handlePedirEnviarRevision = () => {
    if (gastos.length === 0) {
      mostrarError('El viaje debe tener por lo menos un gasto asociado para ser finalizado')
      return
    }
    if (!viajeEnCurso) {
      mostrarError('Solo se pueden finalizar viajes en curso o rechazados con gastos')
      return
    }
    if ((excedePresupuesto || excedePresupuestoUsd) && !justificacion.trim()) {
      mostrarError('Debes ingresar una justificación por exceso de presupuesto')
      return
    }
    setShowConfirmarRevisionModal(true)
  }

  const handleConfirmarEnviarRevision = async () => {
    setShowConfirmarRevisionModal(false)
    setLoadingEnvio(true)
    const data = await confirmarFinalizacion(id_viaje, justificacion.trim() || null)
    setLoadingEnvio(false)
    if (data.error) { mostrarError(data.error); return }
    setEnviado(true)
    setViaje((prev) => ({ ...prev, estado: 'EN_REVISION' }))
  }

  const handleCancelarEnviarRevision = () => setShowConfirmarRevisionModal(false)

  const handlePedirEliminar = (id_gasto) => {
    setGastoAEliminar(id_gasto)
    setShowEliminarModal(true)
  }

  const handleConfirmarEliminar = async () => {
    setLoadingEliminar(true)
    const data = await eliminarGasto(gastoAEliminar)
    setLoadingEliminar(false)
    setShowEliminarModal(false)
    setGastoAEliminar(null)
    if (data.error) { mostrarError(data.error); return }
    setGastos((prev) => prev.filter((g) => g.id_gasto !== gastoAEliminar))
  }

  const handleCancelarEliminar = () => {
    setShowEliminarModal(false)
    setGastoAEliminar(null)
  }

  return {
    viaje, gastos,
    gastosNacionales, gastosInternacionales,
    gastosMostradosNacional, gastosMostradosInternacional,
    gastoAcumulado, gastoAcumuladoUsd,
    excedePresupuesto, excedePresupuestoUsd,
    viajeEnCurso, loading, loadingEnvio, loadingEliminar,
    error, justificacion, setJustificacion,
    observaciones, enviado,
    showTodosNacional, setShowTodosNacional,
    showTodosInternacional, setShowTodosInternacional,
    showEliminarModal, showConfirmarRevisionModal,
    handlePedirEnviarRevision, handleConfirmarEnviarRevision, handleCancelarEnviarRevision,
    handlePedirEliminar, handleConfirmarEliminar, handleCancelarEliminar,
  }
}

export default useDetalleViaje;