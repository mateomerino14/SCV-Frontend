import { Clock } from 'lucide-react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-sm mx-4 gap-2 shadow-xl',
  iconWrapper: 'rounded-full p-4',
  titulo: 'text-2xl font-bold font-inter leading-tight text-center mt-2',
  label: 'font-inter text-center text-sm m-2',
  motivoBox: 'rounded-xl p-3 text-xs font-inter w-full mt-1',
  buttons: 'flex flex-row gap-4 mt-3',
}

function PlazoVencidoModal({ isOpen, onClose, mensaje, motivoRechazo }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.background }}>
          <Clock size={50} style={{ color: COLORS.secondary }} />
        </div>
        <h2 className={styles.titulo} style={{ color: COLORS.background }}>
          Plazo Vencido
        </h2>
        <p className={styles.label} style={{ color: COLORS.backgroundHeader }}>
          {mensaje}
        </p>
        {motivoRechazo && (
          <p className={styles.motivoBox} style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: COLORS.background }}>
            Motivo del rechazo: {motivoRechazo}
          </p>
        )}
        <div className={styles.buttons}>
          <Button text="Entendido" variant="secondary" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}

export default PlazoVencidoModal;