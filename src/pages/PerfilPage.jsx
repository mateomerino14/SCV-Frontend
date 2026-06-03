import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, Briefcase, Pencil, Check, X, LogOut, Camera, Hash, Layers } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import usePerfil from '../hooks/usePerfil'
import useMenu from '../hooks/useMenu'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'
import { COLORS } from '../constants'

const AVATAR_DEFAULT = "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2558759027.jpg"

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full max-w-md mx-auto",
  avatarWrapper: "flex flex-col items-center mb-6",
  avatarContainer: "relative",
  avatar: "w-28 h-28 rounded-full object-cover border-4 shadow-md",
  editBtn: "absolute bottom-0 right-0 rounded-full p-2 shadow-md cursor-pointer border-2",
  nombre: "text-2xl font-bold font-inter mt-3",
  rolBadge: "flex items-center gap-2 px-4 py-2 rounded-xl mt-2",
  rolLabel: "text-sm font-bold font-inter uppercase",
  rolValor: "text-sm font-bold font-inter",
  seccionCard: "rounded-2xl p-5 shadow-sm mb-4 border",
  seccionLabel: "text-sm font-bold font-inter uppercase mb-3",
  campoWrapper: "flex items-center justify-between py-3 border-b",
  campoWrapperLast: "flex items-center justify-between py-3",
  campoIzq: "flex items-center gap-3 flex-1",
  iconoCampo: "rounded-lg p-2 shrink-0",
  campoInfo: "flex flex-col flex-1",
  campoLabel: "text-xs font-inter uppercase",
  campoValor: "text-sm font-bold font-inter mt-0.5",
  inputEdicion: "text-sm font-inter outline-none bg-transparent border-b w-full",
  accionesEdicion: "flex gap-2 ml-2 shrink-0",
  cerrarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer border flex items-center justify-center gap-2 mt-6",
  errorMsg: "text-xs font-inter italic text-center py-2 px-3 rounded-xl mt-2",
  exitoMsg: "text-sm font-bold font-inter text-center py-2 px-3 rounded-xl mt-2",
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  modalCard: 'items-center flex flex-col p-6 rounded-xl w-80 gap-3',
  modalIconWrapper: 'rounded-full p-4',
  modalTitle: 'text-2xl font-bold font-inter leading-tight text-center mt-2',
  modalLabel: 'font-inter text-center text-sm',
  modalBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer text-center',
}

function FotoModal({ isOpen, onClose, onNueva, onQuitar, guardando }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard} style={{ backgroundColor: COLORS.primary }}>
        <div className={styles.modalIconWrapper} style={{ backgroundColor: COLORS.background }}>
          <Camera size={40} style={{ color: COLORS.backgroundSecondary }} />
        </div>
        <h2 className={styles.modalTitle} style={{ color: COLORS.background }}>
          Foto de Perfil
        </h2>
        <p className={styles.modalLabel} style={{ color: COLORS.backgroundHeader }}>
          ¿Qué deseas hacer con tu foto de perfil?
        </p>
        <div className="flex flex-col gap-2 w-full mt-2">
          <label
            className={styles.modalBtn}
            style={{
              backgroundColor: COLORS.background,
              color: COLORS.secondary,
              cursor: guardando ? 'not-allowed' : 'pointer',
            }}
          >
            Actualizar foto
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={guardando}
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  onNueva(file)
                  e.target.value = ''
                }
              }}
            />
          </label>
          <button
            className={styles.modalBtn}
            style={{ backgroundColor: COLORS.background, color: COLORS.secondary }}
            onClick={onQuitar}
            disabled={guardando}
          >
            Quitar foto
          </button>
          <button
            className={styles.modalBtn}
            style={{ backgroundColor: COLORS.secondary, color: COLORS.background }}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

