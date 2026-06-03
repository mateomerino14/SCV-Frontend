import { useState, useEffect } from 'react'
import { getCategorias, obtenerDetalleGasto, actualizarGasto } from '../services/dashboardService'

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

      if (datosGasto.error) {
        return
      }

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

      if (!datosCategorias.error) {
        setCategorias(datosCategorias)
      }
    }

    cargar()
  }, [id_gasto])

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const handleImagenChange = (file) => {
    if (!file) {
      return
    }
    setImagen(file)
    setPreviewImagen(URL.createObjectURL(file))
    setImagenExistente(null)
  }

  const handleEliminarImagen = () => {
    if (previewImagen && !imagenExistente) {
      URL.revokeObjectURL(previewImagen)
    }
    setImagen(null)
    setPreviewImagen(null)
    setImagenExistente(null)
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
      tipo,
      fecha_gasto: fecha,
      proveedor: proveedor.trim() || null,
      monto: parseFloat(monto),
      descripcion: descripcion.trim(),
      id_categoria: idCategoria,
      mantener_imagen: !!imagenExistente,
    }

    const data = await actualizarGasto(id_gasto, datos, imagen)
    setLoading(false)

    if (data.error) {
      mostrarError(data.error)
      return
    }

    setGuardado(true)
  }

  return {
    tipo, setTipo,
    fecha, setFecha,
    proveedor, setProveedor,
    monto,
    descripcion, setDescripcion,
    idCategoria, setIdCategoria,
    categorias,
    previewImagen,
    loading,
    loadingDatos,
    error,
    guardado,
    idViaje,
    handleImagenChange,
    handleEliminarImagen,
    handleMontoChange,
    handleGuardar,
  }
}

export default useEditarGasto;