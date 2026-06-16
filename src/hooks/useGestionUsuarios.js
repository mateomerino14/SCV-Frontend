import { useState, useEffect } from 'react'
import { getUsuarios, crearUsuario, actualizarUsuario, suspenderUsuario, activarUsuario, getCargos } from '../services/adminService'

function useGestionUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargos, setCargos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [error, setError] = useState('')
  const [erroresCampo, setErroresCampo] = useState({})
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

  const emailYaExiste = (email, idExcluir = null) =>
    usuarios.some(
      (u) => u.email_corporativo.toLowerCase() === email.toLowerCase() &&
        (idExcluir ? u.id_usuario !== idExcluir : true)
    )

  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const soloNumeros = /^[0-9]+$/

  const validarCampos = (esNuevo, idExcluir = null) => {
    const errores = {}
    if (!formData.nombre.trim()) errores.nombre = 'El nombre es requerido'
    else if (!soloLetras.test(formData.nombre.trim())) errores.nombre = 'Solo puede contener letras'
    else if (formData.nombre.trim().length > 30) errores.nombre = 'Máximo 30 caracteres'

    if (!formData.apellido_paterno.trim()) errores.apellido_paterno = 'El apellido paterno es requerido'
    else if (!soloLetras.test(formData.apellido_paterno.trim())) errores.apellido_paterno = 'Solo puede contener letras'
    else if (formData.apellido_paterno.trim().length > 30) errores.apellido_paterno = 'Máximo 30 caracteres'

    if (formData.apellido_materno.trim()) {
      if (!soloLetras.test(formData.apellido_materno.trim())) errores.apellido_materno = 'Solo puede contener letras'
      else if (formData.apellido_materno.trim().length > 30) errores.apellido_materno = 'Máximo 30 caracteres'
    }

    if (!formData.email_corporativo.trim()) errores.email_corporativo = 'El correo es requerido'
    else if (!emailRegex.test(formData.email_corporativo)) errores.email_corporativo = 'Ingresa un correo válido'
    else if (formData.email_corporativo.length > 100) errores.email_corporativo = 'Máximo 100 caracteres'
    else if (emailYaExiste(formData.email_corporativo, idExcluir)) errores.email_corporativo = 'Ya existe un usuario con ese correo'

    if (formData.telefono.trim()) {
      if (!soloNumeros.test(formData.telefono.trim())) errores.telefono = 'Solo puede contener números'
      else if (formData.telefono.trim().length < 7) errores.telefono = 'Mínimo 7 dígitos'
      else if (formData.telefono.trim().length > 8) errores.telefono = 'Máximo 8 dígitos'
    }

    if (!formData.numero_dependencia.trim()) errores.numero_dependencia = 'El número de dependencia es requerido'
    else if (formData.numero_dependencia.trim().length > 50) errores.numero_dependencia = 'Máximo 50 caracteres'

    if (!formData.numero_seccion.trim()) errores.numero_seccion = 'El número de sección es requerido'
    else if (formData.numero_seccion.trim().length > 50) errores.numero_seccion = 'Máximo 50 caracteres'

    if (!formData.id_cargo) errores.id_cargo = 'Selecciona un cargo'

    if (esNuevo) {
      if (!formData.contrasenia) errores.contrasenia = 'La contraseña es requerida'
      else if (formData.contrasenia.length < 6) errores.contrasenia = 'Mínimo 6 caracteres'
    }

    return errores
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
    setErroresCampo({})
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
    setErroresCampo({})
    setShowEditar(true)
  }

  const abrirSuspender = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setShowSuspender(true)
  }

  const handleCrear = async () => {
    const errores = validarCampos(true)
    if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
    setErroresCampo({})
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
  const errores = validarCampos(false, usuarioSeleccionado.id_usuario)
  if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
  setErroresCampo({})
  const payload = {
    nombre: formData.nombre,
    apellido_paterno: formData.apellido_paterno,
    apellido_materno: formData.apellido_materno,
    email_corporativo: formData.email_corporativo,
    telefono: formData.telefono?.trim() || null,
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
    cargos, loading, loadingAccion, error, erroresCampo, setErroresCampo,
    busqueda, setBusqueda, filtroRol, setFiltroRol,
    usuarioSeleccionado,
    showCrear, setShowCrear, showEditar, setShowEditar,
    showSuspender, setShowSuspender, showExito, setShowExito,
    mensajeExito, formData, setFormData,
    abrirCrear, abrirEditar, abrirSuspender,
    handleCrear, handleEditar, handleToggleActivo,
  }
}

export default useGestionUsuarios;