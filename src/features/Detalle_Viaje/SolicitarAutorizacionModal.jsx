import { useState, useEffect } from 'react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const MAX_LENGTH = 500

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-xl w-full max-w-md mx-4 gap-3 shadow-xl',
  titulo: 'text-lg font-bold font-inter leading-tight',
  sub: 'text-xs font-inter mt-1',
  textarea: 'w-full border rounded-xl p-3 text-sm font-inter outline-none resize-none mt-2',
  errorMsg: 'text-xs font-inter italic text-center w-full',
  buttons: 'flex flex-row gap-3 mt-1 justify-center',
}

function SolicitarAutorizacionModal({ isOpen, onClose, onConfirm, loading, error }) {
  const [motivo, setMotivo] = useState('')

  useEffect(() => {
    if (!isOpen) setMotivo('')
  }, [isOpen])

  if (!isOpen) return null

  const excede = motivo.length > MAX_LENGTH

  const handleConfirmar = async () => {
    if (!motivo.trim() || excede) return
    const ok = await onConfirm(motivo)
    if (ok) setMotivo('')
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}` }}>
        <div>
          <p className={styles.titulo} style={{ color: COLORS.text }}>Solicitar Autorización</p>
          <p className={styles.sub} style={{ color: COLORS.labels }}>
            Explica al revisor por qué necesitas registrar gastos fuera del plazo permitido.
          </p>
        </div>

        <textarea
          className={styles.textarea}
          style={{ borderColor: excede ? COLORS.secondary : COLORS.dataFields, color: COLORS.text, backgroundColor: COLORS.background }}
          rows={4}
          placeholder="Ej: Estuve de licencia médica y no pude cargar los gastos a tiempo..."
          value={motivo}
          maxLength={MAX_LENGTH}
          onChange={(e) => setMotivo(e.target.value)}
        />
        {excede && (
          <p className={styles.errorMsg} style={{ color: COLORS.secondary }}>
            El motivo no puede superar los {MAX_LENGTH} caracteres
          </p>
        )}
        {error && <p className={styles.errorMsg} style={{ color: COLORS.secondary }}>{error}</p>}

        <div className={styles.buttons}>
          <Button text="Cancelar" variant="secondary" onClick={onClose} />
          <Button
            text={loading ? 'Enviando...' : 'Enviar Solicitud'}
            variant="primary"
            onClick={handleConfirmar}
            disabled={loading || !motivo.trim() || excede}
          />
        </div>
      </div>
    </div>
  )
}

export default SolicitarAutorizacionModal;