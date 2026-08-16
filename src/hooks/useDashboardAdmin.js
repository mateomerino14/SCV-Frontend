import { useState, useEffect } from 'react'
import { getDashboardAdmin } from '../services/adminService'

const POLLING_INTERVAL = 30 * 1000

function useDashboardAdmin() {
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async (esCargaInicial = false) => {
      if (esCargaInicial) setLoading(true)
      const data = await getDashboardAdmin()
      if (esCargaInicial) setLoading(false)
      if (!data.error) setDatos(data)
    }

    cargar(true)
    const polling = setInterval(() => cargar(false), POLLING_INTERVAL)
    return () => clearInterval(polling)
  }, [])

  return { datos, loading }
}

export default useDashboardAdmin;