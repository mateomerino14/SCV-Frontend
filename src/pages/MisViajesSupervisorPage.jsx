import { useEffect, useState } from 'react'
import { Globe, MapPin } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import FiltrosHistorial from '../features/Revisiones/FiltrosHistorial'
import ViajePreRevisionItem from '../features/Revisiones/ViajePreRevisionItem'
import EmptyState from '../components/ui/EmptyState'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import useMisViajesPreviosSupervisor from '../hooks/useMisViajesPreviosSupervisor'
import useMenu from '../hooks/useMenu'
import { getEmpleados, devolverViajePreRevision } from '../services/supervisorService'
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
  seccionTitulo: 'text-sm font-bold font-inter uppercase mb-3 mt-6 flex items-center gap-2',
  grid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3',
}

const filtrosVacios = { fecha_inicio: '', fecha_fin: '', id_empleado: '' }

const tabsFiltro = [
  { valor: 'EN_REVISION_VIAJE', label: 'En Proceso' },
  { valor: 'APROBADO_VIAJE', label: 'Aprobados' },
  { valor: 'RECHAZADO', label: 'Rechazados' },
]

function MisViajesSupervisorPage() {
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { viajes, loading, error, filtroEstado, setFiltroEstado, recargar } = useMisViajesPreviosSupervisor()
  const [empleados, setEmpleados] = useState([])
  const [filtrosDraft, setFiltrosDraft] = useState(filtrosVacios)
  const [filtrosAplicados, setFiltrosAplicados] = useState(filtrosVacios)
  const [errorDevolver, setErrorDevolver] = useState('')

  useEffect(() => {
    getEmpleados().then((data) => { if (!data.error) setEmpleados(data) })
  }, [])

  const handleDevolver = async (id_viaje) => {
    const data = await devolverViajePreRevision(id_viaje)
    if (data.error) {
      setErrorDevolver(data.error)
      setTimeout(() => setErrorDevolver(''), 3000)
      return
    }
    recargar()
  }

  const aplicarFiltros = () => setFiltrosAplicados({ ...filtrosDraft })
  const limpiarFiltros = () => {
    setFiltrosDraft(filtrosVacios)
    setFiltrosAplicados(filtrosVacios)
  }

  const viajesFiltradosPorFecha = viajes.filter((v) => {
    if (filtrosAplicados.fecha_inicio && v.fecha_inicio < filtrosAplicados.fecha_inicio) return false
    if (filtrosAplicados.fecha_fin && v.fecha_fin > filtrosAplicados.fecha_fin) return false
    if (filtrosAplicados.id_empleado && String(v.id_usuario) !== String(filtrosAplicados.id_empleado)) return false
    return true
  })

  const viajesNacionales = viajesFiltradosPorFecha.filter(v => v.tipo !== 'Internacional')
  const viajesInternacionales = viajesFiltradosPorFecha.filter(v => v.tipo === 'Internacional')

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Aprobación de Viajes" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Aprobación de Viajes</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Mis Viajes Revisados</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.labels }}>
          Viajes que tomaste o procesaste en la fase previa al inicio.
        </p>

        <FiltrosHistorial
          filtros={filtrosDraft}
          setFiltros={setFiltrosDraft}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          onAplicar={aplicarFiltros}
          onLimpiar={limpiarFiltros}
          empleados={empleados}
          tabs={tabsFiltro}
        />

        <div className={styles.totalBadge} style={{ backgroundColor: COLORS.backgroundHeader }}>
          <p className={styles.totalTexto} style={{ color: COLORS.labels }}>{viajesFiltradosPorFecha.length} Viajes</p>
        </div>

        {loading && <p className={styles.emptyMsg} style={{ color: COLORS.labels }}>Cargando...</p>}
        {(error || errorDevolver) && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error || errorDevolver}
          </p>
        )}

        {!loading && viajesFiltradosPorFecha.length === 0 && (
          <EmptyState
            titulo="Sin viajes en esta categoría"
            subtitulo="No tienes viajes con este estado"
            icono={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="8" width="20" height="16" rx="3" fill="rgba(255,255,255,0.3)" />
                <path d="M10 14H22M10 18H18" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" />
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
                  rutaDetalle={`/dashboard/supervisor/viaje-previo/${viaje.id_viaje}`}
                  origenDetalle="/dashboard/supervisor/viajes-historial"
                  onDevolver={viaje.estado === 'EN_REVISION_VIAJE' ? handleDevolver : undefined}
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
                  rutaDetalle={`/dashboard/supervisor/viaje-previo/${viaje.id_viaje}`}
                  origenDetalle="/dashboard/supervisor/viajes-historial"
                  onDevolver={viaje.estado === 'EN_REVISION_VIAJE' ? handleDevolver : undefined}
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

export default MisViajesSupervisorPage;