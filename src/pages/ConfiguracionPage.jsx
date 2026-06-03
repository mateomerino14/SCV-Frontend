import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, FileText, LogOut } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import OpcionConfig from '../features/Configuracion/OpcionConfig'
import CambiarContraseniaModal from '../features/Configuracion/CambiarContraseniaModal'
import TerminosModal from '../features/Configuracion/TerminosModal'
import MenuDinamico from '../layouts/Menu/MenuDinamico'
import useMenu from '../hooks/useMenu'
import { COLORS } from '../constants'
import SessionExpiredModal from '../features/Login/SessionExpiredModal'

const styles = {
  page: "min-h-screen flex flex-col",
  content: "flex-1 px-5 py-6 w-full max-w-4xl mx-auto",
  title: "text-3xl font-bold font-inter mb-6",
  seccionLabel: "text-xs font-bold font-inter uppercase mb-3",
  seccionWrapper: "flex flex-col gap-3 mb-6",
  cerrarBtn: "w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer border flex items-center justify-center gap-2 mt-2",
}

function ConfiguracionPage() {
  const navigate = useNavigate()
  const [showCambiarContrasenia, setShowCambiarContrasenia] = useState(false)
  const [showTerminos, setShowTerminos] = useState(false)
  const { menuAbierto, usuario, abrirMenu, cerrarMenu,sessionExpired, handleSessionExpiredClose } = useMenu()

  const handleCerrarSesion = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className={styles.page} style={{ backgroundColor: COLORS.background }}>
      <SessionExpiredModal isOpen={sessionExpired} onClose={handleSessionExpiredClose} />
      <Navbar text="Configuración" onMenuClick={abrirMenu} fotoPerfil={usuario?.foto_perfil} />
      <MenuDinamico isOpen={menuAbierto} onClose={cerrarMenu} usuario={usuario} />

      <div className={styles.content}>

        <h1 className={styles.title} style={{ color: COLORS.text }}>
          Configuración
        </h1>

        <p className={styles.seccionLabel} style={{ color: COLORS.labels }}>
          Cuenta
        </p>
        <div className={styles.seccionWrapper}>
          <OpcionConfig
            icono={KeyRound}
            label="Cambiar contraseña"
            onClick={() => setShowCambiarContrasenia(true)}
          />
        </div>

        <p className={styles.seccionLabel} style={{ color: COLORS.labels }}>
          Soporte
        </p>
        <div className={styles.seccionWrapper}>
          <OpcionConfig
            icono={FileText}
            label="Términos y condiciones"
            onClick={() => setShowTerminos(true)}
          />
        </div>

        <button
          className={styles.cerrarBtn}
          style={{ borderColor: COLORS.secondary, color: COLORS.secondary }}
          onClick={handleCerrarSesion}
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>

      </div>

      <CambiarContraseniaModal
        isOpen={showCambiarContrasenia}
        onClose={() => setShowCambiarContrasenia(false)}
      />

      <TerminosModal
        isOpen={showTerminos}
        onClose={() => setShowTerminos(false)}
      />

      <Footer />
    </div>
  )
}

export default ConfiguracionPage;