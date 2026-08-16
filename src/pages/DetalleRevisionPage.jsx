import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Globe, Eye, MapPin, Navigation, MessageSquare, Download } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import ConfirmarAprobarModal from '../features/Revisiones/ConfirmarAprobarModal'
import ConfirmarRechazarModal from '../features/Revisiones/ConfirmarRechazarModal'
import SinObservacionesModal from '../features/Revisiones/SinObservacionesModal'
import ObservacionesGastoModal from '../features/Revisiones/ObservacionesGastoModal'
import EditarComentarioModal from '../features/Revisiones/EditarComentarioModal'
import ConfirmarEliminarComentarioModal from '../features/Revisiones/ConfirmarEliminarComentarioModal'
import useDetalleRevision from '../hooks/useDetalleRevision'
import useMenu from '../hooks/useMenu'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import { tomarRevision } from '../services/supervisorService'
import { COLORS } from '../constants'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

const CATEGORIAS_ORACLE = ['Alimentación', 'Alojamiento', 'Transporte', 'Combustible', 'Peajes', 'Estacionamiento', 'Materiales de Oficina', 'Otros', 'Movilidad']

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  backBtn: 'flex items-center gap-1 cursor-pointer mb-4 w-fit',
  card: 'rounded-2xl p-5 mb-4 shadow-md',
  empleadoInner: 'flex items-center gap-3 mb-4',
  avatar: 'w-14 h-14 rounded-full object-cover border-2 shrink-0',
  empleadoInfo: 'flex flex-col flex-1 min-w-0',
  empleadoLabel: 'text-xs font-bold font-inter uppercase mb-0.5',
  empleadoNombre: 'text-lg font-bold font-inter leading-tight',
  empleadoCargo: 'text-xs font-inter',
  estadoBadge: 'text-xs font-bold font-inter px-3 py-1.5 rounded-full uppercase shrink-0',
  divider: 'border-t mb-4',
  motivoLabel: 'text-xs font-bold font-inter uppercase mb-1',
  motivoTexto: 'text-sm font-inter mb-4 font-semibold',
  infoGrid: 'grid grid-cols-2 gap-4',
  infoLabel: 'text-xs font-bold font-inter uppercase mb-0.5',
  infoValor: 'text-sm font-inter break-words',
  infoValorIcon: 'text-sm font-inter break-words flex items-center gap-1',
  rutaFull: 'col-span-2 mt-1',
  rutaValorRow: 'flex items-center gap-1.5 flex-wrap',
  presupuestoLabel: 'text-xs font-nunito font-bold uppercase mb-1',
  presupuestoMonto: 'text-2xl font-semibold font-inter',
  presupuestoSub: 'text-sm font-inter ml-2',
  presupuestoBar: 'w-full rounded-full h-2 mt-2',
  presupuestoFill: 'h-2 rounded-full transition-all',
  presupuestoPct: 'text-xs font-inter mt-1',
  liquidacionCard: 'rounded-2xl p-5 mb-4',
  montoLiquidacion: 'text-2xl font-bold font-inter',
  montoLabel: 'text-sm font-inter mt-1',
  justificacionBox: 'mt-3 p-3 rounded-xl text-xs font-inter',
  divisorBlanco: 'border-t my-3',
  alertasSection: 'mb-4',
  alertasTitulo: 'text-xs font-bold font-inter uppercase mb-2',
  alertasRow: 'flex gap-2 flex-wrap',
  alertaBadge: 'text-xs font-bold font-inter px-3 py-1.5 rounded-lg flex items-center gap-1',
  planillaSection: 'mb-6',
  planillaTitulo: 'text-sm font-bold font-inter uppercase mb-2 flex items-center gap-2',
  planillaSubtitulo: 'text-xs font-inter mb-3',
  tableWrapper: 'overflow-x-auto rounded-xl border',
  table: 'w-full text-xs font-inter border-collapse',
  th: 'px-3 py-2.5 text-center font-bold uppercase text-xs border-b border-r last:border-r-0 whitespace-nowrap',
  td: 'px-3 py-2.5 border-b border-r last:border-r-0 text-center whitespace-nowrap',
  eyeBtn: 'w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0',
  obsBtnTabla: 'w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0 relative',
  obsBadge: 'absolute -top-1 -right-1 rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center',
  resumenCard: 'rounded-2xl p-5 mb-4 shadow-md',
  resumenTitulo: 'text-xs font-bold font-inter uppercase mb-3',
  resumenRow: 'flex justify-between items-center py-1.5',
  resumenLabel: 'text-sm font-inter',
  resumenValor: 'text-sm font-bold font-inter',
  resumenDivider: 'border-t my-2',
  accionesRow: 'flex gap-3',
  accionBtn: 'flex-1 py-2 rounded-xl font-bold font-nunito text-base cursor-pointer text-center',
  errorMsg: 'text-xs font-inter italic text-center py-3 px-3 rounded-xl mb-3',
  exitoBadge: 'text-sm font-bold font-inter text-center py-3 px-4 rounded-xl mb-4',
  exportBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer flex items-center justify-center gap-2 mb-4',
}

