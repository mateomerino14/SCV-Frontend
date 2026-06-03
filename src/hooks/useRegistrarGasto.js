import { useState, useEffect } from 'react'
import { getCategorias, registrarGasto } from '../services/dashboardService'

function useRegistrarGasto(id_viaje) {
  const [tipo, setTipo] = useState('C')
  const [fecha, setFecha] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [monto, setMonto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [idCategoria, setIdCategoria] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [imagen, setImagen] = useState(null)
  const [previewImagen, setPreviewImagen] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  useEffect(() => {
    const cargarCategorias = async () => {
      const data = await getCategorias()
      if (!data.error) {
        setCategorias(data)
      }
    }
    cargarCategorias()
  }, [])

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const limpiarCampos = () => {
    setTipo('C')
    setFecha('')
    setProveedor('')
    setMonto('')
    setDescripcion('')
    setIdCategoria(null)
    if (previewImagen) {
      URL.revokeObjectURL(previewImagen)
    }
    setImagen(null)
    setPreviewImagen(null)
  }

  const handleImagenChange = (file) => {
    if (!file) {
      return
    }
    setImagen(file)
    setPreviewImagen(URL.createObjectURL(file))
  }

  const handleEliminarImagen = () => {
    if (previewImagen) {
      URL.revokeObjectURL(previewImagen)
    }
    setImagen(null)
    setPreviewImagen(null)
  }

  const validarMonto = (valor) => {
    const soloDecimalValido = valor.replace(',', '.').replace(/[^0-9.]/g, '')
    const partes = soloDecimalValido.split('.')
    if (partes.length > 2) {
      return null
    }
    if (partes.length === 2 && partes[1].length > 2) {
      return null
    }
    return soloDecimalValido
  }

  const handleMontoChange = (valor) => {
    const valorValidado = validarMonto(valor)
    if (valorValidado !== null) {
      setMonto(valorValidado)
    }
  }

  const handleGuardar = async () => {
    if (!fecha) {
      mostrarError('La fecha del gasto es requerida')
      return
    }

    if (!monto || parseFloat(monto) <= 0) {
      mostrarError('El monto es requerido y debe ser mayor a cero')
      return
    }

    if (!descripcion.trim()) {
      mostrarError('La descripción es requerida')
      return
    }

    setLoading(true)

    const datos = {
      id_viaje,
      tipo,
      fecha_gasto: fecha,
      proveedor: proveedor.trim() || null,
      monto: parseFloat(monto),
      descripcion: descripcion.trim(),
      id_categoria: idCategoria,
    }

    const data = await registrarGasto(datos, imagen)
    setLoading(false)

    if (data.error) {
      mostrarError(data.error)
      return
    }

    limpiarCampos()
    setExito(true)
    setTimeout(() => setExito(false), 3000)
  }

  return {
    tipo, setTipo,
    fecha, setFecha,
    proveedor, setProveedor,
    monto,
    descripcion, setDescripcion,
    idCategoria, setIdCategoria,
    categorias,
    imagen,
    previewImagen,
    loading,
    error,
    exito,
    handleImagenChange,
    handleEliminarImagen,
    handleMontoChange,
    handleGuardar,
  }
}

export default useRegistrarGasto;