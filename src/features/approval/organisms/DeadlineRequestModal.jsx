import ModalActions from '../../../components/ui/ModalActions';
import {COLORS} from '../../../constants';
import useDeadlineRequestModal from '../hooks/useDeadlineRequestModal';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-xl w-full max-w-md mx-4 gap-3 shadow-xl',
  title: 'text-lg font-bold font-inter leading-tight',
  subtitle: 'text-xs font-inter mt-1',
  textarea: 'w-full border rounded-xl p-3 text-sm font-inter outline-none resize-none mt-2',
  errorMsg: 'text-xs font-inter italic text-center w-full',
};

function DeadlineRequestModal({isOpen, onClose, onConfirm, loading, error}) {
  const {reason, setReason, maxLength, exceedsLimit, handleConfirm} = useDeadlineRequestModal(isOpen, onConfirm);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{backgroundColor: COLORS.background, border: `1px solid ${COLORS.dataFields}`}}>
        <div>
          <p className={styles.title} style={{color: COLORS.text}}>Solicitar Autorización</p>
          <p className={styles.subtitle} style={{color: COLORS.labels}}>Explica al revisor por qué necesitas registrar gastos fuera del plazo permitido.</p>
        </div>
        <textarea className={styles.textarea} rows={4} maxLength={maxLength} value={reason}
          placeholder="Ej: Estuve de licencia médica y no pude cargar los gastos a tiempo..."
          style={{borderColor: exceedsLimit ? COLORS.secondary : COLORS.dataFields, color: COLORS.text, backgroundColor: COLORS.background}}
          onChange={(event) => setReason(event.target.value)} />
        {exceedsLimit && <p className={styles.errorMsg} style={{color: COLORS.secondary}}>El motivo no puede superar los {maxLength} caracteres</p>}
        {error && <p className={styles.errorMsg} style={{color: COLORS.secondary}}>{error}</p>}
        <ModalActions onCancel={onClose} onConfirm={handleConfirm} confirmLabel={loading ? 'Enviando...' : 'Enviar Solicitud'} loading={loading || !reason.trim() || exceedsLimit} />
      </div>
    </div>
  );
}

export default DeadlineRequestModal;