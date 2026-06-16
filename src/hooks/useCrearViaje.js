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
  const [erroresCampo, setErroresCampo] = useState({})
  const [showMapa, setShowMapa] = useState(false)
  const [showConfirmacion, setShowConfirmacion] = useState(false)

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

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const handleMotivoChange = (valor) => {
    if (valor.length > 100) return
    setMotivo(valor)
    setErroresCampo((prev) => ({ ...prev, motivo: undefined }))
  }

  const handleDestinoChange = (valor) => {
    if (valor.length > 200) return
    setDestino(valor)
    setErroresCampo((prev) => ({ ...prev, destino: undefined }))
  }

  const handleFechaInicioChange = (valor) => {
    setFechaInicio(valor)
    setErroresCampo((prev) => ({ ...prev, fechaInicio: undefined }))
  }

  const handleFechaFinChange = (valor) => {
    setFechaFin(valor)
    setErroresCampo((prev) => ({ ...prev, fechaFin: undefined }))
  }

  const handleConfirmarMapa = (direccion) => {
    setDestino(direccion)
    setErroresCampo((prev) => ({ ...prev, destino: undefined }))
    setShowMapa(false)
  }

  const validar = () => {
    const errores = {}
    if (!motivo.trim()) errores.motivo = 'El motivo del viaje es requerido'
    if (!destino.trim()) errores.destino = 'El destino es requerido'
    if (!fechaInicio) errores.fechaInicio = 'La fecha de inicio es requerida'
    if (!fechaFin) errores.fechaFin = 'La fecha de fin es requerida'
    if (fechaInicio && fechaFin && calcularDias() <= 0) {
      errores.fechaFin = 'La fecha fin debe ser posterior a la fecha de inicio'
    }
    return errores
  }

  const handleAbrirConfirmacion = () => {
    const errores = validar()
    if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
    setErroresCampo({})
    setShowConfirmacion(true)
  }

  const handleConfirmar = async () => {
    const errores = validar()
    if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
    setErroresCampo({})
    setLoading(true)
    const data = await crearViaje({
      motivo: motivo.trim(),
      destino: destino.trim(),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      tipo,
      entorno_destino: entorno,
      monto_asignado: montoTotal,
    })
    setLoading(false)
    if (data.error) { mostrarError(data.error); return }
    setShowConfirmacion(true)
    setMotivo('')
    setDestino('')
    setFechaInicio('')
    setFechaFin('')
    setTipo('Nacional')
    setEntorno('Urbano')
  }

  return {
    motivo, destino,
    fechaInicio, fechaFin,
    tipo, setTipo,
    entorno, setEntorno,
    dias, montoTotal, tarifaDiaria,
    loading, error, erroresCampo,
    showMapa, setShowMapa,
    showConfirmacion, setShowConfirmacion,
    handleMotivoChange,
    handleDestinoChange,
    handleFechaInicioChange,
    handleFechaFinChange,
    handleConfirmarMapa,
    handleAbrirConfirmacion,
    handleConfirmar,
  }
}

export default useCrearViaje;