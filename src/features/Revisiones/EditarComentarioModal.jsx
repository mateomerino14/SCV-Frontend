import { MessageSquare } from 'lucide-react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const MAX_LENGTH = 300

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-sm mx-4 gap-3 shadow-xl',
  iconWrapper: 'rounded-full p-4',
  titulo: 'text-2xl font-bold font-inter leading-tight text-center mt-2',
  subtitulo: 'font-inter text-center text-sm',
  textareaWrapper: 'w-full flex flex-col gap-1',
  textarea: 'w-full border rounded-xl p-3 text-sm font-inter outline-none resize-none',
  errorMsg: 'text-xs font-inter italic text-center w-full mt-2',
  buttons: 'flex flex-row gap-4 mt-2 justify-center',
}

function EditarComentarioModal({ isOpen, onClose, onConfirm, texto, setTexto, loading, error }) {
  if (!isOpen) return null

  const excedeLongitud = texto.length > MAX_LENGTH

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.background }}>
          <MessageSquare size={50} style={{ color: COLORS.backgroundSecondary }} />
        </div>
        <h2 className={styles.titulo} style={{ color: COLORS.background }}>
          Editar Comentario
        </h2>
        <p className={styles.subtitulo} style={{ color: COLORS.backgroundHeader }}>
          Modifica el contenido del comentario.
        </p>
        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.textarea}
            style={{
              borderColor: excedeLongitud ? COLORS.secondary : 'rgba(255,255,255,0.3)',
              color: COLORS.text,
              backgroundColor: COLORS.background,
            }}
            rows={4}
            value={texto}
            maxLength={MAX_LENGTH}
            onChange={(e) => setTexto(e.target.value)}
          />
          {excedeLongitud && (
            <p className={styles.errorMsg} style={{ color: COLORS.background }}>
              El comentario no puede superar los {MAX_LENGTH} caracteres
            </p>
          )}
          {error && (
            <p className={styles.errorMsg} style={{ color: COLORS.background }}>
              {error}
            </p>
          )}
        </div>
        <div className={styles.buttons}>
          <Button text="Cancelar" variant="secondary" onClick={onClose} />
          <Button
            text={loading ? 'Guardando...' : 'Guardar'}
            variant="primary"
            onClick={onConfirm}
            disabled={loading || !texto.trim() || excedeLongitud}
          />
        </div>
      </div>
    </div>
  )
}

export default EditarComentarioModal;