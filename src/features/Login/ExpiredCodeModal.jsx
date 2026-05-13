import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import ModalBase from './ModalBase'
import Button from '../../components/ui/Button'

const styles = {
  icon: "rounded-full p-5 border-4 border-white",
  title: "text-2xl font-bold font-inter",
  descriptionItalic: "font-inter text-sm italic",
  description: "font-inter text-sm",
}

function ExpiredCodeModal({ isOpen, onClose, onResend }) {
  const [resending, setResending] = useState(false)

  const handleResend = async () => {
    setResending(true)
    await onResend()
    setResending(false)
  }

  return (
    <ModalBase isOpen={isOpen}>
      <div className={styles.icon} style={{ backgroundColor: '#000000' }}>
        <RefreshCw size={36} color="white" />
      </div>
      <h2 className={styles.title}>Codigo Expirado</h2>
      <p className={styles.descriptionItalic}>El codigo de verificacion ha expirado</p>
      <p className={styles.description}>Solicita un nuevo codigo para continuar</p>
      <div className="w-full flex flex-col gap-3">
        <Button text={resending ? 'Reenviando...' : 'Reenviar Codigo'} variant="primary" onClick={handleResend} />
        <Button text="Volver al Inicio" variant="secondary" onClick={onClose} />
      </div>
    </ModalBase>
  )
}

export default ExpiredCodeModal;