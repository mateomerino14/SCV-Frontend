import { useEffect, useState } from 'react'
import { Globe, MapPin } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import FiltrosHistorial from '../features/Revisiones/FiltrosHistorial'
import ViajePreRevisionItem from '../features/Revisiones/ViajePreRevisionItem'
import EmptyState from '../components/ui/EmptyState'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import ContraseniavencidaModal from '../features/Login/ContraseniavencidaModal'
import useRevisionesAprobador from '../hooks/useRevisionesAprobador'
import useMenu from '../hooks/useMenu'
import useContraseniavencida from '../hooks/useContraseniavencida'
import { getEmpleadosAprobador } from '../services/aprobadorService'
import { COLORS } from '../constants'

const styles = {
  page: 'min-h-screen flex flex-col',
  content: 'flex-1 px-5 py-6 w-full',
  planLabel: 'text-xs font-semibold font-inter uppercase mb-2 tracking-wide',
  title: 'text-3xl font-bold font-inter mb-1',
  subtitulo: 'text-sm font-inter mb-5',
  emptyMsg: 'text-sm font-inter text-center py-8',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl mb-3',
  seccionTitulo: 'text-sm font-bold font-inter uppercase mb-3 mt-6 flex items-center gap-2',
  grid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3',
}

const tabsEstado = [
  { valor: 'PENDIENTES', label: 'Pendientes' },
  { valor: 'APROBADOS', label: 'Aprobados' },
  { valor: 'RECHAZADOS', label: 'Rechazados' },
]

function RevisionesAprobadorPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { showModal, loading: loadingCambio, error: errorCambio, handleCambio } = useContraseniavencida()
  const {
    viajes, totalPendientes, totalAprobados, totalRechazados,
    loading, error, tab, setTab,
    filtros, setFiltros, aplicarFiltros, limpiarFiltros,
  } = useRevisionesAprobador()
  const [empleados, setEmpleados] = useState([])

  useEffect(() => {
    getEmpleadosAprobador().then((data) => { if (!data.error) setEmpleados(data) })
  }, [])

  const rutaDetalle = (id) => `/dashboard/aprobador/viaje-previo/${id}`
  const origenDetalle = '/dashboard/aprobador/revisiones'
  const labelDetalle = tab === 'PENDIENTES' ? 'Revisar' : 'Ver Detalle'

  const viajesNacionales = viajes.filter(v => v.tipo !== 'Internacional')
  const viajesInternacionales = viajes.filter(v => v.tipo === 'Internacional')

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <ContraseniavencidaModal isOpen={showModal} onConfirm={handleCambio} loading={loadingCambio} error={errorCambio} />
      <Navbar text="Revisiones Pendientes" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Aprobación de Viajes</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Revisiones Pendientes</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.text_enviroment_types }}>
          Revisa, aprueba o rechaza los viajes, y consulta el historial de tus decisiones.
        </p>

        <FiltrosHistorial
          filtros={filtros}
          setFiltros={setFiltros}
          filtroEstado={tab}
          setFiltroEstado={setTab}
          onAplicar={aplicarFiltros}
          onLimpiar={limpiarFiltros}
          empleados={empleados}
          tabs={tabsEstado}
        />

        {loading && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>Cargando...</p>}
        {error && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error}
          </p>
        )}

        {!loading && viajes.length === 0 && (
          <EmptyState
            titulo="Sin viajes en esta categoría"
            subtitulo={tab === 'PENDIENTES' ? 'No hay viajes esperando aprobación' : 'No tienes viajes con este estado'}
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
                <ViajePreRevisionItem
                  key={viaje.id_viaje}
                  viaje={viaje}
                  rutaDetalle={rutaDetalle(viaje.id_viaje)}
                  origenDetalle={origenDetalle}
                  labelDetalle={labelDetalle}
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
                <ViajePreRevisionItem
                  key={viaje.id_viaje}
                  viaje={viaje}
                  rutaDetalle={rutaDetalle(viaje.id_viaje)}
                  origenDetalle={origenDetalle}
                  labelDetalle={labelDetalle}
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

export default RevisionesAprobadorPage;