import {Send} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function SubmitReviewConfirmModal({isOpen, onClose, onConfirm}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={Send} iconColor={COLORS.backgroundSecondary} iconBackgroundColor={COLORS.background}
      title="Enviar a Revisión" message="¿Estás seguro de que deseas enviar este viaje a revisión?"
      warning="Una vez enviado no podrás registrar ni modificar gastos hasta que sea revisado."
      confirmText="Enviar" onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default SubmitReviewConfirmModal;