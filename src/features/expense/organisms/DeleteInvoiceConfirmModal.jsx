import {Trash2} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import {COLORS} from '../../../constants';

function DeleteInvoiceConfirmModal({isOpen, onClose, onConfirm}) {
  return (
    <ConfirmDialog isOpen={isOpen} icon={Trash2} iconColor={COLORS.backgroundSecondary} iconBackgroundColor={COLORS.background}
      title="Quitar Factura" message="¿Estás seguro de que deseas quitar esta factura de la lista?"
      warning="La factura no se guardará y los datos extraídos se perderán."
      confirmText="Aceptar" onConfirm={onConfirm} onCancel={onClose} />
  );
}

export default DeleteInvoiceConfirmModal;