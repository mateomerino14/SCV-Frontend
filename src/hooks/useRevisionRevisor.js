import { useState, useEffect, useCallback } from 'react'
import { getPendientesRevisor, getMisRevisionesRevisor, getEmpleadosRevisor } from '../services/revisorService'

const POLLING_INTERVAL = 30 * 1000

function useRevisionRevisor() {
  const [pendientes, setPendientes] = useState([])
  const [historial, setHistorial] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [tab, setTab] = useState('PENDIENTES')

  const cargar = useCallback(async (f, mostrarLoading = true) => {
    const filtrosActuales = f || filtros
    if (mostrarLoading) setLoading(true)
    const [pend, hist] = await Promise.all([
      getPendientesRevisor(filtrosActuales),
      getMisRevisionesRevisor(filtrosActuales),
    ])
    if (mostrarLoading) setLoading(false)
    if (pend.error) { if (mostrarLoading) setError(pend.error); return }
    if (hist.error) { if (mostrarLoading) setError(hist.error); return }
    setPendientes(pend)
    setHistorial((hist || []).filter((v) => v.estado === 'APROBADO_FINAL' || v.estado === 'RECHAZADO'))
  }, [filtros])

  useEffect(() => {
    const iniciar = async () => {
      await cargar(filtros, true)
      const data = await getEmpleadosRevisor()
      if (!data.error) setEmpleados(data)
    }
    iniciar()
    const polling = setInterval(() => cargar(filtros, false), POLLING_INTERVAL)
    return () => clearInterval(polling)
  }, [])

  useEffect(() => {
    setFiltroEstado('TODOS')
  }, [tab])

  const aplicarFiltros = () => cargar(filtros, true)

  const limpiarFiltros = () => {
    const vacios = { fecha_inicio: '', fecha_fin: '', id_empleado: '' }
    setFiltros(vacios)
    setFiltroEstado('TODOS')
    cargar(vacios, true)
  }

  const pendientesFiltrados = pendientes.filter((v) => {
    if (filtroEstado === 'OBSERVADO') return v.estadoRevision === 'OBSERVADO'
    if (filtroEstado === 'CONFORME') return v.estadoRevision === 'CONFORME'
    return true
  })

  const historialFiltrado = historial.filter((v) => {
    if (filtroEstado === 'APROBADO_FINAL') return v.estado === 'APROBADO_FINAL'
    if (filtroEstado === 'RECHAZADO') return v.estado === 'RECHAZADO'
    return true
  })

  return {
    viajes: tab === 'PENDIENTES' ? pendientesFiltrados : historialFiltrado,
    totalPendientes: pendientes.length,
    empleados,
    loading,
    error,
    filtros,
    setFiltros,
    filtroEstado,
    setFiltroEstado,
    tab,
    setTab,
    aplicarFiltros,
    limpiarFiltros,
    recargar: cargar,
  }
}

export default useRevisionRevisor;