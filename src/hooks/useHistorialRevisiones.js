import { useState, useEffect } from 'react'
import { getMisRevisiones } from '../services/supervisorService'

function useHistorialRevisiones() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })
  const [filtroEstado, setFiltroEstado] = useState('EN_REVISION')

  const cargar = async (f = filtros) => {
    setLoading(true)
    const data = await getMisRevisiones(f)
    setLoading(false)
    if (data.error) { setError(data.error); return }
    setViajes(data)
  }

  useEffect(() => {
    cargar()
  }, [])

  const aplicarFiltros = () => cargar(filtros)

  const limpiarFiltros = () => {
    const vacios = { fecha_inicio: '', fecha_fin: '', id_empleado: '' }
    setFiltros(vacios)
    setFiltroEstado('EN_REVISION')
    cargar(vacios)
  }

  const viajesFiltrados = viajes.filter((v) => {
  if (filtroEstado === 'EN_REVISION') return v.estado === 'EN_REVISION'
  if (filtroEstado === 'APROBADO_SUPERVISOR') return v.estado === 'APROBADO_SUPERVISOR'
  if (filtroEstado === 'APROBADO_FINAL') return v.estado === 'APROBADO_FINAL'
  if (filtroEstado === 'RECHAZADO') return v.estado === 'RECHAZADO'
  return true
})

  return {
    viajes: viajesFiltrados,
    totalViajes: viajesFiltrados.length,
    loading,
    error,
    filtros,
    setFiltros,
    filtroEstado,
    setFiltroEstado,
    recargar: cargar,
    aplicarFiltros,
    limpiarFiltros,
  }
}

export default useHistorialRevisiones;