import { useState, useEffect } from 'react'
import { getDashboardAdmin } from '../services/adminService'

function useDashboardAdmin() {
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const data = await getDashboardAdmin()
      setLoading(false)
      if (!data.error) setDatos(data)
    }
    cargar()
  }, [])

  return { datos, loading }
}

export default useDashboardAdmin;