import { useState } from 'react'
import { extraerFactura, guardarFactura } from '../services/dashboardService'

function useSubirFactura(id_viaje) {
  const [facturas, setFacturas] = useState([])
  const [indexActual, setIndexActual] = useState(null)
  const [loadingGuardar, setLoadingGuardar] = useState(false)
  const [error, setError] = useState('')
  const [resumenGuardado, setResumenGuardado] = useState(null)
  const [modificadoManualmente, setModificadoManualmente] = useState(false)
  const [showEliminarModal, setShowEliminarModal] = useState(false)
  const [indiceAEliminar, setIndiceAEliminar] = useState(null)

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const handleAgregarArchivos = async (files) => {
    const nuevas = Array.from(files).map((file) => ({
      file,
      nombre: file.name,
      preview: URL.createObjectURL(file),
      datos: null,
      loading: true,
      error: null,
      guardado: false,
      errorGuardado: null,
    }))

    let baseIndex = 0

    setFacturas((prev) => {
      baseIndex = prev.length
      return [...prev, ...nuevas]
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    for (let i = 0; i < nuevas.length; i++) {
      const index = baseIndex + i
      const data = await extraerFactura(nuevas[i].file)

      setFacturas((prev) =>
        prev.map((f, idx) =>
          idx === index
            ? { ...f, loading: false, datos: data.error ? null : data, error: data.error || null }
            : f
        )
      )

      setIndexActual((prevIndex) => {
        if (prevIndex === null && !data.error) {
          return index
        }
        return prevIndex
      })
    }
  }

  const handleSeleccionarFactura = (index) => {
    setIndexActual(index)
    setModificadoManualmente(false)
  }

  const handlePedirEliminarFactura = (indice) => {
    setIndiceAEliminar(indice)
    setShowEliminarModal(true)
  }

  const handleConfirmarEliminarFactura = () => {
    const facturaAEliminar = facturas[indiceAEliminar]

    if (facturaAEliminar?.preview) {
      URL.revokeObjectURL(facturaAEliminar.preview)
    }

    setFacturas((prev) => prev.filter((_, i) => i !== indiceAEliminar))

    if (indexActual === indiceAEliminar) {
      setIndexActual(null)
    }

    setShowEliminarModal(false)
    setIndiceAEliminar(null)
  }

  const handleCancelarEliminarFactura = () => {
    setShowEliminarModal(false)
    setIndiceAEliminar(null)
  }

  const handleCambioDato = (campo, valor) => {
    if (indexActual === null) {
      return
    }
    setFacturas((prev) =>
      prev.map((f, i) =>
        i === indexActual
          ? { ...f, datos: { ...f.datos, [campo]: valor } }
          : f
      )
    )
    setModificadoManualmente(true)
  }

  const handleCambioDetalle = (idx, campo, valor) => {
    if (indexActual === null) {
      return
    }
    setFacturas((prev) =>
      prev.map((f, i) => {
        if (i !== indexActual) {
          return f
        }
        const detalle = [...f.datos.detalle]
        detalle[idx] = { ...detalle[idx], [campo]: valor }
        return { ...f, datos: { ...f.datos, detalle } }
      })
    )
    setModificadoManualmente(true)
  }

  const handleAgregarDetalle = (item) => {
    if (indexActual === null) {
      return
    }
    setFacturas((prev) =>
      prev.map((f, i) =>
        i === indexActual
          ? { ...f, datos: { ...f.datos, detalle: [...(f.datos.detalle || []), item] } }
          : f
      )
    )
    setModificadoManualmente(true)
  }

  const handleEliminarDetalle = (idx) => {
    if (indexActual === null) {
      return
    }
    setFacturas((prev) =>
      prev.map((f, i) =>
        i === indexActual
          ? { ...f, datos: { ...f.datos, detalle: f.datos.detalle.filter((_, j) => j !== idx) } }
          : f
      )
    )
    setModificadoManualmente(true)
  }

  const handleGuardar = async () => {
    const facturasListas = facturas.filter((f) => f.datos !== null && !f.loading && !f.guardado)
    if (facturasListas.length === 0) {
      mostrarError('No hay facturas listas para guardar')
      return
    }
    setLoadingGuardar(true)
    setResumenGuardado(null)
    let totalGuardadas = 0
    let totalErrores = 0

    for (let i = 0; i < facturas.length; i++) {
      const factura = facturas[i]

      if (!factura.datos || factura.loading || factura.guardado) {
        continue
      }
      console.log('archivo a guardar:', factura.file)
      console.log('nombre:', factura.file?.name)
      console.log('size:', factura.file?.size)
      console.log('type:', factura.file?.type)

      const data = await guardarFactura(
        { id_viaje, ...factura.datos, modificado_manualmente: modificadoManualmente },
        factura.file
      )

      if (data.error) {
        totalErrores++
        setFacturas((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, errorGuardado: data.error }
              : f
          )
        )
      } else {
        totalGuardadas++
        if (factura.preview) {
          URL.revokeObjectURL(factura.preview)
        }
        setFacturas((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, guardado: true, errorGuardado: null }
              : f
          )
        )
      }
    }

    setLoadingGuardar(false)
    setResumenGuardado({ guardadas: totalGuardadas, errores: totalErrores })
    setModificadoManualmente(false)
  }

  const facturaActual = indexActual !== null ? facturas[indexActual] : null
  const hayFacturasConError = facturas.some((f) => f.errorGuardado)
  const todasGuardadas = facturas.length > 0 && facturas.every((f) => f.guardado || f.loading || f.error)

  return {
    facturas,
    facturaActual,
    indexActual,
    loadingGuardar,
    error,
    resumenGuardado,
    modificadoManualmente,
    showEliminarModal,
    hayFacturasConError,
    todasGuardadas,
    handleAgregarArchivos,
    handleSeleccionarFactura,
    handlePedirEliminarFactura,
    handleConfirmarEliminarFactura,
    handleCancelarEliminarFactura,
    handleCambioDato,
    handleCambioDetalle,
    handleAgregarDetalle,
    handleEliminarDetalle,
    handleGuardar,
  }
}

export default useSubirFactura;