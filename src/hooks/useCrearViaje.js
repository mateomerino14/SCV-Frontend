import { useState } from 'react'
import { crearViaje } from '../services/dashboardService'

function useCrearViaje(usuario) {
  const [motivo, setMotivo] = useState('')
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [tipo, setTipo] = useState('Nacional')
  const [transporte, setTransporte] = useState('Terrestre')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [erroresCampo, setErroresCampo] = useState({})
  const [showConfirmacion, setShowConfirmacion] = useState(false)
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false)

  const tarifaDiaria = parseFloat(usuario?.Cargo?.monto_diario ?? 0)
  const tarifaDiariaUsd = parseFloat(usuario?.Cargo?.monto_diario_usd ?? 0)

  const calcularDias = () => {
    if (!fechaInicio || !fechaFin) return 0
    const [y1, m1, d1] = fechaInicio.split('-')
    const [y2, m2, d2] = fechaFin.split('-')
    const inicio = new Date(y1, m1 - 1, d1)
    const fin = new Date(y2, m2 - 1, d2)
    const diff = Math.round((fin - inicio) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff + 1 : 0
  }

  const dias = calcularDias()
  const diasNacionales = tipo === 'Internacional' ? Math.min(dias, 2) : dias
  const diasInternacionales = tipo === 'Internacional' ? Math.max(0, dias - 2) : 0
  const montoTotal = diasNacionales * tarifaDiaria
  const montoTotalUsd = diasInternacionales * tarifaDiariaUsd

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const handleMotivoChange = (valor) => {
    if (valor.length > 100) return
    setMotivo(valor)
    setErroresCampo((prev) => ({ ...prev, motivo: undefined }))
  }

  const handleOrigenChange = (valor) => {
    if (valor.length > 200) return
    setOrigen(valor)
    setErroresCampo((prev) => ({ ...prev, origen: undefined }))
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

  const handleUsarUbicacionActual = () => {
    if (!navigator.geolocation) {
      mostrarError('Tu navegador no permite obtener la ubicación actual')
      return
    }

    setCargandoUbicacion(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es`
          )
          const data = await res.json()
          const direccion = data?.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
          setOrigen(direccion.length > 200 ? direccion.slice(0, 200) : direccion)
          setErroresCampo((prev) => ({ ...prev, origen: undefined }))
        } catch {
          mostrarError('No se pudo obtener la dirección de tu ubicación actual')
        } finally {
          setCargandoUbicacion(false)
        }
      },
      () => {
        setCargandoUbicacion(false)
        mostrarError('No se pudo acceder a tu ubicación. Revisa los permisos del navegador.')
      }
    )
  }

  const validar = () => {
    const errores = {}
    if (!motivo.trim()) errores.motivo = 'El motivo del viaje es requerido'
    if (!origen.trim()) errores.origen = 'El origen es requerido'
    if (!destino.trim()) errores.destino = 'El destino es requerido'
    if (!fechaInicio) errores.fechaInicio = 'La fecha de inicio es requerida'
    if (!fechaFin) errores.fechaFin = 'La fecha de fin es requerida'
    if (fechaInicio && fechaFin && calcularDias() <= 0) {
      errores.fechaFin = 'La fecha fin debe ser posterior a la fecha de inicio'
    }
    return errores
  }

  const handleGuardarBorrador = async () => {
    const errores = validar()
    if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
    setErroresCampo({})
    setLoading(true)
    const data = await crearViaje({
      motivo: motivo.trim(),
      origen: origen.trim(),
      destino: destino.trim(),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      tipo,
      transporte,
      monto_asignado: montoTotal,
      monto_asignado_usd: montoTotalUsd,
    })
    setLoading(false)
    if (data.error) { mostrarError(data.error); return }
    setShowConfirmacion(true)
    setMotivo('')
    setOrigen('')
    setDestino('')
    setFechaInicio('')
    setFechaFin('')
    setTipo('Nacional')
    setTransporte('Terrestre')
  }

  return {
    motivo, origen, destino,
    fechaInicio, fechaFin,
    tipo, setTipo,
    transporte, setTransporte,
    dias, diasNacionales, diasInternacionales,
    montoTotal, montoTotalUsd,
    tarifaDiaria, tarifaDiariaUsd,
    loading, error, erroresCampo,
    showConfirmacion, setShowConfirmacion,
    cargandoUbicacion,
    handleMotivoChange,
    handleOrigenChange,
    handleDestinoChange,
    handleFechaInicioChange,
    handleFechaFinChange,
    handleUsarUbicacionActual,
    handleGuardarBorrador,
  }
}

export default useCrearViaje;