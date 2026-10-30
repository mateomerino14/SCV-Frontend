import {useState} from 'react';
import {createPortal} from 'react-dom';
import {motion, AnimatePresence} from 'framer-motion';
import ModalIconHeader from './ModalIconHeader';
import Button from './Button';
import SignaturePad from './SignaturePad';
import {COLORS} from '../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm px-4',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-sm gap-2 max-h-[94dvh] overflow-y-auto',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-3',
  message: 'font-inter text-center text-sm mx-2 mt-1',
  warning: 'font-inter text-center text-xs px-2',
  pad: 'w-full mt-3',
  buttons: 'flex flex-row gap-4 mt-3 w-full',
};

const backdropVariants = {hidden: {opacity: 0}, visible: {opacity: 1}};
const cardVariants = {hidden: {opacity: 0, scale: 0.94, y: 8}, visible: {opacity: 1, scale: 1, y: 0}};

function SignatureDialogCard({icon, iconColor, title, message, warning, confirmText, cancelText, onConfirm, onCancel, loading}) {
  const [signature, setSignature] = useState(null);
  let confirmLabel = confirmText;
  if (loading) {
    confirmLabel = `${confirmText}...`;
  }
  return (
    <motion.div className={styles.card} style={{backgroundColor: COLORS.primary}} role="dialog" aria-label={title}
      variants={cardVariants} initial="hidden" animate="visible" exit="hidden" transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}>
      <ModalIconHeader icon={icon} size={50} backgroundColor={COLORS.background} color={iconColor} />
      <h2 className={styles.title} style={{color: COLORS.background}}>{title}</h2>
      <p className={styles.message} style={{color: COLORS.background}}>{message}</p>
      {warning && <p className={styles.warning} style={{color: COLORS.backgroundHeader}}>{warning}</p>}
      <div className={styles.pad}>
        <SignaturePad onChange={setSignature} disabled={loading} noteColor={COLORS.backgroundHeader} clearColor={COLORS.background} />
      </div>
      <div className={styles.buttons}>
        <Button text={cancelText} variant="secondary" onClick={onCancel} disabled={loading} />
        <Button text={confirmLabel} variant="primary" onClick={() => onConfirm(signature)} disabled={loading || !signature} />
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
