import {BookmarkCheck} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function TripCreatedModal({isOpen, onClose}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={BookmarkCheck} iconColor={COLORS.backgroundSecondary} iconBackgroundColor={COLORS.background}
      title="Registro Exitoso" message="Se registro el viaje correctamente" confirmText="Aceptar" hideCancel onConfirm={onClose} />
  );
}

export default TripCreatedModal;