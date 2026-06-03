import useDashboard from '../hooks/useDashboard'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import ViajeEnCursoCard from '../features/Dashboard_Empleado/ViajeEnCursoCard'
import ViajeRecienteItem from '../features/Dashboard_Empleado/ViajeRecienteItem'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import useMenu from '../hooks/useMenu'
import useContraseniavencida from '../hooks/useContraseniavencida'
import ContraseniavencidaModal from '../features/Login/ContraseniavencidaModal'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import { COLORS } from '../constants'
import { useNavigate } from 'react-router-dom'

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 max-w-8xl mx-auto w-full",
  greeting: "text-3xl font-bold font-inter mb-1",
  subtitle: "text-md font-inter mb-6",
  sectionLabel: "text-sm font-bold font-inter uppercase mb-8",
  newTripBtn: "flex items-center gap-2 text-white font-bold font-nunito text-md py-2 px-5 rounded-lg cursor-pointer transition-colors w-58 md:w-60",
  headerRow: "flex flex-col md:flex-row md:items-center md:justify-between mb-5",
  viajesHeader: "flex items-center justify-between mt-8 mb-3",
  verTodo: "text-xs font-bold font-inter cursor-pointer",
  emptyRecientes: "rounded-xl p-8 text-white text-center flex flex-col items-center gap-2",
  recientesWrapper: "rounded-xl overflow-hidden",
  recientesInner: "px-0",
}

function DashboardEmpleadoPage() {
  const navigate = useNavigate()
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { viajesEnCurso, viajesMostrados, viajesRecientes, showAllViajes, toggleVerTodo, loading } = useDashboard()
  const { showModal, loading: loadingCambio, error: errorCambio, handleCambio } = useContraseniavencida()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <p className="font-inter text-sm" style={{ color: COLORS.labels }}>Cargando...</p>
      </div>
    )
  }

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <ContraseniavencidaModal isOpen={showModal} onConfirm={handleCambio} loading={loadingCambio} error={errorCambio} />
      <Navbar text="Gestor de Viajes" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.greeting} style={{ color: COLORS.backgroundSecondary }}>
              Hola, {usuario?.nombre}
            </h1>
            <p className={styles.subtitle} style={{ color: COLORS.title }}>
              Gestiona tus viajes y gastos corporativos aquí.
            </p>
          </div>
          <button
            className={styles.newTripBtn}
            style={{ backgroundColor: COLORS.primary }}
            onClick={() => navigate('/dashboard/empleado/crear-viaje')}
          >
            <span className="w-8 h-8 text-sm bg-white rounded-full inline-flex items-center justify-center" style={{ color: COLORS.primary }}>
              +
            </span>
            Crear Nuevo Viaje
          </button>
        </div>

        <p className={styles.sectionLabel} style={{ color: COLORS.title }}>Viajes en Curso</p>

        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {viajesEnCurso.length > 0 ? (
              viajesEnCurso.map((v) => (
                <div key={v.id_viaje} className="snap-start shrink-0 w-full md:w-[450px]">
                  <ViajeEnCursoCard viaje={v} />
                </div>
              ))
            ) : (
              <div className="w-full">
                <ViajeEnCursoCard viaje={null} />
              </div>
            )}
          </div>
        </div>

        <div className={styles.viajesHeader}>
          <p className={styles.sectionLabel} style={{ color: COLORS.title }}>Viajes Recientes</p>
          {viajesRecientes.length > 3 && (
            <span className={styles.verTodo} style={{ color: COLORS.secondary }} onClick={toggleVerTodo}>
              {showAllViajes ? 'VER MENOS' : 'VER TODO'}
            </span>
          )}
        </div>

        <div className={styles.recientesWrapper} style={{ backgroundColor: COLORS.background }}>
          {viajesMostrados.length > 0 ? (
            <div className={styles.recientesInner}>
              {viajesMostrados.map((viaje) => (
                <ViajeRecienteItem
                  key={viaje.id_viaje}
                  viaje={viaje}
                  from="/dashboard/empleado"
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyRecientes} style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.title})` }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.1)" />
                <path d="M12 28L16 16L20 22L25 13L28 28H12Z" fill="rgba(255,255,255,0.6)" />
              </svg>
              <p className="font-inter font-bold text-base text-white">Sin viajes recientes</p>
              <p className="font-inter text-xs text-white opacity-70">Aún no tienes viajes registrados</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default DashboardEmpleadoPage;