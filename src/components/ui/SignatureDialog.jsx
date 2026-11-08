import {useState} from 'react';
import {createPortal} from 'react-dom';
import {motion, AnimatePresence} from 'framer-motion';
import ModalIconHeader from './ModalIconHeader';
import Button from './Button';
import SignaturePad from './SignaturePad';
import PasswordField from './PasswordField';
import useStoredSignature from '../../hooks/user/useStoredSignature';
import {COLORS} from '../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm px-4',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-sm gap-2 max-h-[94dvh] overflow-y-auto',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-3',
  message: 'font-inter text-center text-sm mx-2 mt-1',
  warning: 'font-inter text-center text-xs px-2',
  note: 'font-inter text-center text-xs px-2 mt-2',
  stored: 'w-full mt-3 rounded-xl flex items-center justify-center p-3',
  storedImage: 'h-24 max-w-full object-contain',
  pad: 'w-full mt-3',
  password: 'w-full mt-3',
  error: 'w-full font-inter text-center text-xs font-bold rounded-lg px-3 py-2 mt-2',
  buttons: 'flex flex-col gap-2 mt-3 w-full',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function SignatureDialogCard({icon, iconColor, title, message, warning, confirmText, cancelText, onConfirm, onCancel, loading}) {
  const {signature, loading: loadingSignature, loadError, save} = useStoredSignature(true);
  const [drawn, setDrawn] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const busy = loading || saving;
  let confirmLabel = confirmText;
  if (busy) {
    confirmLabel = `${confirmText}...`;
  }
  const canConfirm = !busy && !loadingSignature && !loadError && password !== '' && (!!signature || !!drawn);

  const handleConfirm = async () => {
    if (!signature) {
      setSaving(true);
      const result = await save(drawn, password);
      setSaving(false);
      if (result.error) {
        setError(result.error);
        return;
      }
    }
    const result = await onConfirm(password);
    if (result?.error) {
      setError(result.error);
    }
  };

  let signatureArea = <p className={styles.note} style={{color: COLORS.backgroundHeader}}>Cargando tu firma...</p>;
  if (!loadingSignature && loadError) {
    signatureArea = <p className={styles.error} style={{color: COLORS.secondary, backgroundColor: COLORS.background}}>{loadError}</p>;
  }
  else if (!loadingSignature && signature) {
    signatureArea = (
      <>
        <div className={styles.stored} style={{backgroundColor: COLORS.background}}>
          <img src={signature.imagen} alt="Tu firma digital" className={styles.storedImage} />
        </div>
        <p className={styles.note} style={{color: COLORS.backgroundHeader}}>Se firma con la firma digital registrada en tu perfil.</p>
      </>
    );
  }
  else if (!loadingSignature) {
    signatureArea = (
      <>
        <p className={styles.note} style={{color: COLORS.backgroundHeader}}>Aún no registraste tu firma digital: dibújala aquí y quedará guardada en tu perfil.</p>
        <div className={styles.pad}>
          <SignaturePad onChange={setDrawn} disabled={busy} noteColor={COLORS.backgroundHeader} clearColor={COLORS.background} />
        </div>
      </>
    );
  }

  return (
    <motion.div className={styles.card} style={{backgroundColor: COLORS.primary}} role="dialog" aria-label={title}
      variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
      <ModalIconHeader icon={icon} size={50} backgroundColor={COLORS.background} color={iconColor} />
      <h2 className={styles.title} style={{color: COLORS.background}}>{title}</h2>
      <p className={styles.message} style={{color: COLORS.background}}>{message}</p>
      {warning && <p className={styles.warning} style={{color: COLORS.backgroundHeader}}>{warning}</p>}
      {signatureArea}
      <div className={styles.password}>
        <PasswordField required label="Tu contraseña" value={password} onChange={(event) => setPassword(event.target.value)} maxLength={100}
          labelColor={COLORS.background} borderColor={COLORS.backgroundHeader} textColor={COLORS.background} iconColor={COLORS.background} />
      </div>
      {error && <p className={styles.error} style={{color: COLORS.secondary, backgroundColor: COLORS.background}}>{error}</p>}
      <div className={styles.buttons}>
        <Button text={confirmLabel} variant="primary" onClick={handleConfirm} disabled={!canConfirm} />
        <Button text={cancelText} variant="secondary" onClick={onCancel} disabled={busy} />
      </div>
    </motion.div>
  );
}

function SignatureDialog({isOpen, icon, iconColor = COLORS.backgroundSecondary, title, message, warning, confirmText = 'Firmar y confirmar', cancelText = 'Cancelar', onConfirm, onCancel, loading}) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.15}}
          style={{backgroundColor: COLORS.overlay}}>
          <SignatureDialogCard icon={icon} iconColor={iconColor} title={title} message={message} warning={warning} confirmText={confirmText}
            cancelText={cancelText} onConfirm={onConfirm} onCancel={onCancel} loading={loading} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default SignatureDialog;
