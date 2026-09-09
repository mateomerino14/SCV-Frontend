import {ShieldCheck} from 'lucide-react';
import ModalBase from './ModalBase';
import Button from '../../../components/ui/Button';
import useVerificationCodeInput from '../hooks/useVerificationCodeInput';

const styles = {
  icon: 'rounded-full p-5 border-4 border-white',
  title: 'text-2xl font-bold font-inter text-center',
  description: 'font-inter text-sm text-center',
  label: 'font-inter font-bold',
  digitInput: 'h-11 text-center text-white font-bold font-inter text-base outline-none rounded-lg border-2 min-w-0',
  resentMsg: 'text-white text-xs font-inter italic text-center',
  errorMsg: 'text-white text-xs font-inter italic text-center w-full',
};

function VerificationCodeModal({isOpen, onClose, onVerify, onResend, onExpired, expiresAt, codeError, verifying}) {
  const {digits, resentMessage, resending, inputRefs, codeLength, handleChange, handleKeyDown, handleResend} =
    useVerificationCodeInput(isOpen, expiresAt, onExpired);
  const hasError = !!codeError;

  return (
    <ModalBase isOpen={isOpen}>
      <div className={styles.icon} style={{backgroundColor: '#000000'}}>
        <ShieldCheck size={36} color="white" />
      </div>
      <h2 className={styles.title}>Confirmación de Correo</h2>
      <p className={styles.description}>Hemos enviado un código para verificar tu correo electrónico</p>
      <p className={styles.label}>Ingresar Código</p>
      <div className="grid w-full" style={{gridTemplateColumns: `repeat(${codeLength}, 1fr)`, gap: '6px'}}>
        {digits.map((digit, index) => (
          <input key={index} ref={(element) => (inputRefs.current[index] = element)} type="text" inputMode="numeric" maxLength={1}
            value={digit} onChange={(event) => handleChange(event.target.value, index)} onKeyDown={(event) => handleKeyDown(event, index)}
            className={styles.digitInput} style={{backgroundColor: '#000000', borderColor: hasError ? '#fca5a5' : 'white', width: '100%'}} />
        ))}
      </div>
      {codeError && <p className={styles.errorMsg}>{codeError}</p>}
      {resentMessage && !codeError && <p className={styles.resentMsg}>{resentMessage}</p>}
      <div className="w-full flex flex-col gap-3">
        <Button text={verifying ? 'Verificando...' : 'Verificar'} variant="primary" onClick={() => onVerify(digits.join(''))} disabled={verifying} />
        <Button text={resending ? 'Reenviando...' : 'Reenviar Código'} variant="primary" onClick={() => handleResend(onResend)} disabled={resending || verifying} />
        <Button text="Cancelar" variant="secondary" onClick={onClose} disabled={verifying} />
      </div>
    </ModalBase>
  );
}

export default VerificationCodeModal;