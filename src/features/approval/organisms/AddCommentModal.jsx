import {MessageSquare} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import ModalActions from '../../../components/ui/ModalActions';
import LimitedTextarea from '../../../components/ui/LimitedTextarea';
import {COLORS} from '../../../constants';
import useCommentTextarea from '../hooks/useCommentTextarea';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'items-center flex flex-col p-6 rounded-xl w-full max-w-sm mx-4 gap-3 shadow-xl',
  title: 'text-2xl font-bold font-inter leading-tight text-center mt-2',
  subtitle: 'font-inter text-center text-sm',
};

function AddCommentModal({isOpen, onClose, onConfirm, observations, onEdit, loading, error}) {
  if (!isOpen) {
    return null;
  }

  const text = observations[0] || '';
  const {maxLength, exceedsLimit} = useCommentTextarea(text);

  const handleConfirm = () => {
    if (!text.trim() || exceedsLimit) {
      return;
    }
    onConfirm();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{backgroundColor: COLORS.primary}}>
        <ModalIconHeader icon={MessageSquare} backgroundColor={COLORS.background} color={COLORS.backgroundSecondary} />
        <h2 className={styles.title} style={{color: COLORS.background}}>Agregar Comentario</h2>
        <p className={styles.subtitle} style={{color: COLORS.backgroundHeader}}>Se observó el gasto indebido del presupuesto del empleado.</p>

        <LimitedTextarea value={text} maxLength={maxLength} exceedsLimit={exceedsLimit} error={error}
          placeholder="Escribe tu observación..." onChange={(event) => onEdit(0, event.target.value)} />

        <ModalActions onCancel={onClose} onConfirm={handleConfirm} confirmLabel={loading ? 'Agregando...' : 'Agregar'} loading={loading || !text.trim() || exceedsLimit} />
      </div>
    </div>
  );
}

export default AddCommentModal;