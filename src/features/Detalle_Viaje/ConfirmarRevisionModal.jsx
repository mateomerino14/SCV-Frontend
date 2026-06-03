import { Send } from 'lucide-react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-80 gap-2',
  iconWrapper: 'rounded-full p-4',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-3',
  label: 'font-inter text-center text-sm m-3',
  warning: 'font-inter text-center text-xs px-2',
  buttons: 'flex flex-row gap-4 mt-2',
}

function ConfirmarRevisionModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.background }}>
          <Send size={50} style={{ color: COLORS.backgroundSecondary }} />
        </div>
        <h2 className={styles.title} style={{ color: COLORS.background }}>
          Enviar a Revisión
        </h2>
        <span className={styles.label} style={{ color: COLORS.background }}>
          ¿Estás seguro de que deseas enviar este viaje a revisión?
        </span>
        <span className={styles.warning} style={{ color: COLORS.backgroundHeader }}>
          Una vez enviado no podrás registrar ni modificar gastos hasta que sea revisado.
        </span>
        <div className={styles.buttons}>
          <Button text="Cancelar" variant="secondary" onClick={onClose} />
          <Button text="Enviar" variant="primary" onClick={onConfirm} />
        </div>
      </div>
    </div>
  )
}

export default ConfirmarRevisionModal;