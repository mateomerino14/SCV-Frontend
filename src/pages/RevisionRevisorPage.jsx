import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import ContraseniavencidaModal from '../features/Login/ContraseniavencidaModal'
import ViajeRevisionItem from '../features/Revisiones/ViajeRevisionItem'
import useRevisionRevisor from '../hooks/useRevisionRevisor'
import useMenu from '../hooks/useMenu'
import useContraseniavencida from '../hooks/useContraseniavencida'
import FiltrosPendientes from '../features/Revisiones/FiltrosPendientes'
import { COLORS } from '../constants'

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  planLabel: 'text-xs font-semibold font-inter uppercase mb-2 tracking-wide',
  title: 'text-3xl font-bold font-inter mb-1',
  subtitulo: 'text-sm font-inter mb-5',
  totalCard: 'rounded-2xl p-5 mb-5',
  totalLabel: 'text-xs font-bold font-inter uppercase mb-1',
  totalNumero: 'text-4xl font-bold font-inter',
  totalSub: 'text-sm font-inter mt-0.5',
  emptyMsg: 'text-sm font-inter text-center py-8',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-3',
}

function RevisionRevisorPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { showModal, loading: loadingCambio, error: errorCambio, handleCambio } = useContraseniavencida()
  const { viajes, empleados, totalViajes, loading, error, filtros, setFiltros, aplicarFiltros, limpiarFiltros } = useRevisionRevisor()

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <ContraseniavencidaModal isOpen={showModal} onConfirm={handleCambio} loading={loadingCambio} error={errorCambio} />
      <Navbar text="Revisiones Pendientes" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Revisión Final</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Pendientes de Revisión Final</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.text_enviroment_types }}>
          Viajes aprobados por el supervisor que requieren tu revisión final.
        </p>

        <FiltrosPendientes
          filtros={filtros}
          setFiltros={setFiltros}
          onAplicar={aplicarFiltros}
          onLimpiar={limpiarFiltros}
          empleados={empleados}
        />

        <div className={styles.totalCard} style={{ backgroundColor: COLORS.secondary }}>
          <p className={styles.totalLabel} style={{ color: 'rgba(255,255,255,0.7)' }}>Total a Revisar</p>
          <p className={styles.totalNumero} style={{ color: COLORS.background }}>{totalViajes}</p>
          <p className={styles.totalSub} style={{ color: 'rgba(255,255,255,0.8)' }}>Solicitudes</p>
        </div>

        {loading && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>Cargando...</p>}
        {error && <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>{error}</p>}
        {!loading && viajes.length === 0 && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>No hay solicitudes pendientes</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {!loading && viajes.map((viaje) => (
            <ViajeRevisionItem
              key={viaje.id_viaje}
              viaje={viaje}
              rutaDetalle={`/dashboard/revisor/revision/${viaje.id_viaje}`}
              origenDetalle="/dashboard/revisor"
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default RevisionRevisorPage;