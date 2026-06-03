import { useState, useEffect } from 'react'
import { getCargos, crearCargo, actualizarCargo, suspenderCargo, activarCargo } from '../services/adminService'

const MAX_MONTO = 99999.99

function useGestionCargos() {
  const [cargos, setCargos] = useState([])
  const [todosLosCargos, setTodosLosCargos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [error, setError] = useState('')
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
    if (!data.error) {
      setCargos(data)
      setTodosLosCargos(data)
    }
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

  const cargoYaExiste = (nombre, idExcluir = null) => {
    return todosLosCargos.some(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase() &&
        (idExcluir ? c.id_cargo !== idExcluir : true)
    )
  }

  const validarMonto = (valor) => {
    const num = parseFloat(valor)
    if (isNaN(num) || num <= 0) return 'El monto debe ser mayor a 0'
    if (num > MAX_MONTO) return `El monto no puede superar ${MAX_MONTO} Bs`
    const decimales = valor.toString().split('.')[1]
    if (decimales && decimales.length > 2) return 'El monto no puede tener más de 2 decimales'
    return null
  }

  const abrirCrear = () => {
    setFormData({ nombre: '', monto_diario: '' })
    setError('')
    setShowCrear(true)
  }

  const abrirEditar = (cargo) => {
    setCargoSeleccionado(cargo)
    setFormData({ nombre: cargo.nombre, monto_diario: cargo.monto_diario })
    setError('')
    setShowEditar(true)
  }

  const abrirSuspender = (cargo) => {
    setCargoSeleccionado(cargo)
    setShowSuspender(true)
  }

  const handleCrear = async () => {
    if (!formData.nombre.trim() || !formData.monto_diario) {
      mostrarError('Completa todos los campos requeridos')
      return
    }
    if (cargoYaExiste(formData.nombre.trim())) {
      mostrarError('Ya existe un cargo con ese nombre')
      return
    }
    const errorMonto = validarMonto(formData.monto_diario)
    if (errorMonto) { mostrarError(errorMonto); return }

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
    if (!formData.nombre.trim() || !formData.monto_diario) {
      mostrarError('Completa todos los campos requeridos')
      return
    }
    if (cargoYaExiste(formData.nombre.trim(), cargoSeleccionado.id_cargo)) {
      mostrarError('Ya existe un cargo con ese nombre')
      return
    }
    const errorMonto = validarMonto(formData.monto_diario)
    if (errorMonto) { mostrarError(errorMonto); return }

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
    loading,
    loadingAccion,
    error,
    busqueda, setBusqueda,
    cargoSeleccionado,
    showCrear, setShowCrear,
    showEditar, setShowEditar,
    showSuspender, setShowSuspender,
    showExito, setShowExito,
    mensajeExito,
    formData, setFormData,
    sugerenciasCargo,
    abrirCrear,
    abrirEditar,
    abrirSuspender,
    handleCrear,
    handleEditar,
    handleToggleActivo,
  }
}

export default useGestionCargos;