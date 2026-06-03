import { AlertCircle } from 'lucide-react'
import ModalBase from './ModalBase'
import Button from '../../components/ui/Button'

const styles = {
  icon: "rounded-full p-5 border-4 border-white",
  title: "text-2xl font-bold font-inter",
  description: "font-inter text-sm",
}

function NonExistentAccountModal({ isOpen, onClose }) {
  return (
    <ModalBase isOpen={isOpen}>
      <div className={styles.icon} style={{ backgroundColor: '#000000' }}>
        <AlertCircle size={36} color="white" />
      </div>
      <h2 className={styles.title}>Cuenta Inexistente</h2>
      <p className={styles.description}>El correo ingresado no esta ligado a una cuenta existente</p>
      <div className="w-full">
        <Button text="Volver al Inicio" variant="primary" onClick={onClose} />
      </div>
    </ModalBase>
  )
}

export default NonExistentAccountModal