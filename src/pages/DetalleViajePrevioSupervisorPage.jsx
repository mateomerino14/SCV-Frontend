import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Plus, Pencil, Trash2, Navigation, MapPin, Globe } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
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
import useDetalleViajePrevioSupervisor from '../hooks/useDetalleViajePrevioSupervisor'
import useMenu from '../hooks/useMenu'
import { tomarViajePreRevision } from '../services/supervisorService'
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
  motivoTexto: 'text-sm font-inter mb-3 font-semibold',
  infoGrid: 'grid grid-cols-2 gap-4',
  infoLabel: 'text-xs font-bold font-inter uppercase mb-0.5',
  infoValor: 'text-sm font-inter break-words',
  infoRuta: 'text-sm font-inter flex items-center gap-1 flex-wrap',
  detailCard: 'rounded-2xl p-5 mb-4',
  detailRow: 'flex justify-between items-center py-2 border-b',
  detailRowLast: 'flex justify-between items-center py-2',
  detailLabel: 'text-sm font-inter',
  detailValor: 'text-sm font-bold font-inter',
  obsSection: 'mb-4 mt-6',
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
}

const estadoConfig = {
  EN_REVISION_VIAJE: { label: 'Pendiente de Revisión', bg: '#e8d5ff', color: '#5b00a0' },
  APROBADO_VIAJE: { label: 'Aprobado por Supervisor', bg: '#ffd700aa', color: '#7a5900' },
  EN_REVISION_TESORERO: { label: 'Enviado a Tesorería', bg: '#ffd8a8aa', color: '#8a4b00' },
  RECHAZADO: { label: 'Rechazado', bg: '#ffa7a8aa', color: '#500203' },
}

