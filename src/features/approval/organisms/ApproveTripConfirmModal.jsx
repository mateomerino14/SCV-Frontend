import {CheckCircle} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

function ApproveTripConfirmModal({isOpen, onClose, onConfirm, loading, title = 'Aprobar Viaje', message = '¿Estás seguro de que deseas aprobar este viaje?'}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={CheckCircle}
      title={title} message={message}
      confirmText="Aprobar" loading={loading} onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default ApproveTripConfirmModal;
