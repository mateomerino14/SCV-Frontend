import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategorias, obtenerDetalleGasto, actualizarGasto } from '../services/dashboardService'

const MAX_MONTO = 99999.99
const MAX_DESCRIPCION = 1000
const MAX_TIPO_CAMBIO = 9999.9999
const MAX_DESCRIPCION_SUBITEM = 255

const MONEDAS = [
  { codigo: 'EUR', nombre: 'Euro' },
  { codigo: 'PEN', nombre: 'Sol peruano' },
  { codigo: 'ARS', nombre: 'Peso argentino' },
  { codigo: 'BRL', nombre: 'Real brasileño' },
  { codigo: 'CLP', nombre: 'Peso chileno' },
  { codigo: 'COP', nombre: 'Peso colombiano' },
  { codigo: 'MXN', nombre: 'Peso mexicano' },
]

const CATEGORIAS_SUBITEM = ['Alimentación', 'Alojamiento', 'Transporte', 'Combustible', 'Peajes', 'Estacionamiento', 'Materiales de Oficina', 'Otros', 'Movilidad']

const calcularRetenciones = (monto, tipo, esInternacional) => {
  const montoNum = parseFloat(monto) || 0
  if (esInternacional || tipo === 'F' || tipo === 'R' || montoNum <= 0) {
    return { base: montoNum, rc_iva: 0, iue: 0, it: 0, costo: montoNum }
  }
  if (tipo === 'C') {
    const base = parseFloat((montoNum / 0.92).toFixed(2))
    const iue = parseFloat((base * 0.05).toFixed(2))
    const it = parseFloat((base * 0.03).toFixed(2))
    return { base, rc_iva: 0, iue, it, costo: base }
  }
  if (tipo === 'S') {
    const base = parseFloat((montoNum / 0.84).toFixed(2))
    const rc_iva = parseFloat((base * 0.13).toFixed(2))
    const it = parseFloat((base * 0.03).toFixed(2))
    return { base, rc_iva, iue: 0, it, costo: base }
  }
  return { base: montoNum, rc_iva: 0, iue: 0, it: 0, costo: montoNum }
}

let contadorTramo = 0
let contadorSubitem = 0
const nuevoTramo = (moneda = 'EUR', montoOrigen = '', tipoCambio = '') => ({
  id: `t${++contadorTramo}`, moneda, montoOrigen, tipoCambio,
})
const nuevoSubitem = (descripcion = '', monto = '') => ({
  id: `s${++contadorSubitem}`, descripcion, monto,
})