function PerfilPage() {
  const navigate = useNavigate()
  const { menuAbierto, usuario: usuarioMenu, abrirMenu, cerrarMenu, cargarUsuario, sessionExpired, handleSessionExpiredClose } = useMenu()
  const [showFotoModal, setShowFotoModal] = useState(false)

  const {
    usuario,
    loading,
    error,
    exito,
    guardando,
    telefono, setTelefono,
    email, setEmail,
    editandoTelefono, setEditandoTelefono,
    editandoEmail, setEditandoEmail,
    handleGuardarTelefono,
    handleGuardarEmail,
    handleCancelarTelefono,
    handleCancelarEmail,
    handleCambiarFoto,
    handleQuitarFoto,
  } = usePerfil()

  const handleCerrarSesion = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleNuevaFoto = async (file) => {
    setShowFotoModal(false)
    await handleCambiarFoto(file)
    cargarUsuario()
  }

  const handleQuitarFotoModal = async () => {
    setShowFotoModal(false)
    await handleQuitarFoto()
    cargarUsuario()
  }

  if (loading) {
    return (
      <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
        <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
        <Navbar text="Perfil Corporativo" onMenuClick={abrirMenu} fotoPerfil={usuarioMenu?.foto_perfil} />
        <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: COLORS.labels }}>Cargando...</p>
        </div>
        <Footer />
      </div>
    )
  }

  const nombreCompleto = `${usuario?.nombre || ''} ${usuario?.apellido_paterno || ''}`.trim()
  const tieneCodigos = usuario?.numero_dependencia || usuario?.numero_seccion

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Perfil Corporativo" onMenuClick={abrirMenu} fotoPerfil={usuarioMenu?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <FotoModal
        isOpen={showFotoModal}
        onClose={() => setShowFotoModal(false)}
        onNueva={handleNuevaFoto}
        onQuitar={handleQuitarFotoModal}
        guardando={guardando}
      />

      <div className={styles.content}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarContainer}>
            <img
              src={usuario?.foto_perfil || AVATAR_DEFAULT}
              alt="avatar"
              className={styles.avatar}
              style={{ borderColor: COLORS.primary }}
            />
            <button
              className={styles.editBtn}
              style={{ backgroundColor: COLORS.secondary, borderColor: COLORS.background }}
              onClick={() => setShowFotoModal(true)}
              disabled={guardando}
            >
              <Pencil size={14} style={{ color: COLORS.background }} />
            </button>
          </div>
          <p className={styles.nombre} style={{ color: COLORS.text }}>
            {nombreCompleto}
          </p>
          <div className={styles.rolBadge} style={{ backgroundColor: COLORS.error }}>
            <div className="rounded-full p-2 mr-1" style={{ backgroundColor: COLORS.secondary }}>
              <Briefcase size={20} style={{ color: COLORS.background }} />
            </div>
            <div>
              <p className={styles.rolLabel} style={{ color: COLORS.labels }}>Rol de Sistema</p>
              <p className={styles.rolValor} style={{ color: COLORS.secondary }}>
                {usuario?.Rol?.nombre || 'Usuario'}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.seccionCard} style={{ backgroundColor: COLORS.background }}>
          <p className={styles.seccionLabel} style={{ color: COLORS.labels }}>
            Información Personal
          </p>

          <div className={styles.campoWrapper} style={{ borderColor: COLORS.dataFields }}>
            <div className={styles.campoIzq}>
              <div className={styles.iconoCampo} style={{ backgroundColor: COLORS.backgroundHeader }}>
                <Mail size={16} style={{ color: COLORS.title }} />
              </div>
              <div className={styles.campoInfo}>
                <p className={styles.campoLabel} style={{ color: COLORS.labels }}>Correo Corporativo</p>
                {editandoEmail ? (
                  <input
                    className={styles.inputEdicion}
                    style={{ color: COLORS.text, borderColor: COLORS.primary }}
                    value={email}
                    maxLength={100}
                    type="email"
                    inputMode="email"
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <p className={styles.campoValor} style={{ color: COLORS.text }}>
                    {usuario?.email_corporativo || '—'}
                  </p>
                )}
              </div>
            </div>
            {editandoEmail ? (
              <div className={styles.accionesEdicion}>
                <button onClick={handleGuardarEmail} disabled={guardando}>
                  <Check size={16} style={{ color: '#2d7a3a', cursor: 'pointer' }} />
                </button>
                <button onClick={handleCancelarEmail}>
                  <X size={16} style={{ color: COLORS.secondary, cursor: 'pointer' }} />
                </button>
              </div>
            ) : (
              <button onClick={() => setEditandoEmail(true)}>
                <Pencil size={16} style={{ color: COLORS.title, cursor: 'pointer' }} />
              </button>
            )}
          </div>

          <div className={styles.campoWrapper} style={{ borderColor: COLORS.dataFields }}>
            <div className={styles.campoIzq}>
              <div className={styles.iconoCampo} style={{ backgroundColor: COLORS.backgroundHeader }}>
                <Phone size={16} style={{ color: COLORS.title }} />
              </div>
              <div className={styles.campoInfo}>
                <p className={styles.campoLabel} style={{ color: COLORS.labels }}>Teléfono</p>
                {editandoTelefono ? (
                  <input
                    className={styles.inputEdicion}
                    style={{ color: COLORS.text, borderColor: COLORS.primary }}
                    value={telefono}
                    maxLength={20}
                    type="tel"
                    inputMode="tel"
                    onChange={(e) => setTelefono(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <p className={styles.campoValor} style={{ color: COLORS.text }}>
                    {usuario?.telefono || '—'}
                  </p>
                )}
              </div>
            </div>
            {editandoTelefono ? (
              <div className={styles.accionesEdicion}>
                <button onClick={handleGuardarTelefono} disabled={guardando}>
                  <Check size={16} style={{ color: '#2d7a3a', cursor: 'pointer' }} />
                </button>
                <button onClick={handleCancelarTelefono}>
                  <X size={16} style={{ color: COLORS.secondary, cursor: 'pointer' }} />
                </button>
              </div>
            ) : (
              <button onClick={() => setEditandoTelefono(true)}>
                <Pencil size={16} style={{ color: COLORS.title, cursor: 'pointer' }} />
              </button>
            )}
          </div>

          <div className={tieneCodigos ? styles.campoWrapper : styles.campoWrapperLast} style={{ borderColor: COLORS.dataFields }}>
            <div className={styles.campoIzq}>
              <div className={styles.iconoCampo} style={{ backgroundColor: COLORS.backgroundHeader }}>
                <Briefcase size={16} style={{ color: COLORS.title }} />
              </div>
              <div className={styles.campoInfo}>
                <p className={styles.campoLabel} style={{ color: COLORS.labels }}>Cargo</p>
                <p className={styles.campoValor} style={{ color: COLORS.text }}>
                  {usuario?.Cargo?.nombre || '—'}
                </p>
              </div>
            </div>
          </div>

          {usuario?.numero_dependencia && (
            <div className={usuario?.numero_seccion ? styles.campoWrapper : styles.campoWrapperLast} style={{ borderColor: COLORS.dataFields }}>
              <div className={styles.campoIzq}>
                <div className={styles.iconoCampo} style={{ backgroundColor: COLORS.backgroundHeader }}>
                  <Hash size={16} style={{ color: COLORS.title }} />
                </div>
                <div className={styles.campoInfo}>
                  <p className={styles.campoLabel} style={{ color: COLORS.labels }}>N° Dependencia</p>
                  <p className={styles.campoValor} style={{ color: COLORS.text }}>
                    {usuario.numero_dependencia}
                  </p>
                </div>
              </div>
            </div>
          )}

          {usuario?.numero_seccion && (
          <div className={styles.campoWrapperLast}>
            <div className={styles.campoIzq}>
              <div className={styles.iconoCampo} style={{ backgroundColor: COLORS.backgroundHeader }}>
                <Layers size={16} style={{ color: COLORS.title }} />
              </div>
              <div className={styles.campoInfo}>
                <p className={styles.campoLabel} style={{ color: COLORS.labels }}>N° Sección</p>
                <p className={styles.campoValor} style={{ color: COLORS.text }}>
                  {usuario.numero_seccion}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>

        {exito && (
          <p className={styles.exitoMsg} style={{ color: '#155724', backgroundColor: '#d4edda' }}>
            {exito}
          </p>
        )}

        {error && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}>
            {error}
          </p>
        )}

        <button
          className={styles.cerrarBtn}
          style={{ borderColor: COLORS.secondary, color: COLORS.secondary }}
          onClick={handleCerrarSesion}
        >
          Cerrar Sesión
          <LogOut size={16} />
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default PerfilPage;