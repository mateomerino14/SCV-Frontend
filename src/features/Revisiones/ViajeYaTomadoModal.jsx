import { UserX } from 'lucide-react'
import { COLORS } from '../../constants'

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm px-4',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs gap-2 shadow-xl',
  iconWrapper: 'rounded-full p-4',
  titulo: 'text-lg font-bold font-inter text-center mt-3',
  texto: 'font-inter text-center text-sm m-3',
  boton: 'w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer mt-1',
}

function ViajeYaTomadoModal({ isOpen, onClose, mensaje }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.background }}>
          <UserX size={40} style={{ color: COLORS.secondary }} />
        </div>
        <p className={styles.titulo} style={{ color: COLORS.background }}>Viaje no disponible</p>
        <p className={styles.texto} style={{ color: 'rgba(255,255,255,0.9)' }}>
          {mensaje || 'Este viaje ya fue tomado por otra persona.'}
        </p>
        <button
          className={styles.boton}
          style={{ backgroundColor: COLORS.background, color: COLORS.secondary }}
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

export default ViajeYaTomadoModal;