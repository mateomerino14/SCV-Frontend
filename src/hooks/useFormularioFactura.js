import { useEffect } from 'react'

const MAX_PROVEEDOR = 50
const MAX_FACTURA = 50
const MAX_NIT = 10
const MAX_MONTO = 99999.99

function useFormularioFactura(datos, onChange) {
  const monto = parseFloat(datos.monto || 0)
  const iva = parseFloat(datos.iva || 0)
  const montoTotal = monto + iva
  const porcentajeIva = monto > 0 ? ((iva / monto) * 100).toFixed(0) : 0

  useEffect(() => {
    const ivaActual = parseFloat(datos.iva || 0)
    if (ivaActual > 0 && datos.tipo_doc !== 'F') {
      onChange('tipo_doc', 'F')
    } else if (ivaActual === 0 && datos.tipo_doc !== 'R') {
      onChange('tipo_doc', 'R')
    }
  }, [datos.iva])

  const validarDecimal = (valor) => {
    const soloDecimalValido = valor.replace(',', '.').replace(/[^0-9.]/g, '')
    const partes = soloDecimalValido.split('.')
    if (partes.length > 2) return null
    if (partes.length === 2 && partes[1].length > 2) return null
    return soloDecimalValido
  }

  const handleCampoChange = (campo, valor) => {
    if (campo === 'monto' || campo === 'iva') {
      const valorValidado = validarDecimal(valor)
      if (valorValidado === null) return
      if (valorValidado !== '' && parseFloat(valorValidado) > MAX_MONTO) return
      onChange(campo, valorValidado)
      const nuevoMonto = campo === 'monto' ? parseFloat(valorValidado || 0) : monto
      const nuevoIva = campo === 'iva' ? parseFloat(valorValidado || 0) : iva
      onChange('monto_total', (nuevoMonto + nuevoIva).toFixed(2))
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

  return {
    montoTotal,
    porcentajeIva,
    handleCampoChange,
  }
}

export default useFormularioFactura;