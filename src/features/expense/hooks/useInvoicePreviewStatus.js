import {COLORS} from '../../../constants';

function useInvoicePreviewStatus(invoice) {
  const getStatusColor = () => {
    if (invoice.saved) {
      return '#008330';
    }
    if (invoice.saveError) {
      return COLORS.secondary;
    }
    if (invoice.loading) {
      return COLORS.labels;
    }
    if (invoice.error) {
      return COLORS.secondary;
    }
    if (invoice.data?.extraido_por_qr) {
      return '#155724';
    }
    return COLORS.primary;
  };

  const getStatusText = () => {
    if (invoice.saved) {
      return 'Guardado correctamente';
    }
    if (invoice.saveError) {
      return 'Error al guardar';
    }
    if (invoice.loading) {
      return 'Procesando...';
    }
    if (invoice.error) {
      return 'Error al leer';
    }
    if (invoice.manual) {
      return 'Ingreso manual';
    }
    if (invoice.data?.extraido_por_qr) {
      return 'QR SIAT detectado';
    }
    return 'Listo';
  };

  const getBorderColor = (expanded) => {
    if (invoice.saved) {
      return '#008330';
    }
    if (invoice.saveError) {
      return COLORS.secondary;
    }
    if (invoice.data?.extraido_por_qr && expanded) {
      return '#155724';
    }
    if (expanded) {
      return COLORS.primary;
    }
    return COLORS.dataFields;
  };

  return {getStatusColor, getStatusText, getBorderColor};
}

export default useInvoicePreviewStatus;