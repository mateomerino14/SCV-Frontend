import { useState, useEffect } from 'react'
import { getPendientesRevisor, getEmpleadosRevisor } from '../services/revisorService'

const POLLING_INTERVAL = 30 * 1000

function useRevisionRevisor() {
  const [viajes, setViajes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })

  const cargar = async (f = filtros) => {
    const data = await getPendientesRevisor(f)
    if (data.error) {
      setError(data.error)
      return
    }
    setViajes(data)
  }

  useEffect(() => {
    const iniciar = async () => {
      setLoading(true)
      await cargar()
      setLoading(false)
      const data = await getEmpleadosRevisor()
      if (!data.error) setEmpleados(data)
    }

    iniciar()

    const polling = setInterval(() => {
      cargar()
    }, POLLING_INTERVAL)

    return () => clearInterval(polling)
  }, [])

  const aplicarFiltros = () => cargar(filtros)

  const limpiarFiltros = () => {
    const vacios = { fecha_inicio: '', fecha_fin: '', id_empleado: '' }
    setFiltros(vacios)
    cargar(vacios)
  }

  return {
    viajes,
    empleados,
    totalViajes: viajes.length,
    loading,
    error,
    filtros,
    setFiltros,
    aplicarFiltros,
    limpiarFiltros,
    recargar: cargar,
  }
}

export default useRevisionRevisor;