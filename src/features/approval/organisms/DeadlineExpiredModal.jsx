import {Clock} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function DeadlineExpiredModal({isOpen, onClose, message, rejectionReason}) {
  let warning = null;
  if (rejectionReason) {
    warning = `Motivo del rechazo: ${rejectionReason}`;
  }
  return (
    <ConfirmDialog isOpen={isOpen} icon={Clock} iconColor={COLORS.secondary} iconBackgroundColor={COLORS.background}
      title="Plazo Vencido" message={message} warning={warning} confirmText="Entendido" hideCancel onConfirm={onClose} />
  );
}

export default DeadlineExpiredModal;