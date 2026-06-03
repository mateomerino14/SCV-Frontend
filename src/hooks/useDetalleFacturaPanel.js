import { useState } from 'react'

function useDetalleFacturaPanel(detalle, onAgregar, onEliminar) {
  const [item, setItem] = useState({
    nombre_producto: '',
    precio: '',
    cantidad: 1,
  })
  const [indexSeleccionado, setIndexSeleccionado] = useState(null)

  const handleSeleccionarFila = (indice) => {
    setIndexSeleccionado(indice)
    setItem({
      nombre_producto: detalle[indice].nombre_producto,
      precio: detalle[indice].precio,
      cantidad: detalle[indice].cantidad,
    })
  }

  const handleCampoChange = (key, valor) => {
    if (key === 'precio') {
      const soloDecimalValido = valor.replace(',', '.').replace(/[^0-9.]/g, '')
      const partes = soloDecimalValido.split('.')

      if (partes.length > 2) {
        return
      }

      if (partes.length === 2 && partes[1].length > 2) {
        return
      }

      setItem((prev) => ({ ...prev, [key]: soloDecimalValido }))
      return
    }

    if (key === 'cantidad') {
      const soloEnteros = valor.replace(/[^0-9]/g, '')
      setItem((prev) => ({ ...prev, [key]: soloEnteros }))
      return
    }

    setItem((prev) => ({ ...prev, [key]: valor }))
  }

  const handleAgregar = () => {
    if (!item.nombre_producto || !item.precio) {
      return
    }

    onAgregar({
      nombre_producto: item.nombre_producto,
      precio: parseFloat(parseFloat(item.precio).toFixed(2)),
      cantidad: parseInt(item.cantidad),
    })

    setItem({ nombre_producto: '', precio: '', cantidad: 1 })
    setIndexSeleccionado(null)
  }

  const handleModificar = () => {
    if (indexSeleccionado === null || !item.nombre_producto || !item.precio) {
      return
    }

    onEliminar(indexSeleccionado)

    onAgregar({
      nombre_producto: item.nombre_producto,
      precio: parseFloat(parseFloat(item.precio).toFixed(2)),
      cantidad: parseInt(item.cantidad),
    })

    setItem({ nombre_producto: '', precio: '', cantidad: 1 })
    setIndexSeleccionado(null)
  }

  return {
    item,
    indexSeleccionado,
    handleSeleccionarFila,
    handleCampoChange,
    handleAgregar,
    handleModificar,
  }
}

export default useDetalleFacturaPanel;