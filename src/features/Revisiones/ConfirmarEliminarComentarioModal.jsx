import { Trash2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs mx-4 gap-2',
  iconWrapper: 'rounded-full p-4',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-3',
  label: 'font-inter text-center text-sm m-3',
  buttons: 'flex flex-row gap-4 mt-2',
}

function ConfirmarEliminarComentarioModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.background }}>
          <Trash2 size={50} style={{ color: COLORS.secondary }} />
        </div>
        <h2 className={styles.title} style={{ color: COLORS.background }}>
          Eliminar Comentario
        </h2>
        <span className={styles.label} style={{ color: COLORS.backgroundHeader }}>
          ¿Estás seguro de que deseas eliminar este comentario?
        </span>
        <div className={styles.buttons}>
          <Button text="Cancelar" variant="secondary" onClick={onClose} />
          <Button
            text={loading ? 'Eliminando...' : 'Eliminar'}
            variant="primary"
            onClick={onConfirm}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default ConfirmarEliminarComentarioModal;