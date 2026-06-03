import { AlertCircle } from 'lucide-react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs mx-4 gap-3 shadow-xl',
  iconWrapper: 'rounded-full p-4',
  titulo: 'text-2xl font-bold font-inter leading-tight text-center mt-2',
  label: 'font-inter text-center text-sm m-2',
  buttons: 'flex flex-row gap-4 mt-2 justify-center',
}

function SinObservacionesModal({ isOpen, onClose }) {
  if (!isOpen) return null
  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.background }}>
          <AlertCircle size={50} style={{ color: COLORS.text }} />
        </div>
        <h2 className={styles.titulo} style={{ color: COLORS.background }}>
          Sin Observaciones
        </h2>
        <p className={styles.label} style={{ color: COLORS.backgroundHeader }}>
          Debes agregar al menos una observación antes de rechazar el viaje. Usa el botón + para añadirla.
        </p>
        <div className={styles.buttons}>
          <Button text="Entendido" variant="secondary" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}

export default SinObservacionesModal;