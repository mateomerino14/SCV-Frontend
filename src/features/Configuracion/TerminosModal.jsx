import { Shield } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-2xl w-full max-w-sm md:max-w-lg mx-4 gap-4 shadow-xl max-h-[90vh] overflow-y-auto',
  iconWrapper: 'flex items-center justify-center rounded-2xl p-4 w-16 h-16 mx-auto',
  titulo: 'text-2xl font-bold font-inter text-center',
  subtitulo: 'text-sm font-bold font-inter uppercase text-center tracking-widest',
  seccionWrapper: 'rounded-xl p-4 flex gap-3',
  seccionIcono: 'rounded-full p-1.5 shrink-0 h-fit',
  seccionTexto: 'text-sm font-inter leading-relaxed',
  avisoLabel: 'text-sm font-bold font-inter uppercase mt-2',
  avisoTexto: 'text-sm font-inter leading-relaxed mt-1',
  btnEntendido: 'w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer border mt-2',
}

function TerminosModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay} style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>

        <div
          className={styles.iconWrapper}
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <Shield size={36} style={{ color: COLORS.background }} />
        </div>

        <p className={styles.titulo} style={{ color: COLORS.background }}>
          MAXAM
        </p>
        <p className={styles.subtitulo} style={{ color: 'rgba(255,255,255,0.7)' }}>
          Sistema de Gestión Corporativa
        </p>

        <div
          className={styles.seccionWrapper}
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <div
            className={styles.seccionIcono}
            style={{ backgroundColor: COLORS.secondary }}
          >
            <p className="text-sm font-bold font-inter px-1" style={{ color: COLORS.background }}>C</p>
          </div>
          <div>
            <p className="text-sm font-bold font-inter" style={{ color: COLORS.background }}>
              © 2026 Maxam
            </p>
            <p className={styles.seccionTexto} style={{ color: 'rgba(255,255,255,0.85)' }}>
              Todos los derechos reservados. El uso no autorizado de esta aplicación está estrictamente prohibido y sujeto a sanciones legales.
            </p>
          </div>
        </div>

        <p className={styles.avisoLabel} style={{ color: 'rgba(255,255,255,0.7)' }}>
          Aviso Legal y Privacidad
        </p>
        <p className={styles.avisoTexto} style={{ color: 'rgba(255,255,255,0.85)' }}>
          Esta plataforma es de uso exclusivo para empleados y contratistas autorizados del Grupo Maxam. Toda la información contenida es confidencial y propiedad intelectual del Grupo.
        </p>
        <p className={styles.avisoTexto} style={{ color: 'rgba(255,255,255,0.85)' }}>
          El acceso y uso están restringidos únicamente a personal autorizado. Queda prohibida la divulgación, reproducción o distribución sin permiso previo.
        </p>

        <button
          className={styles.btnEntendido}
          style={{ borderColor: COLORS.background, color: COLORS.secondary, backgroundColor:COLORS.background }}
          onClick={onClose}
        >
          Entendido
        </button>

      </div>
    </div>
  )
}

export default TerminosModal;