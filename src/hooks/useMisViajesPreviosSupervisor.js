import { useState, useEffect } from 'react'
import { getMisViajesSupervisor } from '../services/supervisorService'

function useMisViajesPreviosSupervisor() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('EN_REVISION_VIAJE')

  const cargar = async () => {
    setLoading(true)
    const data = await getMisViajesSupervisor()
    setLoading(false)
    if (data.error) { setError(data.error); return }
    setViajes(data)
  }

  useEffect(() => {
    cargar()
  }, [])

  const viajesFiltrados = viajes.filter((v) => {
    if (filtroEstado === 'EN_REVISION_VIAJE') return v.estado === 'EN_REVISION_VIAJE'
    if (filtroEstado === 'APROBADO_VIAJE') return ['APROBADO_VIAJE', 'EN_REVISION_TESORERO', 'EN_CURSO'].includes(v.estado)
    if (filtroEstado === 'RECHAZADO') return v.estado === 'RECHAZADO'
    return true
  })

  return {
    viajes: viajesFiltrados,
    totalViajes: viajesFiltrados.length,
    loading,
    error,
    filtroEstado, setFiltroEstado,
    recargar: cargar,
  }
}

export default useMisViajesPreviosSupervisor;