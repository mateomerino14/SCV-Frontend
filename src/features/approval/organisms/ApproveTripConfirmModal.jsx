import {CheckCircle} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function ApproveTripConfirmModal({isOpen, onClose, onConfirm, loading}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={CheckCircle} iconColor={COLORS.background} iconBackgroundColor={COLORS.backgroundSecondary}
      title="Aprobar Viaje" message="¿Estás seguro de que deseas aprobar este viaje?"
      confirmText="Aprobar" loading={loading} onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default ApproveTripConfirmModal;