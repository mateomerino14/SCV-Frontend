import {MessageSquare} from 'lucide-react';
import ModalIconHeader from '../../../components/ui/ModalIconHeader';
import ModalActions from '../../../components/ui/ModalActions';
import LimitedTextarea from '../../../components/ui/LimitedTextarea';
import CommentCard from '../../../components/ui/CommentCard';
import {COLORS} from '../../../constants';
import {formatDateTime} from '../../../utils/dateFormatter';
import useCommentTextarea from '../hooks/useCommentTextarea';

const styles = {
  overlay: 'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
  card: 'flex flex-col p-6 rounded-xl w-full max-w-md mx-4 gap-3 shadow-xl',
  headerRow: 'flex items-center gap-3',
  title: 'text-lg font-bold font-inter leading-tight',
  subtitle: 'text-xs font-inter mt-0.5',
  listWrapper: 'flex flex-col gap-2 max-h-52 overflow-y-auto pr-1 obs-scroll',
  empty: 'text-xs font-inter text-center py-3',
};

function ExpenseObservationsModal({isOpen, onClose, expenseName, observations, canEdit, newText, setNewText, onAdd, onEdit, onDelete, loading, error}) {
  if (!isOpen) {
    return null;
  }

  const {maxLength, exceedsLimit} = useCommentTextarea(newText);

  const handleAdd = () => {
    if (!newText.trim() || exceedsLimit) {
      return;
    }
    onAdd();
  };

  return (
    <div className={styles.overlay}>
      <style>{`
        .obs-scroll::-webkit-scrollbar { width: 6px; }
        .obs-scroll::-webkit-scrollbar-track { background: transparent; }
        .obs-scroll::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.4); border-radius: 10px; }
      `}</style>
      <div className={styles.card} style={{backgroundColor: COLORS.primary}}>
        <div className={styles.headerRow}>
          <ModalIconHeader icon={MessageSquare} backgroundColor={COLORS.background} color={COLORS.backgroundSecondary} />
          <div>
            <p className={styles.title} style={{color: COLORS.background}}>Observaciones</p>
            {expenseName && <p className={styles.subtitle} style={{color: COLORS.backgroundHeader}}>{expenseName}</p>}
          </div>
        </div>

        <div className={styles.listWrapper}>
          {observations.length === 0 ? (
            <p className={styles.empty} style={{color: COLORS.backgroundHeader}}>Este gasto no tiene observaciones aún</p>
          ) : (
            observations.map((observation) => (
              <CommentCard key={observation.id_comentario} compact date={formatDateTime(observation.fecha)} text={observation.descripcion}
                backgroundColor="rgba(255,255,255,0.12)" onEdit={canEdit ? () => onEdit(observation) : null} onDelete={canEdit ? () => onDelete(observation.id_comentario) : null} />
            ))
          )}
        </div>

        {canEdit && (
          <LimitedTextarea value={newText} maxLength={maxLength} exceedsLimit={exceedsLimit} error={error} rows={3}
            placeholder="Escribe una nueva observación para este gasto..." onChange={(event) => setNewText(event.target.value)} />
        )}

        <ModalActions onCancel={onClose} cancelText="Cerrar" onConfirm={handleAdd} hideConfirm={!canEdit}
          confirmLabel={loading ? 'Agregando...' : 'Agregar'} loading={loading || !newText.trim() || exceedsLimit} />
      </div>
    </div>
  );
}

export default ExpenseObservationsModal;