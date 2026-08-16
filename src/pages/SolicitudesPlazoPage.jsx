import { useState } from 'react'
import { AlertTriangle, Calendar, Navigation, MapPin, Check, X } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import EmptyState from '../components/ui/EmptyState'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import useSolicitudesPlazo from '../hooks/useSolicitudesPlazo'
import useMenu from '../hooks/useMenu'
import { COLORS } from '../constants'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  planLabel: 'text-xs font-semibold font-inter uppercase mb-2 tracking-wide',
  title: 'text-3xl font-bold font-inter mb-1',
  subtitulo: 'text-sm font-inter mb-5',
  tabsRow: 'flex gap-2 mb-5',
  tab: 'px-4 py-2 rounded-xl text-sm font-bold font-inter cursor-pointer border',
  card: 'rounded-2xl p-4 shadow-sm border mb-3',
  empleadoRow: 'flex items-center gap-3 mb-3',
  avatar: 'w-11 h-11 rounded-full object-cover border-2 shrink-0',
  nombre: 'text-sm font-bold font-inter',
  cargo: 'text-xs font-inter',
  estadoBadge: 'text-xs font-bold font-inter px-2 py-1 rounded-lg ml-auto',
  motivoBox: 'rounded-xl p-3 mb-3',
  motivoLabel: 'text-xs font-bold font-inter uppercase mb-1',
  motivoTexto: 'text-sm font-inter',
  rutaRow: 'flex items-center gap-1 mb-2 flex-wrap',
  rutaTxt: 'text-sm font-inter',
  fechaRow: 'flex items-center gap-1 mb-1',
  fechaTxt: 'text-xs font-inter',
  accionesRow: 'flex gap-2',
  accionBtn: 'flex-1 py-2 rounded-xl font-bold font-nunito text-sm cursor-pointer flex items-center justify-center gap-1',
  rechazoBox: 'rounded-xl p-3 flex flex-col gap-2 mt-2',
  textarea: 'w-full rounded-xl p-3 text-sm font-inter outline-none border resize-none',
  emptyMsg: 'text-sm font-inter text-center py-8',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-3',
}

const estadoConfig = {
  PENDIENTE: { label: 'Pendiente', bg: '#ffd700aa', color: '#7a5900' },
  APROBADA: { label: 'Aprobada', bg: '#d4edda', color: '#155724' },
  RECHAZADA: { label: 'Rechazada', bg: '#ffa7a8aa', color: '#500203' },
}

