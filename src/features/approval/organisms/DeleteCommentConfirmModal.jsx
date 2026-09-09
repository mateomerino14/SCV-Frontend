import {Trash2} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function DeleteCommentConfirmModal({isOpen, onClose, onConfirm, loading}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={Trash2} iconColor={COLORS.secondary} iconBackgroundColor={COLORS.background}
      title="Eliminar Comentario" message="¿Estás seguro de que deseas eliminar este comentario?"
      confirmText="Eliminar" loading={loading} onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default DeleteCommentConfirmModal;