import {AlertCircle} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function SubmitTripConfirmModal({isOpen, onClose, onConfirm, loading}) {
  return (
    <ConfirmDialog isOpen={isOpen} compact icon={AlertCircle} iconColor={COLORS.primary} iconBackgroundColor={COLORS.background}
      title="¿Enviar a Revisión?" message="Verifica que los datos del viaje sean correctos. Una vez enviado, no podrás editarlo hasta que sea revisado."
      confirmText="Enviar" loading={loading} onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default SubmitTripConfirmModal;