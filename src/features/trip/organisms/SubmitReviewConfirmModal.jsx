import {Send} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function SubmitReviewConfirmModal({isOpen, onClose, onConfirm}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={Send} iconColor={COLORS.backgroundSecondary} iconBackgroundColor={COLORS.background}
      title="Confirmar Finalización" message="¿Estás seguro de que deseas finalizar el viaje y enviar tus gastos a revisión?"
      warning="Una vez enviado no podrás registrar ni modificar gastos hasta que sea revisado."
      confirmText="Enviar" onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default SubmitReviewConfirmModal;