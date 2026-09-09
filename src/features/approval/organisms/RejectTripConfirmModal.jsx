import {XCircle} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function RejectTripConfirmModal({isOpen, onClose, onConfirm, loading}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={XCircle} iconColor={COLORS.text} iconBackgroundColor={COLORS.background}
      title="Rechazar Viaje" message="¿Estás seguro de que deseas rechazar este viaje? Las observaciones registradas serán enviadas al empleado."
      confirmText="Rechazar" loading={loading} onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default RejectTripConfirmModal;