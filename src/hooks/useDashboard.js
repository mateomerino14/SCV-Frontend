import { useState, useEffect } from 'react'
import { getMe, getDashboard } from '../services/dashboardService'

function useDashboard() {
  const [usuario, setUsuario] = useState(null)
  const [viajesEnCurso, setViajesEnCurso] = useState([])
  const [viajesRecientes, setViajesRecientes] = useState([])
  const [showAllViajes, setShowAllViajes] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [meData, dashData] = await Promise.all([getMe(), getDashboard()])
      setUsuario(meData)
      setViajesEnCurso(dashData.viajesEnCurso || [])
      setViajesRecientes(dashData.viajesRecientes || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const toggleVerTodo = () => setShowAllViajes((prev) => !prev)

  const viajesMostrados = showAllViajes ? viajesRecientes : viajesRecientes.slice(0, 3)

  return {
    usuario,
    viajesEnCurso,
    viajesMostrados,
    viajesRecientes,
    showAllViajes,
    toggleVerTodo,
    loading,
  }
}

export default useDashboard