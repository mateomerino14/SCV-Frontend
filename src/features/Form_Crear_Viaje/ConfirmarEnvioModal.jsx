import { AlertCircle } from 'lucide-react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs mx-4 gap-2 shadow-xl',
  iconWrapper: 'rounded-full p-4',
  titulo: 'text-xl font-bold font-inter text-center mt-3',
  texto: 'font-inter text-center text-sm m-3',
  botones: 'flex gap-3 mt-2',
}

function ConfirmarEnvioModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.background }}>
          <AlertCircle size={44} style={{ color: COLORS.primary }} />
        </div>
        <p className={styles.titulo} style={{ color: COLORS.background }}>¿Enviar a Revisión?</p>
        <p className={styles.texto} style={{ color: COLORS.backgroundHeader }}>
          Verifica que los datos del viaje sean correctos. Una vez enviado, no podrás editarlo hasta que sea revisado.
        </p>
        <div className={styles.botones}>
          <Button text="Cancelar" variant="secondary" onClick={onClose} />
          <Button
            text={loading ? 'Enviando...' : 'Enviar'}
            variant="primary"
            onClick={onConfirm}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default ConfirmarEnvioModal;