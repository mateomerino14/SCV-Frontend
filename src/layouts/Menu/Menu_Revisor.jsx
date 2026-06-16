import { useNavigate, useLocation } from 'react-router-dom'
import { ClipboardList, BookOpen, Briefcase, Plane, User, Settings, LogOut, X } from 'lucide-react'
import { COLORS } from '../../constants'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

const styles = {
  overlay: 'fixed inset-0 z-50',
  backdrop: 'absolute inset-0',
  drawer: 'absolute top-0 left-0 h-full w-72 flex flex-col shadow-2xl',
  header: 'flex items-center gap-3 p-5 border-b',
  avatar: 'w-12 h-12 rounded-full object-cover border-2',
  headerInfo: 'flex flex-col flex-1',
  headerNombre: 'text-sm font-bold font-inter',
  headerCargo: 'text-xs font-inter uppercase',
  closeBtn: 'cursor-pointer shrink-0',
  nav: 'flex flex-col gap-1 p-4 flex-1',
  opcion: 'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors',
  opcionLabel: 'text-sm font-bold font-inter',
  separador: 'border-t mx-4 my-2',
  cerrarBtn: 'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer mx-4 mb-4',
  cerrarLabel: 'text-sm font-bold font-inter',
}

const opciones = [
  { path: '/dashboard/revisor', label: 'Solicitudes Pendientes', icono: ClipboardList },
  { path: '/dashboard/revisor/historial', label: 'Mis Revisiones', icono: BookOpen },
  { path: '/dashboard/empleado', label: 'Viajes Personales', icono: Briefcase },
  { path: '/dashboard/empleado/historial', label: 'Mis Viajes', icono: Plane },
  { path: '/dashboard/revisor/perfil', label: 'Perfil', icono: User },
  { path: '/dashboard/revisor/configuracion', label: 'Ajustes', icono: Settings },
]

function MenuRevisor({ isOpen, onClose, usuario }) {
  const navigate = useNavigate()
  const location = useLocation()

  if (!isOpen) return null

  const handleNavegar = (path) => { navigate(path); onClose() }
  const handleCerrarSesion = () => { localStorage.removeItem('token'); navigate('/') }

  const esActivo = (path) => {
    if (path === '/dashboard/revisor' || path === '/dashboard/empleado') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

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
        <div className={styles.nav}>
          {opciones.map(({ path, label, icono: Icono }) => (
            <div
              key={path}
              className={styles.opcion}
              style={{ backgroundColor: esActivo(path) ? COLORS.backgroundHeader : 'transparent' }}
              onClick={() => handleNavegar(path)}
            >
              <Icono size={20} style={{ color: esActivo(path) ? COLORS.primary : COLORS.labels }} />
              <p className={styles.opcionLabel} style={{ color: esActivo(path) ? COLORS.primary : COLORS.text }}>{label}</p>
            </div>
          ))}
        </div>
        <div className={styles.separador} style={{ borderColor: COLORS.dataFields }} />
        <div className={styles.cerrarBtn} onClick={handleCerrarSesion}>
          <LogOut size={20} style={{ color: COLORS.secondary }} />
          <p className={styles.cerrarLabel} style={{ color: COLORS.secondary }}>Cerrar Sesión</p>
        </div>
      </div>
    </div>
  )
}

export default MenuRevisor;