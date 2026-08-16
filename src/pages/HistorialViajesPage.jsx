import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import FiltroTabs from '../features/Historial_Viajes/FiltroTabs'
import ViajeRecienteItem from '../features/Dashboard_Empleado/ViajeRecienteItem'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import EmptyState from '../components/ui/EmptyState'
import useHistorialViajes from '../hooks/useHistorialViajes'
import useMenu from '../hooks/useMenu'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import { COLORS } from '../constants'

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full",
  planLabel: "text-xs font-semibold font-inter uppercase mb-2 tracking-wide",
  title: "text-3xl font-bold font-inter mb-6",
  emptyMsg: "text-sm font-inter text-center py-8",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  totalTexto: "text-xs font-inter mb-3",
  cargarMasBtn: "w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border mt-3",
}

function HistorialViajesPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const {
    viajesFiltrados, totalFiltrados, hayMasPaginas, cargarMas,
    loading, cargandoMas, error, filtro, setFiltro,
  } = useHistorialViajes()

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Viajes" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Historial Corporativo</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Mis Viajes</h1>

        <FiltroTabs filtroActivo={filtro} onChange={setFiltro} />

        {loading && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>Cargando...</p>}

        {error && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error}
          </p>
        )}

        {!loading && totalFiltrados > 0 && (
          <p className={styles.totalTexto} style={{ color: COLORS.labels }}>
            Mostrando {viajesFiltrados.length} de {totalFiltrados} viajes
          </p>
        )}

        {!loading && viajesFiltrados.length === 0 && (
          <EmptyState
            titulo="Sin viajes registrados"
            subtitulo="Aún no tienes viajes en esta categoría"
            icono={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C16 4 8 12 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 12 16 4 16 4Z" fill="rgba(255,255,255,0.5)" />
                <circle cx="16" cy="18" r="3" fill="rgba(255,255,255,0.9)" />
              </svg>
            }
          />
        )}

        {!loading && viajesFiltrados.map((viaje) => (
          <ViajeRecienteItem
            key={viaje.id_viaje}
            viaje={viaje}
            from="/dashboard/empleado/historial"
          />
        ))}

        {!loading && hayMasPaginas && (
          <button
            className={styles.cargarMasBtn}
            style={{ borderColor: COLORS.primary, color: COLORS.primary, opacity: cargandoMas ? 0.6 : 1 }}
            onClick={cargarMas}
            disabled={cargandoMas}
          >
            {cargandoMas ? 'Cargando...' : 'Cargar más viajes'}
          </button>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default HistorialViajesPage;