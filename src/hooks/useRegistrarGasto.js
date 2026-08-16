import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategorias, registrarGasto, obtenerDetalleViaje } from '../services/dashboardService'

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

let contadorItem = 0
let contadorTramo = 0
let contadorSubitem = 0

const nuevoTramo = () => ({ id: `t${++contadorTramo}`, moneda: 'EUR', montoOrigen: '', tipoCambio: '' })
const nuevoSubitem = () => ({ id: `s${++contadorSubitem}`, descripcion: '', monto: '' })

const nuevoItem = () => ({
  id: `g${++contadorItem}`,
  tipo: 'C',
  fecha: '',
  proveedor: '',
  monto: '',
  descripcion: '',
  idCategoria: null,
  imagen: null,
  previewImagen: null,
  usaOtraMoneda: false,
  tramos: [nuevoTramo()],
  usaSubitems: false,
  subitems: [nuevoSubitem()],
  erroresCampo: {},
  erroresTramos: {},
  erroresSubitems: {},
  guardado: false,
  errorGuardado: null,
  requiereAutorizacion: false,
})

function useRegistrarGasto(id_viaje) {
  const [searchParams] = useSearchParams()
  const esGastoInternacional = searchParams.get('internacional') === 'true'

  const [items, setItems] = useState([nuevoItem()])
  const [expandidoId, setExpandidoId] = useState(items[0].id)
  const [categorias, setCategorias] = useState([])
  const [esInternacional, setEsInternacional] = useState(false)
  const [loadingGuardar, setLoadingGuardar] = useState(false)
  const [error, setError] = useState('')
  const [resumenGuardado, setResumenGuardado] = useState(null)

  useEffect(() => {
    const cargarCategorias = async () => {
      const data = await getCategorias()
      if (!data.error) setCategorias(data)
    }
    cargarCategorias()
  }, [])

  useEffect(() => {
    const cargarViaje = async () => {
      const data = await obtenerDetalleViaje(id_viaje)
      if (!data.error && data.viaje?.tipo === 'Internacional') setEsInternacional(true)
    }
    cargarViaje()
  }, [id_viaje])

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }

  const tramosValidosDe = (item) =>
    item.tramos.filter(t => t.moneda && parseFloat(t.montoOrigen) > 0 && parseFloat(t.tipoCambio) > 0)

  const subitemsValidosDe = (item) =>
    item.subitems.filter(si => si.descripcion.trim() && parseFloat(si.monto) > 0)

  const montoFinalDe = (item) => {
    if (!esGastoInternacional && item.usaSubitems) {
      const validos = subitemsValidosDe(item)
      if (validos.length > 0) {
        return parseFloat(validos.reduce((s, si) => s + parseFloat(si.monto || 0), 0).toFixed(2))
      }
    }
    return parseFloat(item.monto) || 0
  }

  const retencionesDe = (item) => calcularRetenciones(montoFinalDe(item), item.tipo, esGastoInternacional)
  const tieneRetencionesDe = (item) => !esGastoInternacional && (item.tipo === 'C' || item.tipo === 'S') && montoFinalDe(item) > 0

  const actualizarItem = (idItem, cambios) => {
    setItems((prev) => prev.map((it) => it.id === idItem ? { ...it, ...cambios } : it))
  }

  const handleAgregarItem = () => {
    const item = nuevoItem()
    setItems((prev) => [...prev, item])
    setExpandidoId(item.id)
  }

  const handleDuplicarItem = (idItem) => {
    const original = items.find((it) => it.id === idItem)
    if (!original) return
    const copia = {
      ...nuevoItem(),
      tipo: original.tipo,
      fecha: original.fecha,
      proveedor: original.proveedor,
      descripcion: original.descripcion,
      idCategoria: original.idCategoria,
    }
    setItems((prev) => {
      const indice = prev.findIndex((it) => it.id === idItem)
      const nuevos = [...prev]
      nuevos.splice(indice + 1, 0, copia)
      return nuevos
    })
    setExpandidoId(copia.id)
  }

  const handleEliminarItem = (idItem) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev
      const item = prev.find(it => it.id === idItem)
      if (item?.previewImagen) URL.revokeObjectURL(item.previewImagen)
      return prev.filter(it => it.id !== idItem)
    })
  }

  const handleSeleccionarItem = (idItem) => {
    setExpandidoId((prev) => prev === idItem ? null : idItem)
  }

  const handleTipoChange = (idItem, tipo) => actualizarItem(idItem, { tipo })

  const handleFechaChange = (idItem, valor) => {
    setItems((prev) => prev.map((it) => it.id === idItem ? { ...it, fecha: valor, erroresCampo: { ...it.erroresCampo, fecha: undefined } } : it))
  }

  const handleProveedorChange = (idItem, valor) => {
    if (valor.length > 50) return
    actualizarItem(idItem, { proveedor: valor })
  }

  const handleMontoChange = (idItem, valor) => {
    if (valor === '') {
      setItems((prev) => prev.map((it) => it.id === idItem ? { ...it, monto: '', erroresCampo: { ...it.erroresCampo, monto: undefined } } : it))
      return
    }
    if (!/^\d*\.?\d{0,2}$/.test(valor)) return
    if (parseFloat(valor) > MAX_MONTO) return
    setItems((prev) => prev.map((it) => it.id === idItem ? { ...it, monto: valor, erroresCampo: { ...it.erroresCampo, monto: undefined } } : it))
  }

  const handleDescripcionChange = (idItem, valor) => {
    if (valor.length > MAX_DESCRIPCION) return
    setItems((prev) => prev.map((it) => it.id === idItem ? { ...it, descripcion: valor, erroresCampo: { ...it.erroresCampo, descripcion: undefined } } : it))
  }

  const handleCategoriaChange = (idItem, idCategoria) => {
    setItems((prev) => prev.map((it) => it.id === idItem ? { ...it, idCategoria, erroresCampo: { ...it.erroresCampo, categoria: undefined } } : it))
  }

  const handleImagenChange = (idItem, file) => {
    if (!file) return
    setItems((prev) => prev.map((it) => {
      if (it.id !== idItem) return it
      if (it.previewImagen) URL.revokeObjectURL(it.previewImagen)
      return { ...it, imagen: file, previewImagen: URL.createObjectURL(file), erroresCampo: { ...it.erroresCampo, imagen: undefined } }
    }))
  }

  const handleEliminarImagen = (idItem) => {
    setItems((prev) => prev.map((it) => {
      if (it.id !== idItem) return it
      if (it.previewImagen) URL.revokeObjectURL(it.previewImagen)
      return { ...it, imagen: null, previewImagen: null }
    }))
  }

  const handleToggleOtraMoneda = (idItem) => {
    setItems((prev) => prev.map((it) => it.id === idItem ? { ...it, usaOtraMoneda: !it.usaOtraMoneda } : it))
  }

  const handleAgregarTramo = (idItem) => {
    setItems((prev) => prev.map((it) => it.id === idItem ? { ...it, tramos: [...it.tramos, nuevoTramo()] } : it))
  }

  const handleEliminarTramo = (idItem, idTramo) => {
    setItems((prev) => prev.map((it) => {
      if (it.id !== idItem) return it
      if (it.tramos.length <= 1) return it
      const nuevosErrores = { ...it.erroresTramos }
      delete nuevosErrores[idTramo]
      return { ...it, tramos: it.tramos.filter(t => t.id !== idTramo), erroresTramos: nuevosErrores }
    }))
  }

  const handleTramoMonedaChange = (idItem, idTramo, valor) => {
    setItems((prev) => prev.map((it) => it.id === idItem
      ? { ...it, tramos: it.tramos.map(t => t.id === idTramo ? { ...t, moneda: valor } : t) }
      : it))
  }

  const handleTramoMontoChange = (idItem, idTramo, valor) => {
    if (valor !== '' && !/^\d*\.?\d{0,2}$/.test(valor)) return
    if (valor !== '' && parseFloat(valor) > MAX_MONTO) return
    setItems((prev) => prev.map((it) => {
      if (it.id !== idItem) return it
      return {
        ...it,
        tramos: it.tramos.map(t => t.id === idTramo ? { ...t, montoOrigen: valor } : t),
        erroresTramos: { ...it.erroresTramos, [idTramo]: { ...it.erroresTramos[idTramo], monto: undefined } },
      }
    }))
  }

  const handleTramoTipoCambioChange = (idItem, idTramo, valor) => {
    if (valor !== '' && !/^\d*\.?\d{0,4}$/.test(valor)) return
    if (valor !== '' && parseFloat(valor) > MAX_TIPO_CAMBIO) return
    setItems((prev) => prev.map((it) => {
      if (it.id !== idItem) return it
      return {
        ...it,
        tramos: it.tramos.map(t => t.id === idTramo ? { ...t, tipoCambio: valor } : t),
        erroresTramos: { ...it.erroresTramos, [idTramo]: { ...it.erroresTramos[idTramo], tipoCambio: undefined } },
      }
    }))
  }

  const handleToggleSubitems = (idItem) => {
    setItems((prev) => prev.map((it) => it.id === idItem ? { ...it, usaSubitems: !it.usaSubitems } : it))
  }

  const handleAgregarSubitem = (idItem) => {
    setItems((prev) => prev.map((it) => it.id === idItem ? { ...it, subitems: [...it.subitems, nuevoSubitem()] } : it))
  }

  const handleEliminarSubitem = (idItem, idSubitem) => {
    setItems((prev) => prev.map((it) => {
      if (it.id !== idItem) return it
      if (it.subitems.length <= 1) return it
      const nuevosErrores = { ...it.erroresSubitems }
      delete nuevosErrores[idSubitem]
      return { ...it, subitems: it.subitems.filter(si => si.id !== idSubitem), erroresSubitems: nuevosErrores }
    }))
  }

  const handleSubitemDescripcionChange = (idItem, idSubitem, valor) => {
    if (valor.length > MAX_DESCRIPCION_SUBITEM) return
    setItems((prev) => prev.map((it) => {
      if (it.id !== idItem) return it
      return {
        ...it,
        subitems: it.subitems.map(si => si.id === idSubitem ? { ...si, descripcion: valor } : si),
        erroresSubitems: { ...it.erroresSubitems, [idSubitem]: { ...it.erroresSubitems[idSubitem], descripcion: undefined } },
      }
    }))
  }

  const handleSubitemMontoChange = (idItem, idSubitem, valor) => {
    if (valor !== '' && !/^\d*\.?\d{0,2}$/.test(valor)) return
    if (valor !== '' && parseFloat(valor) > MAX_MONTO) return
    setItems((prev) => prev.map((it) => {
      if (it.id !== idItem) return it
      return {
        ...it,
        subitems: it.subitems.map(si => si.id === idSubitem ? { ...si, monto: valor } : si),
        erroresSubitems: { ...it.erroresSubitems, [idSubitem]: { ...it.erroresSubitems[idSubitem], monto: undefined } },
      }
    }))
  }

  const validarItem = (item) => {
    const errores = {}
    if (!item.fecha) errores.fecha = 'La fecha del gasto es requerida'
    const montoEsAutomatico = !esGastoInternacional && item.usaSubitems
    if (!montoEsAutomatico && (!item.monto || parseFloat(item.monto) <= 0)) {
      errores.monto = 'El monto es requerido y debe ser mayor a 0'
    }
    if (!item.usaSubitems && !item.descripcion.trim()) errores.descripcion = 'La descripción es requerida'
    if (!item.idCategoria) errores.categoria = 'La categoría es requerida'

    const erroresTramos = {}
    if (item.usaOtraMoneda) {
      item.tramos.forEach((t) => {
        const errTramo = {}
        if (!t.montoOrigen || parseFloat(t.montoOrigen) <= 0) errTramo.monto = 'El monto es requerido'
        if (!t.tipoCambio || parseFloat(t.tipoCambio) <= 0) errTramo.tipoCambio = 'El tipo de cambio es requerido'
        if (Object.keys(errTramo).length > 0) erroresTramos[t.id] = errTramo
      })
    }

    const erroresSubitems = {}
    if (item.usaSubitems) {
      item.subitems.forEach((si) => {
        const errSi = {}
        if (!si.descripcion.trim()) errSi.descripcion = 'La descripción es requerida'
        if (!si.monto || parseFloat(si.monto) <= 0) errSi.monto = 'El monto es requerido'
        if (Object.keys(errSi).length > 0) erroresSubitems[si.id] = errSi
      })
    }

    return { errores, erroresTramos, erroresSubitems }
  }

  const handleGuardarTodos = async () => {
    setLoadingGuardar(true)
    setResumenGuardado(null)
    let guardados = 0
    let errores = 0

    for (const item of items) {
      if (item.guardado) continue

      const { errores: erroresCampo, erroresTramos, erroresSubitems } = validarItem(item)
      if (Object.keys(erroresCampo).length > 0 || Object.keys(erroresTramos).length > 0 || Object.keys(erroresSubitems).length > 0) {
        setItems((prev) => prev.map((it) => it.id === item.id ? { ...it, erroresCampo, erroresTramos, erroresSubitems, errorGuardado: 'Completa los campos requeridos' } : it))
        errores++
        continue
      }

      const montoFinal = montoFinalDe(item)
      const tramosValidos = tramosValidosDe(item)
      const subitemsValidos = subitemsValidosDe(item)

      const datos = {
        id_viaje,
        tipo: item.tipo,
        fecha_gasto: item.fecha,
        proveedor: item.proveedor.trim() || null,
        monto_total: montoFinal,
        descripcion: item.descripcion.trim(),
        id_categoria_gasto: item.idCategoria,
        es_gasto_internacional: esGastoInternacional,
      }

      if (item.usaOtraMoneda && tramosValidos.length > 0) {
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
        datos.monto_moneda_origen = montoFinal
      }

      if (item.usaSubitems && subitemsValidos.length > 0) {
        datos.subitems = subitemsValidos.map(si => ({
          descripcion: si.descripcion.trim(),
          monto: parseFloat(si.monto),
        }))
      }

      const data = await registrarGasto(datos, item.imagen)

      if (data.error) {
        errores++
        setItems((prev) => prev.map((it) => it.id === item.id
          ? { ...it, errorGuardado: data.error, requiereAutorizacion: !!data.requiereAutorizacion }
          : it))
      } else {
        guardados++
        setItems((prev) => prev.map((it) => it.id === item.id
          ? { ...it, guardado: true, errorGuardado: null, requiereAutorizacion: false, erroresCampo: {}, erroresTramos: {}, erroresSubitems: {} }
          : it))
      }
    }

    setLoadingGuardar(false)
    setResumenGuardado({ guardados, errores })
  }

  const hayRequiereAutorizacion = items.some((it) => it.requiereAutorizacion)
  const todosGuardados = items.length > 0 && items.every((it) => it.guardado)
  const pendientesDeGuardar = items.filter((it) => !it.guardado).length

  return {
    items,
    expandidoId,
    categorias,
    esInternacional,
    esGastoInternacional,
    loadingGuardar,
    error,
    resumenGuardado,
    hayRequiereAutorizacion,
    todosGuardados,
    pendientesDeGuardar,
    MONEDAS,
    CATEGORIAS_SUBITEM,
    tramosValidosDe, subitemsValidosDe, montoFinalDe, retencionesDe, tieneRetencionesDe,
    handleAgregarItem, handleDuplicarItem, handleEliminarItem, handleSeleccionarItem,
    handleTipoChange, handleFechaChange, handleProveedorChange, handleMontoChange,
    handleDescripcionChange, handleCategoriaChange,
    handleImagenChange, handleEliminarImagen,
    handleToggleOtraMoneda,
    handleAgregarTramo, handleEliminarTramo, handleTramoMonedaChange, handleTramoMontoChange, handleTramoTipoCambioChange,
    handleToggleSubitems, handleAgregarSubitem, handleEliminarSubitem, handleSubitemDescripcionChange, handleSubitemMontoChange,
    handleGuardarTodos,
  }
}

export default useRegistrarGasto;