import { useState, useEffect } from 'react'
import { getHistorialViajes } from '../services/dashboardService'

function useHistorialViajes() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('TODOS')

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const data = await getHistorialViajes()
      setLoading(false)

      if (data.error) {
        setError(data.error)
        return
      }

      setViajes(data)
    }

    cargar()
  }, [])

  const viajesFiltrados = viajes.filter((viaje) => {
    if (filtro === 'TODOS') {
      return true
    }
    return viaje.estado === filtro
  })

  return {
    viajes,
    viajesFiltrados,
    loading,
    error,
    filtro,
    setFiltro,
  }
}

export default useHistorialViajes;