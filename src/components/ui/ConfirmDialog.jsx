import ModalIconHeader from './ModalIconHeader';
import Button from './Button';
import {COLORS} from '../../constants';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm',
  overlayCompact: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm px-4',
  card: 'items-center flex flex-col p-6 rounded-xl w-80 gap-2',
  cardCompact: 'items-center flex flex-col p-6 rounded-xl w-full max-w-xs gap-2 shadow-xl',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-3',
  titleCompact: 'text-lg font-bold font-inter text-center mt-3',
  message: 'font-inter text-center text-sm m-3',
  warning: 'font-inter text-center text-xs px-2',
  buttons: 'flex flex-row gap-4 mt-2',
};

function ConfirmDialog({isOpen, icon, iconColor, iconBackgroundColor, cardColor = COLORS.primary, title, message, warning, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel, loading, hideCancel, compact}) {
  if (!isOpen) {
    return null;
  }

  let confirmLabel = confirmText;
  if (loading) {
    confirmLabel = `${confirmText}...`;
  }

  return (
    <div className={compact ? styles.overlayCompact : styles.overlay}>
      <div className={compact ? styles.cardCompact : styles.card} style={{backgroundColor: cardColor}}>
        <ModalIconHeader icon={icon} size={compact ? 40 : 50} backgroundColor={iconBackgroundColor} color={iconColor} />
        <h2 className={compact ? styles.titleCompact : styles.title} style={{color: COLORS.background}}>{title}</h2>
        <p className={styles.message} style={{color: COLORS.background}}>{message}</p>
        {warning && <p className={styles.warning} style={{color: COLORS.backgroundHeader}}>{warning}</p>}
        <div className={styles.buttons}>
          {!hideCancel && <Button text={cancelText} variant="secondary" onClick={onCancel} disabled={loading} />}
          <Button text={confirmLabel} variant="primary" onClick={onConfirm} disabled={loading} />
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;