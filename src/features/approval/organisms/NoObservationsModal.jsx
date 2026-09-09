import {AlertCircle} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function NoObservationsModal({isOpen, onClose}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={AlertCircle} iconColor={COLORS.text} iconBackgroundColor={COLORS.background}
      title="Sin Observaciones"
      message="Debes agregar al menos una observación en esta revisión antes de rechazar el viaje. Las observaciones de revisiones anteriores no cuentan para un nuevo rechazo — usa el botón + para añadir una nueva."
      confirmText="Entendido" hideCancel onConfirm={onClose} />
  );
}

export default NoObservationsModal;