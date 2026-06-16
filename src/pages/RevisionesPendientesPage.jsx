import { useEffect, useState } from 'react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import FiltrosPendientes from '../features/Revisiones/FiltrosPendientes'
import ViajeRevisionItem from '../features/Revisiones/ViajeRevisionItem'
import EmptyState from '../components/ui/EmptyState'
import useRevisionesPendientes from '../hooks/useRevisionesPendientes'
import useMenu from '../hooks/useMenu'
import useContraseniavencida from '../hooks/useContraseniavencida'
import ContraseniavencidaModal from '../features/Login/ContraseniavencidaModal'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import { getEmpleados, tomarRevision } from '../services/supervisorService'
import { useNavigate } from 'react-router-dom'
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

function RevisionesPendientesPage() {
  const navigate = useNavigate()
  const { menuAbierto, usuario, abrirMenu, cerrarMenu, sessionExpired, handleSessionExpiredClose } = useMenu()
  const { viajes, totalViajes, loading, error, filtros, setFiltros, filtroEstado, setFiltroEstado, aplicarFiltros, limpiarFiltros, recargar } = useRevisionesPendientes()
  const { showModal, loading: loadingCambio, error: errorCambio, handleCambio } = useContraseniavencida()
  const [empleados, setEmpleados] = useState([])
  const [tomando, setTomando] = useState(null)
  const [errorTomar, setErrorTomar] = useState('')

  useEffect(() => {
    getEmpleados().then((data) => { if (!data.error) setEmpleados(data) })
  }, [])

  const handleTomar = async (id_viaje) => {
  setTomando(id_viaje)
  setErrorTomar('')
  const data = await tomarRevision(id_viaje)
  setTomando(null)
  if (data.error) {
    setErrorTomar(data.error)
    setTimeout(() => setErrorTomar(''), 3000)
    recargar()
    return
  }
  recargar()
}

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <ContraseniavencidaModal isOpen={showModal} onConfirm={handleCambio} loading={loadingCambio} error={errorCambio} />
      <Navbar text="Solicitudes Pendientes" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>
        <p className={styles.planLabel} style={{ color: COLORS.title }}>Revisión de Rendiciones</p>
        <h1 className={styles.title} style={{ color: COLORS.text }}>Solicitudes Pendientes</h1>
        <p className={styles.subtitulo} style={{ color: COLORS.text_enviroment_types }}>
          Asígnate un viaje para revisarlo. Solo tú podrás procesarlo una vez asignado.
        </p>

        <FiltrosPendientes
          filtros={filtros}
          setFiltros={setFiltros}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
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
        {(error || errorTomar) && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error || errorTomar}
          </p>
        )}

        {!loading && viajes.length === 0 && (
          <EmptyState
            titulo="Sin solicitudes pendientes"
            subtitulo="No hay viajes esperando revisión en este momento"
            icono={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 26L10 14L16 20L22 10L26 26H6Z" fill="rgba(255,255,255,0.6)" />
                <circle cx="22" cy="8" r="3" fill="rgba(255,255,255,0.4)" />
              </svg>
            }
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {!loading && viajes.map((viaje) => (
            <ViajeRevisionItem
              key={viaje.id_viaje}
              viaje={viaje}
              rutaDetalle={`/dashboard/supervisor/revision/${viaje.id_viaje}`}
              origenDetalle="/dashboard/supervisor"
              onTomar={handleTomar}
              tomando={tomando === viaje.id_viaje}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default RevisionesPendientesPage;