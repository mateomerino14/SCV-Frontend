import {CheckCircle} from 'lucide-react';
import ModalIconHeader from './ModalIconHeader';
import Button from './Button';
import {COLORS} from '../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs mx-4 gap-2 shadow-xl',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-3',
  message: 'font-inter text-center text-sm m-3',
  buttons: 'flex flex-row gap-4 mt-2',
};

function SuccessModal({isOpen, title, message, onAccept}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{backgroundColor: COLORS.primary}}>
        <ModalIconHeader icon={CheckCircle} backgroundColor={COLORS.background} color={COLORS.primary} />
        <h2 className={styles.title} style={{color: COLORS.background}}>{title}</h2>
        <p className={styles.message} style={{color: COLORS.backgroundHeader}}>{message}</p>
        <div className={styles.buttons}>
          <Button text="Aceptar" variant="primary" onClick={onAccept} />
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;