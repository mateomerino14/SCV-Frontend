import { useState, useEffect, useRef } from 'react'
import { getViajesPendientesTesorero, getMisViajesTesorero } from '../services/tesoreroService'

const POLLING_INTERVAL = 30 * 1000

function useRevisionesTesorero() {
  const [pendientes, setPendientes] = useState([])
  const [misViajes, setMisViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('PENDIENTES')
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_empleado: '' })
  const filtrosRef = useRef(filtros)

  useEffect(() => { filtrosRef.current = filtros }, [filtros])

  const cargar = async (f = filtrosRef.current, mostrarLoading = true) => {
    if (mostrarLoading) setLoading(true)
    const [pend, mios] = await Promise.all([
      getViajesPendientesTesorero(f),
      getMisViajesTesorero(),
    ])
    if (mostrarLoading) setLoading(false)
    if (pend.error) { setError(pend.error); return }
    if (mios.error) { setError(mios.error); return }
    setPendientes(pend)
    setMisViajes(mios)
  }

  useEffect(() => {
    cargar(filtrosRef.current, true)
    const polling = setInterval(() => cargar(filtrosRef.current, false), POLLING_INTERVAL)
    return () => clearInterval(polling)
  }, [])

  const aplicarFiltros = () => cargar(filtros, true)
  const limpiarFiltros = () => {
    const vacios = { fecha_inicio: '', fecha_fin: '', id_empleado: '' }
    setFiltros(vacios)
    cargar(vacios, true)
  }

  const viajesAprobados = misViajes.filter(v => v.estado === 'EN_CURSO')
  const viajesRechazados = misViajes.filter(v => v.estado === 'RECHAZADO')

  const viajesMostrados = tab === 'PENDIENTES' ? pendientes : tab === 'APROBADOS' ? viajesAprobados : viajesRechazados

  return {
    viajes: viajesMostrados,
    totalPendientes: pendientes.length,
    totalAprobados: viajesAprobados.length,
    totalRechazados: viajesRechazados.length,
    loading, error,
    tab, setTab,
    filtros, setFiltros,
    aplicarFiltros, limpiarFiltros,
  }
}

export default useRevisionesTesorero;