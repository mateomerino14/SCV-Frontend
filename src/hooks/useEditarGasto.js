import { useState, useEffect } from 'react'
import { getCategorias, obtenerDetalleGasto, actualizarGasto } from '../services/dashboardService'

const MAX_MONTO = 99999.99

function useEditarGasto(id_gasto) {
  const [tipo, setTipo] = useState('C')
  const [fecha, setFecha] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [monto, setMonto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [idCategoria, setIdCategoria] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [imagen, setImagen] = useState(null)
  const [previewImagen, setPreviewImagen] = useState(null)
  const [imagenExistente, setImagenExistente] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingDatos, setLoadingDatos] = useState(true)
  const [error, setError] = useState('')
  const [erroresCampo, setErroresCampo] = useState({})
  const [guardado, setGuardado] = useState(false)
  const [idViaje, setIdViaje] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      setLoadingDatos(true)
      const [datosGasto, datosCategorias] = await Promise.all([
        obtenerDetalleGasto(id_gasto),
        getCategorias(),
      ])
      setLoadingDatos(false)
      if (datosGasto.error) return
      setTipo(datosGasto.tipo || 'C')
      setFecha(datosGasto.fecha_gasto || '')
      setProveedor(datosGasto.Proveedor?.nombre || '')
      setMonto(parseFloat(datosGasto.monto_total || 0).toString())
      setDescripcion(datosGasto.descripcion || '')
      setIdCategoria(datosGasto.id_categoria || null)
      setIdViaje(datosGasto.id_viaje || null)
      if (datosGasto.Imagen?.url_archivo) {
        setImagenExistente(datosGasto.Imagen.url_archivo)
        setPreviewImagen(datosGasto.Imagen.url_archivo)
      }
      if (!datosCategorias.error) setCategorias(datosCategorias)
    }
    cargar()
  }, [id_gasto])

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const handleImagenChange = (file) => {
    if (!file) return
    setImagen(file)
    setPreviewImagen(URL.createObjectURL(file))
    setImagenExistente(null)
  }

  const handleEliminarImagen = () => {
    if (previewImagen && !imagenExistente) URL.revokeObjectURL(previewImagen)
    setImagen(null)
    setPreviewImagen(null)
    setImagenExistente(null)
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
      tipo,
      fecha_gasto: fecha,
      proveedor: proveedor.trim() || null,
      monto_total: parseFloat(monto),
      descripcion: descripcion.trim(),
      id_categoria_gasto: idCategoria,
      mantener_imagen: !!imagenExistente,
    }
    const data = await actualizarGasto(id_gasto, datos, imagen)
    setLoading(false)
    if (data.error) { mostrarError(data.error); return }
    setGuardado(true)
  }

  return {
    tipo, setTipo,
    fecha,
    proveedor,
    monto,
    descripcion,
    idCategoria,
    categorias,
    previewImagen,
    loading,
    loadingDatos,
    error,
    erroresCampo,
    guardado,
    idViaje,
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

export default useEditarGasto;