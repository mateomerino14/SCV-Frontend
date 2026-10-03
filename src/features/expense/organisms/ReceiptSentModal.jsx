import {CheckCircle, XCircle} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

// Resultado del envio del recibo, con el mismo estilo que el resto de las ventanas emergentes
function ReceiptSentModal({isOpen, onClose, success, message}) {
  const icon = success ? CheckCircle : XCircle;
  let title = 'No se pudo enviar';
  if (success) {
    title = 'Recibo Enviado';
  }
  return (
    <ConfirmDialog isOpen={isOpen} compact icon={icon} iconColor={COLORS.primary} iconBackgroundColor={COLORS.background}
      title={title} message={message} confirmText="Entendido" hideCancel onConfirm={onClose} />
  );
}

export default ReceiptSentModal;
