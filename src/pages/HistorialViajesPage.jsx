import { useNavigate } from 'react-router-dom'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import FiltroTabs from '../features/Historial_Viajes/FiltroTabs'
import ViajeRecienteItem from '../features/Dashboard_Empleado/ViajeRecienteItem'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
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
}

function HistorialViajesPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { viajesFiltrados, loading, error, filtro, setFiltro } = useHistorialViajes()

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

        {!loading && viajesFiltrados.length === 0 && (
          <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>No hay viajes para mostrar</p>
        )}

        {!loading && viajesFiltrados.map((viaje) => (
          <ViajeRecienteItem
            key={viaje.id_viaje}
            viaje={viaje}
            from="/dashboard/empleado/historial"
          />
        ))}
      </div>
      <Footer />
    </div>
  )
}

export default HistorialViajesPage;