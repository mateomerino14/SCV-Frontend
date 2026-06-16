import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Plus, Pencil, Trash2, Download, Eye } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import ConfirmarAprobarModal from '../features/Revisiones/ConfirmarAprobarModal'
import ConfirmarRechazarModal from '../features/Revisiones/ConfirmarRechazarModal'
import SinObservacionesModal from '../features/Revisiones/SinObservacionesModal'
import AgregarComentarioModal from '../features/Revisiones/AgregarComentarioModal'
import EditarComentarioModal from '../features/Revisiones/EditarComentarioModal'
import ConfirmarEliminarComentarioModal from '../features/Revisiones/ConfirmarEliminarComentarioModal'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import useDetalleRevisor from '../hooks/useDetalleRevisor'
import useMenu from '../hooks/useMenu'
import { tomarRevisionRevisor } from '../services/revisorService'
import { COLORS } from '../constants'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

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
  presupuestoLabel: 'text-xs font-nunito font-bold uppercase mb-1',
  presupuestoMonto: 'text-2xl font-semibold font-inter',
  presupuestoSub: 'text-sm font-inter ml-2',
  presupuestoBar: 'w-full rounded-full h-2 mt-2',
  presupuestoFill: 'h-2 rounded-full transition-all',
  presupuestoPct: 'text-xs font-inter mt-1',
  liquidacionCard: 'rounded-2xl p-5 mb-4',
  montoLiquidacion: 'text-3xl font-bold font-inter',
  montoLabel: 'text-sm font-inter mt-1',
  justificacionBox: 'mt-3 p-3 rounded-xl text-xs font-inter',
  alertasSection: 'mb-4',
  alertasTitulo: 'text-xs font-bold font-inter uppercase mb-2',
  alertasRow: 'flex gap-2 flex-wrap',
  alertaBadge: 'text-xs font-bold font-inter px-3 py-1.5 rounded-lg flex items-center gap-1',
  planillaSection: 'mb-6',
  planillaTitulo: 'text-sm font-bold font-inter uppercase mb-2',
  planillaSubtitulo: 'text-xs font-inter mb-3',
  tableWrapper: 'overflow-x-auto rounded-xl border',
  table: 'w-full text-xs font-inter border-collapse',
  th: 'px-3 py-2.5 text-center font-bold uppercase text-xs border-b border-r last:border-r-0 whitespace-nowrap',
  td: 'px-3 py-2.5 border-b border-r last:border-r-0 text-center whitespace-nowrap',
  resumenCard: 'rounded-2xl p-5 mb-4 shadow-md',
  resumenTitulo: 'text-xs font-bold font-inter uppercase mb-3',
  resumenRow: 'flex justify-between items-center py-1.5',
  resumenLabel: 'text-sm font-inter',
  resumenValor: 'text-sm font-bold font-inter',
  resumenDivider: 'border-t my-2',
  obsSection: 'mb-4 mt-8',
  obsTituloRow: 'flex items-center mb-3',
  obsTitulo: 'text-sm font-semibold font-inter uppercase',
  obsBotonesRow: 'flex gap-2 ml-auto',
  obsBtn: 'w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer',
  obsItem: 'flex flex-col gap-1 mb-3',
  obsBulletRow: 'flex items-center gap-2',
  obsBullet: 'w-2 h-2 rounded-full shrink-0',
  obsFecha: 'text-xs font-inter',
  obsTexto: 'text-sm font-inter leading-relaxed p-3 rounded-xl ml-4 break-words overflow-hidden',
  accionesRow: 'flex gap-3',
  accionBtn: 'flex-1 py-2 rounded-xl font-bold font-nunito text-base cursor-pointer text-center',
  errorMsg: 'text-xs font-inter italic text-center py-3 px-3 rounded-xl mb-3',
  exitoBadge: 'text-sm font-bold font-inter text-center py-3 px-4 rounded-xl mb-4',
  exportBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer flex items-center justify-center gap-2 mb-4',
  eyeBtn: 'w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shrink-0',
}

const alertaConfig = {
  EXCESO_PRESUPUESTO: { label: 'Exceso Detectado', color: '#856404', bg: '#fef3cd' },
  ALCOHOL: { label: 'Alcohol', color: '#721c24', bg: '#f8d7da' },
}

const tipoLabels = { F: 'Factura', R: 'Recibo', C: 'Compra', S: 'Servicio' }

