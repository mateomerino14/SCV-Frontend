import { useEffect, useState } from 'react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import FiltrosHistorial from '../features/Revisiones/FiltrosHistorial'
import ViajeHistorialItem from '../features/Revisiones/ViajeHistorialItem'
import EmptyState from '../components/ui/EmptyState'
import useHistorialRevisiones from '../hooks/useHistorialRevisiones'
import useMenu from '../hooks/useMenu'
import { getEmpleados } from '../services/supervisorService'
import { COLORS } from '../constants'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  planLabel: 'text-xs font-semibold font-inter uppercase mb-2 tracking-wide',
  title: 'text-3xl font-bold font-inter mb-2',
  subtitulo: 'text-sm font-inter mb-5',
  totalBadge: 'inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-5',
  totalTexto: 'text-sm font-bold font-inter',
  emptyMsg: 'text-sm font-inter text-center py-8',
  grid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3',
}

function HistorialRevisionesPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { viajes, totalViajes, loading, error, filtros, setFiltros, filtroEstado, setFiltroEstado, aplicarFiltros, limpiarFiltros } = useHistorialRevisiones()
  const [empleados, setEmpleados] = useState([])

  useEffect(() => {
    getEmpleados().then((data) => {
      if (!data.error) setEmpleados(data)
    })
  }, [])

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Historial de Revisiones" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Solicitudes Atendidas</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Revisiones Realizadas</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.labels }}>Consulta el historial de viajes revisados.</p>

        <FiltrosHistorial
          filtros={filtros}
          setFiltros={setFiltros}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          onAplicar={aplicarFiltros}
          onLimpiar={limpiarFiltros}
          empleados={empleados}
        />

        <div className={styles.totalBadge} style={{ backgroundColor: COLORS.backgroundHeader }}>
          <p className={styles.totalTexto} style={{ color: COLORS.labels }}>{totalViajes} Revisiones</p>
        </div>

        {loading && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>Cargando...</p>}

        {!loading && viajes.length === 0 && (
          <EmptyState
            titulo="Sin revisiones realizadas"
            subtitulo="Aún no has procesado ninguna solicitud de viaje"
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
              <ViajeHistorialItem
                key={viaje.id_viaje}
                viaje={viaje}
                rutaDetalle={`/dashboard/supervisor/revision/${viaje.id_viaje}`}
                origenDetalle="/dashboard/supervisor/historial"
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