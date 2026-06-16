import { useEffect, useState } from 'react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import FiltrosHistorial from '../features/Revisiones/FiltrosHistorial'
import ViajeRevisionItem from '../features/Revisiones/ViajeRevisionItem'
import EmptyState from '../components/ui/EmptyState'
import useHistorialRevisiones from '../hooks/useHistorialRevisiones'
import useMenu from '../hooks/useMenu'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import { getEmpleados, devolverRevision } from '../services/supervisorService'
import { COLORS } from '../constants'

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  planLabel: 'text-xs font-semibold font-inter uppercase mb-2 tracking-wide',
  title: 'text-3xl font-bold font-inter mb-2',
  subtitulo: 'text-sm font-inter mb-5',
  totalBadge: 'inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-5',
  totalTexto: 'text-sm font-bold font-inter',
  emptyMsg: 'text-sm font-inter text-center py-8',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-3',
  grid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3',
}

function HistorialRevisionesPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { viajes, totalViajes, loading, error, filtros, setFiltros, filtroEstado, setFiltroEstado, aplicarFiltros, limpiarFiltros, recargar } = useHistorialRevisiones()
  const [empleados, setEmpleados] = useState([])
  const [errorDevolver, setErrorDevolver] = useState('')

  useEffect(() => {
    getEmpleados().then((data) => { if (!data.error) setEmpleados(data) })
  }, [])

  const handleDevolver = async (id_viaje) => {
    const data = await devolverRevision(id_viaje)
    if (data.error) {
      setErrorDevolver(data.error)
      setTimeout(() => setErrorDevolver(''), 3000)
      return
    }
    recargar()
  }

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Mis Revisiones" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Revisión de Rendiciones</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Mis Revisiones</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.labels }}>
          Viajes que tienes asignados o que ya procesaste.
        </p>

        <FiltrosHistorial
  filtros={filtros}
  setFiltros={setFiltros}
  filtroEstado={filtroEstado}
  setFiltroEstado={setFiltroEstado}
  onAplicar={aplicarFiltros}
  onLimpiar={limpiarFiltros}
  empleados={empleados}
  tabs={[
  { valor: 'EN_REVISION', label: 'En Proceso' },
  { valor: 'APROBADO_SUPERVISOR', label: 'Aprobado Preliminar' },
  { valor: 'APROBADO_FINAL', label: 'Aprobado Final' },
  { valor: 'RECHAZADO', label: 'Rechazados' },
]}
/>

        <div className={styles.totalBadge} style={{ backgroundColor: COLORS.backgroundHeader }}>
          <p className={styles.totalTexto} style={{ color: COLORS.labels }}>{totalViajes} Revisiones</p>
        </div>

        {loading && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>Cargando...</p>}
        {(error || errorDevolver) && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error || errorDevolver}
          </p>
        )}

        {!loading && viajes.length === 0 && (
          <EmptyState
            titulo="Sin revisiones asignadas"
            subtitulo="Aún no tienes viajes asignados para revisar"
            icono={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="8" width="20" height="16" rx="3" fill="rgba(255,255,255,0.3)" />
                <path d="M10 14H22M10 18H18" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
        )}

        {!loading && viajes.length > 0 && (
          <div className={styles.grid}>
            {viajes.map((viaje) => (
              <ViajeRevisionItem
                key={viaje.id_viaje}
                viaje={viaje}
                rutaDetalle={`/dashboard/supervisor/revision/${viaje.id_viaje}`}
                origenDetalle="/dashboard/supervisor/historial"
                onDevolver={viaje.estado === 'EN_REVISION' ? handleDevolver : undefined}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default HistorialRevisionesPage;