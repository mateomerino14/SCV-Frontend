import { useState, useEffect } from 'react'
import { getUsuarios, crearUsuario, actualizarUsuario, suspenderUsuario, activarUsuario, getCargos } from '../services/adminService'

function useGestionUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargos, setCargos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('TODOS')
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [showCrear, setShowCrear] = useState(false)
  const [showEditar, setShowEditar] = useState(false)
  const [showSuspender, setShowSuspender] = useState(false)
  const [showExito, setShowExito] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  const [formData, setFormData] = useState({
    nombre: '', apellido_paterno: '', apellido_materno: '',
    email_corporativo: '', telefono: '', contrasenia: '',
    id_cargo: '', id_rol: 3,
    numero_dependencia: '', numero_seccion: '',
  })

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    const [dataUsuarios, dataCargos] = await Promise.all([getUsuarios(), getCargos()])
    setLoading(false)
    if (!dataUsuarios.error) setUsuarios(dataUsuarios)
    if (!dataCargos.error) setCargos(dataCargos)
  }

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }

  const emailYaExiste = (email, idExcluir = null) => {
    return usuarios.some(
      (u) => u.email_corporativo.toLowerCase() === email.toLowerCase() &&
        (idExcluir ? u.id_usuario !== idExcluir : true)
    )
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombreCompleto = `${u.nombre} ${u.apellido_paterno}`.toLowerCase()
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase())
    const coincideRol = filtroRol === 'TODOS' || u.Rol?.nombre === filtroRol
    return coincideBusqueda && coincideRol
  })

  const abrirCrear = () => {
    setFormData({
      nombre: '', apellido_paterno: '', apellido_materno: '',
      email_corporativo: '', telefono: '', contrasenia: '',
      id_cargo: cargos.filter(c => c.activo)[0]?.id_cargo || '', id_rol: 3,
      numero_dependencia: '', numero_seccion: '',
    })
    setError('')
    setShowCrear(true)
  }

  const abrirEditar = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setFormData({
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno || '',
      email_corporativo: usuario.email_corporativo,
      telefono: usuario.telefono || '',
      contrasenia: '',
      id_cargo: usuario.Cargo?.id_cargo || '',
      id_rol: usuario.id_rol,
      numero_dependencia: usuario.numero_dependencia || '',
      numero_seccion: usuario.numero_seccion || '',
    })
    setError('')
    setShowEditar(true)
  }

  const abrirSuspender = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setShowSuspender(true)
  }

  const handleCrear = async () => {
    if (!formData.nombre || !formData.apellido_paterno || !formData.email_corporativo || !formData.contrasenia || !formData.id_cargo) {
      mostrarError('Completa todos los campos requeridos')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email_corporativo)) {
      mostrarError('Ingresa un correo electrónico válido')
      return
    }
    if (emailYaExiste(formData.email_corporativo)) {
      mostrarError('Ya existe un usuario con ese correo corporativo')
      return
    }
    if (formData.contrasenia.length < 6) {
      mostrarError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoadingAccion(true)
    const data = await crearUsuario({ ...formData, activo: true })
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowCrear(false)
    setMensajeExito('Usuario creado correctamente')
    setShowExito(true)
    await cargar()
  }

  const handleEditar = async () => {
    if (!formData.nombre || !formData.apellido_paterno || !formData.email_corporativo || !formData.id_cargo) {
      mostrarError('Completa todos los campos requeridos')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email_corporativo)) {
      mostrarError('Ingresa un correo electrónico válido')
      return
    }
    if (emailYaExiste(formData.email_corporativo, usuarioSeleccionado.id_usuario)) {
      mostrarError('Ya existe un usuario con ese correo corporativo')
      return
    }
    const payload = {
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      email_corporativo: formData.email_corporativo,
      telefono: formData.telefono,
      id_cargo: formData.id_cargo,
      id_rol: formData.id_rol,
      numero_dependencia: formData.numero_dependencia,
      numero_seccion: formData.numero_seccion,
    }
    setLoadingAccion(true)
    const data = await actualizarUsuario(usuarioSeleccionado.id_usuario, payload)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowEditar(false)
    setMensajeExito('Usuario actualizado correctamente')
    setShowExito(true)
    await cargar()
  }

  const handleToggleActivo = async () => {
    setLoadingAccion(true)
    const data = usuarioSeleccionado.activo
      ? await suspenderUsuario(usuarioSeleccionado.id_usuario)
      : await activarUsuario(usuarioSeleccionado.id_usuario)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowSuspender(false)
    setMensajeExito(usuarioSeleccionado.activo ? 'Usuario suspendido' : 'Usuario activado')
    setShowExito(true)
    await cargar()
  }

  return {
    usuarios: usuariosFiltrados,
    cargos,
    loading,
    loadingAccion,
    error,
    busqueda, setBusqueda,
    filtroRol, setFiltroRol,
    usuarioSeleccionado,
    showCrear, setShowCrear,
    showEditar, setShowEditar,
    showSuspender, setShowSuspender,
    showExito, setShowExito,
    mensajeExito,
    formData, setFormData,
    abrirCrear,
    abrirEditar,
    abrirSuspender,
    handleCrear,
    handleEditar,
    handleToggleActivo,
  }
}

export default useGestionUsuarios;