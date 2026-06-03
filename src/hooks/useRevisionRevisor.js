import { useState, useEffect } from 'react'
import { getPendientesRevisor, getEmpleadosRevisor } from '../services/revisorService'

function useRevisionRevisor() {
  const [viajes, setViajes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })
  const [filtrosAplicados, setFiltrosAplicados] = useState({})

  useEffect(() => {
    cargar({})
    getEmpleadosRevisor().then((data) => { if (!data.error) setEmpleados(data) })
  }, [])

  const cargar = async (f) => {
    setLoading(true)
    const data = await getPendientesRevisor(f)
    setLoading(false)
    if (data.error) { setError(data.error); return }
    setViajes(data)
  }

  const aplicarFiltros = () => {
    setFiltrosAplicados(filtros)
    cargar(filtros)
  }

  const limpiarFiltros = () => {
    const vacios = { fecha_inicio: '', fecha_fin: '', id_empleado: '' }
    setFiltros(vacios)
    setFiltrosAplicados({})
    cargar({})
  }

  return {
    viajes,
    empleados,
    totalViajes: viajes.length,
    loading,
    error,
    filtros, setFiltros,
    aplicarFiltros,
    limpiarFiltros,
  }
}

export default useRevisionRevisor;