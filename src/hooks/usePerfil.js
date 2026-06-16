import { useState, useEffect } from 'react'
import { getMe, actualizarPerfil, actualizarFotoPerfil } from '../services/dashboardService'

function usePerfil() {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [editandoTelefono, setEditandoTelefono] = useState(false)
  const [editandoEmail, setEditandoEmail] = useState(false)
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const data = await getMe()
      setLoading(false)

      if (data.error) {
        setError(data.error)
        return
      }

      setUsuario(data)
      setTelefono(data.telefono || '')
      setEmail(data.email_corporativo || '')
    }

    cargar()
  }, [])

  const mostrarExito = (msg) => {
    setExito(msg)
    setTimeout(() => setExito(''), 3000)
  }

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const handleGuardarTelefono = async () => {
    const telefonoLimpio = telefono.trim()

    if (telefonoLimpio && !/^[0-9]{7,8}$/.test(telefonoLimpio)) {
      mostrarError('El teléfono debe tener 7 u 8 dígitos numéricos')
      return
    }

    setGuardando(true)
    const data = await actualizarPerfil({ telefono: telefonoLimpio || null })
    setGuardando(false)

    if (data.error) {
      mostrarError(data.error)
      return
    }

    setUsuario((prev) => ({ ...prev, telefono: data.telefono }))
    setTelefono(data.telefono || '')
    setEditandoTelefono(false)
    mostrarExito('Teléfono actualizado correctamente')
}

  const handleGuardarEmail = async () => {
    if (!email.trim()) {
      mostrarError('El correo no puede estar vacío')
      return
    }

    if (email.length > 100) {
      mostrarError('El correo no puede tener más de 100 caracteres')
      return
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailValido) {
      mostrarError('El correo no tiene un formato válido')
      return
    }

    setGuardando(true)
    const data = await actualizarPerfil({ email_corporativo: email.trim() })
    setGuardando(false)

    if (data.error) {
      mostrarError(data.error)
      return
    }

    setUsuario((prev) => ({ ...prev, email_corporativo: data.email_corporativo }))
    setEmail(data.email_corporativo || '')
    setEditandoEmail(false)
    mostrarExito('Correo actualizado correctamente')
  }

  const handleCancelarTelefono = () => {
    setTelefono(usuario?.telefono || '')
    setEditandoTelefono(false)
  }

  const handleCancelarEmail = () => {
    setEmail(usuario?.email_corporativo || '')
    setEditandoEmail(false)
  }

  const handleCambiarFoto = async (file) => {
    if (!file) {
      return
    }

    setGuardando(true)
    const data = await actualizarFotoPerfil(file)
    setGuardando(false)

    if (data.error) {
      mostrarError(data.error)
      return
    }

    setUsuario((prev) => ({ ...prev, foto_perfil: data.foto_perfil }))
    mostrarExito('Foto de perfil actualizada correctamente')
  }
  const handleQuitarFoto = async () => {
  setGuardando(true)
  const data = await actualizarPerfil({ foto_perfil: null })
  setGuardando(false)

  if (data.error) {
    mostrarError(data.error)
    return
  }

  setUsuario((prev) => ({ ...prev, foto_perfil: null }))
  mostrarExito('Foto de perfil eliminada')
}

  return {
    usuario,
    loading,
    error,
    exito,
    guardando,
    telefono, setTelefono,
    email, setEmail,
    editandoTelefono, setEditandoTelefono,
    editandoEmail, setEditandoEmail,
    handleGuardarTelefono,
    handleGuardarEmail,
    handleQuitarFoto,
    handleCancelarTelefono,
    handleCancelarEmail,
    handleCambiarFoto,
  }
}

export default usePerfil;