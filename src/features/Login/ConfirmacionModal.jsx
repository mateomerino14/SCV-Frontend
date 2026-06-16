import { useState, useEffect, useRef } from 'react'
import { ShieldCheck } from 'lucide-react'
import ModalBase from './ModalBase'
import Button from '../../components/ui/Button'

const CODE_LENGTH = 7

const styles = {
  icon: 'rounded-full p-5 border-4 border-white',
  title: 'text-2xl font-bold font-inter',
  description: 'font-inter text-sm',
  label: 'font-inter font-bold',
  digitInput: 'w-10 h-12 text-center text-white font-bold font-inter text-lg outline-none rounded-lg border-2',
  resentMsg: 'text-white text-xs font-inter italic text-center',
  errorMsg: 'text-white text-xs font-inter italic text-center w-full',
}

function ConfirmacionModal({ isOpen, onClose, onVerify, onResend, onExpired, expiresAt, codeError, verifying }) {
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''))
  const [resentMsg, setResentMsg] = useState('')
  const [resending, setResending] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!isOpen) return
    setDigits(Array(CODE_LENGTH).fill(''))
    setResending(false)

    const calcSeconds = () => {
      if (!expiresAt) return 0
      const diff = Math.floor((new Date(expiresAt) - new Date()) / 1000)
      return diff > 0 ? diff : 0
    }

    const timer = setInterval(() => {
      const remaining = calcSeconds()
      if (remaining <= 0) {
        clearInterval(timer)
        onExpired()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, expiresAt])

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value.slice(-1)
    setDigits(newDigits)
    if (value && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const newDigits = [...digits]
        newDigits[index] = ''
        setDigits(newDigits)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        const newDigits = [...digits]
        newDigits[index - 1] = ''
        setDigits(newDigits)
      }
    }
  }

  const handleResend = async () => {
    setResending(true)
    setDigits(Array(CODE_LENGTH).fill(''))
    await onResend()
    setResending(false)
    setResentMsg('Se ha reenviado el código correctamente')
    setTimeout(() => setResentMsg(''), 5000)
  }

  const handleVerify = () => onVerify(digits.join(''))

  const hasError = !!codeError

  return (
    <ModalBase isOpen={isOpen}>
      <div className={styles.icon} style={{ backgroundColor: '#000000' }}>
        <ShieldCheck size={36} color="white" />
      </div>
      <h2 className={styles.title}>Confirmacion de Correo</h2>
      <p className={styles.description}>Hemos enviado un código para verificar tu correo electrónico</p>
      <p className={styles.label}>Ingresar Código</p>

      <div className="flex gap-2 justify-center">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={styles.digitInput}
            style={{
              backgroundColor: '#000000',
              borderColor: hasError ? '#fca5a5' : 'white',
            }}
          />
        ))}
      </div>

      {codeError && <p className={styles.errorMsg}>{codeError}</p>}
      {resentMsg && !codeError && <p className={styles.resentMsg}>{resentMsg}</p>}

      <div className="w-full flex flex-col gap-3">
        <Button
          text={verifying ? 'Verificando...' : 'Verificar'}
          variant="primary"
          onClick={handleVerify}
          disabled={verifying}
        />
        <Button
          text={resending ? 'Reenviando...' : 'Reenviar Codigo'}
          variant="primary"
          onClick={handleResend}
          disabled={resending || verifying}
        />
        <Button text="Cancelar" variant="secondary" onClick={onClose} disabled={verifying} />
      </div>
    </ModalBase>
  )
}

export default ConfirmacionModal;