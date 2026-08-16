import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, PlusCircle, Upload, Globe, Navigation, MapPin, AlertTriangle, Pencil, Send, Download, Eye, MessageSquare, Receipt } from 'lucide-react'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import GastoItem from '../features/Detalle_Viaje/GastoItem'
import PresupuestoBar from '../features/Detalle_Viaje/PresupuestoBar'
import ObservacionesViaje from '../features/Detalle_Viaje/ObservacionesViaje'
import ObservacionesGastoModal from '../features/Revisiones/ObservacionesGastoModal'
import EliminarGastoModal from '../features/Detalle_Viaje/EliminarGastoModal'
import ConfirmarRevisionModal from '../features/Detalle_Viaje/ConfirmarRevisionModal'
import ConfirmarEnvioModal from '../features/Form_Crear_Viaje/ConfirmarEnvioModal'
import SolicitarAutorizacionModal from '../features/Detalle_Viaje/SolicitarAutorizacionModal'
import ReciboEnviadoModal from '../features/Detalle_Viaje/ReciboEnviadoModal'
import PlazoVencidoModal from '../features/Detalle_Viaje/PlazoVencidoModal'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import useDetalleViaje from '../hooks/useDetalleViaje'
import useMenu from '../hooks/useMenu'
import useSolicitudPlazo from '../hooks/useSolicitudPlazo'
import { enviarReciboIndividual, enviarViajeARevision } from '../services/dashboardService'
import { COLORS } from '../constants'

const DIAS_TOLERANCIA_FRONTEND = 4
const CATEGORIAS_ORACLE = ['Alimentación', 'Alojamiento', 'Transporte', 'Combustible', 'Peajes', 'Estacionamiento', 'Materiales de Oficina', 'Otros', 'Movilidad']

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  backBtn: "flex items-center gap-1 cursor-pointer mb-4 w-fit",
  badges: "flex gap-2 mb-4 flex-wrap",
  badge: "text-xs font-semibold font-inter px-3 py-1 rounded-full uppercase",
  title: "text-2xl font-bold font-inter mb-1 leading-tight",
  fecha: "text-xs font-nunito font-bold mb-1",
  ruta: "text-xs font-nunito font-bold mb-1 flex items-center gap-1",
  destino: "text-xs font-nunito font-bold mb-4",
  card: "rounded-2xl p-5 shadow-md mb-4",
  sectionTitle: "text-xs font-bold font-inter uppercase mb-3",
  sectionTitleInter: "text-xs font-bold font-inter uppercase mb-3 flex items-center gap-2",
  actionRow: "flex gap-3 mb-2",
  actionBtn: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors",
  internacionalLabel: "text-xs font-bold font-inter uppercase mb-2 mt-3",
  gastosHeader: "flex items-center justify-between mb-3",
  verTodo: "text-xs font-bold font-inter cursor-pointer",
  justificacionLabel: "text-xs font-bold font-inter uppercase mb-2",
  montoExceso: "text-sm font-semibold font-inter mb-2",
  textarea: "w-full rounded-xl p-3 text-sm font-inter outline-none border resize-none",
  enviarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer mt-3",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  estadoBadge: "text-xs font-semibold font-inter px-3 py-2 rounded-xl text-center mb-4",
  divider: "border-t mb-4",
  balanceRow: "flex justify-between items-center py-2",
  balanceLabel: "text-sm font-inter",
  balanceValor: "text-sm font-bold font-inter",
  alertaEstadoPrevia: "rounded-xl px-4 py-3 mb-4 text-center",
  infoGrid: "grid grid-cols-2 gap-4",
  infoLabel: "text-xs font-bold font-inter uppercase mb-0.5",
  infoValor: "text-sm font-inter break-words",
  infoRuta: "text-sm font-inter flex items-center gap-1 flex-wrap",
  motivoLabel: "text-xs font-bold font-inter uppercase mb-1",
  motivoTexto: "text-sm font-inter mb-3 font-semibold",
  cardHeaderRow: "flex items-start justify-between mb-4",
  headerTopRow: "flex items-start justify-between gap-3 mb-1",
  reciboRow: "flex gap-3 mb-2",
  reciboBtn: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer border transition-colors",
  solicitudBtn: "w-full py-2.5 rounded-xl font-bold font-nunito text-sm cursor-pointer mt-3 flex items-center justify-center gap-2",
  planillaSection: "mb-6",
  planillaTitulo: "text-sm font-bold font-inter uppercase mb-2 flex items-center gap-2",
  planillaSubtitulo: "text-xs font-inter mb-3",
  tableWrapper: "overflow-x-auto rounded-xl border",
  table: "w-full text-xs font-inter border-collapse",
  th: "px-3 py-2.5 text-center font-bold uppercase text-xs border-b border-r last:border-r-0 whitespace-nowrap",
  td: "px-3 py-2.5 border-b border-r last:border-r-0 text-center whitespace-nowrap",
  eyeBtn: "w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0",
  obsBtnTabla: "w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0 relative",
  obsBadge: "absolute -top-1 -right-1 rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center",
  exportBtn: "w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer flex items-center justify-center gap-2 mb-4",
}

const tipoLabels = { F: 'Factura', R: 'Recibo', C: 'Compra', S: 'Servicio' }

const estadoColors = {
  BORRADOR: { backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types },
  EN_REVISION_VIAJE: { backgroundColor: '#e8d5ff', color: '#5b00a0' },
  APROBADO_VIAJE: { backgroundColor: '#ffd700aa', color: '#7a5900' },
  EN_REVISION_TESORERO: { backgroundColor: '#ffd8a8aa', color: '#8a4b00' },
  EN_CURSO: { backgroundColor: COLORS.primary, color: COLORS.background },
  EN_REVISION: { backgroundColor: '#85aff3ab', color: '#000a65' },
  APROBADO_SUPERVISOR: { backgroundColor: '#ffd700aa', color: '#7a5900' },
  APROBADO_FINAL: { backgroundColor: '#aafac9a2', color: '#008330' },
  RECHAZADO: { backgroundColor: '#ffa7a8aa', color: '#500203' },
}

const estadoLabels = {
  EN_REVISION_VIAJE: 'Tu viaje está siendo revisado por el supervisor',
  APROBADO_VIAJE: 'Viaje aprobado por supervisor, esperando aprobador',
  EN_REVISION_TESORERO: 'Tu viaje fue aprobado y está esperando la asignación de fondos por tesorería',
  EN_CURSO: 'Viaje aprobado — registra tus gastos',
  EN_REVISION: 'Gastos enviados a revisión',
  APROBADO_SUPERVISOR: 'Gastos aprobados por supervisor — en espera de revisión final',
  APROBADO_FINAL: 'Este viaje fue aprobado definitivamente',
  RECHAZADO: 'Este viaje fue rechazado',
}

const estadoTexto = {
  BORRADOR: 'Borrador',
  EN_REVISION_VIAJE: 'En Revisión Previa',
  APROBADO_VIAJE: 'Esperando Aprobador',
  EN_REVISION_TESORERO: 'Esperando Fondos',
  EN_CURSO: 'En Curso',
  EN_REVISION: 'En Revisión',
  APROBADO_SUPERVISOR: 'Apr. Supervisor',
  APROBADO_FINAL: 'Aprobado',
  RECHAZADO: 'Rechazado',
}

const formatFecha = (f1, f2) => {
  const [y1, m1, d1] = f1.split('-')
  const [y2, m2, d2] = f2.split('-')
  const opts = { day: 'numeric', month: 'long', year: 'numeric' }
  return `${new Date(y1, m1 - 1, d1).toLocaleDateString('es-ES', opts)} — ${new Date(y2, m2 - 1, d2).toLocaleDateString('es-ES', opts)}`
}

