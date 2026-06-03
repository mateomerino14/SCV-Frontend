import { useState, useEffect } from 'react'
import { KeyRound } from 'lucide-react'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants'

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-sm mx-4 gap-3 shadow-xl',
  iconWrapper: 'rounded-full p-4',
  titulo: 'text-2xl font-bold font-inter leading-tight text-center mt-2',
  subtitulo: 'font-inter text-center text-sm',
  inputLabel: 'text-xs font-bold font-inter uppercase mb-1 self-start w-full',
  input: 'w-full border rounded-xl px-3 py-2.5 text-sm font-inter outline-none',
  errorMsg: 'text-white text-sm font-inter italic text-center w-full',
  buttons: 'flex flex-row gap-4 mt-2 justify-center',
}

function ContraseniavencidaModal({ isOpen, onConfirm, loading, error: errorExterno }) {
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (errorExterno) setError(errorExterno)
  }, [errorExterno])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!actual || !nueva || !confirmar) {
      setError('Completa todos los campos requeridos')
      return
    }
    if (nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    if (nueva !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (nueva === actual) {
      setError('La nueva contraseña no puede ser igual a la actual')
      return
    }
    setError('')
    onConfirm(actual, nueva)
  }

  return (
    <div className={styles.overlay} style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className={styles.card} style={{ backgroundColor: COLORS.primary }}>
        <div className={styles.iconWrapper} style={{ backgroundColor: COLORS.background }}>
          <KeyRound size={50} style={{ color: COLORS.text }} />
        </div>

        <h2 className={styles.titulo} style={{ color: COLORS.background }}>
          Actualiza tu Contraseña
        </h2>
        <p className={styles.subtitulo} style={{ color: COLORS.backgroundHeader }}>
          Han pasado más de 90 días desde tu último cambio de contraseña. Por seguridad debes actualizarla para continuar.
        </p>

        <p className={styles.inputLabel} style={{ color: 'rgba(255,255,255,0.7)' }}>
          Contraseña Actual
        </p>
        <input
          className={styles.input}
          style={{ borderColor: 'rgba(255,255,255,0.3)', color: COLORS.text, backgroundColor: COLORS.background }}
          type="password"
          placeholder="••••••••"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
        />

        <p className={styles.inputLabel} style={{ color: 'rgba(255,255,255,0.7)' }}>
          Nueva Contraseña
        </p>
        <input
          className={styles.input}
          style={{ borderColor: 'rgba(255,255,255,0.3)', color: COLORS.text, backgroundColor: COLORS.background }}
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />

        <p className={styles.inputLabel} style={{ color: 'rgba(255,255,255,0.7)' }}>
          Confirmar Nueva Contraseña
        </p>
        <input
          className={styles.input}
          style={{ borderColor: 'rgba(255,255,255,0.3)', color: COLORS.text, backgroundColor: COLORS.background }}
          type="password"
          placeholder="Repite la nueva contraseña"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />

        {error && <p className={styles.errorMsg}>{error}</p>}

        <div className={styles.buttons}>
          <Button
            text={loading ? 'Guardando...' : 'Actualizar Contraseña'}
            variant="secondary"
            onClick={handleConfirm}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default ContraseniavencidaModal;