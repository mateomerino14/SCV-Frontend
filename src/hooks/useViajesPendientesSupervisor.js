import { useState, useEffect, useRef } from 'react'
import { getViajesPendientesSupervisor } from '../services/supervisorService'

const POLLING_INTERVAL = 30 * 1000

function useViajesPendientesSupervisor() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })
  const filtrosRef = useRef(filtros)

  useEffect(() => {
    filtrosRef.current = filtros
  }, [filtros])

  const cargar = async (f = filtrosRef.current) => {
    const data = await getViajesPendientesSupervisor(f)
    if (data.error) { setError(data.error); return }
    setViajes(data)
  }

  useEffect(() => {
    const iniciar = async () => {
      setLoading(true)
      await cargar()
      setLoading(false)
    }
    iniciar()
    const polling = setInterval(() => cargar(), POLLING_INTERVAL)
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
    totalViajes: viajes.length,
    loading, error, filtros, setFiltros,
    aplicarFiltros, limpiarFiltros,
    recargar: cargar,
  }
}

export default useViajesPendientesSupervisor;