const alertaConfig = {
  EXCESO_PRESUPUESTO: { label: 'Exceso Detectado', color: '#856404', bg: '#fef3cd' },
  ALCOHOL: { label: 'Alcohol', color: '#721c24', bg: '#f8d7da' },
}

const estadoConfig = {
  EN_REVISION: { label: 'En Revisión', bg: COLORS.error, color: COLORS.secondary },
  APROBADO_SUPERVISOR: { label: 'Apr. Preliminar', bg: '#85aff3ab', color: '#000a65' },
  APROBADO_APROBADOR: { label: 'Apr. Aprobador', bg: '#85aff3ab', color: '#000a65' },
  APROBADO_FINAL: { label: 'Aprobado', bg: '#d4edda', color: '#155724' },
  RECHAZADO: { label: 'Rechazado', bg: '#ffa7a8aa', color: '#500203' },
}

const tipoLabels = { F: 'Factura', R: 'Recibo', C: 'Compra', S: 'Servicio' }

const formatFecha = (f) => {
  const [y, m, d] = f.split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function PresupuestoBar({ gastoAcumulado, montoAsignado, esUsd = false }) {
  const porcentaje = montoAsignado > 0 ? Math.min((gastoAcumulado / montoAsignado) * 100, 100) : 0
  const excede = porcentaje >= 100
  const colorBarra = excede ? COLORS.secondary : COLORS.title
  const moneda = esUsd ? 'USD' : 'Bs'
  return (
    <div>
      <p className={styles.presupuestoLabel} style={{ color: COLORS.text_enviroment_types }}>
        {esUsd ? 'Presupuesto Internacional (USD)' : 'Presupuesto Gastado'}
      </p>
      <p style={{ color: excede ? COLORS.secondary : COLORS.text }}>
        <span className={styles.presupuestoMonto}>{gastoAcumulado.toFixed(2)} {moneda}</span>
        <span className={styles.presupuestoSub} style={{ color: COLORS.title }}>/ {parseFloat(montoAsignado).toFixed(2)} {moneda}</span>
      </p>
      <div className={styles.presupuestoBar} style={{ backgroundColor: COLORS.dataFields }}>
        <div className={styles.presupuestoFill} style={{ width: `${porcentaje}%`, backgroundColor: colorBarra }} />
      </div>
      <p className={styles.presupuestoPct} style={{ color: COLORS.title }}>{porcentaje.toFixed(0)}% del límite alcanzado</p>
    </div>
  )
}

function DetalleRevisionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const origen = location.state?.from || '/dashboard/supervisor'
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const [tomando, setTomando] = useState(false)
  const [errorTomar, setErrorTomar] = useState('')

  const {
    datos, loading, loadingAccion, error, bloqueado,
    showAprobar, setShowAprobar,
    showRechazar, setShowRechazar,
    showSinObservaciones, setShowSinObservaciones,
    accionCompletada,
    comentarioAgregado, resetComentarioAgregado,
    comentarioEditando, setComentarioEditando,
    comentarioEliminando, setComentarioEliminando,
    textoEdicion, setTextoEdicion,
    gastoActivo, showObsGasto, nuevoTexto, setNuevoTexto,
    abrirObservacionesGasto, cerrarObservacionesGasto,
    observacionesDelGastoActivo, contarObservacionesGasto,
    handleAprobar, handlePedirRechazar, handleRechazar,
    handleAgregarComentario,
    handleAbrirEdicion, handleConfirmarEdicion,
    handleAbrirEliminacion, handleConfirmarEliminacion,
  } = useDetalleRevision(id)

  useEffect(() => {
    if (comentarioAgregado) resetComentarioAgregado()
  }, [comentarioAgregado])

  const getMiId = () => {
    try {
      const token = localStorage.getItem('token')
      return jwtDecode(token)?.id_usuario
    } catch { return null }
  }

  const handleAsignarme = async () => {
    setTomando(true)
    setErrorTomar('')
    const data = await tomarRevision(id)
    setTomando(false)
    if (data.error) {
      setErrorTomar(data.error)
      setTimeout(() => setErrorTomar(''), 3000)
      return
    }
    window.location.reload()
  }

  const exportarExcel = async () => {
    if (!datos) return
    const { viaje, gastos } = datos
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
    merge(5, 13, 5, NC); setCelda(5, 13, `${formatFecha(viaje.fecha_inicio)} al ${formatFecha(viaje.fecha_fin)}`, { size: 9, border: borde })

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
        <Navbar text="Detalle de Revisión" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: COLORS.labels }}>Cargando...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (bloqueado) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalle de Revisión" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-12">
          <div className="rounded-full p-5" style={{ backgroundColor: COLORS.error }}>
            <AlertTriangle size={36} style={{ color: COLORS.secondary }} />
          </div>
          <p className="text-base font-bold font-inter text-center mt-2" style={{ color: COLORS.text }}>
            Revisión no disponible
          </p>
          <p className="text-sm font-inter text-center" style={{ color: COLORS.labels }}>
            {error}
          </p>
          <button
            className="mt-4 py-2.5 px-8 rounded-xl font-bold font-nunito text-sm"
            style={{ backgroundColor: COLORS.primary, color: COLORS.background }}
            onClick={() => navigate(origen)}
          >
            Volver
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  if (!datos) return null

  const { viaje, gastos, gastoAcumulado, gastoAcumuladoUsd, excedePresupuesto, excedePresupuestoUsd, alertas } = datos
  const esPendiente = viaje.estado === 'EN_REVISION'
  const estadoActual = estadoConfig[viaje.estado] || estadoConfig['EN_REVISION']
  const miId = getMiId()
  const esMio = viaje.id_supervisor_asignado === miId
  const sinAsignar = !viaje.id_supervisor_asignado
  const puedeAccionar = esPendiente && esMio
  const esInternacional = viaje.tipo === 'Internacional'

  const gastosNacionales = (gastos || []).filter(g => !g.es_gasto_internacional)
  const gastosInternacionales = (gastos || []).filter(g => !!g.es_gasto_internacional)
  const gastosCF = gastosNacionales.filter(g => !!g.Factura)
  const gastosSF = gastosNacionales.filter(g => !g.Factura)

  const totalIVA = gastosCF.reduce((sum, g) => {
    return sum + Math.max(0, parseFloat(g.monto_total || 0) - parseFloat(g.Factura?.monto_parcial || 0))
  }, 0)

  const montoLiquidacion = excedePresupuesto
    ? gastoAcumulado - parseFloat(viaje.monto_asignado)
    : parseFloat(viaje.monto_asignado) - gastoAcumulado

  const montoLiquidacionUsd = excedePresupuestoUsd
    ? gastoAcumuladoUsd - parseFloat(viaje.monto_asignado_usd || 0)
    : parseFloat(viaje.monto_asignado_usd || 0) - gastoAcumuladoUsd

  const justificacion = (datos.comentarios || []).find((c) => c.tipo === 'JUSTIFICACION')
  const gastoActivoData = gastoActivo ? (gastos || []).find(g => g.id_gasto === gastoActivo) : null
  const nombreGastoActivo = gastoActivoData
    ? (gastoActivoData.Factura ? (gastoActivoData.Proveedor?.nombre || 'Sin proveedor') : (gastoActivoData.Categoria_Gasto?.nombre || gastoActivoData.Proveedor?.nombre || 'Sin categoría'))
    : ''

  const C = (extra = {}) => ({ ...extra, borderColor: COLORS.dataFields })
  const rutaDetalle = (id_gasto) => `/dashboard/supervisor/gasto/${id_gasto}`

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

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Detalle de Revisión" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(origen)}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
          <div className={styles.empleadoInner}>
            <img src={viaje.Usuario?.foto_perfil || AVATAR_DEFAULT} alt="empleado" className={styles.avatar} style={{ borderColor: COLORS.primary }} />
            <div className={styles.empleadoInfo}>
              <p className={styles.empleadoLabel} style={{ color: COLORS.secondary }}>Empleado Asignado</p>
              <p className={styles.empleadoNombre} style={{ color: COLORS.text }}>{viaje.Usuario?.nombre} {viaje.Usuario?.apellido_paterno}</p>
              <p className={styles.empleadoCargo} style={{ color: COLORS.labels }}>{viaje.Usuario?.Cargo?.nombre}</p>
            </div>
            <span className={styles.estadoBadge} style={{ backgroundColor: estadoActual.bg, color: estadoActual.color }}>
              {estadoActual.label}
            </span>
          </div>
          <p className={styles.motivoLabel} style={{ color: COLORS.secondary }}>Motivo</p>
          <p className={styles.motivoTexto} style={{ color: COLORS.text }}>{viaje.motivo}</p>
          <div className={styles.divider} style={{ borderColor: COLORS.dataFields }} />
          <div className={styles.infoGrid}>
            <div>
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Período</p>
              <p className={styles.infoValor} style={{ color: COLORS.text }}>{formatFecha(viaje.fecha_inicio)} - {formatFecha(viaje.fecha_fin)}</p>
            </div>
            <div>
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Tipo</p>
              <p className={styles.infoValorIcon} style={{ color: COLORS.text }}>
                <MapPin size={13} style={{ color: esInternacional ? COLORS.primary : COLORS.title }} />
                {esInternacional ? 'Internacional' : 'Nacional'}
              </p>
            </div>
            {viaje.transporte && (
              <div>
                <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Transporte</p>
                <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.transporte}</p>
              </div>
            )}
            <div>
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Presupuesto</p>
              <p className={styles.infoValor} style={{ color: COLORS.text }}>
                Bs {parseFloat(viaje.monto_asignado || 0).toFixed(2)}
                {esInternacional && parseFloat(viaje.monto_asignado_usd || 0) > 0 && ` / USD ${parseFloat(viaje.monto_asignado_usd).toFixed(2)}`}
              </p>
            </div>
            <div className={styles.rutaFull}>
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>{viaje.origen ? 'Ruta' : 'Lugar'}</p>
              {viaje.origen ? (
                <div className={styles.rutaValorRow}>
                  <Navigation size={13} style={{ color: COLORS.labels }} />
                  <span className="text-sm font-inter" style={{ color: COLORS.text }}>{viaje.origen}</span>
                  <span style={{ color: COLORS.labels }}>→</span>
                  <MapPin size={13} style={{ color: COLORS.secondary }} />
                  <span className="text-sm font-inter" style={{ color: COLORS.text }}>{viaje.destino}</span>
                </div>
              ) : (
                <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.destino}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
          <PresupuestoBar gastoAcumulado={gastoAcumulado} montoAsignado={parseFloat(viaje.monto_asignado)} />
        </div>

        {esInternacional && (
          <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
            <PresupuestoBar gastoAcumulado={gastoAcumuladoUsd} montoAsignado={parseFloat(viaje.monto_asignado_usd || 0)} esUsd />
          </div>
        )}

        <div className={styles.liquidacionCard} style={{ backgroundColor: COLORS.primary }}>
          <p className={styles.montoLiquidacion} style={{ color: COLORS.background }}>Bs {montoLiquidacion.toFixed(2)}</p>
          <p className={styles.montoLabel} style={{ color: 'rgba(255,255,255,0.8)' }}>
            {excedePresupuesto ? 'A Reembolsar al Empleado (Bs)' : 'A devolver a la empresa (Bs)'}
          </p>
          {esInternacional && (
            <>
              <div className={styles.divisorBlanco} style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
              <p className={styles.montoLiquidacion} style={{ color: COLORS.background }}>USD {montoLiquidacionUsd.toFixed(2)}</p>
              <p className={styles.montoLabel} style={{ color: 'rgba(255,255,255,0.8)' }}>
                {excedePresupuestoUsd ? 'A Reembolsar al Empleado (USD)' : 'A devolver a la empresa (USD)'}
              </p>
            </>
          )}
          {(excedePresupuesto || excedePresupuestoUsd) && justificacion && (
            <p className={styles.justificacionBox} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>
              Justificación: {justificacion.descripcion}
            </p>
          )}
        </div>

        {alertas?.length > 0 && (
          <div className={styles.alertasSection}>
            <p className={styles.alertasTitulo} style={{ color: COLORS.labels }}>Alertas</p>
            <div className={styles.alertasRow}>
              {alertas.map((a) => {
                const cfg = alertaConfig[a]
                return cfg ? (
                  <span key={a} className={styles.alertaBadge} style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    <AlertTriangle size={12} />{cfg.label}
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}

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
                  <tr style={{ backgroundColor: COLORS.primary }}>
                    {['#', 'Fecha', 'Proveedor', 'Descripción', 'Tipo', 'N° Doc.', 'NIT/CI', 'Importe (Bs)', 'IVA (Bs)', 'Obs.', ''].map((h) => (
                      <th key={h} className={styles.th} style={{ color: COLORS.background, borderColor: 'rgba(255,255,255,0.2)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gastosCF.map((g, i) => {
                    const importe = parseFloat(g.monto_total || 0)
                    const iva = Math.max(0, importe - parseFloat(g.Factura?.monto_parcial || 0))
                    const bg = i % 2 === 0 ? COLORS.background : COLORS.backgroundHeader
                    return (
                      <tr key={g.id_gasto} style={{ backgroundColor: bg }}>
                        <td className={styles.td} style={C({ color: COLORS.labels })}>{i + 1}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{formatFecha(g.Factura?.fecha_emision || g.fecha_gasto)}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{g.Proveedor?.nombre || '—'}</td>
                        <td className={styles.td} style={C({ color: COLORS.labels })}>{g.descripcion || `N° ${g.Factura.numero_factura}`}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{tipoLabels[g.tipo] || g.tipo}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{g.Factura?.numero_factura || '—'}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{g.Proveedor?.numero_doc_fiscal || '—'}</td>
                        <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>{importe.toFixed(2)}</td>
                        <td className={styles.td} style={C({ color: COLORS.labels })}>{iva > 0 ? iva.toFixed(2) : '—'}</td>
                        <td className={styles.td} style={C({ width: 36 })}>{renderBotonObs(g.id_gasto, COLORS.primary)}</td>
                        <td className={styles.td} style={C({ width: 36 })}>
                          <button className={styles.eyeBtn} style={{ backgroundColor: COLORS.backgroundHeader, margin: '0 auto' }} onClick={() => navigate(rutaDetalle(g.id_gasto), { state: { from: `/dashboard/supervisor/revision/${id}`, origenViaje: origen } })}>
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
                  <tr style={{ backgroundColor: COLORS.title }}>
                    {['#', 'Fecha', 'Categoría / Concepto', 'Descripción', 'Tipo', 'Importe (Bs)', 'RC-IVA/IUE', 'IT 3%', 'Costo', 'Obs.', ''].map((h) => (
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
                    const bg = i % 2 === 0 ? COLORS.background : COLORS.backgroundHeader
                    const subitems = g.Gasto_Subitem || []
                    return (
                      <tr key={g.id_gasto} style={{ backgroundColor: bg }}>
                        <td className={styles.td} style={C({ color: COLORS.labels })}>{i + 1}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{formatFecha(g.fecha_gasto)}</td>
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
                        <td className={styles.td} style={C({ width: 36 })}>
                          <button className={styles.eyeBtn} style={{ backgroundColor: COLORS.backgroundHeader, margin: '0 auto' }} onClick={() => navigate(rutaDetalle(g.id_gasto), { state: { from: `/dashboard/supervisor/revision/${id}`, origenViaje: origen } })}>
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
                    <td colSpan={2} className={styles.td} style={C()} />
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
                  <tr style={{ backgroundColor: COLORS.primary }}>
                    {['#', 'Fecha', 'Concepto', 'Descripción', 'Conversión', 'Importe (USD)', 'Obs.', ''].map((h) => (
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
                    const bg = i % 2 === 0 ? COLORS.background : COLORS.backgroundHeader
                    return (
                      <tr key={g.id_gasto} style={{ backgroundColor: bg }}>
                        <td className={styles.td} style={C({ color: COLORS.labels })}>{i + 1}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{formatFecha(g.fecha_gasto)}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{g.Categoria_Gasto?.nombre || g.Proveedor?.nombre || '—'}</td>
                        <td className={styles.td} style={C({ color: tieneSubitems ? COLORS.secondary : COLORS.labels, fontWeight: tieneSubitems ? 'bold' : 'normal' })}>
                          {tieneSubitems ? `${subitems.length} subgasto${subitems.length !== 1 ? 's' : ''}` : (g.descripcion || '—')}
                        </td>
                        <td className={styles.td} style={C({ color: tieneTramos ? COLORS.secondary : COLORS.labels, fontWeight: tieneTramos ? 'bold' : 'normal' })}>
                          {tieneTramos ? `${tramos.length} tramo${tramos.length !== 1 ? 's' : ''}` : 'USD directo'}
                        </td>
                        <td className={styles.td} style={C({ color: COLORS.primary, fontWeight: 'bold' })}>{importe.toFixed(2)}</td>
                        <td className={styles.td} style={C({ width: 36 })}>{renderBotonObs(g.id_gasto, COLORS.primary)}</td>
                        <td className={styles.td} style={C({ width: 36 })}>
                          <button className={styles.eyeBtn} style={{ backgroundColor: COLORS.backgroundHeader, margin: '0 auto' }} onClick={() => navigate(rutaDetalle(g.id_gasto), { state: { from: `/dashboard/supervisor/revision/${id}`, origenViaje: origen } })}>
                            <Eye size={13} style={{ color: COLORS.primary }} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ backgroundColor: COLORS.backgroundHeader }}>
                    <td colSpan={5} className={styles.td} style={C({ color: COLORS.primary, fontWeight: 'bold' })}>TOTAL</td>
                    <td className={styles.td} style={C({ color: COLORS.primary, fontWeight: 'bold' })}>{gastosInternacionales.reduce((s, g) => s + parseFloat(g.monto_total || 0), 0).toFixed(2)}</td>
                    <td colSpan={2} className={styles.td} style={C()} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className={styles.resumenCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
          <p className={styles.resumenTitulo} style={{ color: COLORS.text_enviroment_types }}>Resumen de Totales</p>
          <div className={styles.resumenRow}>
            <p className={styles.resumenLabel} style={{ color: COLORS.labels }}>Total IVA Crédito</p>
            <p className={styles.resumenValor} style={{ color: COLORS.text }}>Bs. {totalIVA.toFixed(2)}</p>
          </div>
          <div className={styles.resumenDivider} style={{ borderColor: COLORS.dataFields }} />
          <div className={styles.resumenRow}>
            <p className="text-sm font-bold font-inter" style={{ color: COLORS.title }}>Saldo Neto (Bs)</p>
            <p className="text-sm font-bold font-inter" style={{ color: COLORS.title }}>Bs. {gastoAcumulado.toFixed(2)}</p>
          </div>
          {esInternacional && (
            <div className={styles.resumenRow}>
              <p className="text-sm font-bold font-inter" style={{ color: COLORS.primary }}>Saldo Neto (USD)</p>
              <p className="text-sm font-bold font-inter" style={{ color: COLORS.primary }}>USD {gastoAcumuladoUsd.toFixed(2)}</p>
            </div>
          )}
        </div>

        {gastos && gastos.length > 0 && (
          <button className={styles.exportBtn} style={{ backgroundColor: COLORS.primary, color: COLORS.background }} onClick={exportarExcel}>
            <Download size={16} />
            Exportar Planilla Excel
          </button>
        )}

        {errorTomar && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {errorTomar}
          </p>
        )}

        {error && !bloqueado && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error}
          </p>
        )}

        {accionCompletada && (
          <p className={styles.exitoBadge} style={{ backgroundColor: accionCompletada === 'APROBADO' ? '#d4edda' : '#ffa7a8aa', color: accionCompletada === 'APROBADO' ? '#155724' : '#500203' }}>
            {accionCompletada === 'APROBADO' ? 'Viaje aprobado correctamente' : 'Viaje rechazado correctamente'}
          </p>
        )}

        {esPendiente && sinAsignar && !accionCompletada && (
          <div className="mb-4">
            <p className="text-sm font-inter mb-3 text-center" style={{ color: COLORS.labels }}>
              Este viaje no está asignado. Asígnate para poder aprobarlo o rechazarlo.
            </p>
            <button
              className={styles.accionBtn}
              style={{ backgroundColor: COLORS.primary, color: COLORS.background, opacity: tomando ? 0.7 : 1, width: '100%' }}
              onClick={handleAsignarme}
              disabled={tomando}
            >
              {tomando ? 'Asignando...' : 'Asignarme este viaje'}
            </button>
          </div>
        )}

        {puedeAccionar && !accionCompletada && (
          <div className="mb-4">
            <p className="text-xs font-inter text-center mb-3" style={{ color: COLORS.labels }}>
              Para observar un gasto, ve a la tabla y presiona el ícono de mensaje junto a él
            </p>
            <div className={styles.accionesRow}>
              <button className={styles.accionBtn} style={{ backgroundColor: COLORS.primary, color: COLORS.background }} onClick={() => setShowAprobar(true)}>
                Aprobar
              </button>
              <button className={styles.accionBtn} style={{ backgroundColor: 'transparent', borderWidth: 2, borderStyle: 'solid', borderColor: COLORS.secondary, color: COLORS.secondary }} onClick={handlePedirRechazar}>
                Rechazar
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmarAprobarModal isOpen={showAprobar} onClose={() => setShowAprobar(false)} onConfirm={handleAprobar} loading={loadingAccion} />
      <ConfirmarRechazarModal isOpen={showRechazar} onClose={() => setShowRechazar(false)} onConfirm={handleRechazar} loading={loadingAccion} />
      <SinObservacionesModal isOpen={showSinObservaciones} onClose={() => setShowSinObservaciones(false)} />
      <ObservacionesGastoModal
        isOpen={showObsGasto}
        onClose={cerrarObservacionesGasto}
        nombreGasto={nombreGastoActivo}
        observaciones={observacionesDelGastoActivo()}
        puedeEditar={puedeAccionar}
        nuevoTexto={nuevoTexto}
        setNuevoTexto={setNuevoTexto}
        onAgregar={handleAgregarComentario}
        onEditar={handleAbrirEdicion}
        onEliminar={handleAbrirEliminacion}
        loading={loadingAccion}
        error={error && !bloqueado ? error : ''}
      />
      <EditarComentarioModal isOpen={!!comentarioEditando} onClose={() => { setComentarioEditando(null); setTextoEdicion('') }} onConfirm={handleConfirmarEdicion} texto={textoEdicion} setTexto={setTextoEdicion} loading={loadingAccion} error={error} />
      <ConfirmarEliminarComentarioModal isOpen={!!comentarioEliminando} onClose={() => setComentarioEliminando(null)} onConfirm={handleConfirmarEliminacion} loading={loadingAccion} />
      <Footer />
    </div>
  )
}

export default DetalleRevisionPage;