function useEditarGasto(id_gasto) {
  const [searchParams] = useSearchParams()
  const esGastoInternacional = searchParams.get('internacional') === 'true'

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
  const [usaOtraMoneda, setUsaOtraMoneda] = useState(false)
  const [tramos, setTramos] = useState([nuevoTramo()])
  const [erroresTramos, setErroresTramos] = useState({})
  const [usaSubitems, setUsaSubitems] = useState(false)
  const [subitems, setSubitems] = useState([nuevoSubitem()])
  const [erroresSubitems, setErroresSubitems] = useState({})

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
      setFecha(datosGasto.fecha_gasto?.split('T')[0] || '')
      setProveedor(datosGasto.Proveedor?.nombre || '')
      setDescripcion(datosGasto.descripcion || '')
      setIdCategoria(datosGasto.id_categoria || null)
      setIdViaje(datosGasto.id_viaje || null)
      setMonto(parseFloat(datosGasto.monto_total || 0).toString())

      const tramosGuardados = datosGasto.Gasto_Tramo_Moneda || []
      if (tramosGuardados.length > 0) {
        setUsaOtraMoneda(true)
        setTramos(tramosGuardados.map(t => nuevoTramo(
          t.moneda,
          parseFloat(t.monto_origen).toString(),
          parseFloat(t.tipo_cambio).toString(),
        )))
      }

      const subitemsGuardados = datosGasto.Gasto_Subitem || []
      if (subitemsGuardados.length > 0) {
        setUsaSubitems(true)
        setSubitems(subitemsGuardados.map(si => nuevoSubitem(
          si.descripcion,
          parseFloat(si.monto).toString(),
        )))
      }

      if (datosGasto.Imagen?.url_archivo) {
        setImagenExistente(datosGasto.Imagen.url_archivo)
        setPreviewImagen(datosGasto.Imagen.url_archivo)
      }
      if (!datosCategorias.error) setCategorias(datosCategorias)
    }
    cargar()
  }, [id_gasto])

  const tramosValidos = useMemo(() => {
    return tramos.filter(t => t.moneda && parseFloat(t.montoOrigen) > 0 && parseFloat(t.tipoCambio) > 0)
  }, [tramos])

  const subitemsValidos = useMemo(() => {
    return subitems.filter(si => si.descripcion.trim() && parseFloat(si.monto) > 0)
  }, [subitems])

  const montoFinalCalculado = useMemo(() => {
    if (!esGastoInternacional && usaSubitems && subitemsValidos.length > 0) {
      return parseFloat(subitemsValidos.reduce((s, si) => s + parseFloat(si.monto || 0), 0).toFixed(2))
    }
    return parseFloat(monto) || 0
  }, [monto, esGastoInternacional, usaSubitems, subitemsValidos])

  const retenciones = useMemo(() => {
    return calcularRetenciones(montoFinalCalculado, tipo, esGastoInternacional)
  }, [montoFinalCalculado, tipo, esGastoInternacional])

  const tieneRetenciones = !esGastoInternacional && (tipo === 'C' || tipo === 'S') && montoFinalCalculado > 0

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }

  const handleImagenChange = (file) => {
    if (!file) return
    setImagen(file)
    setPreviewImagen(URL.createObjectURL(file))
    setImagenExistente(null)
    setErroresCampo((prev) => ({ ...prev, imagen: undefined }))
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

  const handleAgregarTramo = () => {
    setTramos((prev) => [...prev, nuevoTramo()])
  }

  const handleEliminarTramo = (idTramo) => {
    setTramos((prev) => prev.length > 1 ? prev.filter(t => t.id !== idTramo) : prev)
    setErroresTramos((prev) => {
      const nuevo = { ...prev }
      delete nuevo[idTramo]
      return nuevo
    })
  }

  const handleTramoMonedaChange = (idTramo, valor) => {
    setTramos((prev) => prev.map(t => t.id === idTramo ? { ...t, moneda: valor } : t))
  }

  const handleTramoMontoChange = (idTramo, valor) => {
    if (valor !== '' && !/^\d*\.?\d{0,2}$/.test(valor)) return
    if (valor !== '' && parseFloat(valor) > MAX_MONTO) return
    setTramos((prev) => prev.map(t => t.id === idTramo ? { ...t, montoOrigen: valor } : t))
    setErroresTramos((prev) => ({ ...prev, [idTramo]: { ...prev[idTramo], monto: undefined } }))
  }

  const handleTramoTipoCambioChange = (idTramo, valor) => {
    if (valor === '') {
      setTramos((prev) => prev.map(t => t.id === idTramo ? { ...t, tipoCambio: '' } : t))
      setErroresTramos((prev) => ({ ...prev, [idTramo]: { ...prev[idTramo], tipoCambio: undefined } }))
      return
    }
    if (!/^\d*\.?\d{0,4}$/.test(valor)) return
    if (parseFloat(valor) > MAX_TIPO_CAMBIO) return
    setTramos((prev) => prev.map(t => t.id === idTramo ? { ...t, tipoCambio: valor } : t))
    setErroresTramos((prev) => ({ ...prev, [idTramo]: { ...prev[idTramo], tipoCambio: undefined } }))
  }

  const handleToggleSubitems = () => {
    setUsaSubitems((prev) => !prev)
  }

  const handleAgregarSubitem = () => {
    setSubitems((prev) => [...prev, nuevoSubitem()])
  }

  const handleEliminarSubitem = (idSubitem) => {
    setSubitems((prev) => prev.length > 1 ? prev.filter(si => si.id !== idSubitem) : prev)
    setErroresSubitems((prev) => {
      const nuevo = { ...prev }
      delete nuevo[idSubitem]
      return nuevo
    })
  }

  const handleSubitemDescripcionChange = (idSubitem, valor) => {
    if (valor.length > MAX_DESCRIPCION_SUBITEM) return
    setSubitems((prev) => prev.map(si => si.id === idSubitem ? { ...si, descripcion: valor } : si))
    setErroresSubitems((prev) => ({ ...prev, [idSubitem]: { ...prev[idSubitem], descripcion: undefined } }))
  }

  const handleSubitemMontoChange = (idSubitem, valor) => {
    if (valor !== '' && !/^\d*\.?\d{0,2}$/.test(valor)) return
    if (valor !== '' && parseFloat(valor) > MAX_MONTO) return
    setSubitems((prev) => prev.map(si => si.id === idSubitem ? { ...si, monto: valor } : si))
    setErroresSubitems((prev) => ({ ...prev, [idSubitem]: { ...prev[idSubitem], monto: undefined } }))
  }

  const handleProveedorChange = (valor) => {
    if (valor.length > 50) return
    setProveedor(valor)
  }

  const handleDescripcionChange = (valor) => {
    if (valor.length > MAX_DESCRIPCION) return
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
    const montoEsAutomatico = !esGastoInternacional && usaSubitems
    if (!montoEsAutomatico && (!monto || parseFloat(monto) <= 0)) {
      errores.monto = 'El monto es requerido y debe ser mayor a 0'
    }
    if (!usaSubitems && !descripcion.trim()) errores.descripcion = 'La descripción es requerida'
    if (!idCategoria) errores.categoria = 'La categoría es requerida'

    const erroresTramosLocal = {}
    if (usaOtraMoneda) {
      tramos.forEach((t) => {
        const errTramo = {}
        if (!t.montoOrigen || parseFloat(t.montoOrigen) <= 0) errTramo.monto = 'El monto es requerido'
        if (!t.tipoCambio || parseFloat(t.tipoCambio) <= 0) errTramo.tipoCambio = 'El tipo de cambio es requerido'
        if (Object.keys(errTramo).length > 0) erroresTramosLocal[t.id] = errTramo
      })
    }

    const erroresSubitemsLocal = {}
    if (usaSubitems) {
      subitems.forEach((si) => {
        const errSi = {}
        if (!si.descripcion.trim()) errSi.descripcion = 'La descripción es requerida'
        if (!si.monto || parseFloat(si.monto) <= 0) errSi.monto = 'El monto es requerido'
        if (Object.keys(errSi).length > 0) erroresSubitemsLocal[si.id] = errSi
      })
    }

    return { errores, erroresTramosLocal, erroresSubitemsLocal }
  }

  const handleGuardar = async () => {
    const { errores, erroresTramosLocal, erroresSubitemsLocal } = validar()
    if (Object.keys(errores).length > 0 || Object.keys(erroresTramosLocal).length > 0 || Object.keys(erroresSubitemsLocal).length > 0) {
      setErroresCampo(errores)
      setErroresTramos(erroresTramosLocal)
      setErroresSubitems(erroresSubitemsLocal)
      return
    }
    setErroresCampo({})
    setErroresTramos({})
    setErroresSubitems({})
    setLoading(true)

    const datos = {
      tipo,
      fecha_gasto: fecha,
      proveedor: proveedor.trim() || null,
      monto_total: montoFinalCalculado,
      descripcion: descripcion.trim(),
      id_categoria_gasto: idCategoria,
      mantener_imagen: !!imagenExistente,
      es_gasto_internacional: esGastoInternacional,
    }

    if (usaOtraMoneda && tramosValidos.length > 0) {
      datos.tramos = tramosValidos.map(t => ({
        moneda: t.moneda,
        monto_origen: parseFloat(t.montoOrigen),
        tipo_cambio: parseFloat(t.tipoCambio),
      }))
      datos.moneda = tramosValidos[0].moneda
      datos.tipo_cambio = parseFloat(tramosValidos[0].tipoCambio)
      datos.monto_moneda_origen = tramosValidos.reduce((s, t) => s + parseFloat(t.montoOrigen), 0)
    } else {
      datos.moneda = 'USD'
      datos.tipo_cambio = 1
      datos.monto_moneda_origen = montoFinalCalculado
    }

    if (usaSubitems && subitemsValidos.length > 0) {
      datos.subitems = subitemsValidos.map(si => ({
        descripcion: si.descripcion.trim(),
        monto: parseFloat(si.monto),
      }))
    }

    const data = await actualizarGasto(id_gasto, datos, imagen)
    setLoading(false)
    if (data.error) { mostrarError(data.error); return }
    setGuardado(true)
  }

  return {
    tipo, setTipo,
    fecha, proveedor, monto, descripcion,
    idCategoria, categorias,
    previewImagen, loading, loadingDatos,
    error, erroresCampo, guardado, idViaje,
    esGastoInternacional,
    usaOtraMoneda, setUsaOtraMoneda,
    tramos, tramosValidos, montoFinalCalculado,
    erroresTramos,
    usaSubitems, subitems, subitemsValidos, erroresSubitems,
    CATEGORIAS_SUBITEM,
    retenciones, tieneRetenciones,
    MONEDAS,
    handleImagenChange, handleEliminarImagen,
    handleMontoChange,
    handleAgregarTramo, handleEliminarTramo,
    handleTramoMonedaChange, handleTramoMontoChange, handleTramoTipoCambioChange,
    handleToggleSubitems, handleAgregarSubitem, handleEliminarSubitem,
    handleSubitemDescripcionChange, handleSubitemMontoChange,
    handleProveedorChange,
    handleDescripcionChange, handleFechaChange,
    handleCategoriaChange, handleGuardar,
  }
}

export default useEditarGasto;