const formatFechaCorta = (f) => {
  const [y, m, d] = f.split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const calcularFechaLimitePlazo = (fechaFin) => {
  const [y, m, d] = fechaFin.split('-')
  const f = new Date(y, m - 1, d)
  f.setDate(f.getDate() + DIAS_TOLERANCIA_FRONTEND)
  return f
}

const formatFechaLimite = (fechaFin) => {
  return calcularFechaLimitePlazo(fechaFin).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

const calcularPlazoVencido = (fechaFin) => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const limite = calcularFechaLimitePlazo(fechaFin)
  limite.setHours(0, 0, 0, 0)
  return hoy > limite
}

function DetalleViajePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const origenNav = location.state?.from || '/dashboard/empleado'
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()

  const [modalRecibo, setModalRecibo] = useState({ show: false, exito: false, mensaje: '' })
  const [enviandoReciboGastoId, setEnviandoReciboGastoId] = useState(null)
  const [showConfirmarEnvioBorrador, setShowConfirmarEnvioBorrador] = useState(false)
  const [enviandoBorrador, setEnviandoBorrador] = useState(false)
  const [errorEnvioBorrador, setErrorEnvioBorrador] = useState('')
  const [showPlazoVencidoModal, setShowPlazoVencidoModal] = useState(false)
  const [yaMostroPlazoModal, setYaMostroPlazoModal] = useState(false)
  const [gastoActivo, setGastoActivo] = useState(null)
  const [showObsGasto, setShowObsGasto] = useState(false)

  const {
    viaje, gastos,
    gastosNacionales, gastosInternacionales,
    gastosMostradosNacional, gastosMostradosInternacional,
    gastoAcumulado, gastoAcumuladoUsd,
    excedePresupuesto, excedePresupuestoUsd,
    viajeEnCurso, loading, loadingEnvio, loadingEliminar, error,
    justificacion, setJustificacion,
    observaciones,
    showTodosNacional, setShowTodosNacional,
    showTodosInternacional, setShowTodosInternacional,
    showEliminarModal, showConfirmarRevisionModal,
    handlePedirEnviarRevision, handleConfirmarEnviarRevision, handleCancelarEnviarRevision,
    handlePedirEliminar, handleConfirmarEliminar, handleCancelarEliminar,
  } = useDetalleViaje(id)

  const {
    solicitud, tienePendiente, fueAprobada, fueRechazada, puedeSolicitar,
    showModal: showModalPlazo, setShowModal: setShowModalPlazo,
    enviando: enviandoPlazo, error: errorPlazo, loading: loadingPlazo,
    handleSolicitar,
  } = useSolicitudPlazo(id)

  const plazoVencido = viaje ? calcularPlazoVencido(viaje.fecha_fin) : false
  const bloqueadoPorPlazo = viajeEnCurso && plazoVencido && !fueAprobada

  useEffect(() => {
    if (!loadingPlazo && bloqueadoPorPlazo && !yaMostroPlazoModal) {
      setShowPlazoVencidoModal(true)
      setYaMostroPlazoModal(true)
    }
  }, [loadingPlazo, bloqueadoPorPlazo, yaMostroPlazoModal])

  const mensajePlazoVencido = (() => {
    if (!viaje) return ''
    if (tienePendiente) {
      return 'El plazo de este viaje venció. Tienes una solicitud de autorización pendiente de revisión por parte del revisor. No podrás registrar nuevos gastos ni subir facturas hasta que sea aprobada.'
    }
    if (fueRechazada) {
      return 'El plazo de este viaje venció y tu solicitud de autorización fue rechazada. No puedes registrar nuevos gastos ni subir facturas. Puedes enviar una nueva solicitud de autorización desde el botón al final de la página.'
    }
    return `El plazo de este viaje venció el ${formatFechaLimite(viaje.fecha_fin)}. No puedes registrar nuevos gastos ni subir facturas hasta que un revisor apruebe tu solicitud de autorización.`
  })()

  const handleEnviarReciboIndividual = async (id_gasto) => {
    setEnviandoReciboGastoId(id_gasto)
    const data = await enviarReciboIndividual(id_gasto)
    setEnviandoReciboGastoId(null)
    if (data.error) {
      setModalRecibo({ show: true, exito: false, mensaje: data.error })
      return
    }
    setModalRecibo({ show: true, exito: true, mensaje: 'El recibo fue enviado correctamente a tu correo.' })
  }

  const handleConfirmarEnvioBorrador = async () => {
    setEnviandoBorrador(true)
    const data = await enviarViajeARevision(id)
    setEnviandoBorrador(false)
    setShowConfirmarEnvioBorrador(false)
    if (data.error) {
      setErrorEnvioBorrador(data.error)
      setTimeout(() => setErrorEnvioBorrador(''), 4000)
      return
    }
    navigate(origenNav)
  }

  const abrirObservacionesGasto = (id_gasto) => {
    setGastoActivo(id_gasto)
    setShowObsGasto(true)
  }

  const cerrarObservacionesGasto = () => {
    setShowObsGasto(false)
    setGastoActivo(null)
  }

  const observacionesDelGastoActivo = () => {
    if (!gastoActivo) return []
    return observaciones.filter((o) => o.id_gasto === gastoActivo)
  }

  const contarObservacionesGasto = (id_gasto) => {
    return observaciones.filter((o) => o.id_gasto === id_gasto).length
  }

  const exportarExcel = async () => {
    if (!viaje) return
    const wb = new ExcelJS.Workbook()
    wb.creator = 'SCV'
    wb.created = new Date()
    const anio = new Date().getFullYear()
    const codigoViaje = `VIA-${id}/${anio}`
    const gastosNacionalesXlsx = gastos.filter(g => !g.es_gasto_internacional)
    const gastosInternacionalesXlsx = gastos.filter(g => !!g.es_gasto_internacional)
    const todosGastos = [...gastosNacionalesXlsx, ...gastosInternacionalesXlsx]
    const fondoRecibido = parseFloat(viaje.monto_asignado)
    const fondoRecibidoUsd = parseFloat(viaje.monto_asignado_usd || 0)
    const esInternacionalXlsx = viaje.tipo === 'Internacional'
    const totalNacional = gastosNacionalesXlsx.reduce((s, g) => s + parseFloat(g.monto_total || 0), 0)
    const totalUsd = gastosInternacionalesXlsx.reduce((s, g) => s + parseFloat(g.monto_total || 0), 0)
    const saldo = fondoRecibido - totalNacional
    const saldoUsd = fondoRecibidoUsd - totalUsd
    const totalIVAxlsx = gastosNacionalesXlsx.reduce((sum, g) => {
      if (!g.Factura) return sum
      return sum + Math.max(0, parseFloat(g.monto_total || 0) - parseFloat(g.Factura?.monto_parcial || 0))
    }, 0)
    const totalRcIva = gastosNacionalesXlsx.filter(g => g.tipo === 'S').reduce((s, g) => s + parseFloat(g.retencion_rc_iva || 0), 0)
    const totalIue = gastosNacionalesXlsx.filter(g => g.tipo === 'C').reduce((s, g) => s + parseFloat(g.retencion_iue || 0), 0)
    const totalIt = gastosNacionalesXlsx.reduce((s, g) => s + parseFloat(g.retencion_it || 0), 0)
    const totalCostoNacional = gastosNacionalesXlsx.reduce((s, g) => s + parseFloat(g.importe_costo || g.monto_total || 0), 0)

    const colorHeader = '1a3a5c'
    const colorInter = '870002'
    const colorBorde = '999999'
    const colorFila = 'EEF3FA'
    const colorFilaInter = 'FDE9E9'

    const borde = {
      top: { style: 'thin', color: { argb: 'FF' + colorBorde } },
      left: { style: 'thin', color: { argb: 'FF' + colorBorde } },
      bottom: { style: 'thin', color: { argb: 'FF' + colorBorde } },
      right: { style: 'thin', color: { argb: 'FF' + colorBorde } },
    }
    const bordeMedium = {
      top: { style: 'medium', color: { argb: 'FF' + colorHeader } },
      left: { style: 'medium', color: { argb: 'FF' + colorHeader } },
      bottom: { style: 'medium', color: { argb: 'FF' + colorHeader } },
      right: { style: 'medium', color: { argb: 'FF' + colorHeader } },
    }

    const ws = wb.addWorksheet('Planilla Rendición')
    const NC = 16
    ws.columns = [
      { width: 4 }, { width: 12 }, { width: 8 }, { width: 18 }, { width: 11 },
      { width: 18 }, { width: 30 }, { width: 6 }, { width: 12 },
      { width: 13 }, { width: 13 }, { width: 11 }, { width: 10 }, { width: 10 }, { width: 8 },
      { width: 13 },
    ]

    const setCelda = (row, col, value, opts = {}) => {
      const cell = ws.getRow(row).getCell(col)
      cell.value = value
      cell.font = { bold: !!opts.bold, size: opts.size || 9, color: opts.color ? { argb: 'FF' + opts.color } : undefined }
      if (opts.fill) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + opts.fill } }
      if (opts.border) cell.border = opts.border
      cell.alignment = { horizontal: opts.align || 'left', vertical: 'middle', wrapText: true }
      if (opts.numFmt) cell.numFmt = opts.numFmt
      if (opts.dropdown) {
        cell.dataValidation = { type: 'list', allowBlank: true, formulae: [`"${CATEGORIAS_ORACLE.join(',')}"`] }
      }
      return cell
    }
    const merge = (r1, c1, r2, c2) => { try { ws.mergeCells(r1, c1, r2, c2) } catch {} }

    ws.getRow(1).height = 28
    merge(1, 1, 1, 4); setCelda(1, 1, 'SIMBOLOGÍA', { bold: true, size: 9, fill: colorHeader, color: 'FFFFFF', align: 'center', border: borde })
    merge(1, 5, 1, 12); setCelda(1, 5, 'PLANILLA DE RENDICIÓN DE CUENTAS', { bold: true, size: 12, fill: colorHeader, color: 'FFFFFF', align: 'center', border: borde })
    merge(1, 13, 1, NC); setCelda(1, 13, codigoViaje, { bold: true, size: 10, fill: colorHeader, color: 'FFFFFF', align: 'center', border: borde })

    const simbolos = [['F', 'Compra Bien/Servicio c/factura'], ['C', 'Compra de Bien sin factura'], ['S', 'Servicio sin factura'], ['R', 'Docto. sin IVA, sin Retención']]
    simbolos.forEach(([codigo, desc], i) => {
      const r = 2 + i; ws.getRow(r).height = 16
      setCelda(r, 1, codigo, { bold: true, size: 9, align: 'center', border: borde })
      merge(r, 2, r, 4); setCelda(r, 2, desc, { size: 9, border: borde })
    })

    ws.getRow(2).height = 16
    merge(2, 5, 2, 7); setCelda(2, 5, 'RESPONSABLE:', { bold: true, size: 9, border: borde })
    merge(2, 8, 2, 12); setCelda(2, 8, `${viaje.Usuario?.nombre} ${viaje.Usuario?.apellido_paterno}`.toUpperCase(), { bold: true, size: 9, border: borde })
    setCelda(2, 13, 'MEMORANDUM:', { bold: true, size: 9, border: borde })
    merge(2, 13, 2, NC); setCelda(2, 13, codigoViaje, { bold: true, size: 9, border: borde })

    ws.getRow(3).height = 16
    merge(3, 5, 3, 7); setCelda(3, 5, 'CARGO:', { bold: true, size: 9, border: borde })
    merge(3, 8, 3, NC); setCelda(3, 8, (viaje.Usuario?.Cargo?.nombre || '').toUpperCase(), { bold: true, size: 9, border: borde })

    ws.getRow(4).height = 16
    merge(4, 5, 4, 7); setCelda(4, 5, 'DEPENDENCIA / SECCIÓN:', { bold: true, size: 9, border: borde })
    merge(4, 8, 4, NC); setCelda(4, 8, `${viaje.Usuario?.numero_dependencia || ''} / ${viaje.Usuario?.numero_seccion || ''}`, { size: 9, border: borde })

    ws.getRow(5).height = 32
    merge(5, 5, 5, 7); setCelda(5, 5, 'MOTIVO:', { bold: true, size: 9, border: borde })
    merge(5, 8, 5, 11); setCelda(5, 8, (viaje.motivo || '').toUpperCase(), { bold: true, size: 9, border: borde })
    setCelda(5, 12, 'FECHA:', { bold: true, size: 9, border: borde })
    merge(5, 13, 5, NC); setCelda(5, 13, `${formatFechaCorta(viaje.fecha_inicio)} al ${formatFechaCorta(viaje.fecha_fin)}`, { size: 9, border: borde })

    ws.getRow(6).height = 14
    merge(6, 1, 6, NC)
    setCelda(6, 1, '■ Fondo rojo = Gasto Internacional (USD)    ■ Fondo azul claro = Gasto Nacional (Bs)    T/C = Tipo de Cambio usado al registrar    Cuenta/Oracle editable con lista desplegable', { size: 8, fill: 'F3F6FF', color: colorHeader, border: borde })

    ws.getRow(7).height = 36
    const headers = ['N°', 'TIPO VIAJE', 'MONEDA', 'TIPO DE CAMBIO', 'FECHA', 'CUENTA/ORACLE', 'D E T A L L E', 'TIPO GASTO', 'N° DOCUMENTO', 'NIT', 'IMPORTE FACT./REC.', 'IMPORTE', 'I.V.A. / RC-IVA', 'IUE 5%', 'IT 3%', 'COSTO/GASTO']
    headers.forEach((h, i) => setCelda(7, i + 1, h, { bold: true, size: 8, fill: colorHeader, color: 'FFFFFF', align: 'center', border: borde }))

    ws.getRow(8).height = 16
    merge(8, 1, 8, 10)
    setCelda(8, 1, `FONDO RECIBIDO: Bs. ${fondoRecibido.toFixed(2)}${esInternacionalXlsx ? `   |   USD ${fondoRecibidoUsd.toFixed(2)}` : ''}`, { bold: true, size: 9, fill: 'D9E1F2', align: 'center', border: borde })
    for (let c = 11; c <= NC; c++) setCelda(8, c, '', { border: borde, fill: 'D9E1F2' })

    const FILAS_MIN = 10
    const filasGasto = Math.max(todosGastos.length, FILAS_MIN)
    const filaActual = 9

    for (let i = 0; i < filasGasto; i++) {
      const g = todosGastos[i] || null
      const r = filaActual + i
      ws.getRow(r).height = 16
      const esInter = g ? !!g.es_gasto_internacional : false
      const bgFill = esInter ? colorFilaInter : (i % 2 === 0 ? 'FFFFFF' : colorFila)

      if (g) {
        const tieneFactura = !!g.Factura
        const importe = parseFloat(g.monto_total || 0)
        const iva = tieneFactura && !esInter ? Math.max(0, importe - parseFloat(g.Factura?.monto_parcial || 0)) : 0
        const rc_iva = parseFloat(g.retencion_rc_iva || 0)
        const iue = parseFloat(g.retencion_iue || 0)
        const it = parseFloat(g.retencion_it || 0)
        const costo = parseFloat(g.importe_costo || importe)
        const usaOtraMoneda = esInter && g.moneda && g.moneda !== 'USD' && parseFloat(g.tipo_cambio || 1) !== 1

        const tramos = g.Gasto_Tramo_Moneda || []
        const tieneTramos = esInter && tramos.length > 0
        const subitems = g.Gasto_Subitem || []
        const tieneSubitems = subitems.length > 0

        const tipoCambioLabel = esInter
          ? (tieneTramos
              ? tramos.map(t => `${parseFloat(t.monto_origen).toFixed(2)} ${t.moneda} → ${parseFloat(t.monto_usd).toFixed(2)} USD`).join(' | ')
              : 'USD directo')
          : '—'

        let detalleCompleto
        if (tieneFactura) {
          const productos = (g.Factura?.Detalle_Factura || [])
            .map(d => `${d.nombre_producto}${d.cantidad ? ` x${d.cantidad}` : ''}`)
            .join('\n')
          detalleCompleto = productos || g.descripcion || `Factura N° ${g.Factura?.numero_factura}`
        } else if (tieneSubitems) {
          detalleCompleto = subitems.map(si => `${si.descripcion}: ${parseFloat(si.monto).toFixed(2)}`).join('\n')
        } else {
          detalleCompleto = g.descripcion || g.Categoria_Gasto?.nombre || ''
        }

        const nroDoc = tieneFactura ? (g.Factura?.numero_factura || '') : ''
        const nit = g.Proveedor?.numero_doc_fiscal || ''
        const fechaGasto = (() => {
          try { const [y, m, d] = (g.Factura?.fecha_emision || g.fecha_gasto).split('-'); return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
          catch { return '' }
        })()
        const colorTexto = esInter ? colorInter : colorHeader
        const colIvaRcIva = iva > 0 ? iva : rc_iva > 0 ? rc_iva : 0
        const categoriaOracle = !tieneFactura ? (g.Categoria_Gasto?.nombre || '') : ''

        setCelda(r, 1, i + 1, { size: 9, align: 'center', border: borde, fill: bgFill })
        setCelda(r, 2, esInter ? 'Internacional' : 'Nacional', { size: 9, bold: true, align: 'center', border: borde, fill: bgFill, color: colorTexto })
        setCelda(r, 3, esInter ? (usaOtraMoneda ? g.moneda : 'USD') : 'Bs.', { size: 9, align: 'center', border: borde, fill: bgFill, color: colorTexto })
        setCelda(r, 4, tipoCambioLabel, { size: 9, align: 'center', border: borde, fill: bgFill, color: esInter && tieneTramos ? colorInter : colorBorde, bold: esInter && tieneTramos })
        setCelda(r, 5, fechaGasto, { size: 9, align: 'center', border: borde, fill: bgFill })
        setCelda(r, 6, categoriaOracle, { size: 9, align: 'center', border: borde, fill: bgFill, dropdown: true })
        setCelda(r, 7, detalleCompleto, { size: 9, border: borde, fill: bgFill })
        setCelda(r, 8, g.tipo || '', { size: 9, align: 'center', border: borde, fill: bgFill })
        setCelda(r, 9, nroDoc, { size: 9, align: 'center', border: borde, fill: bgFill })
        setCelda(r, 10, nit, { size: 9, align: 'center', border: borde, fill: bgFill })
        setCelda(r, 11, tieneFactura && !esInter ? importe : '', { size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: bgFill })
        setCelda(r, 12, (!tieneFactura || esInter) ? importe : '', { size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: bgFill })
        setCelda(r, 13, colIvaRcIva, { size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: bgFill })
        setCelda(r, 14, iue, { size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: bgFill })
        setCelda(r, 15, it, { size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: bgFill })
        setCelda(r, 16, esInter ? importe : costo, { size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: bgFill, bold: true })
      } else {
        for (let c = 1; c <= 16; c++) setCelda(r, c, '', { size: 9, border: borde, fill: bgFill })
        setCelda(r, 1, i + 1, { size: 9, align: 'center', border: borde, fill: bgFill })
        setCelda(r, 6, '', { size: 9, align: 'center', border: borde, fill: bgFill, dropdown: true })
        for (let c = 13; c <= 16; c++) setCelda(r, c, 0, { size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: bgFill })
      }
    }

    const rTotales = filaActual + filasGasto
    ws.getRow(rTotales).height = 18
    merge(rTotales, 1, rTotales, 10); setCelda(rTotales, 1, 'Sumas Totales (Bs)', { bold: true, size: 9, fill: 'D9E1F2', align: 'center', border: borde })
    const totalCF = gastosNacionalesXlsx.filter(g => !!g.Factura).reduce((s, g) => s + parseFloat(g.monto_total || 0), 0)
    const totalSF = gastosNacionalesXlsx.filter(g => !g.Factura).reduce((s, g) => s + parseFloat(g.monto_total || 0), 0)
    const totalIvaRcIva = totalIVAxlsx > 0 ? totalIVAxlsx : totalRcIva
    setCelda(rTotales, 11, totalCF, { bold: true, size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: 'D9E1F2' })
    setCelda(rTotales, 12, totalSF, { bold: true, size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: 'D9E1F2' })
    setCelda(rTotales, 13, totalIvaRcIva, { bold: true, size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: 'D9E1F2' })
    setCelda(rTotales, 14, totalIue, { bold: true, size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: 'D9E1F2' })
    setCelda(rTotales, 15, totalIt, { bold: true, size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: 'D9E1F2' })
    setCelda(rTotales, 16, totalCostoNacional, { bold: true, size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: 'D9E1F2' })

    let rSiguiente = rTotales + 1

    if (esInternacionalXlsx && gastosInternacionalesXlsx.length > 0) {
      ws.getRow(rSiguiente).height = 18
      merge(rSiguiente, 1, rSiguiente, 10)
      setCelda(rSiguiente, 1, 'Sumas Totales Internacional (USD)', { bold: true, size: 9, fill: colorFilaInter, align: 'center', border: borde, color: colorInter })
      setCelda(rSiguiente, 11, '—', { size: 9, align: 'center', border: borde, fill: colorFilaInter, color: colorInter })
      setCelda(rSiguiente, 12, totalUsd, { bold: true, size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: colorFilaInter, color: colorInter })
      setCelda(rSiguiente, 13, '—', { size: 9, align: 'center', border: borde, fill: colorFilaInter, color: colorInter })
      setCelda(rSiguiente, 14, '—', { size: 9, align: 'center', border: borde, fill: colorFilaInter, color: colorInter })
      setCelda(rSiguiente, 15, '—', { size: 9, align: 'center', border: borde, fill: colorFilaInter, color: colorInter })
      setCelda(rSiguiente, 16, totalUsd, { bold: true, size: 9, numFmt: '#,##0.00', align: 'center', border: borde, fill: colorFilaInter, color: colorInter })
      rSiguiente++
    }

    const resumen = [
      { label: `Saldo a Devolver (Bs): ${Math.max(0, saldo).toFixed(2)}${esInternacionalXlsx ? `   |   Saldo a Devolver (USD): ${Math.max(0, saldoUsd).toFixed(2)}` : ''}`, color: colorHeader },
      { label: `Importe a Reembolsar (Bs): ${saldo < 0 ? Math.abs(saldo).toFixed(2) : '0.00'}${esInternacionalXlsx ? `   |   Importe a Reembolsar (USD): ${saldoUsd < 0 ? Math.abs(saldoUsd).toFixed(2) : '0.00'}` : ''}`, color: (saldo < 0 || saldoUsd < 0) ? colorInter : colorHeader },
    ]
    resumen.forEach(({ label, color }, i) => {
      const r = rSiguiente + i
      ws.getRow(r).height = 16
      merge(r, 1, r, NC); setCelda(r, 1, label, { bold: true, size: 9, fill: 'EEF3FA', align: 'center', border: borde, color })
    })

    const rObs = rSiguiente + 2
    ws.getRow(rObs).height = 50
    merge(rObs, 1, rObs, NC); setCelda(rObs, 1, 'OBSERVACIONES:', { bold: true, size: 9, border: bordeMedium })

    const buf = await wb.xlsx.writeBuffer()
    saveAs(new Blob([buf]), `Planilla_Rendicion_${viaje.Usuario?.apellido_paterno || ''}_${id}.xlsx`)
  }

  if (loading) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalles de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: COLORS.labels }}>Cargando...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!viaje) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalles de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: COLORS.secondary }}>No se encontró el viaje</p>
        </div>
        <Footer />
      </div>
    )
  }

  const esInternacional = viaje.tipo === 'Internacional'
  const saldoNacional = parseFloat(viaje.monto_asignado) - gastoAcumulado
  const saldoUsd = parseFloat(viaje.monto_asignado_usd || 0) - gastoAcumuladoUsd
  const estaBorrador = viaje.estado === 'BORRADOR'
  const estaEnRevisionPrevia = ['EN_REVISION_VIAJE', 'APROBADO_VIAJE', 'EN_REVISION_TESORERO'].includes(viaje.estado)
  const estaRechazadoPrevia = viaje.estado === 'RECHAZADO' && !viaje.fue_iniciado
  const estaRechazadoGastos = viaje.estado === 'RECHAZADO' && !!viaje.fue_iniciado
  const estaAprobadoFinal = viaje.estado === 'APROBADO_FINAL'
  const mostrarDetalleGastos = !estaBorrador && !estaEnRevisionPrevia && !estaRechazadoPrevia && !estaAprobadoFinal

  const gastosCF = gastosNacionales.filter(g => !!g.Factura)
  const gastosSF = gastosNacionales.filter(g => !g.Factura)

  const totalIVA = gastosCF.reduce((sum, g) => {
    return sum + Math.max(0, parseFloat(g.monto_total || 0) - parseFloat(g.Factura?.monto_parcial || 0))
  }, 0)

  const C = (extra = {}) => ({ ...extra, borderColor: COLORS.dataFields })
  const rutaDetalleGasto = (id_gasto) => `/dashboard/empleado/gasto/${id_gasto}`

  const gastoActivoData = gastoActivo ? gastos.find(g => g.id_gasto === gastoActivo) : null
  const nombreGastoActivo = gastoActivoData
    ? (gastoActivoData.Factura ? (gastoActivoData.Proveedor?.nombre || 'Sin proveedor') : (gastoActivoData.Categoria_Gasto?.nombre || gastoActivoData.Proveedor?.nombre || 'Sin categoría'))
    : ''

  const renderBotonObs = (id_gasto, colorAcento) => {
    const cantidad = contarObservacionesGasto(id_gasto)
    return (
      <button
        className={styles.obsBtnTabla}
        style={{ backgroundColor: cantidad > 0 ? COLORS.error : COLORS.backgroundHeader, margin: '0 auto' }}
        onClick={() => abrirObservacionesGasto(id_gasto)}
      >
        <MessageSquare size={13} style={{ color: cantidad > 0 ? COLORS.secondary : colorAcento }} />
        {cantidad > 0 && (
          <span className={styles.obsBadge} style={{ backgroundColor: COLORS.secondary, color: '#fff' }}>{cantidad}</span>
        )}
      </button>
    )
  }

  const renderBotonReciboIndividual = (gasto, colorAcento) => {
    const puedeGenerarRecibo = gasto.tipo === 'C' || gasto.tipo === 'S'
    if (!puedeGenerarRecibo) return null
    const enviando = enviandoReciboGastoId === gasto.id_gasto
    return (
      <button
        className={styles.eyeBtn}
        style={{ backgroundColor: COLORS.backgroundHeader, margin: '0 auto', opacity: enviando ? 0.6 : 1 }}
        onClick={() => handleEnviarReciboIndividual(gasto.id_gasto)}
        disabled={enviando}
      >
        <Receipt size={13} style={{ color: colorAcento }} />
      </button>
    )
  }

  const textoExceso = [
    excedePresupuesto ? `${Math.abs(saldoNacional).toFixed(2)} Bs excedidos` : null,
    esInternacional && excedePresupuestoUsd ? `${Math.abs(saldoUsd).toFixed(2)} USD excedidos` : null,
  ].filter(Boolean).join(' · ')

  const observacionesGenerales = observaciones.filter((o) => !o.id_gasto)
  const mostrarObservaciones = viaje.estado === 'RECHAZADO' && observacionesGenerales.length > 0

  if (estaBorrador) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalles de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

        <div className={styles.content}>
          <button className={styles.backBtn} onClick={() => navigate(origenNav)}>
            <ArrowLeft size={25} style={{ color: COLORS.title }} />
          </button>

          <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
            <div className={styles.cardHeaderRow}>
              <h1 className={styles.title} style={{ color: COLORS.text, marginBottom: 0 }}>{viaje.motivo || 'Sin motivo'}</h1>
              <span className={styles.badge} style={estadoColors[viaje.estado]}>
                {estadoTexto[viaje.estado]}
              </span>
            </div>

            <div className={styles.badges}>
              <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
                {viaje.tipo?.toUpperCase()}
              </span>
              {viaje.transporte && (
                <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
                  {viaje.transporte.toUpperCase()}
                </span>
              )}
            </div>

            <div className={styles.divider} style={{ borderColor: COLORS.dataFields }} />

            <div className={styles.infoGrid}>
              <div>
                <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Período</p>
                <p className={styles.infoValor} style={{ color: COLORS.text }}>{formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}</p>
              </div>
              <div>
                <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Presupuesto</p>
                <p className={styles.infoValor} style={{ color: COLORS.text }}>
                  Bs {parseFloat(viaje.monto_asignado || 0).toFixed(2)}
                  {esInternacional && viaje.monto_asignado_usd > 0 && ` / USD ${parseFloat(viaje.monto_asignado_usd).toFixed(2)}`}
                </p>
              </div>
              {viaje.origen && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Ruta</p>
                  <p className={styles.infoRuta} style={{ color: COLORS.text }}>
                    <Navigation size={12} style={{ color: COLORS.labels }} />
                    {viaje.origen}
                    <span style={{ color: COLORS.dataFields, margin: '0 4px' }}>→</span>
                    <MapPin size={12} style={{ color: COLORS.secondary }} />
                    {viaje.destino}
                  </p>
                </div>
              )}
              {!viaje.origen && (
                <div>
                  <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Destino</p>
                  <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.destino}</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.alertaEstadoPrevia} style={{ backgroundColor: COLORS.backgroundHeader, border: `1px solid ${COLORS.dataFields}` }}>
            <p style={{ color: COLORS.text_enviroment_types, fontFamily: 'Inter', fontSize: 13, fontWeight: 600 }}>
              Este viaje aún no ha sido enviado a revisión. Complétalo y envíalo cuando esté listo.
            </p>
          </div>

          {errorEnvioBorrador && (
            <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
              {errorEnvioBorrador}
            </p>
          )}

          <div className={styles.actionRow}>
            <button
              className={styles.actionBtn}
              style={{ borderColor: COLORS.primary, color: COLORS.primary }}
              onClick={() => navigate(`/dashboard/empleado/viaje/${id}/editar`, { state: { from: origenNav } })}
            >
              <Pencil size={16} />
              Editar
            </button>
            <button
              className={styles.actionBtn}
              style={{ backgroundColor: COLORS.secondary, borderColor: COLORS.secondary, color: COLORS.background }}
              onClick={() => setShowConfirmarEnvioBorrador(true)}
            >
              <Send size={16} />
              Enviar a Revisión
            </button>
          </div>
        </div>

        <ConfirmarEnvioModal
          isOpen={showConfirmarEnvioBorrador}
          onClose={() => setShowConfirmarEnvioBorrador(false)}
          onConfirm={handleConfirmarEnvioBorrador}
          loading={enviandoBorrador}
        />

        <Footer />
      </div>
    )
  }

  if (estaRechazadoPrevia) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalles de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

        <div className={styles.content}>
          <button className={styles.backBtn} onClick={() => navigate(origenNav)}>
            <ArrowLeft size={25} style={{ color: COLORS.title }} />
          </button>

          <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
            <div className={styles.cardHeaderRow}>
              <h1 className={styles.title} style={{ color: COLORS.text, marginBottom: 0 }}>{viaje.motivo}</h1>
              <span className={styles.badge} style={estadoColors[viaje.estado]}>
                {estadoTexto[viaje.estado]}
              </span>
            </div>

            <div className={styles.badges}>
              <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
                {viaje.tipo?.toUpperCase()}
              </span>
              {viaje.transporte && (
                <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
                  {viaje.transporte.toUpperCase()}
                </span>
              )}
            </div>

            <div className={styles.divider} style={{ borderColor: COLORS.dataFields }} />

            <div className={styles.infoGrid}>
              <div>
                <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Período</p>
                <p className={styles.infoValor} style={{ color: COLORS.text }}>{formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}</p>
              </div>
              <div>
                <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Presupuesto</p>
                <p className={styles.infoValor} style={{ color: COLORS.text }}>
                  Bs {parseFloat(viaje.monto_asignado).toFixed(2)}
                  {esInternacional && viaje.monto_asignado_usd > 0 && ` / USD ${parseFloat(viaje.monto_asignado_usd).toFixed(2)}`}
                </p>
              </div>
              {viaje.origen && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Ruta</p>
                  <p className={styles.infoRuta} style={{ color: COLORS.text }}>
                    <Navigation size={12} style={{ color: COLORS.labels }} />
                    {viaje.origen}
                    <span style={{ color: COLORS.dataFields, margin: '0 4px' }}>→</span>
                    <MapPin size={12} style={{ color: COLORS.secondary }} />
                    {viaje.destino}
                  </p>
                </div>
              )}
              {!viaje.origen && (
                <div>
                  <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Destino</p>
                  <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.destino}</p>
                </div>
              )}
            </div>
          </div>

          {mostrarObservaciones && (
            <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
              <ObservacionesViaje observaciones={observacionesGenerales} />
            </div>
          )}

          <div className={styles.alertaEstadoPrevia} style={{ backgroundColor: '#ffa7a8aa' }}>
            <p style={{ color: '#500203', fontFamily: 'Inter', fontSize: 13, fontWeight: 600 }}>
              Tu viaje fue rechazado en la fase de aprobación previa. Revisa las observaciones y corrige los datos.
            </p>
          </div>

          {error && (
            <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
              {error}
            </p>
          )}

          <button
            className={styles.enviarBtn}
            style={{ backgroundColor: COLORS.primary }}
            onClick={() => navigate(`/dashboard/empleado/viaje/${id}/editar`, { state: { from: origenNav } })}
          >
            Editar y Reenviar Viaje
          </button>
        </div>

        <Footer />
      </div>
    )
  }

  if (estaEnRevisionPrevia) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalles de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

        <div className={styles.content}>
          <button className={styles.backBtn} onClick={() => navigate(origenNav)}>
            <ArrowLeft size={25} style={{ color: COLORS.title }} />
          </button>

          <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
            <div className={styles.cardHeaderRow}>
              <h1 className={styles.title} style={{ color: COLORS.text, marginBottom: 0 }}>{viaje.motivo}</h1>
              <span className={styles.badge} style={estadoColors[viaje.estado]}>
                {estadoTexto[viaje.estado]}
              </span>
            </div>

            <div className={styles.badges}>
              <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
                {viaje.tipo?.toUpperCase()}
              </span>
              {viaje.transporte && (
                <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
                  {viaje.transporte.toUpperCase()}
                </span>
              )}
            </div>

            <div className={styles.divider} style={{ borderColor: COLORS.dataFields }} />

            <div className={styles.infoGrid}>
              <div>
                <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Período</p>
                <p className={styles.infoValor} style={{ color: COLORS.text }}>{formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}</p>
              </div>
              <div>
                <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Presupuesto</p>
                <p className={styles.infoValor} style={{ color: COLORS.text }}>
                  Bs {parseFloat(viaje.monto_asignado).toFixed(2)}
                  {esInternacional && viaje.monto_asignado_usd > 0 && ` / USD ${parseFloat(viaje.monto_asignado_usd).toFixed(2)}`}
                </p>
              </div>
              {viaje.origen && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Ruta</p>
                  <p className={styles.infoRuta} style={{ color: COLORS.text }}>
                    <Navigation size={12} style={{ color: COLORS.labels }} />
                    {viaje.origen}
                    <span style={{ color: COLORS.dataFields, margin: '0 4px' }}>→</span>
                    <MapPin size={12} style={{ color: COLORS.secondary }} />
                    {viaje.destino}
                  </p>
                </div>
              )}
              {!viaje.origen && (
                <div>
                  <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Destino</p>
                  <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.destino}</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.alertaEstadoPrevia} style={{ backgroundColor: estadoColors[viaje.estado]?.backgroundColor }}>
            <p style={{ color: estadoColors[viaje.estado]?.color, fontFamily: 'Inter', fontSize: 13, fontWeight: 600 }}>
              {estadoLabels[viaje.estado]}
            </p>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  if (estaAprobadoFinal) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalles de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

        <div className={styles.content}>
          <button className={styles.backBtn} onClick={() => navigate(origenNav)}>
            <ArrowLeft size={25} style={{ color: COLORS.title }} />
          </button>

          <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
            <div className={styles.cardHeaderRow}>
              <h1 className={styles.title} style={{ color: COLORS.text, marginBottom: 0 }}>{viaje.motivo}</h1>
              <span className={styles.badge} style={estadoColors[viaje.estado]}>
                {estadoTexto[viaje.estado]}
              </span>
            </div>

            <div className={styles.badges}>
              <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
                {viaje.tipo?.toUpperCase()}
              </span>
              {viaje.transporte && (
                <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
                  {viaje.transporte.toUpperCase()}
                </span>
              )}
            </div>

            <div className={styles.divider} style={{ borderColor: COLORS.dataFields }} />

            <div className={styles.infoGrid}>
              <div>
                <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Período</p>
                <p className={styles.infoValor} style={{ color: COLORS.text }}>{formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}</p>
              </div>
              <div>
                <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Presupuesto</p>
                <p className={styles.infoValor} style={{ color: COLORS.text }}>
                  Bs {parseFloat(viaje.monto_asignado).toFixed(2)}
                  {esInternacional && viaje.monto_asignado_usd > 0 && ` / USD ${parseFloat(viaje.monto_asignado_usd).toFixed(2)}`}
                </p>
              </div>
              {viaje.origen && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Ruta</p>
                  <p className={styles.infoRuta} style={{ color: COLORS.text }}>
                    <Navigation size={12} style={{ color: COLORS.labels }} />
                    {viaje.origen}
                    <span style={{ color: COLORS.dataFields, margin: '0 4px' }}>→</span>
                    <MapPin size={12} style={{ color: COLORS.secondary }} />
                    {viaje.destino}
                  </p>
                </div>
              )}
              {!viaje.origen && (
                <div>
                  <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Destino</p>
                  <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.destino}</p>
                </div>
              )}
            </div>
          </div>

          {gastosCF.length > 0 && (
            <div className={styles.planillaSection}>
              <p className={styles.planillaTitulo} style={{ color: COLORS.title }}>
                <MapPin size={14} style={{ color: COLORS.title }} />
                Gastos con Factura (Bs)
              </p>
              <p className={styles.planillaSubtitulo} style={{ color: COLORS.labels }}>Gastos respaldados con factura o recibo oficial</p>
              <div className={styles.tableWrapper} style={{ borderColor: COLORS.dataFields }}>
                <table className={styles.table}>
                  <thead>
                    <tr style={{ backgroundColor: COLORS.secondary }}>
                      {['#', 'Fecha', 'Proveedor', 'Descripción', 'Tipo', 'N° Doc.', 'NIT/CI', 'Importe (Bs)', 'IVA (Bs)', 'Obs.', ''].map((h) => (
                        <th key={h} className={styles.th} style={{ color: COLORS.background, borderColor: 'rgba(255,255,255,0.2)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gastosCF.map((g, i) => {
                      const importe = parseFloat(g.monto_total || 0)
                      const iva = Math.max(0, importe - parseFloat(g.Factura?.monto_parcial || 0))
                      const bg = COLORS.background
                      return (
                        <tr key={g.id_gasto} style={{ backgroundColor: bg }}>
                          <td className={styles.td} style={C({ color: COLORS.labels })}>{i + 1}</td>
                          <td className={styles.td} style={C({ color: COLORS.text })}>{formatFechaCorta(g.Factura?.fecha_emision || g.fecha_gasto)}</td>
                          <td className={styles.td} style={C({ color: COLORS.text })}>{g.Proveedor?.nombre || '—'}</td>
                          <td className={styles.td} style={C({ color: COLORS.labels })}>{g.descripcion || `N° ${g.Factura.numero_factura}`}</td>
                          <td className={styles.td} style={C({ color: COLORS.text })}>{tipoLabels[g.tipo] || g.tipo}</td>
                          <td className={styles.td} style={C({ color: COLORS.text })}>{g.Factura?.numero_factura || '—'}</td>
                          <td className={styles.td} style={C({ color: COLORS.text })}>{g.Proveedor?.numero_doc_fiscal || '—'}</td>
                          <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>{importe.toFixed(2)}</td>
                          <td className={styles.td} style={C({ color: COLORS.labels })}>{iva > 0 ? iva.toFixed(2) : '—'}</td>
                          <td className={styles.td} style={C({ width: 36 })}>{renderBotonObs(g.id_gasto, COLORS.primary)}</td>
                          <td className={styles.td} style={C({ width: 36 })}>
                            <button className={styles.eyeBtn} style={{ backgroundColor: COLORS.backgroundHeader, margin: '0 auto' }} onClick={() => navigate(rutaDetalleGasto(g.id_gasto), { state: { from: `/dashboard/empleado/viaje/${id}`, origenViaje: origenNav } })}>
                              <Eye size={13} style={{ color: COLORS.primary }} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    <tr style={{ backgroundColor: COLORS.backgroundHeader }}>
                      <td colSpan={7} className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>TOTAL</td>
                      <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>{gastosCF.reduce((s, g) => s + parseFloat(g.monto_total || 0), 0).toFixed(2)}</td>
                      <td colSpan={3} className={styles.td} style={C()} />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {gastosSF.length > 0 && (
            <div className={styles.planillaSection}>
              <p className={styles.planillaTitulo} style={{ color: COLORS.title }}>
                <MapPin size={14} style={{ color: COLORS.title }} />
                Gastos sin Factura (Bs)
              </p>
              <p className={styles.planillaSubtitulo} style={{ color: COLORS.labels }}>Gastos varios sin respaldo de factura oficial</p>
              <div className={styles.tableWrapper} style={{ borderColor: COLORS.dataFields }}>
                <table className={styles.table}>
                  <thead>
                    <tr style={{ backgroundColor: COLORS.secondary }}>
                      {['#', 'Fecha', 'Categoría / Concepto', 'Descripción', 'Tipo', 'Importe (Bs)', 'RC-IVA/IUE', 'IT 3%', 'Costo', 'Obs.', 'Recibo', ''].map((h) => (
                        <th key={h} className={styles.th} style={{ color: COLORS.background, borderColor: 'rgba(255,255,255,0.2)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gastosSF.map((g, i) => {
                      const importe = parseFloat(g.monto_total || 0)
                      const rcIvaIue = parseFloat(g.retencion_rc_iva || 0) > 0
                        ? parseFloat(g.retencion_rc_iva)
                        : parseFloat(g.retencion_iue || 0)
                      const it = parseFloat(g.retencion_it || 0)
                      const costo = parseFloat(g.importe_costo || importe)
                      const bg = COLORS.background
                      const subitems = g.Gasto_Subitem || []
                      return (
                        <tr key={g.id_gasto} style={{ backgroundColor: bg }}>
                          <td className={styles.td} style={C({ color: COLORS.labels })}>{i + 1}</td>
                          <td className={styles.td} style={C({ color: COLORS.text })}>{formatFechaCorta(g.fecha_gasto)}</td>
                          <td className={styles.td} style={C({ color: COLORS.text })}>{g.Categoria_Gasto?.nombre || g.Proveedor?.nombre || '—'}</td>
                          <td className={styles.td} style={C({ color: subitems.length > 0 ? COLORS.secondary : COLORS.labels, fontWeight: subitems.length > 0 ? 'bold' : 'normal' })}>
                            {subitems.length > 0 ? `${subitems.length} subgasto${subitems.length !== 1 ? 's' : ''}` : (g.descripcion || '—')}
                          </td>
                          <td className={styles.td} style={C({ color: COLORS.text })}>{tipoLabels[g.tipo] || g.tipo}</td>
                          <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>{importe.toFixed(2)}</td>
                          <td className={styles.td} style={C({ color: rcIvaIue > 0 ? COLORS.secondary : COLORS.labels })}>{rcIvaIue > 0 ? rcIvaIue.toFixed(2) : '—'}</td>
                          <td className={styles.td} style={C({ color: it > 0 ? COLORS.secondary : COLORS.labels })}>{it > 0 ? it.toFixed(2) : '—'}</td>
                          <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>{costo.toFixed(2)}</td>
                          <td className={styles.td} style={C({ width: 36 })}>{renderBotonObs(g.id_gasto, COLORS.title)}</td>
                          <td className={styles.td} style={C({ width: 36 })}>{renderBotonReciboIndividual(g, COLORS.primary)}</td>
                          <td className={styles.td} style={C({ width: 36 })}>
                            <button className={styles.eyeBtn} style={{ backgroundColor: COLORS.backgroundHeader, margin: '0 auto' }} onClick={() => navigate(rutaDetalleGasto(g.id_gasto), { state: { from: `/dashboard/empleado/viaje/${id}`, origenViaje: origenNav } })}>
                              <Eye size={13} style={{ color: COLORS.title }} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    <tr style={{ backgroundColor: COLORS.backgroundHeader }}>
                      <td colSpan={5} className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>TOTAL</td>
                      <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>{gastosSF.reduce((s, g) => s + parseFloat(g.monto_total || 0), 0).toFixed(2)}</td>
                      <td className={styles.td} style={C()} />
                      <td className={styles.td} style={C()} />
                      <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>{gastosSF.reduce((s, g) => s + parseFloat(g.importe_costo || g.monto_total || 0), 0).toFixed(2)}</td>
                      <td colSpan={3} className={styles.td} style={C()} />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {esInternacional && gastosInternacionales.length > 0 && (
            <div className={styles.planillaSection}>
              <p className={styles.planillaTitulo} style={{ color: COLORS.primary }}>
                <Globe size={14} style={{ color: COLORS.primary }} />
                Gastos Internacionales (USD)
              </p>
              <p className={styles.planillaSubtitulo} style={{ color: COLORS.labels }}>Gastos realizados en el extranjero</p>
              <div className={styles.tableWrapper} style={{ borderColor: COLORS.dataFields }}>
                <table className={styles.table}>
                  <thead>
                    <tr style={{ backgroundColor: COLORS.secondary }}>
                      {['#', 'Fecha', 'Concepto', 'Descripción', 'Conversión', 'Importe (USD)', 'Obs.', 'Recibo', ''].map((h) => (
                        <th key={h} className={styles.th} style={{ color: COLORS.background, borderColor: 'rgba(255,255,255,0.2)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gastosInternacionales.map((g, i) => {
                      const importe = parseFloat(g.monto_total || 0)
                      const tramos = g.Gasto_Tramo_Moneda || []
                      const subitems = g.Gasto_Subitem || []
                      const tieneTramos = tramos.length > 0
                      const tieneSubitems = subitems.length > 0
                      const bg = COLORS.background
                      return (
                        <tr key={g.id_gasto} style={{ backgroundColor: bg }}>
                          <td className={styles.td} style={C({ color: COLORS.labels })}>{i + 1}</td>
                          <td className={styles.td} style={C({ color: COLORS.text })}>{formatFechaCorta(g.fecha_gasto)}</td>
                          <td className={styles.td} style={C({ color: COLORS.text })}>{g.Categoria_Gasto?.nombre || g.Proveedor?.nombre || '—'}</td>
                          <td className={styles.td} style={C({ color: tieneSubitems ? COLORS.secondary : COLORS.labels, fontWeight: tieneSubitems ? 'bold' : 'normal' })}>
                            {tieneSubitems ? `${subitems.length} subgasto${subitems.length !== 1 ? 's' : ''}` : (g.descripcion || '—')}
                          </td>
                          <td className={styles.td} style={C({ color: tieneTramos ? COLORS.secondary : COLORS.labels, fontWeight: tieneTramos ? 'bold' : 'normal' })}>
                            {tieneTramos ? `${tramos.length} tramo${tramos.length !== 1 ? 's' : ''}` : 'USD directo'}
                          </td>
                          <td className={styles.td} style={C({ color: COLORS.primary, fontWeight: 'bold' })}>{importe.toFixed(2)}</td>
                          <td className={styles.td} style={C({ width: 36 })}>{renderBotonObs(g.id_gasto, COLORS.primary)}</td>
                          <td className={styles.td} style={C({ width: 36 })}>{renderBotonReciboIndividual(g, COLORS.primary)}</td>
                          <td className={styles.td} style={C({ width: 36 })}>
                            <button className={styles.eyeBtn} style={{ backgroundColor: COLORS.backgroundHeader, margin: '0 auto' }} onClick={() => navigate(rutaDetalleGasto(g.id_gasto), { state: { from: `/dashboard/empleado/viaje/${id}`, origenViaje: origenNav } })}>
                              <Eye size={13} style={{ color: COLORS.primary }} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    <tr style={{ backgroundColor: COLORS.backgroundHeader }}>
                      <td colSpan={5} className={styles.td} style={C({ color: COLORS.primary, fontWeight: 'bold' })}>TOTAL</td>
                      <td className={styles.td} style={C({ color: COLORS.primary, fontWeight: 'bold' })}>{gastosInternacionales.reduce((s, g) => s + parseFloat(g.monto_total || 0), 0).toFixed(2)}</td>
                      <td colSpan={3} className={styles.td} style={C()} />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
            <p className={styles.sectionTitle} style={{ color: COLORS.text_enviroment_types }}>Balance</p>
            <div className={styles.balanceRow}>
              <p className={styles.balanceLabel} style={{ color: COLORS.labels }}>Fondo recibido (Bs)</p>
              <p className={styles.balanceValor} style={{ color: COLORS.text }}>{parseFloat(viaje.monto_asignado).toFixed(2)} Bs</p>
            </div>
            <div className={styles.balanceRow}>
              <p className={styles.balanceLabel} style={{ color: COLORS.labels }}>Gasto nacional</p>
              <p className={styles.balanceValor} style={{ color: COLORS.text }}>{gastoAcumulado.toFixed(2)} Bs</p>
            </div>
            {totalIVA > 0 && (
              <div className={styles.balanceRow}>
                <p className={styles.balanceLabel} style={{ color: COLORS.labels }}>Total IVA Crédito</p>
                <p className={styles.balanceValor} style={{ color: COLORS.text }}>{totalIVA.toFixed(2)} Bs</p>
              </div>
            )}
            <div className={styles.balanceRow}>
              <p className={styles.balanceLabel} style={{ color: excedePresupuesto ? COLORS.secondary : COLORS.title }}>
                {excedePresupuesto ? 'Exceso a reembolsar' : 'Saldo a devolver'}
              </p>
              <p className={styles.balanceValor} style={{ color: excedePresupuesto ? COLORS.secondary : COLORS.title }}>
                {Math.abs(saldoNacional).toFixed(2)} Bs
              </p>
            </div>
            {esInternacional && (
              <>
                <div className={styles.divider} style={{ borderColor: COLORS.dataFields }} />
                <div className={styles.balanceRow}>
                  <p className={styles.balanceLabel} style={{ color: COLORS.labels }}>Fondo recibido (USD)</p>
                  <p className={styles.balanceValor} style={{ color: COLORS.text }}>{parseFloat(viaje.monto_asignado_usd || 0).toFixed(2)} USD</p>
                </div>
                <div className={styles.balanceRow}>
                  <p className={styles.balanceLabel} style={{ color: COLORS.labels }}>Gasto internacional</p>
                  <p className={styles.balanceValor} style={{ color: COLORS.text }}>{gastoAcumuladoUsd.toFixed(2)} USD</p>
                </div>
                <div className={styles.balanceRow}>
                  <p className={styles.balanceLabel} style={{ color: excedePresupuestoUsd ? COLORS.secondary : COLORS.primary }}>
                    {excedePresupuestoUsd ? 'Exceso a reembolsar' : 'Saldo a devolver'}
                  </p>
                  <p className={styles.balanceValor} style={{ color: excedePresupuestoUsd ? COLORS.secondary : COLORS.primary }}>
                    {Math.abs(saldoUsd).toFixed(2)} USD
                  </p>
                </div>
              </>
            )}
          </div>

          {(excedePresupuesto || excedePresupuestoUsd) && justificacion && (
            <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
              <p className={styles.justificacionLabel} style={{ color: COLORS.text_enviroment_types }}>Justificación de Reembolso</p>
              <textarea className={styles.textarea} rows={4} value={justificacion} readOnly style={{ backgroundColor: 'rgba(243,243,243,0.13)', borderColor: COLORS.dataFields, color: COLORS.text, cursor: 'default' }} />
            </div>
          )}

          <button className={styles.exportBtn} style={{ backgroundColor: COLORS.primary, color: COLORS.background }} onClick={exportarExcel}>
            <Download size={16} />
            Exportar Planilla Excel
          </button>

          <p className={styles.estadoBadge} style={estadoColors[viaje.estado]}>
            {estadoLabels[viaje.estado]}
          </p>
        </div>

        <ObservacionesGastoModal
          isOpen={showObsGasto}
          onClose={cerrarObservacionesGasto}
          nombreGasto={nombreGastoActivo}
          observaciones={observacionesDelGastoActivo()}
          puedeEditar={false}
          nuevoTexto=""
          setNuevoTexto={() => {}}
          onAgregar={() => {}}
          onEditar={() => {}}
          onEliminar={() => {}}
          loading={false}
          error={null}
        />

        <ReciboEnviadoModal
          isOpen={modalRecibo.show}
          onClose={() => setModalRecibo({ show: false, exito: false, mensaje: '' })}
          exito={modalRecibo.exito}
          mensaje={modalRecibo.mensaje}
        />

        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Detalles de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(origenNav)}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <div className={styles.headerTopRow}>
          <h1 className={styles.title} style={{ color: COLORS.text, marginBottom: 0 }}>{viaje.motivo}</h1>
          <span className={styles.badge} style={estadoColors[viaje.estado] || { backgroundColor: COLORS.primary, color: COLORS.background }}>
            {estadoTexto[viaje.estado] || viaje.estado.replace(/_/g, ' ')}
          </span>
        </div>

        <div className={styles.badges}>
          <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
            {viaje.tipo?.toUpperCase()}
          </span>
          {viaje.transporte && (
            <span className={styles.badge} style={{ backgroundColor: COLORS.dataFields, color: COLORS.text_enviroment_types }}>
              {viaje.transporte.toUpperCase()}
            </span>
          )}
        </div>

        <p className={styles.fecha} style={{ color: COLORS.text_enviroment_types }}>
          {formatFecha(viaje.fecha_inicio, viaje.fecha_fin)}
        </p>
        {viaje.origen && (
          <p className={styles.ruta} style={{ color: COLORS.labels }}>
            <Navigation size={11} style={{ color: COLORS.labels }} />
            {viaje.origen}
            <span style={{ color: COLORS.dataFields, margin: '0 4px' }}>→</span>
            <MapPin size={11} style={{ color: COLORS.secondary }} />
            {viaje.destino}
          </p>
        )}
        {!viaje.origen && (
          <p className={styles.destino} style={{ color: COLORS.text_enviroment_types }}>{viaje.destino}</p>
        )}

        {mostrarDetalleGastos && (
          <>
            <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
              <PresupuestoBar gastoAcumulado={gastoAcumulado} montoAsignado={viaje.monto_asignado} />
            </div>
            {esInternacional && (
              <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
                <PresupuestoBar gastoAcumulado={gastoAcumuladoUsd} montoAsignado={parseFloat(viaje.monto_asignado_usd || 0)} esUsd={true} />
              </div>
            )}

            {viajeEnCurso && !bloqueadoPorPlazo && !esInternacional && (
              <div className={styles.actionRow}>
                <button className={styles.actionBtn} style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary, color: COLORS.background }} onClick={() => navigate(`/dashboard/empleado/viaje/${id}/registrar-gasto`)}>
                  <PlusCircle size={16} />
                  Registrar Gasto
                </button>
                <button className={styles.actionBtn} style={{ borderColor: COLORS.primary, color: COLORS.primary }} onClick={() => navigate(`/dashboard/empleado/viaje/${id}/subir-factura`)}>
                  <Upload size={16} />
                  Subir Facturas
                </button>
              </div>
            )}

            {viajeEnCurso && !bloqueadoPorPlazo && esInternacional && (
              <>
                <p className={styles.internacionalLabel} style={{ color: COLORS.labels }}>Gastos Nacionales (Bs)</p>
                <div className={styles.actionRow}>
                  <button className={styles.actionBtn} style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary, color: COLORS.background }} onClick={() => navigate(`/dashboard/empleado/viaje/${id}/registrar-gasto`)}>
                    <PlusCircle size={16} />
                    Gasto sin Factura
                  </button>
                  <button className={styles.actionBtn} style={{ borderColor: COLORS.primary, color: COLORS.primary }} onClick={() => navigate(`/dashboard/empleado/viaje/${id}/subir-factura`)}>
                    <Upload size={16} />
                    Subir Facturas
                  </button>
                </div>
                <p className={styles.internacionalLabel} style={{ color: COLORS.labels }}>Gastos Internacionales (USD)</p>
                <div className={styles.actionRow}>
                  <button className={styles.actionBtn} style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary, color: COLORS.background }} onClick={() => navigate(`/dashboard/empleado/viaje/${id}/registrar-gasto?internacional=true`)}>
                    <Globe size={16} />
                    Gasto Internacional
                  </button>
                </div>
              </>
            )}

            {esInternacional ? (
              <>
                <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
                  <div className={styles.gastosHeader}>
                    <p className={styles.sectionTitle} style={{ color: COLORS.text_enviroment_types }}>Gastos Nacionales</p>
                    {gastosNacionales.length > 3 && (
                      <p className={styles.verTodo} style={{ color: COLORS.secondary }} onClick={() => setShowTodosNacional(!showTodosNacional)}>
                        {showTodosNacional ? 'VER MENOS' : 'VER TODO'}
                      </p>
                    )}
                  </div>
                  {gastosMostradosNacional.length === 0 ? (
                    <p style={{ color: COLORS.labels, fontSize: '13px', textAlign: 'center', padding: '1rem 0' }}>No hay gastos nacionales registrados</p>
                  ) : (
                    gastosMostradosNacional.map((gasto) => (
                      <GastoItem key={gasto.id_gasto} gasto={gasto} viajeEnCurso={viajeEnCurso} onEliminar={handlePedirEliminar} idViaje={id} origenViaje={origenNav} observaciones={observaciones} />
                    ))
                  )}
                </div>
                <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
                  <div className={styles.gastosHeader}>
                    <p className={styles.sectionTitleInter} style={{ color: COLORS.primary }}>
                      <Globe size={13} />
                      Gastos Internacionales
                    </p>
                    {gastosInternacionales.length > 3 && (
                      <p className={styles.verTodo} style={{ color: COLORS.secondary }} onClick={() => setShowTodosInternacional(!showTodosInternacional)}>
                        {showTodosInternacional ? 'VER MENOS' : 'VER TODO'}
                      </p>
                    )}
                  </div>
                  {gastosMostradosInternacional.length === 0 ? (
                    <p style={{ color: COLORS.labels, fontSize: '13px', textAlign: 'center', padding: '1rem 0' }}>No hay gastos internacionales registrados</p>
                  ) : (
                    gastosMostradosInternacional.map((gasto) => (
                      <GastoItem key={gasto.id_gasto} gasto={gasto} viajeEnCurso={viajeEnCurso} onEliminar={handlePedirEliminar} idViaje={id} origenViaje={origenNav} observaciones={observaciones} />
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
                <div className={styles.gastosHeader}>
                  <p className={styles.sectionTitle} style={{ color: COLORS.text_enviroment_types }}>Gastos Registrados</p>
                  {gastosNacionales.length > 3 && (
                    <p className={styles.verTodo} style={{ color: COLORS.secondary }} onClick={() => setShowTodosNacional(!showTodosNacional)}>
                      {showTodosNacional ? 'VER MENOS' : 'VER TODO'}
                    </p>
                  )}
                </div>
                {gastosMostradosNacional.length === 0 ? (
                  <p style={{ color: COLORS.labels, fontSize: '13px', textAlign: 'center', padding: '1rem 0' }}>No hay gastos registrados aún</p>
                ) : (
                  gastosMostradosNacional.map((gasto) => (
                    <GastoItem key={gasto.id_gasto} gasto={gasto} viajeEnCurso={viajeEnCurso} onEliminar={handlePedirEliminar} idViaje={id} origenViaje={origenNav} observaciones={observaciones} />
                  ))
                )}
              </div>
            )}

            <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
              <p className={styles.sectionTitle} style={{ color: COLORS.text_enviroment_types }}>Balance</p>
              <div className={styles.balanceRow}>
                <p className={styles.balanceLabel} style={{ color: COLORS.labels }}>Fondo recibido (Bs)</p>
                <p className={styles.balanceValor} style={{ color: COLORS.text }}>{parseFloat(viaje.monto_asignado).toFixed(2)} Bs</p>
              </div>
              <div className={styles.balanceRow}>
                <p className={styles.balanceLabel} style={{ color: COLORS.labels }}>Gasto nacional</p>
                <p className={styles.balanceValor} style={{ color: COLORS.text }}>{gastoAcumulado.toFixed(2)} Bs</p>
              </div>
              <div className={styles.balanceRow}>
                <p className={styles.balanceLabel} style={{ color: excedePresupuesto ? COLORS.secondary : COLORS.title }}>
                  {excedePresupuesto ? 'Exceso a reembolsar' : 'Saldo a devolver'}
                </p>
                <p className={styles.balanceValor} style={{ color: excedePresupuesto ? COLORS.secondary : COLORS.title }}>
                  {Math.abs(saldoNacional).toFixed(2)} Bs
                </p>
              </div>
              {esInternacional && (
                <>
                  <div className={styles.divider} style={{ borderColor: COLORS.dataFields }} />
                  <div className={styles.balanceRow}>
                    <p className={styles.balanceLabel} style={{ color: COLORS.labels }}>Fondo recibido (USD)</p>
                    <p className={styles.balanceValor} style={{ color: COLORS.text }}>{parseFloat(viaje.monto_asignado_usd || 0).toFixed(2)} USD</p>
                  </div>
                  <div className={styles.balanceRow}>
                    <p className={styles.balanceLabel} style={{ color: COLORS.labels }}>Gasto internacional</p>
                    <p className={styles.balanceValor} style={{ color: COLORS.text }}>{gastoAcumuladoUsd.toFixed(2)} USD</p>
                  </div>
                  <div className={styles.balanceRow}>
                    <p className={styles.balanceLabel} style={{ color: excedePresupuestoUsd ? COLORS.secondary : COLORS.primary }}>
                      {excedePresupuestoUsd ? 'Exceso a reembolsar' : 'Saldo a devolver'}
                    </p>
                    <p className={styles.balanceValor} style={{ color: excedePresupuestoUsd ? COLORS.secondary : COLORS.primary }}>
                      {Math.abs(saldoUsd).toFixed(2)} USD
                    </p>
                  </div>
                </>
              )}
            </div>

            {viajeEnCurso && (excedePresupuesto || (esInternacional && excedePresupuestoUsd)) && (
              <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
                <p className={styles.justificacionLabel} style={{ color: COLORS.text_enviroment_types }}>Justificación de Reembolso</p>
                <p className={styles.montoExceso} style={{ color: COLORS.secondary }}>{textoExceso}</p>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Detalle el motivo del exceso de presupuesto..."
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  style={{ backgroundColor: COLORS.background, borderColor: COLORS.dataFields, color: COLORS.text }}
                />
              </div>
            )}

            {!viajeEnCurso && (excedePresupuesto || excedePresupuestoUsd) && justificacion && (
              <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
                <p className={styles.justificacionLabel} style={{ color: COLORS.text_enviroment_types }}>Justificación de Reembolso</p>
                <textarea className={styles.textarea} rows={4} value={justificacion} readOnly style={{ backgroundColor: 'rgba(243,243,243,0.13)', borderColor: COLORS.dataFields, color: COLORS.text, cursor: 'default' }} />
              </div>
            )}

            {mostrarObservaciones && (
              <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
                <ObservacionesViaje observaciones={observacionesGenerales} />
              </div>
            )}

            {estaRechazadoGastos && (
              <div className={styles.alertaEstadoPrevia} style={{ backgroundColor: '#ffa7a8aa' }}>
                <p style={{ color: '#500203', fontFamily: 'Inter', fontSize: 13, fontWeight: 600 }}>
                  Tu rendición de gastos fue rechazada. Revisa las observaciones, corrige los gastos y vuelve a enviar.
                </p>
              </div>
            )}

            {tienePendiente && (
              <div className={styles.alertaEstadoPrevia} style={{ backgroundColor: '#ffd700aa' }}>
                <p style={{ color: '#7a5900', fontFamily: 'Inter', fontSize: 13, fontWeight: 600 }}>
                  Tienes una solicitud de autorización de plazo pendiente de revisión.
                </p>
              </div>
            )}

            {bloqueadoPorPlazo && !tienePendiente && !fueRechazada && (
              <div className={styles.alertaEstadoPrevia} style={{ backgroundColor: COLORS.error }}>
                <p style={{ color: COLORS.secondary, fontFamily: 'Inter', fontSize: 13, fontWeight: 600 }}>
                  El plazo del viaje venció. No puedes registrar nuevos gastos ni subir facturas.
                </p>
              </div>
            )}

            {error && <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>{error}</p>}

            {viajeEnCurso && (
              <button
                className={styles.enviarBtn}
                style={{ backgroundColor: loadingEnvio ? COLORS.fields : COLORS.secondary }}
                onClick={handlePedirEnviarRevision}
                disabled={loadingEnvio}
              >
                {loadingEnvio ? 'Enviando...' : (estaRechazadoGastos ? 'Reenviar a Revisión' : 'Confirmar Finalización')}
              </button>
            )}

            {bloqueadoPorPlazo && puedeSolicitar && (
              <button
                className={styles.solicitudBtn}
                style={{ backgroundColor: COLORS.secondary, color: COLORS.background }}
                onClick={() => setShowModalPlazo(true)}
              >
                <AlertTriangle size={15} />
                Solicitar Autorización al Revisor
              </button>
            )}

            {!viajeEnCurso && (
              <p className={styles.estadoBadge} style={estadoColors[viaje.estado]}>
                {estadoLabels[viaje.estado]}
              </p>
            )}
          </>
        )}
      </div>

      <EliminarGastoModal isOpen={showEliminarModal} onClose={handleCancelarEliminar} onConfirm={handleConfirmarEliminar} loading={loadingEliminar} />
      <ConfirmarRevisionModal isOpen={showConfirmarRevisionModal} onClose={handleCancelarEnviarRevision} onConfirm={handleConfirmarEnviarRevision} />
      <SolicitarAutorizacionModal isOpen={showModalPlazo} onClose={() => setShowModalPlazo(false)} onConfirm={handleSolicitar} loading={enviandoPlazo} error={errorPlazo} />
      <PlazoVencidoModal
        isOpen={showPlazoVencidoModal}
        onClose={() => setShowPlazoVencidoModal(false)}
        mensaje={mensajePlazoVencido}
        motivoRechazo={fueRechazada ? solicitud?.observacion_revisor : null}
      />
      <ReciboEnviadoModal
        isOpen={modalRecibo.show}
        onClose={() => setModalRecibo({ show: false, exito: false, mensaje: '' })}
        exito={modalRecibo.exito}
        mensaje={modalRecibo.mensaje}
      />
      <Footer />
    </div>
  )
}

export default DetalleViajePage;