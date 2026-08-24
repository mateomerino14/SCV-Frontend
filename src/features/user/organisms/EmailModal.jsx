import {useState, useEffect} from 'react';
import {Send, Mail} from 'lucide-react';
import ModalBase from './ModalBase';
import Button from '../../../components/ui/Button';

const styles = {
  icon: "rounded-full p-5 border-4 border-white",
  title: "text-3xl font-bold font-inter leading-tight",
  inputWrapper: "w-full flex items-center rounded-lg px-4 py-3 gap-3",
  input: "bg-transparent w-full outline-none font-inter text-sm",
  errorMsg: "text-white text-xs font-inter italic text-center",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmailModal({isOpen, onClose, onSend}) {
  const [emailValue, setEmailValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmailValue('');
      setErrorMessage('');
      setSending(false);
    }
  }, [isOpen]);

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleSend = async () => {
    if (!emailRegex.test(emailValue)) {
      showError('Ingresa un correo electrónico válido');
      return;
    }
    setSending(true);
    await onSend(emailValue);
    setSending(false);
  };

  return (
    <ModalBase isOpen={isOpen}>
      <div className={styles.icon} style={{backgroundColor: '#000000'}}>
        <Send size={36} color="white" />
      </div>
      <h2 className={styles.title}>Ingrese su correo electronico</h2>
      <div className={styles.inputWrapper} style={{backgroundColor: '#DEE2F0'}}>
        <Mail size={18} className="shrink-0" style={{color: '#475569'}} />
        <input type="email" placeholder="nombre@empresa.com" value={emailValue} disabled={sending}
          onChange={(event) => setEmailValue(event.target.value)} className={styles.input} style={{color: '#5A413D'}} />
      </div>
      {errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>}
      <div className="w-full flex flex-col gap-3">
        <Button text={sending ? 'Enviando...' : 'Enviar'} variant="primary" onClick={handleSend} />
        <Button text="Cancelar" variant="secondary" onClick={onClose} />
      </div>
    </ModalBase>
  );
}

export default EmailModal;