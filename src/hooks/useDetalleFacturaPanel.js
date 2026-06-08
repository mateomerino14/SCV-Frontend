import { useState } from 'react'

function useDetalleFacturaPanel(detalle, onAgregar, onEliminar) {
  const [item, setItem] = useState({ nombre_producto: '', precio: '', cantidad: 1 })
  const [indexSeleccionado, setIndexSeleccionado] = useState(null)
  const [erroresCampo, setErroresCampo] = useState({})

  const handleSeleccionarFila = (indice) => {
    setIndexSeleccionado(indice)
    setItem({
      nombre_producto: detalle[indice].nombre_producto,
      precio: detalle[indice].precio,
      cantidad: detalle[indice].cantidad,
    })
    setErroresCampo({})
  }

  const handleCampoChange = (key, valor) => {
    if (key === 'precio') {
      const soloDecimalValido = valor.replace(',', '.').replace(/[^0-9.]/g, '')
      const partes = soloDecimalValido.split('.')
      if (partes.length > 2) return
      if (partes.length === 2 && partes[1].length > 2) return
      setItem((prev) => ({ ...prev, [key]: soloDecimalValido }))
    } else if (key === 'cantidad') {
      const soloEnteros = valor.replace(/[^0-9]/g, '')
      setItem((prev) => ({ ...prev, [key]: soloEnteros }))
    } else if (key === 'nombre_producto') {
      if (valor.length > 50) return
      setItem((prev) => ({ ...prev, [key]: valor }))
    } else {
      setItem((prev) => ({ ...prev, [key]: valor }))
    }
    setErroresCampo((prev) => ({ ...prev, [key]: undefined }))
  }

  const validar = () => {
    const errores = {}
    if (!item.nombre_producto.trim()) errores.nombre_producto = 'La descripción es requerida'
    if (!item.precio || parseFloat(item.precio) <= 0) errores.precio = 'El precio es requerido y debe ser mayor a 0'
    if (!item.cantidad || parseInt(item.cantidad) <= 0) errores.cantidad = 'La cantidad debe ser mayor a 0'
    return errores
  }

  const handleAgregar = () => {
    const errores = validar()
    if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
    onAgregar({
      nombre_producto: item.nombre_producto.trim(),
      precio: parseFloat(parseFloat(item.precio).toFixed(2)),
      cantidad: parseInt(item.cantidad),
    })
    setItem({ nombre_producto: '', precio: '', cantidad: 1 })
    setIndexSeleccionado(null)
    setErroresCampo({})
  }

  const handleModificar = () => {
    if (indexSeleccionado === null) return
    const errores = validar()
    if (Object.keys(errores).length > 0) { setErroresCampo(errores); return }
    onEliminar(indexSeleccionado)
    onAgregar({
      nombre_producto: item.nombre_producto.trim(),
      precio: parseFloat(parseFloat(item.precio).toFixed(2)),
      cantidad: parseInt(item.cantidad),
    })
    setItem({ nombre_producto: '', precio: '', cantidad: 1 })
    setIndexSeleccionado(null)
    setErroresCampo({})
  }

  return {
    item,
    indexSeleccionado,
    erroresCampo,
    handleSeleccionarFila,
    handleCampoChange,
    handleAgregar,
    handleModificar,
  }
}

export default useDetalleFacturaPanel;