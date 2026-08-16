import { useState, useEffect, useRef } from 'react'
import { getViajesPendientesTesorero } from '../services/tesoreroService'

const POLLING_INTERVAL = 30 * 1000

function useViajesPendientesTesorero() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })
  const filtrosRef = useRef(filtros)

  useEffect(() => {
    filtrosRef.current = filtros
  }, [filtros])

  const cargar = async (f = filtrosRef.current, mostrarLoading = true) => {
    if (mostrarLoading) setLoading(true)
    const data = await getViajesPendientesTesorero(f)
    if (mostrarLoading) setLoading(false)
    if (data.error) { setError(data.error); return }
    setViajes(data)
  }

  useEffect(() => {
    cargar(filtrosRef.current, true)
    const polling = setInterval(() => cargar(filtrosRef.current, false), POLLING_INTERVAL)
    return () => clearInterval(polling)
  }, [])

  const aplicarFiltros = () => cargar(filtros, true)
  const limpiarFiltros = () => {
    const vacios = { fecha_inicio: '', fecha_fin: '', id_empleado: '' }
    setFiltros(vacios)
    cargar(vacios, true)
  }

  return {
    viajes,
    totalViajes: viajes.length,
    loading,
    error,
    filtros, setFiltros,
    aplicarFiltros, limpiarFiltros,
    recargar: cargar,
  }
}

export default useViajesPendientesTesorero;