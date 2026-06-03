import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Plus, Pencil, Trash2, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
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
  gastosSection: 'my-7',
  gastosHeader: 'flex justify-between items-center mb-3',
  gastosTitulo: 'text-sm font-semibold font-inter uppercase',
  gastosGrid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3',
  gastoCard: 'rounded-xl p-4 border flex flex-col shadow-sm',
  gastoHeader: 'flex justify-between items-start mb-2',
  gastoNombre: 'text-sm font-bold font-inter flex-1 mr-2',
  gastoMonto: 'text-base font-bold font-inter shrink-0',
  gastoSub: 'text-xs font-inter mb-1',
  gastoDesc: 'text-xs font-inter p-2 rounded-lg mt-2 flex-1',
  detalleBtn: 'text-xs font-bold font-inter cursor-pointer mt-3 text-right',
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
}

const alertaConfig = {
  EXCESO_PRESUPUESTO: { label: 'Exceso Detectado', color: '#856404', bg: '#fef3cd' },
  ALCOHOL: { label: 'Alcohol', color: '#721c24', bg: '#f8d7da' },
}

const formatFecha = (f) =>
  new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

const formatFechaHora = (f) =>
  new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const estadoConfig = {
  APROBADO_SUPERVISOR: { label: 'Aprobado por Supervisor', bg: '#85aff3ab', color: '#000a65' },
  APROBADO_FINAL: { label: 'Aprobado Final', bg: '#d4edda', color: '#155724' },
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

  const {
    datos, loading, loadingAccion, error,
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

  const exportarExcel = () => {
    if (!datos) return
    const { viaje, gastos } = datos
    const infoViaje = [{
      'Empleado': `${viaje.Usuario?.nombre} ${viaje.Usuario?.apellido_paterno}`,
      'Cargo': viaje.Usuario?.Cargo?.nombre,
      'Motivo': viaje.motivo,
      'Destino': viaje.destino,
      'Fecha Inicio': viaje.fecha_inicio,
      'Fecha Fin': viaje.fecha_fin,
      'Tipo': viaje.tipo,
      'Entorno': viaje.entorno_destino,
      'Presupuesto (Bs)': parseFloat(viaje.monto_asignado).toFixed(2),
      'Estado': viaje.estado,
    }]
    const infoGastos = gastos.map((g) => ({
      'Tipo': { F: 'Factura', R: 'Recibo', C: 'Compra', S: 'Servicio' }[g.tipo] || g.tipo,
      'Proveedor': g.Proveedor?.nombre || '',
      'Categoría': g.Categoria_Gasto?.nombre || '',
      'N° Factura': g.Factura?.numero_factura || '',
      'Fecha Emisión': g.Factura?.fecha_emision || g.fecha_gasto,
      'NIT/CI': g.Proveedor?.numero_doc_fiscal || '',
      'Monto (Bs)': parseFloat(g.monto_total).toFixed(2),
      'Descripción': g.descripcion || '',
    }))
    const infoFacturas = gastos.flatMap((g) =>
      (g.Factura?.Detalle_Factura || []).map((d) => ({
        'N° Factura': g.Factura?.numero_factura || '',
        'Producto': d.nombre_producto,
        'Cantidad': d.cantidad,
        'Precio Unitario (Bs)': parseFloat(d.precio).toFixed(2),
        'Subtotal (Bs)': (d.cantidad * parseFloat(d.precio)).toFixed(2),
      }))
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(infoViaje), 'Viaje')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(infoGastos), 'Gastos')
    if (infoFacturas.length > 0) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(infoFacturas), 'Detalle Facturas')
    XLSX.writeFile(wb, `Informe_Viaje_${id}_${viaje.Usuario?.apellido_paterno || ''}.xlsx`)
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

  if (!datos) return null

  const { viaje, gastos, comentarios, gastoAcumulado, excedePresupuesto, alertas } = datos
  const esPendiente = viaje.estado === 'APROBADO_SUPERVISOR'
  const estadoActual = estadoConfig[viaje.estado] || estadoConfig['APROBADO_SUPERVISOR']
  const obsComentarios = (comentarios || []).filter((c) => c.tipo === 'OBSERVACION')
  const justificacion = (comentarios || []).find((c) => c.tipo === 'JUSTIFICACION')
  const montoLiquidacion = excedePresupuesto
    ? gastoAcumulado - parseFloat(viaje.monto_asignado)
    : parseFloat(viaje.monto_asignado) - gastoAcumulado
  const totalIVA = gastos.reduce((sum, g) => {
    const monto = parseFloat(g.Factura?.monto_parcial || 0)
    const total = parseFloat(g.monto_total || 0)
    return sum + Math.max(0, total - monto)
  }, 0)

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
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Lugar</p>
              <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.destino}</p>
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

        <div className={styles.gastosSection}>
          <div className={styles.gastosHeader}>
            <p className={styles.gastosTitulo} style={{ color: COLORS.title }}>Desglose de Gastos</p>
          </div>
          <div className={styles.gastosGrid}>
            {gastos.map((gasto) => {
              const tipoLabels = { F: 'Factura', R: 'Recibo', C: 'Compra', S: 'Servicio' }
              const tieneFactura = !!gasto.Factura
              const fechaGasto = new Date(gasto.fecha_gasto).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
              return (
                <div key={gasto.id_gasto} className={styles.gastoCard} style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}>
                  <div className={styles.gastoHeader}>
                    <p className={styles.gastoNombre} style={{ color: COLORS.text }}>
                      {tieneFactura ? (gasto.Proveedor?.nombre || 'Sin proveedor') : (gasto.Categoria_Gasto?.nombre || gasto.Proveedor?.nombre || 'Sin categoría')}
                    </p>
                    <p className={styles.gastoMonto} style={{ color: COLORS.title }}>Bs {parseFloat(gasto.monto_total).toFixed(2)}</p>
                  </div>
                  <p className={styles.gastoSub} style={{ color: COLORS.labels }}>📅 {fechaGasto}</p>
                  <p className={styles.gastoSub} style={{ color: COLORS.labels }}>🏷 {tipoLabels[gasto.tipo] || gasto.tipo}</p>
                  {tieneFactura ? (
                    <p className={styles.gastoSub} style={{ color: COLORS.labels }}>N° {gasto.Factura.numero_factura}</p>
                  ) : (
                    gasto.descripcion && (
                      <p className={styles.gastoDesc} style={{ backgroundColor: COLORS.backgroundHeader, color: COLORS.labels, marginBottom: '8px' }}>{gasto.descripcion}</p>
                    )
                  )}
                  <p
                    className={styles.detalleBtn}
                    style={{ color: COLORS.primary, marginTop: 'auto' }}
                    onClick={() => navigate(`/dashboard/revisor/gasto/${gasto.id_gasto}`, {
                      state: {
                        from: `/dashboard/revisor/revision/${id}`,
                        origenViaje: origen,
                      }
                    })}
                  >
                    DETALLES →
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.resumenCard} style={{ backgroundColor: COLORS.backgroundHeader }}>
          <p className={styles.resumenTitulo} style={{ color: COLORS.text_enviroment_types }}>Resumen de Totales</p>
          <div className={styles.resumenRow}>
            <p className={styles.resumenLabel} style={{ color: COLORS.labels }}>Monto Total Original</p>
            <p className={styles.resumenValor} style={{ color: COLORS.text }}>Bs. {gastoAcumulado.toFixed(2)}</p>
          </div>
          <div className={styles.resumenRow}>
            <p className={styles.resumenLabel} style={{ color: COLORS.labels }}>Total IVA Crédito</p>
            <p className={styles.resumenValor} style={{ color: COLORS.text }}>Bs. {totalIVA.toFixed(2)}</p>
          </div>
          <div className={styles.resumenDivider} style={{ borderColor: COLORS.dataFields }} />
          <div className={styles.resumenRow}>
            <p className="text-sm font-bold font-inter" style={{ color: COLORS.title }}>Costo Neto Liquidado</p>
            <p className="text-sm font-bold font-inter" style={{ color: COLORS.title }}>Bs. {gastoAcumulado.toFixed(2)}</p>
          </div>
        </div>

        <button className={styles.exportBtn} style={{ backgroundColor: COLORS.primary, color: COLORS.background, border: `1px solid ${COLORS.dataFields}` }} onClick={exportarExcel}>
          <Download size={16} />
          Exportar Informe Excel
        </button>

        {(esPendiente || obsComentarios.length > 0) && (
          <div className={styles.obsSection}>
            <div className={styles.obsTituloRow}>
              <p className={styles.obsTitulo} style={{ color: COLORS.title }}>Observaciones</p>
              {esPendiente && (
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
                <div key={obs.id_comentario} className={styles.obsItem} style={{ cursor: esPendiente ? 'pointer' : 'default' }} onClick={() => esPendiente && setObsSeleccionada(seleccionada ? null : obs)}>
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

        {accionCompletada && (
          <p className={styles.exitoBadge} style={{ backgroundColor: accionCompletada === 'APROBADO_FINAL' ? '#d4edda' : '#ffa7a8aa', color: accionCompletada === 'APROBADO_FINAL' ? '#155724' : '#500203' }}>
            {accionCompletada === 'APROBADO_FINAL' ? 'Viaje aprobado correctamente' : 'Viaje rechazado correctamente'}
          </p>
        )}

        {esPendiente && !accionCompletada && (
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