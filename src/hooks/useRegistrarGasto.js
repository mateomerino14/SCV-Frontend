import { useState, useEffect } from 'react'
import { getCategorias, registrarGasto } from '../services/dashboardService'

const MAX_MONTO = 99999.99

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
  const [erroresCampo, setErroresCampo] = useState({})
  const [exito, setExito] = useState(false)

  useEffect(() => {
    const cargarCategorias = async () => {
      const data = await getCategorias()
      if (!data.error) setCategorias(data)
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
    if (previewImagen) URL.revokeObjectURL(previewImagen)
    setImagen(null)
    setPreviewImagen(null)
    setErroresCampo({})
  }

  const handleImagenChange = (file) => {
    if (!file) return
    setImagen(file)
    setPreviewImagen(URL.createObjectURL(file))
  }

  const handleEliminarImagen = () => {
    if (previewImagen) URL.revokeObjectURL(previewImagen)
    setImagen(null)
    setPreviewImagen(null)
  }

  const handleMontoChange = (valor) => {
    if (valor === '') { setMonto(''); return }
    if (!/^\d*\.?\d{0,2}$/.test(valor)) return
    if (parseFloat(valor) > MAX_MONTO) return
    setMonto(valor)
    setErroresCampo((prev) => ({ ...prev, monto: undefined }))
  }

  const handleProveedorChange = (valor) => {
    if (valor.length > 50) return
    setProveedor(valor)
  }

  const handleDescripcionChange = (valor) => {
    if (valor.length > 100) return
    setDescripcion(valor)
    setErroresCampo((prev) => ({ ...prev, descripcion: undefined }))
  }

  const handleFechaChange = (valor) => {
    setFecha(valor)
    setErroresCampo((prev) => ({ ...prev, fecha: undefined }))
  }

  const handleCategoriaChange = (id) => {
    setIdCategoria(id)
    setErroresCampo((prev) => ({ ...prev, categoria: undefined }))
  }

  const validar = () => {
    const errores = {}
    if (!fecha) errores.fecha = 'La fecha del gasto es requerida'
    if (!monto || parseFloat(monto) <= 0) errores.monto = 'El monto es requerido y debe ser mayor a 0'
    if (!descripcion.trim()) errores.descripcion = 'La descripción es requerida'
    if (!idCategoria) errores.categoria = 'La categoría es requerida'
    return errores
  }

  const handleGuardar = async () => {
    const errores = validar()
    if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
    setErroresCampo({})
    setLoading(true)
    const datos = {
      id_viaje, tipo,
      fecha_gasto: fecha,
      proveedor: proveedor.trim() || null,
      monto_total: parseFloat(monto),
      descripcion: descripcion.trim(),
      id_categoria_gasto: idCategoria,
    }
    const data = await registrarGasto(datos, imagen)
    setLoading(false)
    if (data.error) { mostrarError(data.error); return }
    limpiarCampos()
    setExito(true)
    setTimeout(() => setExito(false), 3000)
  }

  return {
    tipo, setTipo,
    fecha,
    proveedor,
    monto,
    descripcion,
    idCategoria,
    categorias,
    imagen,
    previewImagen,
    loading,
    error,
    erroresCampo,
    exito,
    handleImagenChange,
    handleEliminarImagen,
    handleMontoChange,
    handleProveedorChange,
    handleDescripcionChange,
    handleFechaChange,
    handleCategoriaChange,
    handleGuardar,
  }
}

export default useRegistrarGasto;