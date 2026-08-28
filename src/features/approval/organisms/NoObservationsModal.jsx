import {AlertCircle} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function NoObservationsModal({isOpen, onClose}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={AlertCircle} iconColor={COLORS.text} iconBackgroundColor={COLORS.background}
      title="Sin Observaciones" message="Debes agregar al menos una observación antes de rechazar el viaje. Usa el botón + para añadirla."
      confirmText="Entendido" hideCancel onConfirm={onClose} />
  );
}

export default NoObservationsModal;