const formatFecha = (f) =>
  new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const formatFechaViaje = (f) => {
  const [y, m, d] = f.split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function SolicitudesPlazoPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { viajes, totalPendientes, loading, loadingAccion, error, tab, setTab, handleAprobar, handleRechazar } = useSolicitudesPlazo()
  const [rechazandoId, setRechazandoId] = useState(null)
  const [observacion, setObservacion] = useState('')

  const confirmarRechazo = async (id_solicitud) => {
    if (!observacion.trim()) return
    const ok = await handleRechazar(id_solicitud, observacion)
    if (ok) { setRechazandoId(null); setObservacion('') }
  }

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Solicitudes de Plazo" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Rendición de Gastos</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Solicitudes de Plazo</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.labels }}>
          Empleados que exceden el plazo de tolerancia y necesitan autorización para seguir registrando gastos.
        </p>

        <div className={styles.tabsRow}>
          <button
            className={styles.tab}
            style={{
              backgroundColor: tab === 'PENDIENTES' ? COLORS.primary : 'transparent',
              borderColor: tab === 'PENDIENTES' ? COLORS.primary : COLORS.dataFields,
              color: tab === 'PENDIENTES' ? COLORS.background : COLORS.labels,
            }}
            onClick={() => setTab('PENDIENTES')}
          >
            Pendientes ({totalPendientes})
          </button>
          <button
            className={styles.tab}
            style={{
              backgroundColor: tab === 'HISTORIAL' ? COLORS.primary : 'transparent',
              borderColor: tab === 'HISTORIAL' ? COLORS.primary : COLORS.dataFields,
              color: tab === 'HISTORIAL' ? COLORS.background : COLORS.labels,
            }}
            onClick={() => setTab('HISTORIAL')}
          >
            Historial
          </button>
        </div>

        {loading && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>Cargando...</p>}
        {error && <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>{error}</p>}

        {!loading && viajes.length === 0 && (
          <EmptyState
            titulo="Sin solicitudes"
            subtitulo={tab === 'PENDIENTES' ? 'No hay solicitudes pendientes' : 'Aún no procesaste ninguna solicitud'}
            icono={<AlertTriangle size={28} style={{ color: 'rgba(255,255,255,0.6)' }} />}
          />
        )}

        {!loading && viajes.map((s) => {
          const empleado = s.Viaje?.Usuario
          const estado = estadoConfig[s.estado]
          const viaje = s.Viaje
          return (
            <div key={s.id_solicitud} className={styles.card} style={{ borderColor: COLORS.dataFields, backgroundColor: COLORS.background }}>
              <div className={styles.empleadoRow}>
                <img src={empleado?.foto_perfil || AVATAR_DEFAULT} alt="empleado" className={styles.avatar} style={{ borderColor: COLORS.primary }} />
                <div>
                  <p className={styles.nombre} style={{ color: COLORS.text }}>{empleado?.nombre} {empleado?.apellido_paterno}</p>
                  <p className={styles.cargo} style={{ color: COLORS.labels }}>{empleado?.Cargo?.nombre}</p>
                </div>
                <span className={styles.estadoBadge} style={{ backgroundColor: estado.bg, color: estado.color }}>{estado.label}</span>
              </div>

              <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter', color: COLORS.text, marginBottom: 8 }}>
                {viaje?.motivo}
              </p>

              {viaje?.origen ? (
                <div className={styles.rutaRow}>
                  <Navigation size={12} style={{ color: COLORS.labels }} />
                  <span className={styles.rutaTxt} style={{ color: COLORS.text }}>{viaje.origen}</span>
                  <span style={{ color: COLORS.dataFields, margin: '0 2px' }}>→</span>
                  <MapPin size={12} style={{ color: COLORS.secondary }} />
                  <span className={styles.rutaTxt} style={{ color: COLORS.text }}>{viaje.destino}</span>
                </div>
              ) : (
                <div className={styles.rutaRow}>
                  <MapPin size={12} style={{ color: COLORS.secondary }} />
                  <span className={styles.rutaTxt} style={{ color: COLORS.text }}>{viaje?.destino}</span>
                </div>
              )}

              {viaje?.fecha_inicio && viaje?.fecha_fin && (
                <div className={styles.fechaRow}>
                  <Calendar size={11} style={{ color: COLORS.labels }} />
                  <p className={styles.fechaTxt} style={{ color: COLORS.labels }}>
                    Viaje: {formatFechaViaje(viaje.fecha_inicio)} — {formatFechaViaje(viaje.fecha_fin)}
                  </p>
                </div>
              )}

              <div className={styles.motivoBox} style={{ backgroundColor: COLORS.backgroundHeader, marginTop: 8 }}>
                <p className={styles.motivoLabel} style={{ color: COLORS.secondary }}>Motivo del retraso</p>
                <p className={styles.motivoTexto} style={{ color: COLORS.text }}>{s.motivo}</p>
              </div>

              {s.estado === 'RECHAZADA' && s.observacion_revisor && (
                <div className={styles.motivoBox} style={{ backgroundColor: '#ffa7a8aa' }}>
                  <p className={styles.motivoLabel} style={{ color: '#500203' }}>Tu observación</p>
                  <p className={styles.motivoTexto} style={{ color: '#500203' }}>{s.observacion_revisor}</p>
                </div>
              )}

              <div className={styles.fechaRow}>
                <Calendar size={11} style={{ color: COLORS.labels }} />
                <p className={styles.fechaTxt} style={{ color: COLORS.labels }}>Solicitado el {formatFecha(s.fecha_solicitud)}</p>
              </div>

              {s.estado === 'PENDIENTE' && (
                <>
                  {rechazandoId === s.id_solicitud ? (
                    <div className={styles.rechazoBox} style={{ backgroundColor: COLORS.backgroundHeader }}>
                      <textarea
                        className={styles.textarea}
                        style={{ borderColor: COLORS.dataFields, color: COLORS.text, backgroundColor: COLORS.background }}
                        rows={3}
                        placeholder="Explica por qué rechazas esta solicitud..."
                        value={observacion}
                        maxLength={500}
                        onChange={(e) => setObservacion(e.target.value)}
                      />
                      <div className={styles.accionesRow}>
                        <button
                          className={styles.accionBtn}
                          style={{ backgroundColor: 'transparent', border: `1.5px solid ${COLORS.dataFields}`, color: COLORS.labels }}
                          onClick={() => { setRechazandoId(null); setObservacion('') }}
                        >
                          Cancelar
                        </button>
                        <button
                          className={styles.accionBtn}
                          style={{ backgroundColor: COLORS.secondary, color: COLORS.background, opacity: (!observacion.trim() || loadingAccion) ? 0.6 : 1 }}
                          onClick={() => confirmarRechazo(s.id_solicitud)}
                          disabled={!observacion.trim() || loadingAccion}
                        >
                          Confirmar Rechazo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.accionesRow}>
                      <button
                        className={styles.accionBtn}
                        style={{ backgroundColor: COLORS.primary, color: COLORS.background }}
                        onClick={() => handleAprobar(s.id_solicitud)}
                        disabled={loadingAccion}
                      >
                         Aprobar
                      </button>
                      <button
                        className={styles.accionBtn}
                        style={{ backgroundColor: 'transparent', border: `1.5px solid ${COLORS.secondary}`, color: COLORS.secondary }}
                        onClick={() => setRechazandoId(s.id_solicitud)}
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
      <Footer />
    </div>
  )
}

export default SolicitudesPlazoPage;