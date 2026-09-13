import ModalActions from './ModalActions';

export default {
  title: 'UI/ModalActions',
  component: ModalActions,
  parameters: {
    docs: {
      description: {
        component: 'Fila de botones cancelar/confirmar usada al pie de los modales del sistema.',
      },
    },
  },
  args: {
    onCancel: () => {},
    onConfirm: () => {},
    confirmLabel: 'Confirmar',
  },
};

export const Default = {};

export const Loading = {
  args: {loading: true, confirmLabel: 'Guardando...'},
};

export const ConfirmDisabled = {
  args: {confirmDisabled: true},
};

export const OnlyCancel = {
  args: {hideConfirm: true, cancelLabel: 'Cerrar'},
};
