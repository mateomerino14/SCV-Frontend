import { useState, useEffect } from 'react'
import { getHistorialRevisiones } from '../services/supervisorService'

function useHistorialRevisiones() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  const cargar = async (f = filtros) => {
    setLoading(true)
    const data = await getHistorialRevisiones(f)
    setLoading(false)
    if (data.error) {
      setError(data.error)
      return
    }
    setViajes(data)
  }

  useEffect(() => {
    cargar()
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
    return v.estado === filtroEstado
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
  }
}

export default useHistorialRevisiones;