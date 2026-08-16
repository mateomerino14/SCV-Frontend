import { useNavigate, useLocation } from 'react-router-dom'
import { ClipboardCheck, Briefcase, Plane, User, Settings, LogOut, X, Wallet } from 'lucide-react'
import { COLORS } from '../../constants'
import useEsTesorero from '../../hooks/useEsTesorero'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

const styles = {
  overlay: 'fixed inset-0 z-50',
  backdrop: 'absolute inset-0',
  drawer: 'absolute top-0 left-0 h-screen w-72 flex flex-col shadow-2xl',
  header: 'flex items-center gap-3 p-5 border-b shrink-0',
  avatar: 'w-12 h-12 rounded-full object-cover border-2',
  headerInfo: 'flex flex-col flex-1',
  headerNombre: 'text-sm font-bold font-inter',
  headerCargo: 'text-xs font-inter uppercase',
  closeBtn: 'cursor-pointer shrink-0',
  navScroll: 'flex-1 overflow-y-auto',
  nav: 'flex flex-col gap-1 p-4',
  grupo: 'flex flex-col gap-1 pb-1 mb-1 border-b',
  grupoUltimo: 'flex flex-col gap-1',
  seccionLabel: 'text-xs font-bold font-inter uppercase px-4 pt-2 pb-1 opacity-60',
  opcion: 'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors',
  opcionLabel: 'text-sm font-bold font-inter',
  cerrarBtn: 'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer mx-4 mb-4 shrink-0',
  cerrarLabel: 'text-sm font-bold font-inter',
  separadorFinal: 'border-t',
}

const seccionAprobacion = [
  { path: '/dashboard/aprobador/revisiones', label: 'Revisiones Pendientes', icono: ClipboardCheck },
]

const seccionFondos = [
  { path: '/dashboard/tesorero/revisiones', label: 'Aprobación de Fondos', icono: Wallet },
]

const seccionPersonal = [
  { path: '/dashboard/empleado', label: 'Viajes Personales', icono: Briefcase },
  { path: '/dashboard/empleado/historial', label: 'Mis Viajes', icono: Plane },
]

const seccionCuenta = [
  { path: '/dashboard/aprobador/perfil', label: 'Perfil', icono: User },
  { path: '/dashboard/aprobador/configuracion', label: 'Ajustes', icono: Settings },
]

function MenuAprobador({ isOpen, onClose, usuario }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { esTesorero } = useEsTesorero()

  if (!isOpen) return null

  const handleNavegar = (path) => { navigate(path); onClose() }
  const handleCerrarSesion = () => { localStorage.removeItem('token'); navigate('/') }

  const esActivo = (path) => {
    if (['/dashboard/empleado'].includes(path)) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const renderOpciones = (opciones) => opciones.map(({ path, label, icono: Icono }) => (
    <div
      key={path}
      className={styles.opcion}
      style={{ backgroundColor: esActivo(path) ? COLORS.backgroundHeader : 'transparent' }}
      onClick={() => handleNavegar(path)}
    >
      <Icono size={20} style={{ color: esActivo(path) ? COLORS.primary : COLORS.labels }} />
      <p className={styles.opcionLabel} style={{ color: esActivo(path) ? COLORS.primary : COLORS.text }}>{label}</p>
    </div>
  ))

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div className={styles.drawer} style={{ backgroundColor: COLORS.background }}>
        <div className={styles.header} style={{ borderColor: COLORS.dataFields }}>
          <img src={usuario?.foto_perfil || AVATAR_DEFAULT} alt="avatar" className={styles.avatar} style={{ borderColor: COLORS.primary }} />
          <div className={styles.headerInfo}>
            <p className={styles.headerNombre} style={{ color: COLORS.text }}>
              {usuario?.nombre && usuario?.apellido_paterno ? `${usuario.nombre} ${usuario.apellido_paterno}` : 'Usuario'}
            </p>
            <p className={styles.headerCargo} style={{ color: COLORS.labels }}>{usuario?.Cargo?.nombre || ''}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} style={{ color: COLORS.labels }} />
          </button>
        </div>

        <div className={styles.navScroll}>
          <div className={styles.nav}>
            <div className={styles.grupo} style={{ borderColor: COLORS.dataFields }}>
              <p className={styles.seccionLabel} style={{ color: COLORS.labels }}>Aprobación de Viajes</p>
              {renderOpciones(seccionAprobacion)}
            </div>

            {esTesorero && (
              <div className={styles.grupo} style={{ borderColor: COLORS.dataFields }}>
                <p className={styles.seccionLabel} style={{ color: COLORS.labels }}>Aprobación de Fondos</p>
                {renderOpciones(seccionFondos)}
              </div>
            )}

            <div className={styles.grupo} style={{ borderColor: COLORS.dataFields }}>
              <p className={styles.seccionLabel} style={{ color: COLORS.labels }}>Mis Viajes</p>
              {renderOpciones(seccionPersonal)}
            </div>

            <div className={styles.grupoUltimo}>
              <p className={styles.seccionLabel} style={{ color: COLORS.labels }}>Cuenta</p>
              {renderOpciones(seccionCuenta)}
            </div>
          </div>
        </div>

        <div className={styles.separadorFinal} style={{ borderColor: COLORS.dataFields }} />
        <div className={styles.cerrarBtn} onClick={handleCerrarSesion}>
          <LogOut size={20} style={{ color: COLORS.secondary }} />
          <p className={styles.cerrarLabel} style={{ color: COLORS.secondary }}>Cerrar Sesión</p>
        </div>
      </div>
    </div>
  )
}

export default MenuAprobador;