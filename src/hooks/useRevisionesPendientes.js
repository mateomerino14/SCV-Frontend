import { useState, useEffect } from 'react'
import { getPendientes } from '../services/supervisorService'

const POLLING_INTERVAL = 30 * 1000

function useRevisionesPendientes() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  const cargar = async (f = filtros) => {
    const data = await getPendientes(f)
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
    setFiltroEstado('TODOS')
    cargar(vacios)
  }

  const viajesFiltrados = viajes.filter((v) => {
    if (filtroEstado === 'TODOS') return true
    if (filtroEstado === 'OBSERVADO') return v.estadoRevision === 'OBSERVADO'
    if (filtroEstado === 'CONFORME') return v.estadoRevision === 'CONFORME'
    return true
  })

  return {
    viajes: viajesFiltrados,
    totalViajes: viajes.length,
    loading,
    error,
    filtros,
    setFiltros,
    filtroEstado,
    setFiltroEstado,
    aplicarFiltros,
    limpiarFiltros,
    recargar: cargar,
  }
}

export default useRevisionesPendientes;