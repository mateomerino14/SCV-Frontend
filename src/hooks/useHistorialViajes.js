import { useState, useEffect } from 'react'
import { getHistorialViajes } from '../services/dashboardService'

const LIMITE_POR_PAGINA = 10;

function useHistorialViajes() {
  const [viajes, setViajes] = useState([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('TODOS')

  const cargar = async (paginaActual, filtroActual, reemplazar) => {
    if (reemplazar) setLoading(true)
    else setCargandoMas(true)

    const data = await getHistorialViajes(paginaActual, LIMITE_POR_PAGINA, filtroActual)

    setLoading(false)
    setCargandoMas(false)

    if (data.error) { setError(data.error); return }

    setTotal(data.total || 0)
    setViajes((prev) => reemplazar ? (data.viajes || []) : [...prev, ...(data.viajes || [])])
  }

  useEffect(() => {
    setPagina(1)
    cargar(1, filtro, true)
  }, [filtro])

  const cargarMas = () => {
    const siguientePagina = pagina + 1
    setPagina(siguientePagina)
    cargar(siguientePagina, filtro, false)
  }

  const hayMasPaginas = viajes.length < total

  return {
    viajesFiltrados: viajes,
    totalFiltrados: total,
    hayMasPaginas,
    cargarMas,
    loading,
    cargandoMas,
    error,
    filtro,
    setFiltro,
  }
}

export default useHistorialViajes;