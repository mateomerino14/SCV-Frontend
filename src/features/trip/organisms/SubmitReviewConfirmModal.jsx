import {Send} from 'lucide-react';
import SignatureDialog from '../../../components/ui/SignatureDialog';
import {COLORS} from '../../../constants';

function SubmitReviewConfirmModal({isOpen, onClose, onConfirm, loading}) {
  return (
    <SignatureDialog isOpen={isOpen} icon={Send} iconColor={COLORS.backgroundSecondary}
      title="Confirmar Finalización" message="Firma como responsable de la rendición (casillero Preparado por de la planilla) para enviar tus gastos a revisión."
      warning="Una vez enviado no podrás registrar ni modificar gastos hasta que sea revisado."
      confirmText="Firmar y enviar" loading={loading} onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default SubmitReviewConfirmModal;