import { useState } from 'react'
import { crearViaje } from '../services/dashboardService'

function useCrearViaje(usuario) {
  const [motivo, setMotivo] = useState('')
  const [destino, setDestino] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [tipo, setTipo] = useState('Nacional')
  const [entorno, setEntorno] = useState('Urbano')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showMapa, setShowMapa] = useState(false)

  const tarifaDiaria = parseFloat(usuario?.Cargo?.monto_diario ?? 0)

  const calcularDias = () => {
    if (!fechaInicio || !fechaFin) return 0
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    const diff = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  const dias = calcularDias()
  const montoTotal = dias * tarifaDiaria

  const handleConfirmarMapa = (direccion) => {
    setDestino(direccion)
    setShowMapa(false)
  }

  const handleConfirmar = async () => {
    if (!motivo || !destino || !fechaInicio || !fechaFin) {
      setError('Completa todos los campos requeridos')
      setTimeout(() => setError(''), 3000)
      return
    }
    if (dias <= 0) {
      setError('La fecha fin debe ser posterior a la fecha inicio')
      setTimeout(() => setError(''), 3000)
      return
    }
    setLoading(true)
    const data = await crearViaje({
      motivo,
      destino,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      tipo,
      entorno_destino: entorno,
      monto_asignado: montoTotal
    })
    setLoading(false)
    if (data.error) {
      setError(data.error)
      setTimeout(() => setError(''), 3000)
      return
    }
    window.location.href = '/dashboard/empleado'
  }

  return {
    motivo, setMotivo,
    destino, setDestino,
    fechaInicio, setFechaInicio,
    fechaFin, setFechaFin,
    tipo, setTipo,
    entorno, setEntorno,
    dias,
    montoTotal,
    tarifaDiaria,
    loading,
    error,
    showMapa, setShowMapa,
    handleConfirmarMapa,
    handleConfirmar,
  }
}

export default useCrearViaje