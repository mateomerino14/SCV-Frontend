import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { COLORS } from '../../constants'
import { cambiarContrasenia } from '../../services/dashboardService'

const MAX_LENGTH = 255
const MIN_LENGTH = 6

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-2xl w-full max-w-sm mx-4 gap-4 shadow-xl',
  titulo: 'text-2xl font-bold font-inter',
  subtitulo: 'text-sm font-inter -mt-2',
  fieldWrapper: 'flex flex-col gap-1',
  label: 'text-xs font-bold font-inter uppercase',
  inputRow: 'flex items-center border rounded-xl px-4 py-3 gap-2',
  input: 'flex-1 bg-transparent outline-none font-inter text-sm',
  hint: 'text-xs font-inter mt-0.5',
  guardarBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-white text-base cursor-pointer',
  cancelarBtn: 'w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer border',
  errorMsg: 'text-xs font-inter italic text-center py-2 px-3 rounded-xl',
  exitoMsg: 'text-sm  font-inter text-center py-2 px-3 rounded-xl',
}

function CambiarContraseniaModal({ isOpen, onClose }) {
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [verActual, setVerActual] = useState(false)
  const [verNueva, setVerNueva] = useState(false)
  const [verConfirmar, setVerConfirmar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  if (!isOpen) {
    return null
  }

  const mostrarError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const handleChangeNueva = (valor) => {
    if (valor.length <= MAX_LENGTH) {
      setNueva(valor)
    }
  }

  const handleChangeConfirmar = (valor) => {
    if (valor.length <= MAX_LENGTH) {
      setConfirmar(valor)
    }
  }

  const handleGuardar = async () => {
    if (!actual || !nueva || !confirmar) {
      mostrarError('Todos los campos son requeridos')
      return
    }

    if (nueva.trim() !== nueva) {
      mostrarError('La contraseña no puede tener espacios al inicio o al final')
      return
    }

    if (nueva.length < MIN_LENGTH) {
      mostrarError(`La nueva contraseña debe tener al menos ${MIN_LENGTH} caracteres`)
      return
    }

    if (nueva.length > MAX_LENGTH) {
      mostrarError(`La nueva contraseña no puede tener más de ${MAX_LENGTH} caracteres`)
      return
    }

    if (nueva !== confirmar) {
      mostrarError('Las contraseñas nuevas no coinciden')
      return
    }

    if (nueva === actual) {
      mostrarError('La nueva contraseña debe ser diferente a la actual')
      return
    }

    setLoading(true)
    const data = await cambiarContrasenia(actual, nueva)
    setLoading(false)

    if (data.error) {
      mostrarError(data.error)
      return
    }

    setExito(true)
    setTimeout(() => {
      setExito(false)
      setActual('')
      setNueva('')
      setConfirmar('')
      onClose()
    }, 2000)
  }

  const handleCancelar = () => {
    setActual('')
    setNueva('')
    setConfirmar('')
    setError('')
    setExito(false)
    onClose()
  }

  return (
    <div className={styles.overlay} style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className={styles.card} style={{ backgroundColor: COLORS.background }}>

        <p className={styles.titulo} style={{ color: COLORS.text }}>
          Cambiar Contraseña
        </p>
        <p className={styles.subtitulo} style={{ color: COLORS.labels }}>
          Asegúrate de que tu nueva contraseña sea única y robusta.
        </p>

        <div className={styles.fieldWrapper}>
          <p className={styles.label} style={{ color: COLORS.labels }}>Contraseña Actual</p>
          <div className={styles.inputRow} style={{ borderColor: COLORS.dataFields }}>
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type={verActual ? 'text' : 'password'}
              value={actual}
              maxLength={MAX_LENGTH}
              onChange={(e) => setActual(e.target.value)}
            />
            <button onClick={() => setVerActual(!verActual)}>
              {verActual
                ? <EyeOff size={16} style={{ color: COLORS.labels }} />
                : <Eye size={16} style={{ color: COLORS.labels }} />
              }
            </button>
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <p className={styles.label} style={{ color: COLORS.labels }}>Nueva Contraseña</p>
          <div className={styles.inputRow} style={{ borderColor: COLORS.dataFields }}>
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type={verNueva ? 'text' : 'password'}
              value={nueva}
              maxLength={MAX_LENGTH}
              onChange={(e) => handleChangeNueva(e.target.value)}
            />
            <button onClick={() => setVerNueva(!verNueva)}>
              {verNueva
                ? <EyeOff size={16} style={{ color: COLORS.labels }} />
                : <Eye size={16} style={{ color: COLORS.labels }} />
              }
            </button>
          </div>
        </div>

        <div className={styles.fieldWrapper}>
          <p className={styles.label} style={{ color: COLORS.labels }}>Confirmar Nueva Contraseña</p>
          <div className={styles.inputRow} style={{ borderColor: COLORS.dataFields }}>
            <input
              className={styles.input}
              style={{ color: COLORS.text }}
              type={verConfirmar ? 'text' : 'password'}
              value={confirmar}
              maxLength={MAX_LENGTH}
              onChange={(e) => handleChangeConfirmar(e.target.value)}
            />
            <button onClick={() => setVerConfirmar(!verConfirmar)}>
              {verConfirmar
                ? <EyeOff size={16} style={{ color: COLORS.labels }} />
                : <Eye size={16} style={{ color: COLORS.labels }} />
              }
            </button>
          </div>
          {confirmar && nueva !== confirmar && (
            <p className={styles.hint} style={{ color: COLORS.secondary }}>
              Las contraseñas no coinciden
            </p>
          )}
          {confirmar && nueva === confirmar && (
            <p className={styles.hint} style={{ color: '#2d7a3a' }}>
              Las contraseñas coinciden
            </p>
          )}
        </div>

        {exito && (
          <p
            className={styles.exitoMsg}
            style={{ color: '#155724', backgroundColor: '#d4edda' }}
          >
            Contraseña actualizada correctamente
          </p>
        )}

        {error && (
          <p
            className={styles.errorMsg}
            style={{ color: COLORS.secondary, backgroundColor: COLORS.error }}
          >
            {error}
          </p>
        )}

        <button
          className={styles.guardarBtn}
          style={{ backgroundColor: loading ? COLORS.fields : COLORS.secondary }}
          onClick={handleGuardar}
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>

        <button
          className={styles.cancelarBtn}
          style={{ borderColor: COLORS.secondary, color: COLORS.secondary }}
          onClick={handleCancelar}
        >
          Cancelar
        </button>

      </div>
    </div>
  )
}

export default CambiarContraseniaModal;