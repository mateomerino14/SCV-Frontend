import { useEffect } from 'react'

const MAX_PROVEEDOR = 50
const MAX_FACTURA = 50
const MAX_NIT = 10
const MAX_MONTO = 99999.99
const IVA_PORCENTAJE = 0.13

function useFormularioFactura(datos, onChange, guardado = false) {
  const monto = parseFloat(datos.monto || 0)
  const iva = parseFloat(datos.iva || 0)
  const montoTotal = monto + iva
  const porcentajeIva = datos.tipo_doc === 'F' ? 13 : 0

  useEffect(() => {
    if (guardado) return
    const esFactura = datos.tipo_doc === 'F'
    const ivaCalculado = esFactura ? parseFloat((monto * IVA_PORCENTAJE).toFixed(2)) : 0
    const ivaActual = parseFloat(datos.iva || 0)
    if (Math.abs(ivaCalculado - ivaActual) > 0.001) {
      onChange('iva', ivaCalculado.toFixed(2), true)
      onChange('monto_total', (monto + ivaCalculado).toFixed(2), true)
    }
  }, [monto, datos.tipo_doc, guardado])

  const validarDecimal = (valor) => {
    const soloDecimalValido = valor.replace(',', '.').replace(/[^0-9.]/g, '')
    const partes = soloDecimalValido.split('.')
    if (partes.length > 2) return null
    if (partes.length === 2 && partes[1].length > 2) return null
    return soloDecimalValido
  }

  const handleCampoChange = (campo, valor) => {
    if (campo === 'monto') {
      const valorValidado = validarDecimal(valor)
      if (valorValidado === null) return
      if (valorValidado !== '' && parseFloat(valorValidado) > MAX_MONTO) return
      onChange(campo, valorValidado)
      const nuevoMonto = parseFloat(valorValidado || 0)
      const esFactura = datos.tipo_doc === 'F'
      const nuevoIva = esFactura ? parseFloat((nuevoMonto * IVA_PORCENTAJE).toFixed(2)) : 0
      onChange('iva', nuevoIva.toFixed(2), true)
      onChange('monto_total', (nuevoMonto + nuevoIva).toFixed(2), true)
      return
    }

    if (campo === 'nit') {
      const soloNumeros = valor.replace(/[^0-9]/g, '').slice(0, MAX_NIT)
      onChange(campo, soloNumeros)
      return
    }

    if (campo === 'numero_factura') {
      const soloAlfanumerico = valor.replace(/[^a-zA-Z0-9\-\/]/g, '').slice(0, MAX_FACTURA)
      onChange(campo, soloAlfanumerico)
      return
    }

    if (campo === 'proveedor') {
      if (valor.length > MAX_PROVEEDOR) return
      onChange(campo, valor)
      return
    }

    onChange(campo, valor)
  }

  const handleTipoDocChange = (tipo) => {
    onChange('tipo_doc', tipo)
    const esFactura = tipo === 'F'
    const nuevoIva = esFactura ? parseFloat((monto * IVA_PORCENTAJE).toFixed(2)) : 0
    onChange('iva', nuevoIva.toFixed(2), true)
    onChange('monto_total', (monto + nuevoIva).toFixed(2), true)
  }

  return {
    montoTotal,
    porcentajeIva,
    handleCampoChange,
    handleTipoDocChange,
  }
}

export default useFormularioFactura;