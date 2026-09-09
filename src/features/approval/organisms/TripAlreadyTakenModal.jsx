import {UserX} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function TripAlreadyTakenModal({isOpen, onClose, message}) {
  return (
    <ConfirmDialog isOpen={isOpen} compact icon={UserX} iconColor={COLORS.secondary} iconBackgroundColor={COLORS.background}
      title="Viaje no disponible" message={message || 'Este viaje ya fue tomado por otra persona.'}
      confirmText="Entendido" hideCancel onConfirm={onClose} />
  );
}

export default TripAlreadyTakenModal;