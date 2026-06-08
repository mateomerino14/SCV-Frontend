import { useState, useEffect } from 'react'
import { obtenerDetalleGasto, actualizarFactura } from '../services/dashboardService'

function useEditarFactura(id_gasto) {
  const [datos, setDatos] = useState(null)
  const [imagen, setImagen] = useState(null)
  const [previewImagen, setPreviewImagen] = useState(null)
  const [imagenExistente, setImagenExistente] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingDatos, setLoadingDatos] = useState(true)
  const [error, setError] = useState('')
  const [erroresCampo, setErroresCampo] = useState({})
  const [guardado, setGuardado] = useState(false)
  const [idViaje, setIdViaje] = useState(null)
  const [modificadoManualmente, setModificadoManualmente] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      setLoadingDatos(true)
      const datosGasto = await obtenerDetalleGasto(id_gasto)
      setLoadingDatos(false)
      if (datosGasto.error) return
      setIdViaje(datosGasto.id_viaje || null)
      setModificadoManualmente(datosGasto.modificado || false)
      setDatos({
        proveedor: datosGasto.Proveedor?.nombre || '',
        numero_factura: datosGasto.Factura?.numero_factura || '',
        nit: datosGasto.Proveedor?.numero_doc_fiscal || '',
        fecha_emision: datosGasto.Factura?.fecha_emision || '',
        monto: parseFloat(datosGasto.Factura?.monto_parcial || 0).toString(),
        iva: '',
        monto_total: parseFloat(datosGasto.monto_total || 0).toString(),
        tipo_doc: datosGasto.tipo || 'F',
        detalle: datosGasto.Factura?.Detalle_Factura || [],
      })
      if (datosGasto.Imagen?.url_archivo) {
        setImagenExistente(datosGasto.Imagen.url_archivo)
        setPreviewImagen(datosGasto.Imagen.url_archivo)
      }
    }
    cargar()
  }, [id_gasto])

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const handleCambioDato = (campo, valor) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
    setModificadoManualmente(true)
    setErroresCampo((prev) => ({ ...prev, [campo]: undefined }))
  }

  const handleAgregarDetalle = (item) => {
    setDatos((prev) => ({ ...prev, detalle: [...(prev.detalle || []), item] }))
    setModificadoManualmente(true)
  }

  const handleEliminarDetalle = (indice) => {
    setDatos((prev) => ({ ...prev, detalle: prev.detalle.filter((_, i) => i !== indice) }))
    setModificadoManualmente(true)
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

  const validar = () => {
    const errores = {}
    if (!datos?.proveedor?.trim()) errores.proveedor = 'El proveedor es requerido'
    if (!datos?.numero_factura?.trim()) errores.numero_factura = 'El número de factura es requerido'
    if (!datos?.fecha_emision) errores.fecha_emision = 'La fecha de emisión es requerida'
    if (!datos?.monto || parseFloat(datos.monto) <= 0) errores.monto = 'El monto es requerido y debe ser mayor a 0'
    return errores
  }

  const handleGuardar = async () => {
    const errores = validar()
    if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
    setErroresCampo({})
    setLoading(true)
    const payload = {
      ...datos,
      id_viaje: idViaje,
      mantener_imagen: !!imagenExistente,
      modificado_manualmente: modificadoManualmente,
    }
    const data = await actualizarFactura(id_gasto, payload, imagen)
    setLoading(false)
    if (data.error) { mostrarError(data.error); return }
    setGuardado(true)
  }

  return {
    datos,
    previewImagen,
    imagenExistente,
    loading,
    loadingDatos,
    error,
    erroresCampo,
    guardado,
    modificadoManualmente,
    idViaje,
    handleCambioDato,
    handleAgregarDetalle,
    handleEliminarDetalle,
    handleImagenChange,
    handleEliminarImagen,
    handleGuardar,
  }
}

export default useEditarFactura;