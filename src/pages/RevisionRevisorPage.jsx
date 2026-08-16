import { Globe, MapPin } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import FiltrosPendientes from '../features/Revisiones/FiltrosPendientes'
import ViajeRevisionItem from '../features/Revisiones/ViajeRevisionItem'
import EmptyState from '../components/ui/EmptyState'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import ContraseniavencidaModal from '../features/Login/ContraseniavencidaModal'
import useRevisionRevisor from '../hooks/useRevisionRevisor'
import useMenu from '../hooks/useMenu'
import useContraseniavencida from '../hooks/useContraseniavencida'
import { COLORS } from '../constants'

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  planLabel: 'text-xs font-semibold font-inter uppercase mb-2 tracking-wide',
  title: 'text-3xl font-bold font-inter mb-1',
  subtitulo: 'text-sm font-inter mb-5',
  tabsRow: 'flex gap-2 mb-5',
  tab: 'px-4 py-2 rounded-xl text-sm font-bold font-inter cursor-pointer border',
  totalCard: 'rounded-2xl p-5 mb-5',
  totalLabel: 'text-xs font-bold font-inter uppercase mb-1',
  totalNumero: 'text-4xl font-bold font-inter',
  totalSub: 'text-sm font-inter mt-0.5',
  emptyMsg: 'text-sm font-inter text-center py-8',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-3',
  seccionTitulo: 'text-sm font-bold font-inter uppercase mb-3 mt-6 flex items-center gap-2',
  grid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3',
}

function RevisionRevisorPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { showModal, loading: loadingCambio, error: errorCambio, handleCambio } = useContraseniavencida()
  const {
    viajes, totalPendientes, empleados, loading, error,
    filtros, setFiltros, filtroEstado, setFiltroEstado,
    tab, setTab,
    aplicarFiltros, limpiarFiltros,
  } = useRevisionRevisor()

  const viajesNacionales = viajes.filter(v => v.tipo !== 'Internacional')
  const viajesInternacionales = viajes.filter(v => v.tipo === 'Internacional')
  const esPendientes = tab === 'PENDIENTES'

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <ContraseniavencidaModal isOpen={showModal} onConfirm={handleCambio} loading={loadingCambio} error={errorCambio} />
      <Navbar text="Revisión Final" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Revisión Final</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Rendiciones de Gastos</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.text_enviroment_types }}>
          Revisa y aprueba o rechaza los viajes, o consulta tu historial de revisiones.
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

        <FiltrosPendientes
          filtros={filtros}
          setFiltros={setFiltros}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          onAplicar={aplicarFiltros}
          onLimpiar={limpiarFiltros}
          empleados={empleados}
          tabsVariant={esPendientes ? 'PENDIENTES' : 'HISTORIAL'}
        />

        {esPendientes && (
          <div className={styles.totalCard} style={{ backgroundColor: COLORS.secondary }}>
            <p className={styles.totalLabel} style={{ color: 'rgba(255,255,255,0.7)' }}>Total a Revisar</p>
            <p className={styles.totalNumero} style={{ color: COLORS.background }}>{totalPendientes}</p>
            <p className={styles.totalSub} style={{ color: 'rgba(255,255,255,0.8)' }}>Solicitudes</p>
          </div>
        )}

        {loading && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>Cargando...</p>}
        {error && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error}
          </p>
        )}

        {!loading && viajes.length === 0 && (
          <EmptyState
            titulo={esPendientes ? 'Sin solicitudes pendientes' : 'Sin historial aún'}
            subtitulo={esPendientes ? 'No hay viajes esperando revisión final en este momento' : 'Aún no procesaste ninguna rendición'}
            icono={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 26L10 14L16 20L22 10L26 26H6Z" fill="rgba(255,255,255,0.6)" />
                <circle cx="22" cy="8" r="3" fill="rgba(255,255,255,0.4)" />
              </svg>
            }
          />
        )}

        {!loading && viajesNacionales.length > 0 && (
          <>
            <p className={styles.seccionTitulo} style={{ color: COLORS.title }}>
              <MapPin size={15} style={{ color: COLORS.title }} />
              Viajes Nacionales
            </p>
            <div className={styles.grid}>
              {viajesNacionales.map((viaje) => (
                <ViajeRevisionItem
                  key={viaje.id_viaje}
                  viaje={viaje}
                  rutaDetalle={`/dashboard/revisor/revision/${viaje.id_viaje}`}
                  origenDetalle="/dashboard/revisor"
                />
              ))}
            </div>
          </>
        )}

        {!loading && viajesInternacionales.length > 0 && (
          <>
            <p className={styles.seccionTitulo} style={{ color: COLORS.primary }}>
              <Globe size={15} style={{ color: COLORS.primary }} />
              Viajes Internacionales
            </p>
            <div className={styles.grid}>
              {viajesInternacionales.map((viaje) => (
                <ViajeRevisionItem
                  key={viaje.id_viaje}
                  viaje={viaje}
                  rutaDetalle={`/dashboard/revisor/revision/${viaje.id_viaje}`}
                  origenDetalle="/dashboard/revisor"
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default RevisionRevisorPage;