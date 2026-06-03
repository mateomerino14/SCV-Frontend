import { useState, useEffect } from 'react'
import { getHistorialRevisor, getEmpleadosRevisor } from '../services/revisorService'

function useHistorialRevisor() {
  const [viajes, setViajes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  useEffect(() => {
    cargar({})
    getEmpleadosRevisor().then((data) => { if (!data.error) setEmpleados(data) })
  }, [])

  const cargar = async (f) => {
    setLoading(true)
    const data = await getHistorialRevisor(f)
    setLoading(false)
    if (data.error) { setError(data.error); return }
    setViajes(data)
  }

  const aplicarFiltros = () => cargar(filtros)

  const limpiarFiltros = () => {
    const vacios = { fecha_inicio: '', fecha_fin: '', id_empleado: '' }
    setFiltros(vacios)
    setFiltroEstado('TODOS')
    cargar({})
  }

  const viajesFiltrados = filtroEstado === 'TODOS'
    ? viajes
    : viajes.filter((v) => v.estado === filtroEstado)

  return {
    viajes: viajesFiltrados,
    empleados,
    loading,
    error,
    filtros, setFiltros,
    filtroEstado, setFiltroEstado,
    aplicarFiltros,
    limpiarFiltros,
  }
}

export default useHistorialRevisor;