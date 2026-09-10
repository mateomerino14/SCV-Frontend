import {CheckCircle, XCircle} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function ReceiptSentModal({isOpen, onClose, success, message}) {
  const color = success ? COLORS.primary : COLORS.secondary;
  const icon = success ? CheckCircle : XCircle;
  let title = 'No se pudo enviar';
  if (success) {
    title = 'Recibo Enviado';
  }
  return (
    <ConfirmDialog isOpen={isOpen} compact icon={icon} iconColor={color} iconBackgroundColor={COLORS.background} cardColor={color}
      title={title} message={message} confirmText="Entendido" hideCancel onConfirm={onClose} />
  );
}

export default ReceiptSentModal;