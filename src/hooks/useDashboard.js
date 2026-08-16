import { useState, useEffect } from 'react'
import { getMe, getDashboard, enviarViajeARevision } from '../services/dashboardService'

const POLLING_INTERVAL = 30 * 1000

function useDashboard() {
  const [usuario, setUsuario] = useState(null)
  const [viajesBorrador, setViajesBorrador] = useState([])
  const [viajesEnCurso, setViajesEnCurso] = useState([])
  const [viajesRecientes, setViajesRecientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [enviandoRevision, setEnviandoRevision] = useState(null)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [viajeAConfirmar, setViajeAConfirmar] = useState(null)

  const cargarDashboard = async () => {
    const dashData = await getDashboard()
    setViajesBorrador(dashData.viajesBorrador || [])
    setViajesEnCurso(dashData.viajesEnCurso || [])
    setViajesRecientes(dashData.viajesRecientes || [])
  }

  useEffect(() => {
    const iniciar = async () => {
      setLoading(true)
      const [meData] = await Promise.all([getMe(), cargarDashboard()])
      setUsuario(meData)
      setLoading(false)
    }
    iniciar()
    const polling = setInterval(() => cargarDashboard(), POLLING_INTERVAL)
    return () => clearInterval(polling)
  }, [])

  const viajesMostrados = viajesRecientes.slice(0, 3)

  const handlePedirEnviarRevision = (id_viaje) => setViajeAConfirmar(id_viaje)
  const handleCancelarEnviarRevision = () => setViajeAConfirmar(null)

  const handleConfirmarEnviarRevision = async () => {
    if (!viajeAConfirmar) return
    setEnviandoRevision(viajeAConfirmar)
    const data = await enviarViajeARevision(viajeAConfirmar)
    setEnviandoRevision(null)
    setViajeAConfirmar(null)
    if (data.error) {
      setErrorEnvio(data.error)
      setTimeout(() => setErrorEnvio(''), 4000)
      return
    }
    await cargarDashboard()
  }

  return {
    usuario,
    viajesBorrador,
    viajesEnCurso,
    viajesMostrados,
    viajesRecientes,
    loading,
    enviandoRevision,
    errorEnvio,
    viajeAConfirmar,
    handlePedirEnviarRevision,
    handleCancelarEnviarRevision,
    handleConfirmarEnviarRevision,
  }
}

export default useDashboard;