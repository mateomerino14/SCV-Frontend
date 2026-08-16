import { useState, useEffect } from 'react'
import { getMisViajesAprobador } from '../services/aprobadorService'

function useMisViajesPreviosAprobador() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('APROBADO_VIAJE')

  const cargar = async () => {
    setLoading(true)
    const data = await getMisViajesAprobador()
    setLoading(false)
    if (data.error) { setError(data.error); return }
    setViajes(data)
  }

  useEffect(() => {
    cargar()
  }, [])

  const viajesFiltrados = viajes.filter((v) => {
    if (filtroEstado === 'APROBADO_VIAJE') return v.estado === 'APROBADO_VIAJE'
    if (filtroEstado === 'EN_REVISION_TESORERO') return v.estado === 'EN_REVISION_TESORERO'
    if (filtroEstado === 'EN_CURSO') return v.estado === 'EN_CURSO'
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

export default useMisViajesPreviosAprobador;