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
  const [guardado, setGuardado] = useState(false)
  const [idViaje, setIdViaje] = useState(null)
  const [modificadoManualmente, setModificadoManualmente] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      setLoadingDatos(true)
      const datosGasto = await obtenerDetalleGasto(id_gasto)
      setLoadingDatos(false)

      if (datosGasto.error) {
        return
      }

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
  }

  const handleAgregarDetalle = (item) => {
    setDatos((prev) => ({
      ...prev,
      detalle: [...(prev.detalle || []), item],
    }))
    setModificadoManualmente(true)
  }

  const handleEliminarDetalle = (indice) => {
    setDatos((prev) => ({
      ...prev,
      detalle: prev.detalle.filter((_, i) => i !== indice),
    }))
    setModificadoManualmente(true)
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

  const handleGuardar = async () => {
    if (!datos?.proveedor) {
      mostrarError('El nombre del proveedor es requerido')
      return
    }

    if (!datos?.fecha_emision) {
      mostrarError('La fecha de emisión es requerida')
      return
    }

    if (!datos?.monto_total || isNaN(parseFloat(datos.monto_total))) {
      mostrarError('El monto total es requerido')
      return
    }

    setLoading(true)

    const payload = {
      ...datos,
      mantener_imagen: !!imagenExistente,
      modificado_manualmente: modificadoManualmente,
    }

    const data = await actualizarFactura(id_gasto, payload, imagen)
    setLoading(false)

    if (data.error) {
      mostrarError(data.error)
      return
    }

    setGuardado(true)
  }

  return {
    datos,
    previewImagen,
    imagenExistente,
    loading,
    loadingDatos,
    error,
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