const formatFecha = (f) => {
  const [y, m, d] = f.split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatFechaHora = (f) =>
  new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

function DetalleViajePrevioSupervisorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const origen = location.state?.from || '/dashboard/supervisor'
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const [showAgregarObs, setShowAgregarObs] = useState(false)
  const [obsSeleccionada, setObsSeleccionada] = useState(null)
  const [tomando, setTomando] = useState(false)
  const [errorTomar, setErrorTomar] = useState('')

  const {
    datos, loading, loadingAccion, error, errorModal, bloqueado,
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
  } = useDetalleViajePrevioSupervisor(id)

  const obsComentarios = (datos?.comentarios || []).filter(c => c.tipo === 'OBSERVACION')

  useEffect(() => {
    if (comentarioAgregado) { setShowAgregarObs(false); resetComentarioAgregado() }
  }, [comentarioAgregado])

  useEffect(() => {
    if (obsSeleccionada && !obsComentarios.some(o => o.id_comentario === obsSeleccionada.id_comentario)) {
      setObsSeleccionada(null)
    }
  }, [obsComentarios])

  const getMiId = () => {
    try { return jwtDecode(localStorage.getItem('token'))?.id_usuario }
    catch { return null }
  }

  const handleAsignarme = async () => {
    setTomando(true)
    setErrorTomar('')
    const data = await tomarViajePreRevision(id)
    setTomando(false)
    if (data.error) {
      setErrorTomar(data.error)
      setTimeout(() => setErrorTomar(''), 3000)
      return
    }
    window.location.reload()
  }

  if (loading) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Revisión de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center"><p style={{ color: COLORS.labels }}>Cargando...</p></div>
        <Footer />
      </div>
    )
  }

  if (bloqueado) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Revisión de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-12">
          <div className="rounded-full p-5" style={{ backgroundColor: COLORS.error }}>
            <AlertTriangle size={36} style={{ color: COLORS.secondary }} />
          </div>
          <p className="text-base font-bold font-inter text-center mt-2" style={{ color: COLORS.text }}>Revisión no disponible</p>
          <p className="text-sm font-inter text-center" style={{ color: COLORS.labels }}>{error}</p>
          <button className="mt-4 py-2.5 px-8 rounded-xl font-bold font-nunito text-sm" style={{ backgroundColor: COLORS.primary, color: COLORS.background }} onClick={() => navigate(origen)}>Volver</button>
        </div>
        <Footer />
      </div>
    )
  }

  if (!datos) return null

  const { viaje, comentarios } = datos
  const miId = getMiId()
  const esMio = viaje.id_supervisor_asignado === miId
  const sinAsignar = !viaje.id_supervisor_asignado
  const esPendiente = viaje.estado === 'EN_REVISION_VIAJE'
  const puedeAccionar = esPendiente && esMio
  const esInternacional = viaje.tipo === 'Internacional'
  const estadoActual = estadoConfig[viaje.estado] || estadoConfig['EN_REVISION_VIAJE']

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Revisión de Viaje" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(origen)}>
          <ArrowLeft size={25} style={{ color: COLORS.title }} />
        </button>

        <div className={styles.card} style={{ backgroundColor: COLORS.background }}>
          <div className={styles.empleadoInner}>
            <img src={viaje.Usuario?.foto_perfil || AVATAR_DEFAULT} alt="empleado" className={styles.avatar} style={{ borderColor: COLORS.primary }} />
            <div className={styles.empleadoInfo}>
              <p className={styles.empleadoLabel} style={{ color: COLORS.secondary }}>Empleado</p>
              <p className={styles.empleadoNombre} style={{ color: COLORS.text }}>{viaje.Usuario?.nombre} {viaje.Usuario?.apellido_paterno}</p>
              <p className={styles.empleadoCargo} style={{ color: COLORS.labels }}>{viaje.Usuario?.Cargo?.nombre}</p>
            </div>
            <span className={styles.estadoBadge} style={{ backgroundColor: estadoActual.bg, color: estadoActual.color }}>{estadoActual.label}</span>
          </div>

          <p className={styles.motivoLabel} style={{ color: COLORS.secondary }}>Motivo del Viaje</p>
          <p className={styles.motivoTexto} style={{ color: COLORS.text }}>{viaje.motivo}</p>

          <div className={styles.divider} style={{ borderColor: COLORS.dataFields }} />

          <div className={styles.infoGrid}>
            <div>
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Período</p>
              <p className={styles.infoValor} style={{ color: COLORS.text }}>{formatFecha(viaje.fecha_inicio)} - {formatFecha(viaje.fecha_fin)}</p>
            </div>
            <div>
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Tipo</p>
              <p className={styles.infoValor} style={{ color: COLORS.text, display: 'flex', alignItems: 'center', gap: 4 }}>
                {esInternacional ? <Globe size={13} style={{ color: COLORS.primary }} /> : <MapPin size={13} style={{ color: COLORS.title }} />}
                {viaje.tipo}
              </p>
            </div>
            <div>
              <p className={styles.infoLabel} style={{ color: COLORS.secondary }}>Transporte</p>
              <p className={styles.infoValor} style={{ color: COLORS.text }}>{viaje.transporte || '—'}</p>
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
          <p className={styles.exitoBadge} style={{ backgroundColor: accionCompletada === 'APROBADO_VIAJE' ? '#d4edda' : '#ffa7a8aa', color: accionCompletada === 'APROBADO_VIAJE' ? '#155724' : '#500203' }}>
            {accionCompletada === 'APROBADO_VIAJE' ? 'Viaje aprobado correctamente' : 'Viaje rechazado correctamente'}
          </p>
        )}

        {esPendiente && sinAsignar && !accionCompletada && (
          <div className="mb-4">
            <p className="text-sm font-inter mb-3 text-center" style={{ color: COLORS.labels }}>
              Este viaje no está asignado. Asígnate para poder aprobarlo o rechazarlo.
            </p>
            <button className={styles.accionBtn} style={{ backgroundColor: COLORS.primary, color: COLORS.background, opacity: tomando ? 0.7 : 1, width: '100%' }} onClick={handleAsignarme} disabled={tomando}>
              {tomando ? 'Asignando...' : 'Asignarme este viaje'}
            </button>
          </div>
        )}

        {puedeAccionar && !accionCompletada && (
          <div className="mb-4">
            <div className={styles.accionesRow}>
              <button className={styles.accionBtn} style={{ backgroundColor: COLORS.primary, color: COLORS.background }} onClick={() => setShowAprobar(true)}>Aprobar Viaje</button>
              <button className={styles.accionBtn} style={{ backgroundColor: 'transparent', borderWidth: 2, borderStyle: 'solid', borderColor: COLORS.secondary, color: COLORS.secondary }} onClick={handlePedirRechazar}>Rechazar</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmarAprobarModal isOpen={showAprobar} onClose={() => setShowAprobar(false)} onConfirm={handleAprobar} loading={loadingAccion} />
      <ConfirmarRechazarModal isOpen={showRechazar} onClose={() => setShowRechazar(false)} onConfirm={handleRechazar} loading={loadingAccion} />
      <SinObservacionesModal isOpen={showSinObservaciones} onClose={() => setShowSinObservaciones(false)} />
      <AgregarComentarioModal isOpen={showAgregarObs} onClose={() => { setShowAgregarObs(false); editarObservacion(0, '') }} onConfirm={handleAgregarComentario} observaciones={observaciones} onEditar={editarObservacion} loading={loadingAccion} error={errorModal} />
      <EditarComentarioModal isOpen={!!comentarioEditando} onClose={() => { setComentarioEditando(null); setTextoEdicion(''); setObsSeleccionada(null) }} onConfirm={handleConfirmarEdicion} texto={textoEdicion} setTexto={setTextoEdicion} loading={loadingAccion} error={errorModal} />
      <ConfirmarEliminarComentarioModal isOpen={!!comentarioEliminando} onClose={() => { setComentarioEliminando(null); setObsSeleccionada(null) }} onConfirm={handleConfirmarEliminacion} loading={loadingAccion} />
      <Footer />
    </div>
  )
}

export default DetalleViajePrevioSupervisorPage;