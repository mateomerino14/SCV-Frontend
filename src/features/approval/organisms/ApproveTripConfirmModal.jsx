import {CheckCircle} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import SignatureDialog from '../../../components/ui/SignatureDialog';

function ApproveTripConfirmModal({isOpen, onClose, onConfirm, loading, title = 'Aprobar Viaje', message = '¿Estás seguro de que deseas aprobar este viaje?', signatureMessage}) {
  if (signatureMessage) {
    return (
      <SignatureDialog isOpen={isOpen} icon={CheckCircle} title={title} message={signatureMessage}
        confirmText="Firmar y aprobar" loading={loading} onConfirm={onConfirm} onCancel={onClose} />
    );
  }
  return (
    <ConfirmDialog isOpen={isOpen} icon={CheckCircle}
      title={title} message={message}
      confirmText="Aprobar" loading={loading} onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default ApproveTripConfirmModal;
