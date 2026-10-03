import {useState} from 'react';
import {AlertCircle} from 'lucide-react';
import ModalBase from './ModalBase';
import Button from '../../../components/ui/Button';

const styles = {
  icon: "rounded-full p-5 border-4 border-white",
  title: "text-2xl font-bold font-inter",
  description: "font-inter text-sm",
  alertBox: "rounded-lg p-3 flex gap-2 items-center w-full text-left",
  alertText: "text-sm font-inter",
};

function ErrorModal({isOpen, onClose, onResend}) {
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    await onResend();
    setResending(false);
  };

  return (
    <ModalBase isOpen={isOpen}>
      <div className={styles.icon} style={{backgroundColor: '#000000'}}>
        <AlertCircle size={36} color="white" />
      </div>
      <h2 className={styles.title}>Error de Confirmación</h2>
      <p className={styles.description}>El código de verificación es incorrecto</p>
      <div className={styles.alertBox} style={{backgroundColor: 'rgba(255,255,255,0.15)'}}>
        <AlertCircle size={16} color="white" className="shrink-0" />
        <p className={styles.alertText}>Por favor revisa que el código sea el que llegó a tu correo.</p>
      </div>
      <div className="w-full flex flex-col gap-3">
        <Button text={resending ? 'Reenviando...' : 'Reenviar Código'} variant="primary" onClick={handleResend} />
        <Button text="Volver al Inicio" variant="secondary" onClick={onClose} />
      </div>
    </ModalBase>
  );
}

export default ErrorModal;