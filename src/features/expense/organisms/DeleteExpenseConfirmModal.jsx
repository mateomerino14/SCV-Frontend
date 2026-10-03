import {Trash2} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function DeleteExpenseConfirmModal({isOpen, onClose, onConfirm, loading}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={Trash2} iconColor={COLORS.backgroundSecondary} iconBackgroundColor={COLORS.background}
      title="Eliminar Gasto" message="¿Estás seguro de que deseas eliminar este gasto?"
      warning="Si el gasto tiene factura o recibo, también se eliminará. Esta acción no se puede deshacer."
      confirmText="Eliminar" loading={loading} onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default DeleteExpenseConfirmModal;