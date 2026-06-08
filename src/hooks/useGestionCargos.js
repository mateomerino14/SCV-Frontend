import { useState, useEffect } from 'react'
import { getCargos, crearCargo, actualizarCargo, suspenderCargo, activarCargo } from '../services/adminService'

const MAX_MONTO = 99999.99
const MAX_NOMBRE = 50

function useGestionCargos() {
  const [cargos, setCargos] = useState([])
  const [todosLosCargos, setTodosLosCargos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [error, setError] = useState('')
  const [erroresCampo, setErroresCampo] = useState({})
  const [busqueda, setBusqueda] = useState('')
  const [cargoSeleccionado, setCargoSeleccionado] = useState(null)
  const [showCrear, setShowCrear] = useState(false)
  const [showEditar, setShowEditar] = useState(false)
  const [showSuspender, setShowSuspender] = useState(false)
  const [showExito, setShowExito] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  const [formData, setFormData] = useState({ nombre: '', monto_diario: '' })

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    const data = await getCargos()
    setLoading(false)
    if (!data.error) { setCargos(data); setTodosLosCargos(data) }
  }

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }

  const cargosFiltrados = todosLosCargos.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const sugerenciasCargo = formData.nombre.length >= 2
    ? todosLosCargos.filter((c) =>
        c.nombre.toLowerCase().includes(formData.nombre.toLowerCase()) &&
        (cargoSeleccionado ? c.id_cargo !== cargoSeleccionado.id_cargo : true)
      )
    : []

  const cargoYaExiste = (nombre, idExcluir = null) =>
    todosLosCargos.some(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase() &&
        (idExcluir ? c.id_cargo !== idExcluir : true)
    )

  const validarCampos = (idExcluir = null) => {
    const errores = {}
    if (!formData.nombre.trim()) {
      errores.nombre = 'El nombre del cargo es requerido'
    } else if (formData.nombre.trim().length > MAX_NOMBRE) {
      errores.nombre = 'Máximo 50 caracteres'
    } else if (cargoYaExiste(formData.nombre.trim(), idExcluir)) {
      errores.nombre = 'Ya existe un cargo con ese nombre'
    }
    if (!formData.monto_diario) {
      errores.monto_diario = 'El sueldo diario es requerido'
    } else {
      const num = parseFloat(formData.monto_diario)
      if (isNaN(num) || num <= 0) errores.monto_diario = 'Debe ser mayor a 0'
      else if (num > MAX_MONTO) errores.monto_diario = `No puede superar ${MAX_MONTO} Bs`
    }
    return errores
  }

  const abrirCrear = () => {
    setFormData({ nombre: '', monto_diario: '' })
    setError('')
    setErroresCampo({})
    setShowCrear(true)
  }

  const abrirEditar = (cargo) => {
    setCargoSeleccionado(cargo)
    setFormData({ nombre: cargo.nombre, monto_diario: cargo.monto_diario })
    setError('')
    setErroresCampo({})
    setShowEditar(true)
  }

  const abrirSuspender = (cargo) => {
    setCargoSeleccionado(cargo)
    setShowSuspender(true)
  }

  const handleCrear = async () => {
    const errores = validarCampos()
    if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
    setErroresCampo({})
    setLoadingAccion(true)
    const data = await crearCargo({
      nombre: formData.nombre.trim(),
      monto_diario: parseFloat(parseFloat(formData.monto_diario).toFixed(2)),
      activo: true,
    })
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowCrear(false)
    setMensajeExito('Cargo creado correctamente')
    setShowExito(true)
    await cargar()
  }

  const handleEditar = async () => {
    const errores = validarCampos(cargoSeleccionado.id_cargo)
    if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
    setErroresCampo({})
    setLoadingAccion(true)
    const data = await actualizarCargo(cargoSeleccionado.id_cargo, {
      nombre: formData.nombre.trim(),
      monto_diario: parseFloat(parseFloat(formData.monto_diario).toFixed(2)),
    })
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowEditar(false)
    setMensajeExito('Cargo actualizado correctamente')
    setShowExito(true)
    await cargar()
  }

  const handleToggleActivo = async () => {
    setLoadingAccion(true)
    const data = cargoSeleccionado.activo
      ? await suspenderCargo(cargoSeleccionado.id_cargo)
      : await activarCargo(cargoSeleccionado.id_cargo)
    setLoadingAccion(false)
    if (data.error) { mostrarError(data.error); return }
    setShowSuspender(false)
    setMensajeExito(cargoSeleccionado.activo ? 'Cargo bloqueado' : 'Cargo activado')
    setShowExito(true)
    await cargar()
  }

  return {
    cargos: cargosFiltrados,
    todosLosCargos,
    loading, loadingAccion, error, erroresCampo, setErroresCampo,
    busqueda, setBusqueda,
    cargoSeleccionado,
    showCrear, setShowCrear,
    showEditar, setShowEditar,
    showSuspender, setShowSuspender,
    showExito, setShowExito,
    mensajeExito,
    formData, setFormData,
    sugerenciasCargo,
    abrirCrear, abrirEditar, abrirSuspender,
    handleCrear, handleEditar, handleToggleActivo,
  }
}

export default useGestionCargos;