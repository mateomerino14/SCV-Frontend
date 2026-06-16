import { useState, useEffect } from 'react'
import { getMisRevisionesRevisor, getEmpleadosRevisor } from '../services/revisorService'

function useHistorialRevisor() {
  const [viajes, setViajes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })
  const [filtroEstado, setFiltroEstado] = useState('APROBADO_SUPERVISOR')

  useEffect(() => {
    cargar()
    getEmpleadosRevisor().then((data) => { if (!data.error) setEmpleados(data) })
  }, [])

  const cargar = async (f = filtros) => {
    setLoading(true)
    const data = await getMisRevisionesRevisor(f)
    setLoading(false)
    if (data.error) { setError(data.error); return }
    setViajes(data)
  }

  const aplicarFiltros = () => cargar(filtros)

  const limpiarFiltros = () => {
    const vacios = { fecha_inicio: '', fecha_fin: '', id_empleado: '' }
    setFiltros(vacios)
    setFiltroEstado('APROBADO_SUPERVISOR')
    cargar(vacios)
  }

  const viajesFiltrados = viajes.filter((v) => {
    if (filtroEstado === 'APROBADO_SUPERVISOR') return v.estado === 'APROBADO_SUPERVISOR'
    if (filtroEstado === 'APROBADO_FINAL') return v.estado === 'APROBADO_FINAL'
    if (filtroEstado === 'RECHAZADO') return v.estado === 'RECHAZADO'
    return true
  })

  return {
    viajes: viajesFiltrados,
    empleados,
    loading,
    error,
    filtros, setFiltros,
    recargar: cargar,
    filtroEstado, setFiltroEstado,
    aplicarFiltros,
    limpiarFiltros,
  }
}

export default useHistorialRevisor;