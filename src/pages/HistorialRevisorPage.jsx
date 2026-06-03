import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import ContraseniavencidaModal from '../features/Login/ContraseniavencidaModal'
import ViajeHistorialItem from '../features/Revisiones/ViajeHistorialItem'
import FiltrosHistorial from '../features/Revisiones/FiltrosHistorial'
import useHistorialRevisor from '../hooks/useHistorialRevisor'
import useMenu from '../hooks/useMenu'
import useContraseniavencida from '../hooks/useContraseniavencida'
import { COLORS } from '../constants'

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  planLabel: 'text-xs font-semibold font-inter uppercase mb-2 tracking-wide',
  title: 'text-3xl font-bold font-inter mb-1',
  subtitulo: 'text-sm font-inter mb-5',
  emptyMsg: 'text-sm font-inter text-center py-8',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-3',
}

function HistorialRevisorPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { showModal, loading: loadingCambio, error: errorCambio, handleCambio } = useContraseniavencida()
  const { viajes, empleados, loading, error, filtros, setFiltros, filtroEstado, setFiltroEstado, aplicarFiltros, limpiarFiltros } = useHistorialRevisor()

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <ContraseniavencidaModal isOpen={showModal} onConfirm={handleCambio} loading={loadingCambio} error={errorCambio} />
      <Navbar text="Historial de Revisiones" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Revisión Final</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Historial de Revisiones</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.labels }}>Revisiones finales que has procesado.</p>

        <FiltrosHistorial
          filtros={filtros}
          setFiltros={setFiltros}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          onAplicar={aplicarFiltros}
          onLimpiar={limpiarFiltros}
          empleados={empleados}
          tabs={[
            { valor: 'TODOS', label: 'Todos' },
            { valor: 'APROBADO_FINAL', label: 'Aprobados' },
            { valor: 'RECHAZADO', label: 'Rechazados' },
          ]}
        />

        {loading && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>Cargando...</p>}
        {error && <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>{error}</p>}
        {!loading && viajes.length === 0 && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>No hay revisiones en el historial</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {!loading && viajes.map((viaje) => (
            <ViajeHistorialItem
              key={viaje.id_viaje}
              viaje={viaje}
              rutaDetalle={`/dashboard/revisor/historial/${viaje.id_viaje}`}
              origenDetalle="/dashboard/revisor/historial"
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HistorialRevisorPage;