const formatFecha = (f) =>
  new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

const formatFechaHora = (f) =>
  new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const estadoConfig = {
  APROBADO_SUPERVISOR: { label: 'Apr. Preliminar', bg: '#85aff3ab', color: '#000a65' },
  APROBADO_FINAL: { label: 'Aprobado', bg: '#d4edda', color: '#155724' },
  RECHAZADO: { label: 'Rechazado', bg: '#ffa7a8aa', color: '#500203' },
}

function PresupuestoBar({ gastoAcumulado, montoAsignado }) {
  const porcentaje = montoAsignado > 0 ? Math.min((gastoAcumulado / montoAsignado) * 100, 100) : 0
  const excede = porcentaje >= 100
  const colorBarra = excede ? COLORS.secondary : COLORS.title
  return (
    <div>
      <p className={styles.presupuestoLabel} style={{ color: COLORS.text_enviroment_types }}>Presupuesto Gastado</p>
      <p style={{ color: excede ? COLORS.secondary : COLORS.text }}>
        <span className={styles.presupuestoMonto}>{gastoAcumulado.toFixed(2)} Bs</span>
        <span className={styles.presupuestoSub} style={{ color: COLORS.title }}>/ {parseFloat(montoAsignado).toFixed(2)} Bs</span>
      </p>
      <div className={styles.presupuestoBar} style={{ backgroundColor: COLORS.dataFields }}>
        <div className={styles.presupuestoFill} style={{ width: `${porcentaje}%`, backgroundColor: colorBarra }} />
      </div>
      <p className={styles.presupuestoPct} style={{ color: COLORS.title }}>{porcentaje.toFixed(0)}% del límite alcanzado</p>
    </div>
  )
}

function DetalleRevisorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const origen = location.state?.from || '/dashboard/revisor'
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const [showAgregarObs, setShowAgregarObs] = useState(false)
  const [obsSeleccionada, setObsSeleccionada] = useState(null)
  const [tomando, setTomando] = useState(false)
  const [errorTomar, setErrorTomar] = useState('')

  const {
    datos, loading, loadingAccion, error, bloqueado,
    showAprobar, setShowAprobar,
    showRechazar, setShowRechazar,
    showSinObservaciones, setShowSinObservaciones,
    accionCompletada,
    observaciones,
    comentarioAgregado, resetComentarioAgregado,
    comentarioEditando, setComentarioEditando,
    comentarioEliminando, setComentarioEliminando,
    textoEdicion, setTextoEdicion,
    handleAprobar, handlePedirRechazar, handleRechazar,
    handleAgregarComentario,
    handleAbrirEdicion, handleConfirmarEdicion,
    handleAbrirEliminacion, handleConfirmarEliminacion,
    editarObservacion,
  } = useDetalleRevisor(id)

  useEffect(() => {
    if (comentarioAgregado) { setShowAgregarObs(false); resetComentarioAgregado() }
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
    const data = await tomarRevisionRevisor(id)
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

    const colorPrimario = '1a3a5c'
    const colorSecundario = 'E8EFF8'
    const colorFila = 'F5F8FF'
    const colorBorde = 'CCCCCC'

    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + colorPrimario } }
    const headerFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    const headerAlignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    const borderThin = {
      top: { style: 'thin', color: { argb: 'FF' + colorBorde } },
      left: { style: 'thin', color: { argb: 'FF' + colorBorde } },
      bottom: { style: 'thin', color: { argb: 'FF' + colorBorde } },
      right: { style: 'thin', color: { argb: 'FF' + colorBorde } },
    }
    const borderMedium = {
      top: { style: 'medium', color: { argb: 'FF' + colorPrimario } },
      left: { style: 'medium', color: { argb: 'FF' + colorPrimario } },
      bottom: { style: 'medium', color: { argb: 'FF' + colorPrimario } },
      right: { style: 'medium', color: { argb: 'FF' + colorPrimario } },
    }

    const gastosCF = gastos.filter(g => !!g.Factura)
    const gastosSF = gastos.filter(g => !g.Factura)
    const totalGastado = gastos.reduce((s, g) => s + parseFloat(g.monto_total || 0), 0)
    const totalIVA = gastosCF.reduce((sum, g) => {
      const monto = parseFloat(g.Factura?.monto_parcial || 0)
      const total = parseFloat(g.monto_total || 0)
      return sum + Math.max(0, total - monto)
    }, 0)
    const saldo = parseFloat(viaje.monto_asignado) - totalGastado

    const agregarHojaGastos = (ws, lista, conFactura) => {
      ws.getRow(1).height = 40
      const cols = conFactura
        ? ['#', 'Fecha', 'Proveedor', 'Descripción', 'Tipo', 'N° Documento', 'NIT/CI', 'Importe (Bs)', 'IVA Crédito (Bs)', 'Neto (Bs)']
        : ['#', 'Fecha', 'Categoría / Concepto', 'Descripción', 'Tipo', 'Importe (Bs)']

      cols.forEach((col, i) => {
        const cell = ws.getRow(1).getCell(i + 1)
        cell.value = col
        cell.fill = headerFill
        cell.font = headerFont
        cell.alignment = headerAlignment
        cell.border = borderThin
      })

      ws.columns = conFactura
        ? [{ width: 5 }, { width: 12 }, { width: 28 }, { width: 30 }, { width: 10 }, { width: 16 }, { width: 16 }, { width: 14 }, { width: 14 }, { width: 14 }]
        : [{ width: 5 }, { width: 12 }, { width: 28 }, { width: 30 }, { width: 12 }, { width: 14 }]

      let totalImporte = 0
      let totalIVAHoja = 0

      lista.forEach((g, i) => {
        const importe = parseFloat(g.monto_total || 0)
        const montoSinIVA = parseFloat(g.Factura?.monto_parcial || 0)
        const iva = conFactura ? Math.max(0, importe - montoSinIVA) : 0
        totalImporte += importe
        totalIVAHoja += iva

        const row = ws.getRow(i + 2)
        row.height = 18
        const bgFill = i % 2 === 0
          ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
          : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + colorFila } }

        const valores = conFactura
          ? [i + 1, formatFecha(g.Factura?.fecha_emision || g.fecha_gasto), g.Proveedor?.nombre || '', g.descripcion || `Factura N° ${g.Factura?.numero_factura || ''}`, tipoLabels[g.tipo] || g.tipo, g.Factura?.numero_factura || '', g.Proveedor?.numero_doc_fiscal || '', importe, iva > 0 ? iva : '', importe]
          : [i + 1, formatFecha(g.fecha_gasto), g.Categoria_Gasto?.nombre || g.Proveedor?.nombre || '', g.descripcion || '', tipoLabels[g.tipo] || g.tipo, importe]

        valores.forEach((val, ci) => {
          const cell = row.getCell(ci + 1)
          cell.value = val
          cell.fill = bgFill
          cell.border = borderThin
          cell.font = { size: 10 }
          const isNum = conFactura ? ci >= 7 : ci === 5
          if (isNum) {
            if (val !== '') cell.numFmt = '#,##0.00'
            cell.alignment = { horizontal: 'center', vertical: 'middle' }
          } else if (ci === 0) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' }
          } else {
            cell.alignment = { horizontal: 'center', vertical: 'middle' }
          }
        })
      })

      const totalRow = ws.getRow(lista.length + 2)
      totalRow.height = 20
      const totalFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + colorSecundario } }
      const numCols = conFactura ? 10 : 6
      for (let c = 1; c <= numCols; c++) {
        const cell = totalRow.getCell(c)
        cell.fill = totalFill
        cell.border = borderThin
        cell.font = { bold: true, size: 10 }
      }
      const labelCol = conFactura ? 7 : 5
      totalRow.getCell(labelCol).value = 'TOTAL'
      totalRow.getCell(labelCol).alignment = { horizontal: 'center' }
      totalRow.getCell(labelCol + 1).value = totalImporte
      totalRow.getCell(labelCol + 1).numFmt = '#,##0.00'
      totalRow.getCell(labelCol + 1).alignment = { horizontal: 'center' }
      if (conFactura) {
        if (totalIVAHoja > 0) {
          totalRow.getCell(9).value = totalIVAHoja
          totalRow.getCell(9).numFmt = '#,##0.00'
          totalRow.getCell(9).alignment = { horizontal: 'center' }
        }
        totalRow.getCell(10).value = totalImporte
        totalRow.getCell(10).numFmt = '#,##0.00'
        totalRow.getCell(10).alignment = { horizontal: 'center' }
      }
    }

    const wsInfo = wb.addWorksheet('Información General')
    wsInfo.columns = [{ width: 26 }, { width: 40 }]
    wsInfo.getRow(1).height = 35
    wsInfo.mergeCells('A1:B1')
    const tituloCell = wsInfo.getCell('A1')
    tituloCell.value = 'PLANILLA DE RENDICIÓN DE CUENTAS'
    tituloCell.fill = headerFill
    tituloCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } }
    tituloCell.alignment = { horizontal: 'center', vertical: 'middle' }
    tituloCell.border = borderMedium

    wsInfo.addRow([])
    const seccionRow = wsInfo.addRow(['INFORMACIÓN GENERAL', ''])
    seccionRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF' + colorPrimario } }
    seccionRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + colorSecundario } }
    wsInfo.mergeCells(`A${seccionRow.number}:B${seccionRow.number}`)

    const infoData = [
      ['Responsable:', `${viaje.Usuario?.nombre} ${viaje.Usuario?.apellido_paterno}`],
      ['Cargo:', viaje.Usuario?.Cargo?.nombre || ''],
      ['Dependencia:', viaje.Usuario?.numero_dependencia || ''],
      ['Sección:', viaje.Usuario?.numero_seccion || ''],
      ['Motivo:', viaje.motivo],
      ['Destino:', viaje.destino],
      ['Período:', `Del ${formatFecha(viaje.fecha_inicio)} al ${formatFecha(viaje.fecha_fin)}`],
      ['Fondo Recibido (Bs):', parseFloat(viaje.monto_asignado)],
    ]

    infoData.forEach(([label, val]) => {
      const row = wsInfo.addRow([label, val])
      row.height = 18
      row.getCell(1).font = { bold: true, size: 10 }
      row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F8FF' } }
      row.getCell(2).font = { size: 10 }
      if (label === 'Fondo Recibido (Bs):') {
        row.getCell(2).numFmt = '#,##0.00'
        row.getCell(2).alignment = { horizontal: 'center' }
      }
      row.getCell(1).border = borderThin
      row.getCell(2).border = borderThin
    })

    wsInfo.addRow([])
    const resumenSeccion = wsInfo.addRow(['RESUMEN FINANCIERO', ''])
    resumenSeccion.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF' + colorPrimario } }
    resumenSeccion.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + colorSecundario } }
    wsInfo.mergeCells(`A${resumenSeccion.number}:B${resumenSeccion.number}`)

    const resumenData = [
      ['Fondo Recibido (Bs):', parseFloat(viaje.monto_asignado)],
      ['Total Gastado (Bs):', totalGastado],
      ['Total IVA Crédito (Bs):', totalIVA],
      [saldo >= 0 ? 'Saldo a Devolver (Bs):' : 'Monto a Reembolsar (Bs):', Math.abs(saldo)],
    ]

    resumenData.forEach(([label, val]) => {
      const row = wsInfo.addRow([label, val])
      row.height = 18
      row.getCell(1).font = { bold: true, size: 10 }
      row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F8FF' } }
      row.getCell(2).font = { size: 10 }
      row.getCell(2).numFmt = '#,##0.00'
      row.getCell(2).alignment = { horizontal: 'center' }
      row.getCell(1).border = borderThin
      row.getCell(2).border = borderThin
    })

    if (gastosCF.length > 0) {
      const wsCF = wb.addWorksheet('Gastos con Factura')
      agregarHojaGastos(wsCF, gastosCF, true)
    }
    if (gastosSF.length > 0) {
      const wsSF = wb.addWorksheet('Gastos sin Factura')
      agregarHojaGastos(wsSF, gastosSF, false)
    }

    const buf = await wb.xlsx.writeBuffer()
    saveAs(new Blob([buf]), `Planilla_Rendicion_${viaje.Usuario?.apellido_paterno || ''}_${id}.xlsx`)
  }

  if (loading) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Detalle de Revisión Final" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
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
        <Navbar text="Detalle de Revisión Final" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-12">
          <div className="rounded-full p-5" style={{ backgroundColor: COLORS.error }}>
            <AlertTriangle size={36} style={{ color: COLORS.secondary }} />
          </div>
          <p className="text-base font-bold font-inter text-center mt-2" style={{ color: COLORS.text }}>Revisión no disponible</p>
          <p className="text-sm font-inter text-center" style={{ color: COLORS.labels }}>{error}</p>
          <button className="mt-4 py-2.5 px-8 rounded-xl font-bold font-nunito text-sm" style={{ backgroundColor: COLORS.primary, color: COLORS.background }} onClick={() => navigate(origen)}>
            Volver
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  if (!datos) return null

  const { viaje, gastos, comentarios, gastoAcumulado, excedePresupuesto, alertas } = datos
  const esPendiente = viaje.estado === 'APROBADO_SUPERVISOR'
  const estadoActual = estadoConfig[viaje.estado] || estadoConfig['APROBADO_SUPERVISOR']
  const miId = getMiId()
  const esMio = viaje.id_revisor_asignado === miId
  const sinAsignar = !viaje.id_revisor_asignado
  const puedeAccionar = esPendiente && esMio
  const obsComentarios = (comentarios || []).filter((c) => c.tipo === 'OBSERVACION')
  const justificacion = (comentarios || []).find((c) => c.tipo === 'JUSTIFICACION')
  const montoLiquidacion = excedePresupuesto
    ? gastoAcumulado - parseFloat(viaje.monto_asignado)
    : parseFloat(viaje.monto_asignado) - gastoAcumulado

  const gastosCF = gastos.filter(g => !!g.Factura)
  const gastosSF = gastos.filter(g => !g.Factura)

  const totalIVA = gastosCF.reduce((sum, g) => {
    const monto = parseFloat(g.Factura?.monto_parcial || 0)
    const total = parseFloat(g.monto_total || 0)
    return sum + Math.max(0, total - monto)
  }, 0)

  const rutaDetalle = (id_gasto) => `/dashboard/revisor/gasto/${id_gasto}`
  const C = (extra = {}) => ({ ...extra, borderColor: COLORS.dataFields })

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Detalle de Revisión Final" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
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
            <span className={styles.estadoBadge} style={{ backgroundColor: estadoActual.bg, color: estadoActual.color }}>{estadoActual.label}</span>
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
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Lugar</p>
              <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.destino}</p>
            </div>
            <div>
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Dependencia</p>
              <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.Usuario?.numero_dependencia || '—'}</p>
            </div>
            <div>
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Sección</p>
              <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.Usuario?.numero_seccion || '—'}</p>
            </div>
          </div>
        </div>

        <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
          <PresupuestoBar gastoAcumulado={gastoAcumulado} montoAsignado={parseFloat(viaje.monto_asignado)} />
        </div>

        <div className={styles.liquidacionCard} style={{ backgroundColor: COLORS.primary }}>
          <p className={styles.montoLiquidacion} style={{ color: COLORS.background }}>Bs {montoLiquidacion.toFixed(2)}</p>
          <p className={styles.montoLabel} style={{ color: 'rgba(255,255,255,0.8)' }}>
            {excedePresupuesto ? 'A Reembolsar al Empleado' : 'A devolver a la empresa'}
          </p>
          {excedePresupuesto && justificacion && (
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
            <p className={styles.planillaTitulo} style={{ color: COLORS.title }}>Gastos con Factura</p>
            <p className={styles.planillaSubtitulo} style={{ color: COLORS.labels }}>Gastos respaldados con factura o recibo oficial</p>
            <div className={styles.tableWrapper} style={{ borderColor: COLORS.dataFields }}>
              <table className={styles.table}>
                <thead>
                  <tr style={{ backgroundColor: COLORS.primary }}>
                    {['#', 'Fecha', 'Proveedor', 'Descripción', 'Tipo', 'N° Doc.', 'NIT/CI', 'Importe (Bs)', 'IVA (Bs)', ''].map((h) => (
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
                        <td className={styles.td} style={C({ color: COLORS.text, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis' })}>{g.Proveedor?.nombre || '—'}</td>
                        <td className={styles.td} style={C({ color: COLORS.labels, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' })}>{g.descripcion || `N° ${g.Factura.numero_factura}`}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{tipoLabels[g.tipo] || g.tipo}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{g.Factura?.numero_factura || '—'}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{g.Proveedor?.numero_doc_fiscal || '—'}</td>
                        <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>{importe.toFixed(2)}</td>
                        <td className={styles.td} style={C({ color: COLORS.labels })}>{iva > 0 ? iva.toFixed(2) : '—'}</td>
                        <td className={styles.td} style={C({ width: 36 })}>
                          <button className={styles.eyeBtn} style={{ backgroundColor: COLORS.backgroundHeader, margin: '0 auto' }} onClick={() => navigate(rutaDetalle(g.id_gasto), { state: { from: `/dashboard/revisor/revision/${id}`, origenViaje: origen } })}>
                            <Eye size={13} style={{ color: COLORS.primary }} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ backgroundColor: COLORS.backgroundHeader }}>
                    <td colSpan={7} className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>TOTAL</td>
                    <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>
                      {gastosCF.reduce((s, g) => s + parseFloat(g.monto_total || 0), 0).toFixed(2)}
                    </td>
                    <td colSpan={2} className={styles.td} style={C()} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {gastosSF.length > 0 && (
          <div className={styles.planillaSection}>
            <p className={styles.planillaTitulo} style={{ color: COLORS.title }}>Gastos sin Factura</p>
            <p className={styles.planillaSubtitulo} style={{ color: COLORS.labels }}>Gastos varios sin respaldo de factura oficial</p>
            <div className={styles.tableWrapper} style={{ borderColor: COLORS.dataFields }}>
              <table className={styles.table}>
                <thead>
                  <tr style={{ backgroundColor: COLORS.title }}>
                    {['#', 'Fecha', 'Categoría / Concepto', 'Descripción', 'Tipo', 'Importe (Bs)', ''].map((h) => (
                      <th key={h} className={styles.th} style={{ color: COLORS.background, borderColor: 'rgba(255,255,255,0.2)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gastosSF.map((g, i) => {
                    const importe = parseFloat(g.monto_total || 0)
                    const bg = i % 2 === 0 ? COLORS.background : COLORS.backgroundHeader
                    return (
                      <tr key={g.id_gasto} style={{ backgroundColor: bg }}>
                        <td className={styles.td} style={C({ color: COLORS.labels })}>{i + 1}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{formatFecha(g.fecha_gasto)}</td>
                        <td className={styles.td} style={C({ color: COLORS.text, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis' })}>{g.Categoria_Gasto?.nombre || g.Proveedor?.nombre || '—'}</td>
                        <td className={styles.td} style={C({ color: COLORS.labels, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' })}>{g.descripcion || '—'}</td>
                        <td className={styles.td} style={C({ color: COLORS.text })}>{tipoLabels[g.tipo] || g.tipo}</td>
                        <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>{importe.toFixed(2)}</td>
                        <td className={styles.td} style={C({ width: 36 })}>
                          <button className={styles.eyeBtn} style={{ backgroundColor: COLORS.backgroundHeader, margin: '0 auto' }} onClick={() => navigate(rutaDetalle(g.id_gasto), { state: { from: `/dashboard/revisor/revision/${id}`, origenViaje: origen } })}>
                            <Eye size={13} style={{ color: COLORS.title }} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ backgroundColor: COLORS.backgroundHeader }}>
                    <td colSpan={5} className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>TOTAL</td>
                    <td className={styles.td} style={C({ color: COLORS.title, fontWeight: 'bold' })}>
                      {gastosSF.reduce((s, g) => s + parseFloat(g.monto_total || 0), 0).toFixed(2)}
                    </td>
                    <td className={styles.td} style={C()} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className={styles.resumenCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
          <p className={styles.resumenTitulo} style={{ color: COLORS.text_enviroment_types }}>Resumen Financiero</p>
          <div className={styles.resumenRow}>
            <p className={styles.resumenLabel} style={{ color: COLORS.labels }}>Fondo Recibido</p>
            <p className={styles.resumenValor} style={{ color: COLORS.text }}>Bs. {parseFloat(viaje.monto_asignado).toFixed(2)}</p>
          </div>
          <div className={styles.resumenRow}>
            <p className={styles.resumenLabel} style={{ color: COLORS.labels }}>Total Gastado</p>
            <p className={styles.resumenValor} style={{ color: COLORS.text }}>Bs. {gastoAcumulado.toFixed(2)}</p>
          </div>
          {totalIVA > 0 && (
            <div className={styles.resumenRow}>
              <p className={styles.resumenLabel} style={{ color: COLORS.labels }}>Total IVA Crédito</p>
              <p className={styles.resumenValor} style={{ color: COLORS.text }}>Bs. {totalIVA.toFixed(2)}</p>
            </div>
          )}
          <div className={styles.resumenDivider} style={{ borderColor: COLORS.dataFields }} />
          <div className={styles.resumenRow}>
            <p className="text-sm font-bold font-inter" style={{ color: excedePresupuesto ? COLORS.secondary : COLORS.title }}>
              {excedePresupuesto ? 'A Reembolsar al Empleado' : 'Saldo a Devolver'}
            </p>
            <p className="text-sm font-bold font-inter" style={{ color: excedePresupuesto ? COLORS.secondary : COLORS.title }}>
              Bs. {montoLiquidacion.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          className={styles.exportBtn}
          style={{ backgroundColor: COLORS.primary, color: COLORS.background, border: `1px solid ${COLORS.dataFields}` }}
          onClick={exportarExcel}
        >
          <Download size={16} />
          Exportar Planilla Excel
        </button>

        {(puedeAccionar || obsComentarios.length > 0) && (
          <div className={styles.obsSection}>
            <div className={styles.obsTituloRow}>
              <p className={styles.obsTitulo} style={{ color: COLORS.title }}>Observaciones</p>
              {puedeAccionar && (
                <div className={styles.obsBotonesRow}>
                  <button className={styles.obsBtn} style={{ backgroundColor: COLORS.secondary }} onClick={() => setShowAgregarObs(true)}>
                    <Plus size={18} style={{ color: COLORS.background }} />
                  </button>
                  <button className={styles.obsBtn} style={{ backgroundColor: obsSeleccionada ? COLORS.secondary : COLORS.dataFields, opacity: obsSeleccionada ? 1 : 0.5 }} onClick={() => obsSeleccionada && handleAbrirEdicion(obsSeleccionada)} disabled={!obsSeleccionada}>
                    <Pencil size={16} style={{ color: COLORS.background }} />
                  </button>
                  <button className={styles.obsBtn} style={{ backgroundColor: obsSeleccionada ? COLORS.secondary : COLORS.dataFields, opacity: obsSeleccionada ? 1 : 0.5 }} onClick={() => obsSeleccionada && handleAbrirEliminacion(obsSeleccionada.id_comentario)} disabled={!obsSeleccionada}>
                    <Trash2 size={16} style={{ color: COLORS.background }} />
                  </button>
                </div>
              )}
            </div>
            {obsComentarios.map((obs) => {
              const seleccionada = obsSeleccionada?.id_comentario === obs.id_comentario
              return (
                <div key={obs.id_comentario} className={styles.obsItem} style={{ cursor: puedeAccionar ? 'pointer' : 'default' }} onClick={() => puedeAccionar && setObsSeleccionada(seleccionada ? null : obs)}>
                  <div className={styles.obsBulletRow}>
                    <div className={styles.obsBullet} style={{ backgroundColor: seleccionada ? COLORS.primary : COLORS.secondary }} />
                    <p className={styles.obsFecha} style={{ color: COLORS.text_enviroment_types }}>{formatFechaHora(obs.fecha)}</p>
                  </div>
                  <div className={styles.obsTexto} style={{ backgroundColor: seleccionada ? COLORS.backgroundHeader : COLORS.element, color: COLORS.text, border: seleccionada ? `2px solid ${COLORS.primary}` : '2px solid transparent' }}>
                    {obs.descripcion}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {errorTomar && <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>{errorTomar}</p>}
        {error && !bloqueado && <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>{error}</p>}

        {accionCompletada && (
          <p className={styles.exitoBadge} style={{ backgroundColor: accionCompletada === 'APROBADO_FINAL' ? '#d4edda' : '#ffa7a8aa', color: accionCompletada === 'APROBADO_FINAL' ? '#155724' : '#500203' }}>
            {accionCompletada === 'APROBADO_FINAL' ? 'Viaje aprobado correctamente' : 'Viaje rechazado correctamente'}
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
      <AgregarComentarioModal
        isOpen={showAgregarObs}
        onClose={() => { setShowAgregarObs(false); editarObservacion(0, '') }}
        onConfirm={handleAgregarComentario}
        observaciones={observaciones}
        onEditar={editarObservacion}
        loading={loadingAccion}
        error={error}
      />
      <EditarComentarioModal isOpen={!!comentarioEditando} onClose={() => { setComentarioEditando(null); setTextoEdicion(''); setObsSeleccionada(null) }} onConfirm={handleConfirmarEdicion} texto={textoEdicion} setTexto={setTextoEdicion} loading={loadingAccion} error={error} />
      <ConfirmarEliminarComentarioModal isOpen={!!comentarioEliminando} onClose={() => { setComentarioEliminando(null); setObsSeleccionada(null) }} onConfirm={handleConfirmarEliminacion} loading={loadingAccion} />
      <Footer />
    </div>
  )
}

export default DetalleRevisorPage;